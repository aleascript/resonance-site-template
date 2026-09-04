# Resonance site template

A bilingual, documentation-first [Docusaurus](https://docusaurus.io/) template
for Resonance, Regard, and related tabletop role-playing games.

The published site contains only reader-facing game material. Configuration,
authoring, publication, release, and deployment instructions belong in this
README.

## Included

- English and French content stored symmetrically in `docs/en/` and `docs/fr/`;
- automatic browser-language selection on the first visit;
- Docusaurus' native language menu, linking to the equivalent page;
- a manually selected language remembered per site;
- a neutral, accessible light and dark theme;
- project-level visual tokens for identity, colors, typography, geometry, and editorial width;
- optional project-lineage credits in the footer;
- standard Docusaurus admonitions plus a dedicated `design` admonition;
- PDF, EPUB 3, and WebPub publications built from the same Markdown sources;
- a reader-facing `/publications/` page generated from the publication manifest;
- lockstep publication versioning and automated GitHub Releases with Semantic Release;
- automatic validation and deployment to GitHub Pages.

## Create a site from the template

1. Select **Use this template** on GitHub and create a repository.
2. Clone the new repository.
3. Install Node.js 24 and run `npm install`.
4. Customize the project metadata and visual tokens in `site.config.ts`.
5. Configure the publication corpus in `publications.config.mjs`.
6. Replace the sample game material in `docs/en/` and `docs/fr/`.
7. In **Settings → Pages**, select **GitHub Actions** as the source.

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

Design notes have their own custom admonition type. This deliberately leaves
Docusaurus' standard `note` type available for ordinary reader-facing notes.

```md
:::design[Design note]
This explains why the rule is shaped this way rather than what the rule does.
:::
```

French content uses `:::design[Note de design]`. The template registers
`design` as an additional admonition keyword and supplies a restrained base
treatment through `.theme-admonition-design`. Each game may override that
selector in `src/css/custom.css` so a Scooby-Doo design note, an Unmind clinical
design note and a Regard optical design note remain visually native to their
own sites.

The template sample content also contains a showcase for every supported
admonition (`note`, `tip`, `info`, `warning`, `danger`, and `design`). This acts
as both documentation and a visual regression check for the site and generated
publications.

## Content structure

```text
docs/
├── en/
│   ├── index.md
│   ├── enter-the-fiction.md
│   └── admonitions.md
└── fr/
    ├── index.md
    ├── enter-the-fiction.md
    └── admonitions.md
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

Build the downloadable corpus:

```bash
npm run publication:build
```

The generated files and `publications.json` manifest are written under
`dist/publications/`. To copy them into an already-built site exactly as CI
does, run:

```bash
npm run publication:site
```

Validate types and every configured locale:

```bash
npm run check
```

## Publications and versioning

`publications.config.mjs` composes one or more publications from the canonical
Markdown sources. Editorial order is independent from the Docusaurus sidebar.
See [`PUBLICATIONS.md`](PUBLICATIONS.md) for the detailed publication schema.

All publications in a repository use **lockstep versioning**. The version belongs
to the released project corpus, not to an individual PDF. If a release contains
Core Rules, a Quickstart and a GM Reference, all three carry the same version
even when only one document changed. This deliberately avoids independent
version streams and dependency tracking between overlapping documents.

`revision` remains optional per publication and can describe an editorial state
such as `Draft`, `r3`, or a date. It is not used to calculate SemVer.

The builder resolves the corpus version in this order:

1. `PUBLICATION_VERSION`, injected by the release workflow;
2. the latest `vX.Y.Z` Git tag;
3. `release.initialVersion` from `publications.config.mjs` (the template starts at `0.1.0`).

The same resolved version is printed on every publication cover and written to
`dist/publications/publications.json`. The `/publications/` page reads that
manifest and exposes the formats available for the current language.

## Conventional Commits and Semantic Release

Releases are automated by [Semantic Release](https://semantic-release.gitbook.io/)
and follow a small Conventional Commits contract. The commit message that lands
on `main` determines whether a new corpus version exists:

| Commit | Effect |
| --- | --- |
| `fix: ...` | patch: `0.2.0 → 0.2.1` |
| `revert: ...` | patch |
| `feat: ...` | minor: `0.2.1 → 0.3.0` |
| `feat!: ...` or a `BREAKING CHANGE:` footer | major: `0.x.y → 1.0.0` |
| `docs:`, `chore:`, `ci:`, `build:`, `test:`, `style:`, `refactor:`, `perf:` | no release |

There is one important editorial rule: **the game's Markdown is product content,
not repository documentation**. A correction to a rule should therefore be a
`fix:`. A new rule, chapter, scenario, or player-facing capability should be a
`feat:`. Reserve `docs:` for README text, contributor instructions, pipeline
documentation, and similar repository documentation. Otherwise a real change
to the published game could accidentally ship without a new version.

Breaking changes do not need a special commit type. Conventional Commits uses
`!` after the type or a `BREAKING CHANGE:` footer, for example:

```text
feat!: change the stake resolution contract
```

or:

```text
feat: revise stake resolution

BREAKING CHANGE: existing game implementations must update their resolution prism
```

### Squash merges

Semantic Release analyzes the commits present on `main`. When using **Squash and
merge**, make the PR title itself a valid Conventional Commit, for example:

```text
feat: add publication downloads
fix: clarify opposed-stakes wording
chore: update CI action
```

That title normally becomes the squash commit subject and therefore the release
signal. A non-conventional squash title can correctly result in no release.

### First release

A repository created from the template normally has no release tags. Before
Semantic Release runs for the first time, CI creates and pushes a technical
`v0.0.0` seed tag on the parent of the incoming `main` commit. The seed is
visible in Git but has no GitHub Release; its only purpose is to establish the
pre-1.0 SemVer baseline. This lets the first `feat:` naturally create `v0.1.0`
instead of jumping directly to `1.0.0`. Once any real `vX.Y.Z` release tag
exists, the bootstrap step becomes a no-op.

## GitHub Releases and distribution

The workflow in `.github/workflows/deploy-pages.yml` has three responsibilities:

1. every PR validates TypeScript, the localized site, and all publications;
2. a successful push to `main` runs Semantic Release and, when required,
   creates the next `vX.Y.Z` tag and GitHub Release;
3. the resulting site is deployed to GitHub Pages with the current publication
   corpus under `build/downloads/`.

During Semantic Release's `prepare` phase, the template rebuilds every
publication with `PUBLICATION_VERSION` set to the exact next SemVer, builds the
site, and copies the corpus into the site. The GitHub Release attaches all PDF
and EPUB files plus `publications.json`. WebPub is directory-based rather than a
single release asset, so it is served from the website through `/publications/`.

A `docs:` or `chore:` push that does not require a new version still rebuilds and
deploys the site using the latest release tag. GitHub Pages therefore remains
current without inventing an editorial release.

No release commit updates `package.json`, and the repository does not maintain a
robot-generated `CHANGELOG.md`; Git tags and GitHub Release notes are the release
history. `package.json` remains private because the repository itself is not an
npm package.

## Updating a derived site

A GitHub template is a **snapshot**, not a live parent repository. Creating a
site with **Use this template** does not create a relationship that can later be
updated with `git pull`.

During the current design-lab phase, generic improvements should therefore be
promoted to this template and then deliberately ported to each affected game in
a small pull request. This is preferable to blind synchronization because the
files most likely to diverge — `site.config.ts`, `src/css/custom.css`, documents,
publication configuration, themes, covers, and assets — are intentionally
game-specific.

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
- Publication composition: `publications.config.mjs`
- Docusaurus, locale, navbar, footer, and admonition parsing: `docusaurus.config.ts`
- Publications download page: `src/pages/publications.tsx`
- Custom admonition renderers: `src/theme/Admonition/Types.js`
- Sidebar structure: `sidebars.ts`
- Theme tokens and editorial styles: `src/css/custom.css`
- Runtime theme variables, language detection and preference persistence: `src/theme/Root.tsx`
- Publication builder and manifest: `tools/build-publications.mjs`
- Release policy: `.releaserc.json`

The language selector is Docusaurus' native `localeDropdown`. Its
`?persistLocale=true` query parameter is consumed by `Root.tsx`, which saves the
reader's explicit choice and then removes the parameter from the visible URL.

---

## Français

Ce dépôt fournit un template [Docusaurus](https://docusaurus.io/) bilingue pour
Resonance, Regard et les jeux qui en dérivent. Le site publié ne contient que
des textes destinés aux lecteurs et aux joueurs ; la documentation technique,
la publication et le mécanisme de release restent décrits dans ce README.

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

Les **Notes de design** utilisent le type d'admonition dédié
`:::design[Note de design]`. Les types standard restent disponibles et la page
d'exemple `admonitions.md` montre les six rendus supportés dans le site et dans
les publications.

### Filiation du projet

Le bloc `lineage` de `site.config.ts` contrôle les crédits du pied de page. Un
jeu utilisant Regard peut déclarer Resonance comme méthode de design et Regard
comme architecture ; un jeu autonome comme Unmind ne déclare que Resonance.

### Publications et version lockstep

`publications.config.mjs` déclare une ou plusieurs publications, chacune avec
son ordre éditorial, ses langues, sa couverture, son thème et ses formats. Cet
ordre est indépendant de la navigation du site.

Toutes les publications du dépôt partagent **la même version de corpus**. Si
Core Rules, Quickstart et GM Reference sont publiés ensemble en `0.4.1`, les
trois portent `0.4.1`, même si le commit ne modifie matériellement que l'un
d'entre eux. On évite ainsi plusieurs trains de versions et la détection complexe
des documents affectés par des sources partagées.

La propriété `revision` reste locale à une publication et peut indiquer `Draft`,
`r3` ou une date. Elle n'intervient pas dans SemVer.

Le builder utilise, par ordre de priorité, la variable
`PUBLICATION_VERSION`, le dernier tag `vX.Y.Z`, puis `release.initialVersion`
(`0.1.0` dans le template). La version obtenue est imprimée sur toutes les
couvertures et écrite dans `publications.json`. La page `/publications/` utilise
ce manifeste pour présenter les téléchargements dans la langue courante.

### Conventional Commits et Semantic Release

La version est calculée automatiquement par Semantic Release à partir du commit
qui arrive sur `main` :

- `fix:` et `revert:` → incrément **patch** (`0.2.0 → 0.2.1`) ;
- `feat:` → incrément **minor** (`0.2.1 → 0.3.0`) ;
- `feat!:` ou un footer `BREAKING CHANGE:` → incrément **major** (`0.x.y → 1.0.0`) ;
- `docs:`, `chore:`, `ci:`, `build:`, `test:`, `style:`, `refactor:` et `perf:` → pas de nouvelle release.

Attention à une convention importante pour un projet éditorial : **les fichiers
Markdown du jeu sont le produit, pas de la documentation technique**. Corriger
une règle est donc un `fix:` ; ajouter une règle, un chapitre, un scénario ou une
capacité destinée aux joueurs est un `feat:`. `docs:` est réservé au README, aux
instructions de contribution et à la documentation du pipeline.

Avec **Squash and merge**, le titre de la PR doit être lui-même un Conventional
Commit, car il devient normalement le sujet du commit analysé sur `main` :

```text
feat: add facilitator reference publication
fix: clarify the Focus procedure
chore: update CI action
```

Avant la toute première release, la CI crée et pousse un tag technique `v0.0.0`
sur le parent du commit entrant. Ce seed est visible dans Git mais n'a pas de
GitHub Release ; il sert uniquement à établir l'historique SemVer pré-1.0. Le
premier `feat:` produit ainsi naturellement `v0.1.0`. Dès qu'un vrai tag de
release `vX.Y.Z` existe, cette étape ne fait plus rien.

### GitHub Releases et site

Sur une PR, la CI construit le site et toutes les publications sans rien
publier. Après un merge sur `main`, Semantic Release détermine si une nouvelle
version est nécessaire. Lorsqu'elle l'est, sa phase `prepare` reconstruit tout le
corpus avec le numéro exact, construit le site, puis GitHub crée le tag et la
Release. Les PDF, EPUB et `publications.json` sont joints à la GitHub Release.
Les WebPub, qui sont des répertoires, sont servis directement par le site.

Le site est ensuite déployé avec les mêmes fichiers sous `build/downloads/` et
la page `/publications/` les expose aux lecteurs. Un commit `docs:` ou `chore:`
qui ne crée pas de release peut tout de même redéployer le site : il reprend
simplement la dernière version taggée.

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
4. Configurez le corpus dans `publications.config.mjs`.
5. Remplacez les exemples dans `docs/en/` et `docs/fr/`.
6. Choisissez **GitHub Actions** comme source dans **Settings → Pages**.
7. Exécutez `npm run check` avant chaque envoi.

Pour travailler avec hot reload :

```bash
npm run start:en
npm run start:fr
```

Pour construire les publications :

```bash
npm run publication:build
```
