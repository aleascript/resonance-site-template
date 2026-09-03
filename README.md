# Resonance site template

A bilingual, documentation-first [Docusaurus](https://docusaurus.io/) template
for Resonance, Regard, and related tabletop role-playing games.

The published site contains only reader-facing game material. Configuration,
authoring, and deployment instructions belong in this README.

## Included

- English and French content stored symmetrically in `docs/en/` and `docs/fr/`;
- automatic browser-language selection on the first visit;
- Docusaurus' native language menu, linking to the equivalent page;
- a manually selected language remembered per site;
- a neutral, accessible light and dark theme;
- automatic validation and deployment to GitHub Pages.

## Create a site from the template

1. Select **Use this template** on GitHub and create a repository.
2. Clone the new repository.
3. Install Node.js 24 and run `npm install`.
4. Customize the project metadata in `site.config.ts`.
5. Replace the sample game material in `docs/en/` and `docs/fr/`.
6. In **Settings → Pages**, select **GitHub Actions** as the source.

The workflow infers the GitHub owner, repository name, public URL, and Pages
base path. Set `SITE_URL` and `SITE_BASE_URL` only for a custom domain or an
unusual deployment.

## Content structure

```text
docs/
├── en/
│   ├── index.md
│   └── enter-the-fiction.md
└── fr/
    ├── index.md
    └── enter-the-fiction.md
```

Each translated page must keep the same `id`, `slug`, filename, and explicit
heading identifiers as its counterparts. This allows the language menu to open
the equivalent page instead of returning to the home page.

Docusaurus normally stores translated documentation under
`i18n/<locale>/docusaurus-plugin-content-docs/current/`. This template selects
the matching `docs/<locale>/` directory at build time so the authored sources
remain side by side. The `i18n/` directory is reserved for interface strings
such as navbar and footer labels.

## Languages

Locales are declared in `site.config.ts`. When adding a locale:

1. add it to `site.locales`;
2. create the corresponding `docs/<locale>/` directory;
3. generate and translate its interface strings with `write-translations`;
4. keep the same document identifiers and routes in every language.

On the first visit to the site's root, a saved preference takes priority over
the browser languages. A choice made with the language menu is saved in
`localStorage`. The storage key includes the GitHub Pages base path, so several
sites hosted under the same `github.io` domain keep independent preferences.

## Local development

Start the English edition:

```bash
npm run start
```

Start another locale:

```bash
npm run start -- --locale fr
```

Validate types and every configured locale:

```bash
npm run check
```

## Theme and navigation

- Project metadata: `site.config.ts`
- Docusaurus, locale, navbar, and footer configuration: `docusaurus.config.ts`
- Sidebar structure: `sidebars.ts`
- Theme tokens and editorial styles: `src/css/custom.css`
- Language detection and preference persistence: `src/theme/Root.tsx`

The language selector is Docusaurus' native `localeDropdown`. Its
`?persistLocale=true` query parameter is consumed by `Root.tsx`, which saves the
reader's explicit choice and then removes the parameter from the visible URL.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` runs for pull requests and
pushes to `main`. Pull requests are validated without publishing. A successful
push to `main` builds every locale and deploys the resulting `build/` directory.

---

## Français

Ce dépôt fournit un template [Docusaurus](https://docusaurus.io/) bilingue pour
Resonance, Regard et les jeux qui en dérivent. Le site publié ne contient que
des textes destinés aux lecteurs et aux joueurs ; toute la documentation
technique reste dans ce README.

### Organisation des contenus

Les sources sont placées symétriquement dans `docs/en/` et `docs/fr/`. Les pages
correspondantes doivent conserver les mêmes `id`, `slug`, noms de fichiers et
identifiants explicites de titres. Le sélecteur de langue peut ainsi ouvrir la
même page dans l'autre langue.

Le dossier `i18n/` ne contient que les traductions de l'interface Docusaurus :
navigation, pied de page et autres libellés du thème.

### Créer un site

1. Utilisez **Use this template** sur GitHub.
2. Clonez le nouveau dépôt et exécutez `npm install` avec Node.js 24.
3. Modifiez les métadonnées dans `site.config.ts`.
4. Remplacez les exemples dans `docs/en/` et `docs/fr/`.
5. Choisissez **GitHub Actions** comme source dans **Settings → Pages**.
6. Exécutez `npm run check` avant chaque envoi.

Pour prévisualiser directement l'édition française :

```bash
npm run start -- --locale fr
```

Lors de la première visite à la racine, la préférence enregistrée est utilisée
avant les langues du navigateur. Un choix manuel dans le menu Docusaurus est
mémorisé pour ce site et reste prioritaire lors des visites suivantes.
