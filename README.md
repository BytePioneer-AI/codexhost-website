# CodexHost Website

Official website and download portal for [CodexHost](https://github.com/BytePioneer-AI/codex-host): **https://chost.dev**

## Features

- Dual-theme Light / Dark UI (follows system preference on first visit, with manual toggle)
- Bilingual Chinese / English switcher
- Live GitHub Releases detection with per-OS & architecture download routing (`/download`)
- Built with Vite, React, TypeScript, and Tailwind CSS

## Development

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

Import this repository in Vercel with default Vite settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
