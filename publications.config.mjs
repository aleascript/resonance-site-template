export function definePublications(config) {
  return config;
}

export default definePublications({
  markdown: {
    admonitions: ['design'],
  },
  publications: {
    core: {
      author: 'AleaScript',
      version: '0.1.0',
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
            'docs/en/admonitions.md',
          ],
          outputs: ['pdf', 'epub', 'webpub'],
        },
        fr: {
          title: 'Resonance',
          tocTitle: 'Sommaire',
          contents: [
            'docs/fr/index.md',
            'docs/fr/enter-the-fiction.md',
            'docs/fr/admonitions.md',
          ],
          outputs: ['pdf', 'epub', 'webpub'],
        },
      },
    },
  },
});
