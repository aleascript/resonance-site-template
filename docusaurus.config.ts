import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {site} from './site.config';

const repositoryFullName =
  process.env.GITHUB_REPOSITORY ?? site.repository.defaultFullName;
const [organizationName, projectName] = repositoryFullName.split('/');

if (!organizationName || !projectName) {
  throw new Error(
    `Invalid repository name "${repositoryFullName}". Expected "owner/repository".`,
  );
}

function normalizeBaseUrl(value: string): string {
  return `/${value}`.replace(/\/{2,}/g, '/').replace(/\/?$/, '/');
}

const isUserPagesRepository = projectName === `${organizationName}.github.io`;
const url = (process.env.SITE_URL ?? `https://${organizationName}.github.io`).replace(
  /\/$/,
  '',
);
const baseUrl = normalizeBaseUrl(
  process.env.SITE_BASE_URL ?? (isUserPagesRepository ? '/' : projectName),
);
const repositoryUrl = `https://github.com/${repositoryFullName}`;

const config: Config = {
  title: site.title,
  tagline: site.tagline,
  url,
  baseUrl,
  organizationName,
  projectName,
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {
        htmlLang: 'en',
        label: 'English',
      },
      fr: {
        htmlLang: 'fr',
        label: 'Français',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${repositoryUrl}/edit/${site.repository.branch}/`,
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [{name: 'description', content: site.description}],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: site.title,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Contents',
        },
        {
          type: 'localeDropdown',
          position: 'right',
          queryString: '?persistLocale=true',
        },
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} ${site.author}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
