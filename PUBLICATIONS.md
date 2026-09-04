# Publications

The template treats the Markdown files in `docs/` as the canonical editorial
source for both the Docusaurus site and downloadable publications.

## Configuration

`publications.config.mjs` declares publications independently from the website
sidebar. Each publication selects its own ordered pages, cover, page size,
theme, locales, output formats, credits, and explicit edition metadata.

```js
export default definePublications({
  markdown: {
    admonitions: ['design'],
  },
  publications: {
    core: {
      author: 'AleaScript',
      version: '0.1.0',
      revision: 'DRAFT',
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
          outputs: ['pdf', 'epub', 'webpub'],
        },
      },
    },
  },
});
```

A derived project should normally only edit this file and its publication theme
or cover assets. The builder remains generic.

### Version and revision

`version` and `revision` are deliberately explicit strings owned by the
publication. They are not inferred from `package.json`, Git tags, or commit
hashes.

A useful convention is:

- `version`: the public edition of the document, for example `1.0.0`;
- `revision`: an editorial revision identifier, for example `2026-09-04`, `r3`,
  or `draft-7`.

They are displayed on the cover when `cover.showMetadata` is enabled.

### Credits, license, and lineage

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

Outputs are written under `dist/publications/`. The current POC creates PDF,
EPUB 3, and Web Publication editions for both configured locales.

The build uses Vivliostyle CLI. PDF is the required publication format. EPUB
and WebPub intentionally share the same content and theme in this first
iteration; projects can later add format-specific CSS if a reader requires it.

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

The builder keeps the image marked as the publication cover for EPUB and WebPub,
not merely as a decorative image in the PDF.

`theme` points to publication-specific CSS. `publication/theme.css` is a neutral
starter theme that demonstrates page size, page numbers, headings, table of
contents, cover layout, credits, and admonition styling. Derived games are
expected to replace or extend it with their own editorial identity.

### Table of contents page numbers

The PDF table of contents appends the actual target page number to every entry
using paged-media cross references and a dotted leader. This styling is scoped
to print media. EPUB and WebPub deliberately do not receive fixed page numbers,
because their layout is reflowable and pagination depends on the reader.

## CI and distribution

The existing Pages workflow now builds publications for pull requests and
pushes to `main`.

- Every run uploads `dist/publications/` as a GitHub Actions artifact, so a PR
  validates the complete publication pipeline.
- On `main`, the same files are copied into `build/downloads/` before Pages is
  deployed, making them downloadable from the published site.
- GitHub Releases are intentionally left for the next distribution step. The
  build artifacts are already shaped so a tagged release or a rolling snapshot
  release can attach the same files without rebuilding them differently.

Generated publication files and Vivliostyle working files are ignored by Git.
They are build products, not authored sources.
