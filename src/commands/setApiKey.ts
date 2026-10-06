import * as vscode from 'vscode';

export async function setApiKeyCommand(secrets: vscode.SecretStorage): Promise<void> {
  const currentKey = await secrets.get('tokenmarkdown_api_key');
  const key = await vscode.window.showInputBox({
    title: 'TokenMarkdown API Key',
    prompt: 'Enter your TokenMarkdown API Key from https://tokenmarkdown.com. Leave empty to clear.',
    value: currentKey || '',
    password: true,
    placeHolder: 'tm_live_...',
    ignoreFocusOut: true,
  });

  if (key === undefined) {
    // User cancelled
    return;
  }

  if (key.trim() === '') {
    await secrets.delete('tokenmarkdown_api_key');
    vscode.window.showInformationMessage('TokenMarkdown API Key removed. Now using anonymous free tier.');
  } else {
    await secrets.store('tokenmarkdown_api_key', key.trim());
    vscode.window.showInformationMessage('TokenMarkdown API Key securely saved.');
  }
}
