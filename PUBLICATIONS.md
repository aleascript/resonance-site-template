# Publications

The template treats the Markdown files in `docs/` as the canonical editorial
source for both the Docusaurus site and downloadable publications.

## Configuration

`publications.config.mjs` declares publications independently from the website
sidebar. Each publication selects its own ordered pages, cover, page size,
theme, locales, and output formats.

```js
export default definePublications({
  markdown: {
    admonitions: ['design'],
  },
  publications: {
    core: {
      author: 'AleaScript',
      size: 'A5',
      theme: 'publication/theme.css',
      cover: 'static/img/site/resonance_complex_big.png',
      outputName: 'resonance-site',
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

`cover` points to an image owned by the project. Vivliostyle generates the cover
page and reuses the image metadata for EPUB/WebPub.

`theme` points to publication-specific CSS. `publication/theme.css` is a neutral
starter theme that demonstrates page size, page numbers, headings, table of
contents, and admonition styling. Derived games are expected to replace or
extend it with their own editorial identity.

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
