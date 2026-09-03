import type {ReactNode} from 'react';
import {useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const PERSIST_QUERY_PARAMETER = 'persistLocale';
const SUPPORTED_LOCALES = ['en', 'fr'] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function readPreference(storageKey: string): SupportedLocale | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return SUPPORTED_LOCALES.includes(value as SupportedLocale)
      ? (value as SupportedLocale)
      : null;
  } catch {
    return null;
  }
}

function savePreference(storageKey: string, locale: string): void {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, locale);
  } catch {
    // The site remains usable when browser storage is unavailable.
  }
}

function detectBrowserLocale(): SupportedLocale {
  const browserLocales = navigator.languages ?? [navigator.language];

  for (const browserLocale of browserLocales) {
    const language = browserLocale.toLowerCase().split('-')[0];
    if (SUPPORTED_LOCALES.includes(language as SupportedLocale)) {
      return language as SupportedLocale;
    }
  }

  return 'en';
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {i18n} = useDocusaurusContext();

  useEffect(() => {
    const url = new URL(window.location.href);
    const siteBaseUrl = i18n.localeConfigs[i18n.defaultLocale].baseUrl;
    const storageKey = `resonance-site:${siteBaseUrl}:locale`;

    if (url.searchParams.get(PERSIST_QUERY_PARAMETER) === 'true') {
      savePreference(storageKey, i18n.currentLocale);
      url.searchParams.delete(PERSIST_QUERY_PARAMETER);
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`,
      );
      return;
    }

    // Match the previous Resonance site: automatic detection only happens at
    // the site's entry point. A direct link to a localized page is respected.
    if (
      i18n.currentLocale !== i18n.defaultLocale ||
      url.pathname !== siteBaseUrl
    ) {
      return;
    }

    const preferredLocale =
      readPreference(storageKey) ?? detectBrowserLocale();
    savePreference(storageKey, preferredLocale);

    if (preferredLocale !== i18n.defaultLocale) {
      window.location.replace(`${siteBaseUrl}${preferredLocale}/`);
    }
  }, [i18n]);

  return children;
}
