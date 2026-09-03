/**
 * Project-specific values live here so repositories created from this template
 * have one obvious place to start customizing.
 */

export type SiteIdentity = {
  logo: string | null;
  favicon: string | null;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type SiteLineage = {
  designedWith: ProjectLink | null;
  poweredBy: ProjectLink | null;
};

export type ContentLicense = {
  label: string;
  href: string;
  attribution: {
    title: string;
    author: string;
    href: string | null;
  };
};

export type ThemePalette = {
  primary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
};

export type SiteTheme = {
  colors: {
    light: ThemePalette;
    dark: ThemePalette;
  };
  typography: {
    body: string;
    heading: string;
    mono: string;
    headingWeight: number;
  };
  shape: {
    radius: string;
    borderWidth: string;
    navbarShadow: string;
  };
  layout: {
    contentWidth: string;
  };
};

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
  identity: {
    logo: 'img/site/resonance_simple_200x200.png',
    favicon: 'img/site/resonance_simple_200x200.png',
  } satisfies SiteIdentity,
  license: {
    label: 'CC BY 4.0',
    href: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: {
      title: 'Resonance Site',
      author: 'AleaScript',
      href: null,
    },
  } satisfies ContentLicense,
  lineage: {
    designedWith: null,
    poweredBy: null,
  } as SiteLineage,
  theme: {
    colors: {
      light: {
        primary: '#315da8',
        background: '#fcfcfd',
        surface: '#f4f6f9',
        text: '#202a38',
        muted: '#667085',
        border: '#d7dce4',
      },
      dark: {
        primary: '#8eb6f4',
        background: '#10141b',
        surface: '#171d27',
        text: '#edf2f7',
        muted: '#aeb8c7',
        border: '#303949',
      },
    },
    typography: {
      body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      heading: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      headingWeight: 650,
    },
    shape: {
      radius: '0.4rem',
      borderWidth: '1px',
      navbarShadow: '0 1px 0 rgb(20 29 43 / 10%)',
    },
    layout: {
      contentWidth: '52rem',
    },
  } satisfies SiteTheme,
} as const;
