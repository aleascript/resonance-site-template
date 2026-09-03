---
title: Getting started
sidebar_position: 2
---

# Getting started

The English edition lives in `docs/`. Its French counterpart lives in
`i18n/fr/docusaurus-plugin-content-docs/current/` and keeps the same file names
and explicit heading identifiers.

## Customize the project {/* #customize-the-project */}

1. Edit `site.config.ts`.
2. Replace the example pages in both languages.
3. Replace the neutral theme tokens in `src/css/custom.css` with the game's
   visual identity.
4. Run `npm run check` before pushing.

The GitHub repository name and Pages base path are inferred automatically in
GitHub Actions. `SITE_URL` and `SITE_BASE_URL` can override them for a custom
domain or an unusual deployment.

## Publishing {/* #publishing */}

The included workflow validates pull requests. A push to `main` also builds and
publishes the two localized editions through GitHub Pages.

The repository administrator must select **GitHub Actions** as the Pages source
once in **Settings → Pages**.
