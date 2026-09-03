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
- project-level visual tokens for identity, colors, typography, geometry, and editorial width;
- optional project-lineage credits in the footer;
- a shared editorial convention for visually distinct design notes;
- automatic validation and deployment to GitHub Pages.

## Create a site from the template

1. Select **Use this template** on GitHub and create a repository.
2. Clone the new repository.
3. Install Node.js 24 and run `npm install`.
4. Customize the project metadata and visual tokens in `site.config.ts`.
5. Replace the sample game material in `docs/en/` and `docs/fr/`.
6. In **Settings → Pages**, select **GitHub Actions** as the source.

The workflow infers the GitHub owner, repository name, public URL, and Pages
base path. Set `SITE_URL` and `SITE_BASE_URL` only for a custom domain or an
unusual deployment.

## Project lineage

`site.config.ts` can describe the conceptual lineage of the published game:

```ts
lineage: {
  designedWith: {
    label: 'Resonance',
    href: 'https://aleascript.github.io/resonance/',
  },
  poweredBy: {
    label: 'Regard',
    href: 'https://aleascript.github.io/regard/',
  },
}
```

The footer then renders a compact credit such as:

`© 2026 AleaScript · designed with Resonance · powered by Regard`

Both project names are links. A game created directly from Resonance, such as a
standalone experiment that does not use Regard, simply leaves `poweredBy` null.
Resonance itself can leave both values null.

## Visual customization

`site.config.ts` is the first customization layer. A derived site can change:

- `identity.logo` and `identity.favicon`;
- the light and dark palettes (`primary`, `background`, `surface`, `text`, `muted`, `border`);
- body, heading, and monospace font stacks;
- heading weight;
- global radius, border width, and navbar shadow;
- the maximum editorial content width.

These values are exposed as CSS custom properties by `src/theme/Root.tsx` and
mapped onto Docusaurus/Infima variables in `src/css/custom.css`. A game may then
add a small amount of project-specific CSS for its own expressive language
without forking Docusaurus components.

This creates three practical levels of customization:

1. **Identity** — logo, colors, type and geometry in `site.config.ts`;
2. **Mood** — project-specific textures, ornaments and editorial treatments in `custom.css`;
3. **Expression** — custom React/MDX components only when a game genuinely needs a unique interaction or visual form.

## Editorial conventions

Docusaurus `note` admonitions are reserved for **design notes**. Authors use the
same simple source syntax in every game:

```md
:::note[Design note]
This explains why the rule is shaped this way rather than what the rule does.
:::
```

French content uses `:::note[Note de design]`. The template supplies a restrained
base treatment through `.theme-admonition-note`; each game may override that
selector in `src/css/custom.css` so a Scooby-Doo design note, an Unmind clinical
note and a Regard optical note remain visually native to their own sites.

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

Start one locale with hot reload:

```bash
npm run start:en
npm run start:fr
```

Docusaurus development mode serves one locale at a time. To inspect the complete
multilingual site exactly as it will be published, build all locales and serve
the result locally:

```bash
npm run preview
```

Validate types and every configured locale:

```bash
npm run check
```

## Updating a derived site

A GitHub template is a **snapshot**, not a live parent repository. Creating a
site with **Use this template** does not create a relationship that can later be
updated with `git pull`.

During the current design-lab phase, generic improvements should therefore be
promoted to this template and then deliberately ported to each affected game in
a small pull request. This is preferable to blind synchronization because the
files most likely to diverge — `site.config.ts`, `src/css/custom.css`, documents
and assets — are intentionally game-specific.

A template remote can still be useful for inspecting or applying individual
commits:

```bash
git remote add site-template https://github.com/aleascript/resonance-site-template.git
git fetch site-template
```

From there, a genuinely generic commit can be cherry-picked when its patch is
compatible. When the boundary between shared infrastructure and game-specific
expression is stable, the next logical step is to extract the shared files into
a controlled updater or package and expose a command such as
`npm run template:update`. That command does **not** exist yet; adding it before
those boundaries stabilize would risk overwriting intentional game-specific
work.

## Theme and navigation

- Project metadata, lineage and visual tokens: `site.config.ts`
- Docusaurus, locale, navbar, and footer configuration: `docusaurus.config.ts`
- Sidebar structure: `sidebars.ts`
- Theme tokens and editorial styles: `src/css/custom.css`
- Runtime theme variables, language detection and preference persistence: `src/theme/Root.tsx`

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

### Personnalisation visuelle

La première couche de personnalisation se trouve dans `site.config.ts` : logo,
favicon, palettes claire et sombre, familles typographiques, géométrie et
largeur éditoriale. Ces valeurs deviennent des variables CSS communes au thème.

Un jeu peut ensuite ajouter dans `src/css/custom.css` des traitements qui lui
sont propres — texture, ornements ou grammaire éditoriale — sans modifier les
composants Docusaurus. Les composants spécifiques restent réservés aux besoins
qui ne peuvent pas être exprimés proprement par configuration et CSS.

Les admonitions `note` servent conventionnellement aux **Notes de design**. Le
template fournit leur structure visuelle minimale, que chaque jeu peut ensuite
réinterpréter dans son propre CSS.

### Filiation du projet

Le bloc `lineage` de `site.config.ts` contrôle les crédits du pied de page. Un
jeu utilisant Regard peut déclarer Resonance comme méthode de design et Regard
comme architecture ; un jeu autonome comme Unmind ne déclare que Resonance.

### Mettre à jour un site dérivé

Un dépôt créé depuis un template GitHub est une copie instantanée : il ne reste
pas synchronisé avec son template. Pour le moment, les améliorations génériques
sont donc reportées volontairement dans chaque jeu via une petite PR. C'est un
choix de sécurité tant que nous découvrons encore où passe la frontière entre
le noyau commun et l'expression propre à chaque jeu.

Lorsque cette frontière sera stable, nous pourrons ajouter un updater contrôlé
— par exemple `npm run template:update` — limité aux fichiers réellement
partagés. Un `git pull` automatique de tout le template serait au contraire
dangereux car il écraserait précisément les personnalisations que le template
est censé permettre.

### Créer un site

1. Utilisez **Use this template** sur GitHub.
2. Clonez le nouveau dépôt et exécutez `npm install` avec Node.js 24.
3. Modifiez les métadonnées et le thème dans `site.config.ts`.
4. Remplacez les exemples dans `docs/en/` et `docs/fr/`.
5. Choisissez **GitHub Actions** comme source dans **Settings → Pages**.
6. Exécutez `npm run check` avant chaque envoi.

Pour travailler avec hot reload :

```bash
npm run start:en
npm run start:fr
```

Pour contrôler localement le site bilingue complet :

```bash
npm run preview
```
