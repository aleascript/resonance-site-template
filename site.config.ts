/**
 * Project-specific values live here so repositories created from this template
 * have one obvious place to start customizing.
 */
export const site = {
  title: 'Resonance Site',
  tagline: 'A world begins with a question',
  description: 'Enter a world shaped by every choice made at the table.',
  author: 'AleaScript',
  defaultLocale: 'en',
  locales: {
    en: {
      htmlLang: 'en',
      label: 'English',
    },
    fr: {
      htmlLang: 'fr',
      label: 'Français',
    },
  },
  repository: {
    defaultFullName: 'aleascript/resonance-site-template',
  },
} as const;
