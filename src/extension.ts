import * as vscode from 'vscode';
import { OfflineCacheService } from './services/offlineCache';
import { TokenMarkdownClient } from './services/tokenMarkdownClient';
import { TokenMarkdownStatusBar } from './views/statusBar';
import { fetchCleanDocsCommand } from './commands/fetchCleanDocs';
import { setApiKeyCommand } from './commands/setApiKey';

export function activate(context: vscode.ExtensionContext) {
  const cache = new OfflineCacheService(context.globalState);
  const client = new TokenMarkdownClient(context.secrets, cache);
  const statusBar = new TokenMarkdownStatusBar();

  statusBar.showIdle();
  context.subscriptions.push(statusBar);

  const fetchCommand = vscode.commands.registerCommand('tokenmarkdown.fetchCleanDocs', async () => {
    await fetchCleanDocsCommand(client, statusBar);
  });

  const apiKeyCommand = vscode.commands.registerCommand('tokenmarkdown.setApiKey', async () => {
    await setApiKeyCommand(context.secrets);
  });

  context.subscriptions.push(fetchCommand, apiKeyCommand);
}

export function deactivate() {}
