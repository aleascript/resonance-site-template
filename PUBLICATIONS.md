# Publications

The template treats the Markdown files in `docs/` as the canonical editorial
source for both the Docusaurus site and downloadable publications.

## Configuration

`publications.config.mjs` declares publications independently from the website
sidebar. Each publication selects its own ordered pages, cover, page size,
theme, locales, output formats, credits, and optional editorial revision.

```js
export default definePublications({
  release: {
    initialVersion: '0.1.0',
  },
  markdown: {
    admonitions: ['design'],
  },
  publications: {
    core: {
      author: 'AleaScript',
      revision: 'Draft',
      license: {
        label: 'CC BY 4.0',
        href: 'https://creativecommons.org/licenses/by/4.0/',
        attribution: {
          title: 'Resonance',
          author: 'AleaScript',
          href: null,
        },
      },
      lineage: {
        designedWith: null,
        poweredBy: null,
      },
      size: 'A5',
      theme: 'publication/theme.css',
      cover: {
        image: 'static/img/site/resonance_complex_big.png',
        showTitle: true,
        showMetadata: true,
      },
      outputName: 'resonance',
      locales: {
        en: {
          title: 'Resonance',
          tocTitle: 'Contents',
          contents: [
            'docs/en/index.md',
            'docs/en/enter-the-fiction.md',
          ],
          outputs: ['pdf'],
        },
      },
    },
  },
});
```

A derived project should normally only edit this file and its publication theme
or cover assets. The builder remains generic.

## Version and revision

The repository uses **lockstep publication versioning**. A version identifies a
released corpus, not an individual file. All publications rebuilt for a release
therefore carry the same SemVer even if only one document changed.

The builder resolves the version in this order:

1. `PUBLICATION_VERSION`, supplied during release preparation;
2. the latest Git tag matching `vX.Y.Z`;
3. `release.initialVersion` from `publications.config.mjs`.

The template starts at `0.1.0`. There is no `version` field inside individual
publication declarations.

`revision` remains publication-specific. It is an optional editorial identifier
such as `Draft`, `2026-09-04`, `r3`, or `draft-7`. It does not participate in
SemVer and can differ between publications in the same released corpus.

The resolved version and revision are displayed on the cover when
`cover.showMetadata` is enabled.

This intentionally avoids independent version streams such as Core Rules 1.2.0,
Quickstart 1.4.3, and GM Reference 0.8.1. Independent streams would require
tracking which overlapping source documents affect which publication and would
turn the template into a monorepo release manager before a real project has
shown that complexity is necessary.

## Manifest and publication page

Every successful publication build writes
`dist/publications/publications.json`. The manifest contains the lockstep corpus
version and, for each publication and locale, the available formats and relative
paths.

The Docusaurus `/publications/` page reads that manifest from
`/downloads/publications.json` and presents the current locale's editions. The
same page component is reused in every locale.

On deployment, `tools/copy-publications-to-site.mjs` copies the entire
`dist/publications/` directory into `build/downloads/`, so the manifest and the
files it references always travel together.

## Credits, license, and lineage

`author` is passed to Vivliostyle as publication metadata and is also displayed
on the generated cover.

`license` can contain a simple `label` and `href`, plus an optional
`attribution`. When attribution is present, the cover renders the attribution
followed by the linked license reference.

`lineage.designedWith` and `lineage.poweredBy` accept the same `{label, href}`
shape used by the website. Either can be `null`. A Regard game can therefore
render credits such as:

`designed with Resonance · powered by Regard`

The publication configuration currently owns these values explicitly. The site
already exposes equivalent project metadata in `site.config.ts`; consolidating
that shared identity into one project-level source of truth is a possible
follow-up once the publication model itself is stable.

## Build

Install dependencies and run:

```bash
npm run publication:build
```

Outputs are written under `dist/publications/`. The template creates PDF editions for each configured locale, plus the manifest.

The build uses Vivliostyle CLI. PDF is the required publication format.

To copy a built corpus into an already-built site:

```bash
npm run publication:site
```

## Markdown portability

