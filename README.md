# TokenMarkdown for Cursor & VS Code

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/quitegoodproject.tokenmarkdown-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=quitegoodproject.tokenmarkdown-vscode)
[![Open VSX Version](https://img.shields.io/open-vsx/v/quitegoodproject/tokenmarkdown-vscode.svg)](https://open-vsx.org/extension/quitegoodproject/tokenmarkdown-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Extract **clean, token-efficient, LLM-ready Markdown** from any web documentation or article URL in sub-150ms. Strip **90% to 95% of HTML bloat, cookie banners, tracking iframes, and scripts** before feeding context into **Cursor Composer, Claude Code, GitHub Copilot, or ChatGPT**.

---

## ⚡ Why TokenMarkdown in Cursor & VS Code?

When you paste documentation URLs or web research into your AI assistant or agent:
* Raw HTML burns **50k–200k tokens** per page, blowing past your context window and driving up API bills.
* Cookie consent banners, navigation headers, sidebars, and footer disclaimers pollute prompt context, causing **hallucinations and distracted reasoning**.
* TokenMarkdown uses an **Abstract Syntax Tree (AST)** parsing engine to surgically extract the semantic core, delivering crisp, structured GitHub Flavored Markdown (GFM) in ~2k–5k tokens.

---

## 🚀 Key Features

* **⌨️ One-Touch Shortcut (`Ctrl+Alt+M` / `Cmd+Alt+M`)**: Automatically detects URLs from your active editor selection or system clipboard.
* **📋 3 Insertion Modes**:
  * **Insert at Cursor**: Direct insertion into your active prompt, markdown, or code file.
  * **Copy to Clipboard**: Instant copy ready for Cursor Composer (`Cmd+I` / `Ctrl+I`) or Claude.
  * **Open in New Tab**: Opens a fresh Markdown document for review.
* **💾 Instant 0ms Offline Cache**: Previously fetched documentation is stored locally in extension storage, enabling instant zero-latency retrieval even when working offline.
* **📊 Live Token Telemetry**: Status bar displays exact compressed token count and percentage of context saved.
* **🔒 Secure Secret Storage**: API keys are securely encrypted using VS Code's native OS credential vault (`context.secrets`), never stored in plaintext configuration files.

---

## 📦 Getting Started

### 1. Installation
Install from the **VS Code Marketplace** or **Open VSX** (for Cursor IDE):
* Search for `TokenMarkdown` in the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
* Or run in terminal:
  ```bash
  code --install-extension quitegoodproject.tokenmarkdown-vscode
  # Or in Cursor:
  cursor --install-extension quitegoodproject.tokenmarkdown-vscode
  ```

### 2. Usage
1. Copy or highlight any URL (e.g. `https://docs.stripe.com/api` or `https://docs.github.com/rest`).
2. Press **`Ctrl+Alt+M`** (macOS: **`Cmd+Alt+M`**).
3. TokenMarkdown extracts the clean content and inserts or copies the markdown immediately!

---

## 🔑 Pricing & Credentials

TokenMarkdown works immediately with **zero configuration**:

* **Anonymous Free Tier**: 50 free extractions out of the box.
* **Developer Tier**: Enter your developer work email in VS Code Settings (`tokenmarkdown.developerEmail`) to unlock 100 free requests (no credit card required).
* **Production API Key**: For power users and high-volume workloads:
  * **Builder ($29/mo)**: 2,500 extractions / month. [Subscribe here](https://tokenmarkdown.com/checkout/builder)
  * **Pro ($79/mo)**: 10,000 extractions / month. [Subscribe here](https://tokenmarkdown.com/checkout/pro)

To store your API key:
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type `TokenMarkdown: Set API Key`.
3. Paste your key and press Enter.

---

## ⚙️ Extension Settings

| Setting | Default | Description |
| :--- | :--- | :--- |
| `tokenmarkdown.mode` | `article` | `article` (max token compression ~95%), `full` (preserves page structure), or `raw`. |
| `tokenmarkdown.insertMode` | `insertAtCursor` | `insertAtCursor`, `openNewDocument`, or `copyToClipboard`. |
| `tokenmarkdown.developerEmail` | `""` | Work email to unlock 100 free requests without a credit card. |
| `tokenmarkdown.cacheOffline` | `true` | Cache fetched documentation locally for 0ms offline access. |

---

## 📄 License & Attribution

* **License**: MIT
* **Author**: [The Quite Good Project](https://quitegoodproject.com)
* **Support & Feedback**: `engineering@quitegoodproject.com`
