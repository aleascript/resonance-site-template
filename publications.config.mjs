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
        fr: {
          title: 'Resonance',
          tocTitle: 'Sommaire',
          contents: [
            'docs/fr/index.md',
            'docs/fr/enter-the-fiction.md',
          ],
          outputs: ['pdf', 'epub', 'webpub'],
        },
      },
    },
  },
});
