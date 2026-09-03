# Resonance site template

A bilingual, documentation-first [Docusaurus](https://docusaurus.io/) template
for Resonance, Regard, and related tabletop role-playing games.

## What is included

- English as the default locale and a complete French edition structure;
- automatic browser-language detection at the site entry point;
- a language switcher that remembers an explicit reader choice;
- a neutral, accessible light and dark theme;
- automatic GitHub Pages builds and deployments;
- a documented extension point for future PDF builds and GitHub Releases.

## Create a site from the template

1. Select **Use this template** on GitHub and create a repository.
2. Clone the new repository.
3. Install Node.js 24 and run `npm install`.
4. Customize the project metadata in `site.config.ts`.
5. Replace the English pages in `docs/` and their French counterparts in
   `i18n/fr/docusaurus-plugin-content-docs/current/`.
6. In **Settings → Pages**, select **GitHub Actions** as the source.

The workflow infers the GitHub owner, repository name, public URL, and Pages
base path. Set `SITE_URL` and `SITE_BASE_URL` only for a custom domain or an
unusual deployment.

## Local development

```bash
npm run start
```

To preview the French edition:

```bash
npm run start -- --locale fr
```

Before pushing:

```bash
npm run check
```

## Content and localization

Each translated Markdown file should keep the same file name and explicit
heading IDs as its English source. Docusaurus serves the default English
edition at the repository base path and French under `/fr/`.

The language preference is stored per site, not per `github.io` domain, so
several projects created from this template do not overwrite one another's
choice.

## PDF direction

PDF generation will remain independent from Docusaurus: the website and PDF
editions will be two renderers of the same Markdown sources. A later workflow
will read a document manifest, publish generated PDFs under `static/pdfs/`, and
optionally attach the same files to tagged GitHub Releases.

---

## Français

Ce dépôt est un template [Docusaurus](https://docusaurus.io/) bilingue et centré
sur la documentation pour Resonance, Regard et les jeux qui en dérivent.

Il fournit la détection automatique de langue, un sélecteur qui mémorise le
choix du lecteur, un thème clair/sombre neutre et le déploiement automatique sur
GitHub Pages.

Pour créer un site, utilisez **Use this template**, modifiez `site.config.ts`,
remplacez les contenus anglais et français, puis sélectionnez **GitHub Actions**
comme source dans **Settings → Pages**. Utilisez `npm run check` pour vérifier
localement les deux éditions avant chaque envoi.
