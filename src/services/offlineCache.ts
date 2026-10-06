import * as vscode from 'vscode';
import * as crypto from 'crypto';

interface CachedDoc {
  url: string;
  markdown: string;
  title: string;
  cleanTokens: number;
  rawTokens: number;
  reductionPercentage: number;
  timestamp: number;
}

export class OfflineCacheService {
  private memento: vscode.Memento;
  private readonly TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(memento: vscode.Memento) {
    this.memento = memento;
  }

  private hashUrl(url: string, mode: string): string {
    return crypto.createHash('sha256').update(`${url.trim().toLowerCase()}::${mode}`).digest('hex');
  }

  get(url: string, mode: string): CachedDoc | undefined {
    const key = `cache_${this.hashUrl(url, mode)}`;
    const cached = this.memento.get<CachedDoc>(key);
    if (!cached) return undefined;

    if (Date.now() - cached.timestamp > this.TTL_MS) {
      this.memento.update(key, undefined);
      return undefined;
    }

    return cached;
  }

  async set(url: string, mode: string, data: Omit<CachedDoc, 'url' | 'timestamp'>): Promise<void> {
    const key = `cache_${this.hashUrl(url, mode)}`;
    const item: CachedDoc = {
      url,
      ...data,
      timestamp: Date.now(),
    };
    await this.memento.update(key, item);
  }
}
