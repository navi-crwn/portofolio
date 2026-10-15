<p align="center"><picture><source media="(prefers-color-scheme: light)" srcset="assets/img/preview-light.webp"><img src="assets/img/preview-dark.webp" alt="navi-crwn: software that's private by default and yours to keep" width="100%"></picture></p>

<h1 align="center">Ivan Novskies · navi-crwn</h1>

<p align="center">
  <b>Open-source tools that are private by default and yours to host.</b><br>
  <a href="https://navi-crwn.github.io/portofolio/"><b>navi-crwn.github.io/portofolio</b></a> · <a href="https://github.com/navi-crwn">GitHub</a>
</p>

---

## Projects

| | Project | What it is | Stack | Links |
|---|---|---|---|---|
| 🛡️ | **[Amnesia](https://github.com/navi-crwn/amnesia)** | Your Mac forgets everything at logout, except the logins and files you keep. Encrypted Profile Vault, backups to USB, SSH or cloud, panic word. Windows version too. | Swift · SwiftUI · Bash | [Website](https://navi-crwn.github.io/amnesia/) · `brew install navi-crwn/tap/amnesia` |
| 🔗 | **[HEL.ink](https://github.com/navi-crwn/hel.ink)** | Link shortener with click analytics and a block-based link-in-bio page. 20 themes, API & ShareX, 2FA, phishing scans. No premium tier. | Laravel 12 · PHP · Tailwind | [hel.ink](https://hel.ink) · [Website](https://navi-crwn.github.io/hel.ink/) |
| 🐰 | **[PixelHop](https://github.com/navi-crwn/pixelhop)** | Image hosting that strips GPS before anyone sees it, with an in-browser photo studio (OCR, background removal). One ~16 MB Go binary. | Go · SQLite · WebAssembly | [p.hel.ink](https://p.hel.ink) · [Website](https://navi-crwn.github.io/pixelhop/) |

## How I build

1. **Private by default.** No trackers or analytics; nothing leaves the device unless the user asks.
2. **Yours to host.** MIT-licensed, self-hostable, documented.
3. **Docs are product.** Bilingual READMEs (EN/ID), a website per project, README pictures rendered from that website.
4. **Ship, then keep shipping.** Versioned releases, changelogs, CI, Homebrew and Docker.

## This site

Plain HTML, CSS and a little JavaScript, served by GitHub Pages straight from `main`. Stars, releases and the repository list load live from the GitHub API; the page works without them.

```bash
python3 -m http.server   # preview at http://localhost:8000
npm install && npx playwright install chromium && npm run render   # re-render the README picture and social card
```

Content © Ivan Novskies. Code under the [MIT License](LICENSE).
