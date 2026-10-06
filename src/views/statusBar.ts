import * as vscode from 'vscode';

export class TokenMarkdownStatusBar {
  private item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'tokenmarkdown.fetchCleanDocs';
    this.item.tooltip = 'Click to fetch clean documentation via TokenMarkdown';
  }

  showIdle(): void {
    this.item.text = '$(sparkle) TokenMarkdown';
    this.item.show();
  }

  showSuccess(cleanTokens: number, reductionPercentage: number, fromCache: boolean = false): void {
    const cacheTag = fromCache ? ' [Cached]' : '';
    this.item.text = `$(sparkle) ${cleanTokens.toLocaleString()} tokens (${reductionPercentage.toFixed(0)}% saved)${cacheTag}`;
    this.item.show();
  }

  dispose(): void {
    this.item.dispose();
  }
}