Published pages should remain portable Markdown rather than relying on arbitrary
React/MDX components. The template nevertheless defines a small shared Markdown
dialect for constructs that are useful in both the site and publications.

Docusaurus admonitions are part of that dialect:

```md
:::note[Remember]
This remains Markdown in the source file.
:::
```

Before publication, `tools/build-publications.mjs` transforms supported
admonitions in temporary working copies into ordinary Markdown blockquotes with
a semantic marker. The source files are never rewritten. Markdown inside the
admonition therefore remains Markdown and is parsed by Vivliostyle normally.

The five Docusaurus defaults are supported:

- `note`
- `tip`
- `info`
- `warning`
- `danger`

Project-specific admonitions are declared once under `markdown.admonitions`.
The template currently declares `design`, matching the custom Docusaurus
admonition already provided by the site template.

An unknown directive fails the publication build instead of silently producing
a degraded book. Nested admonitions are deliberately rejected by this POC and
can be added later if a real project needs them.

## Cover and theme

`cover.image` points to an image owned by the project. The builder creates a
custom Vivliostyle cover document around it so the publication title can appear
before the image and publication metadata can appear below it.

By default the cover title is the locale's `title`. A locale can override it
with `coverTitle`. `cover.showTitle` and `cover.showMetadata` can independently
hide the title or metadata block.

`theme` points to publication-specific CSS. `publication/theme.css` is a neutral
starter theme that demonstrates page size, page numbers, headings, table of
contents, cover layout, credits, and admonition styling. Derived games are
expected to replace or extend it with their own editorial identity.

### Table of contents page numbers

The PDF table of contents appends the actual target page number to every entry
using paged-media cross references and a dotted leader. This styling is scoped
to print media. 

## Semantic Release

`.releaserc.json` defines one release stream for the repository. The commit that
lands on `main` controls SemVer after the first release exists:

- `fix:` and `revert:` create a patch release;
- `feat:` creates a minor release;
- a Conventional Commits breaking marker (`!` or `BREAKING CHANGE:`) creates a
  major release;
- `docs:`, `chore:`, `ci:`, `build:`, `test:`, `style:`, `refactor:`, and
  `perf:` do not create a release.

For editorial repositories, Markdown game content is the product. A change to a
published rule should therefore use `fix:` or `feat:` rather than `docs:`.
`docs:` is reserved for repository documentation such as this file or the
README.

When squash merging, the PR title should itself be a Conventional Commit so the
squash commit on `main` carries the intended release signal.

A repository created from the template normally has no release tags. The first
successful release run therefore uses `release.initialVersion` (default
`0.1.0`), rebuilds the complete corpus with that exact version, and creates the
first GitHub Release directly on the current `main` HEAD. From that real
`vX.Y.Z` tag onward, Semantic Release manages subsequent versions. No synthetic
seed tag or PAT with workflow scope is required.

During Semantic Release's `prepare` step,
`tools/prepare-release.mjs` receives `nextRelease.version`, exposes it as
`PUBLICATION_VERSION`, rebuilds the complete corpus, builds the site, and copies
the corpus into `build/downloads/`. `@semantic-release/github` then creates the
GitHub Release and attaches all PDF files plus `publications.json`.

WebPub remains website distribution because the current Vivliostyle output is a
directory rather than a single GitHub Release asset.

## CI and distribution

The Pages workflow validates pull requests and publishes from `main`.

- Every PR builds the site and complete publication corpus, validates the release
  configuration, and uploads `dist/publications/` as a validation artifact.
- If no real release tag exists yet, a successful push to `main` creates
  `release.initialVersion` as the first GitHub Release.
- Once a real release exists, successful pushes to `main` run Semantic Release.
- If a subsequent commit requires a release, the corpus is rebuilt with the
  exact new version before the GitHub Release is published.
- If a subsequent commit does not require a release, the site is still rebuilt
  using the latest release tag, so technical/documentation-only changes can
  deploy without inventing an editorial version.
- The deployed site receives the corpus under `build/downloads/` and exposes it
  through `/publications/`.

Generated publication files and Vivliostyle working files are ignored by Git.
They are build products, not authored sources.
