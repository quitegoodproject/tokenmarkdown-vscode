import * as vscode from 'vscode';
import { TokenMarkdownClient, ExtractionResult } from '../services/tokenMarkdownClient';
import { TokenMarkdownStatusBar } from '../views/statusBar';

export async function fetchCleanDocsCommand(
  client: TokenMarkdownClient,
  statusBar: TokenMarkdownStatusBar
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  let candidateUrl = '';

  // 1. Check selection
  if (editor && !editor.selection.isEmpty) {
    const selectedText = editor.document.getText(editor.selection).trim();
    if (selectedText.startsWith('http://') || selectedText.startsWith('https://')) {
      candidateUrl = selectedText;
    }
  }

  // 2. Check clipboard if selection wasn't a URL
  if (!candidateUrl) {
    const clip = (await vscode.env.clipboard.readText()).trim();
    if (clip.startsWith('http://') || clip.startsWith('https://')) {
      candidateUrl = clip;
    }
  }

  // 3. Prompt user if still no URL
  const url = await vscode.window.showInputBox({
    title: 'TokenMarkdown: Fetch Clean Docs',
    prompt: 'Enter documentation or webpage URL to compress into clean LLM-ready Markdown',
    value: candidateUrl,
    placeHolder: 'https://docs.stripe.com/api',
    ignoreFocusOut: true,
  });

  if (!url || !url.trim().startsWith('http')) {
    if (url !== undefined) {
      vscode.window.showWarningMessage('Please enter a valid URL starting with http:// or https://');
    }
    return;
  }

  try {
    let result: ExtractionResult | undefined;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'TokenMarkdown',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: `Extracting & stripping HTML bloat from ${new URL(url).hostname}...` });
        result = await client.extract(url.trim());
      }
    );

    if (!result || !result.markdown) {
      vscode.window.showWarningMessage('No content could be extracted from this URL.');
      return;
    }

    statusBar.showSuccess(result.cleanTokens, result.reductionPercentage, result.fromCache);

    const config = vscode.workspace.getConfiguration('tokenmarkdown');
    const insertMode = config.get<string>('insertMode', 'insertAtCursor');

    if (insertMode === 'copyToClipboard') {
      await vscode.env.clipboard.writeText(result.markdown);
      vscode.window.showInformationMessage(
        `⚡ Clean Markdown copied to clipboard! ${result.cleanTokens.toLocaleString()} tokens (${result.reductionPercentage.toFixed(0)}% context saved)`
      );
    } else if (insertMode === 'openNewDocument' || !editor) {
      const doc = await vscode.workspace.openTextDocument({
        content: result.markdown,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(
        `⚡ Opened in new tab: ${result.cleanTokens.toLocaleString()} tokens (${result.reductionPercentage.toFixed(0)}% context saved)`
      );
    } else {
      // insertAtCursor
      await editor.edit((editBuilder) => {
        if (!editor.selection.isEmpty) {
          editBuilder.replace(editor.selection, result!.markdown);
        } else {
          editBuilder.insert(editor.selection.active, result!.markdown);
        }
      });
      vscode.window.showInformationMessage(
        `⚡ Inserted ${result.cleanTokens.toLocaleString()} clean tokens (${result.reductionPercentage.toFixed(0)}% context saved)`
      );
    }
  } catch (error: any) {
    if (error.message !== 'TokenMarkdown quota exhausted.') {
      vscode.window.showErrorMessage(`TokenMarkdown error: ${error.message}`);
    }
  }
}
