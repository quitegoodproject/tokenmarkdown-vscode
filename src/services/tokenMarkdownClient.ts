import * as vscode from 'vscode';
import { OfflineCacheService } from './offlineCache';

export interface ExtractionResult {
  markdown: string;
  title: string;
  byline?: string;
  excerpt?: string;
  cleanTokens: number;
  rawTokens: number;
  reductionPercentage: number;
  latencyMs: number;
  fromCache?: boolean;
}

export class TokenMarkdownClient {
  private secrets: vscode.SecretStorage;
  private cache: OfflineCacheService;

  constructor(secrets: vscode.SecretStorage, cache: OfflineCacheService) {
    this.secrets = secrets;
    this.cache = cache;
  }

  async extract(url: string, modeOverride?: string): Promise<ExtractionResult> {
    const config = vscode.workspace.getConfiguration('tokenmarkdown');
    const mode = modeOverride || config.get<string>('mode', 'article');
    const email = config.get<string>('developerEmail', '').trim();
    const cacheOffline = config.get<boolean>('cacheOffline', true);

    // Check offline cache first if enabled
    if (cacheOffline) {
      const cached = this.cache.get(url, mode);
      if (cached) {
        return {
          markdown: cached.markdown,
          title: cached.title,
          cleanTokens: cached.cleanTokens,
          rawTokens: cached.rawTokens,
          reductionPercentage: cached.reductionPercentage,
          latencyMs: 0,
          fromCache: true,
        };
      }
    }

    const apiKey = (await this.secrets.get('tokenmarkdown_api_key'))?.trim() || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'tokenmarkdown-vscode/0.1.0',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    if (email) {
      headers['X-Developer-Email'] = email;
    }

    const requestBody = {
      url,
      mode,
      format: 'json',
      include_images: false,
      include_links: true,
      include_toc: false,
    };

    const startTime = Date.now();
    let res: Response;
    try {
      res = await fetch('https://tokenmarkdown.com/v1/extract', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
    } catch (networkError: any) {
      // If network fails, check cache again
      const cached = this.cache.get(url, mode);
      if (cached) {
        return {
          markdown: cached.markdown,
          title: cached.title,
          cleanTokens: cached.cleanTokens,
          rawTokens: cached.rawTokens,
          reductionPercentage: cached.reductionPercentage,
          latencyMs: 0,
          fromCache: true,
        };
      }
      throw new Error(`TokenMarkdown network error: ${networkError.message}. Check your internet connection.`);
    }

    if (!res.ok) {
      if (res.status === 429) {
        const action = await vscode.window.showErrorMessage(
          'TokenMarkdown quota reached (50 free sandbox requests). Unlock 100 free requests with your email or upgrade to Builder ($29/mo for 10k requests).',
          'Claim 100 Free Requests',
          'Upgrade to Builder ($29/mo)',
          'Enter API Key'
        );

        if (action === 'Claim 100 Free Requests') {
          vscode.env.openExternal(vscode.Uri.parse('https://tokenmarkdown.com/claim'));
        } else if (action === 'Upgrade to Builder ($29/mo)') {
          vscode.env.openExternal(vscode.Uri.parse('https://tokenmarkdown.com/checkout/builder'));
        } else if (action === 'Enter API Key') {
          vscode.commands.executeCommand('tokenmarkdown.setApiKey');
        }
        throw new Error('TokenMarkdown quota exhausted.');
      }

      const errText = await res.text().catch(() => '');
      throw new Error(`TokenMarkdown API error (${res.status}): ${errText || res.statusText}`);
    }

    const json: any = await res.json();
    const data = json.data || {};
    const stats = json.stats || {};

    const result: ExtractionResult = {
      markdown: data.markdown || '',
      title: data.title || '',
      byline: data.byline,
      excerpt: data.excerpt,
      cleanTokens: stats.cleanTokens ?? data.tokens ?? 0,
      rawTokens: stats.rawTokens ?? data.rawTokens ?? 0,
      reductionPercentage: stats.reductionPercentage ?? data.reductionPercentage ?? 0,
      latencyMs: Date.now() - startTime,
      fromCache: false,
    };

    if (cacheOffline && result.markdown) {
      await this.cache.set(url, mode, {
        markdown: result.markdown,
        title: result.title,
        cleanTokens: result.cleanTokens,
        rawTokens: result.rawTokens,
        reductionPercentage: result.reductionPercentage,
      });
    }

    return result;
  }
}
