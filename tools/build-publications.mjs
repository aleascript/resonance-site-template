import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from '@vivliostyle/cli';
import config from '../publications.config.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workRoot = path.join(projectRoot, '.publication-workspace');
const outputRoot = path.join(projectRoot, 'dist', 'publications');

const standardAdmonitions = ['note', 'tip', 'info', 'warning', 'danger'];
const defaultTitles = {
  en: {
    note: 'Note',
    tip: 'Tip',
    info: 'Info',
    warning: 'Warning',
    danger: 'Danger',
    design: 'Design note',
  },
  fr: {
    note: 'Note',
    tip: 'Conseil',
    info: 'Information',
    warning: 'Attention',
    danger: 'Danger',
    design: 'Note de design',
  },
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function parseOpening(line) {
  const match = line.match(/^:::([A-Za-z][\w-]*)(?:\[(.*)\])?\s*$/);
  return match ? {type: match[1], title: match[2] ?? null} : null;
}

function transformAdmonitions(markdown, locale, customTypes) {
  const allowed = new Set([...standardAdmonitions, ...customTypes]);
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let inFence = false;
  let fenceMarker = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = line.match(/^\s*(```+|~~~+)/);

    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
      } else if (fence[1][0] === fenceMarker) {
        inFence = false;
        fenceMarker = null;
      }
      output.push(line);
      continue;
    }

    if (inFence) {
      output.push(line);
      continue;
    }

    const opening = parseOpening(line);
    if (!opening) {
      output.push(line);
      continue;
    }

    if (!allowed.has(opening.type)) {
      throw new Error(
        `Unsupported Markdown directive :::${opening.type}. ` +
          `Declare it in publications.config.mjs before publishing it.`,
      );
    }

    const body = [];
    let foundClosing = false;
    for (index += 1; index < lines.length; index += 1) {
      if (lines[index].trim() === ':::') {
        foundClosing = true;
        break;
      }
      if (parseOpening(lines[index])) {
        throw new Error('Nested admonitions are not supported by the publication POC yet.');
      }
      body.push(lines[index]);
    }

    if (!foundClosing) {
      throw new Error(`Unclosed :::${opening.type} admonition.`);
    }

    const fallbackTitle =
      defaultTitles[locale]?.[opening.type] ?? opening.type.replaceAll('-', ' ');
    const title = opening.title || fallbackTitle;
    const marker =
      `<span class="publication-admonition-title publication-admonition-${opening.type}">` +
      `${escapeHtml(title)}</span>`;

    output.push(`> ${marker}`);
    output.push('>');
    for (const bodyLine of body) {
      output.push(bodyLine.length === 0 ? '>' : `> ${bodyLine}`);
    }
  }

  return `${output.join('\n')}\n`;
}

function outputTargets(baseName, locale, formats) {
  return formats.map((format) => {
    if (format === 'webpub') {
      return {
        path: path.join(outputRoot, `${baseName}-${locale}.webpub`),
        format,
      };
    }
    return {
      path: path.join(outputRoot, `${baseName}-${locale}.${format}`),
      format,
    };
  });
}

async function preparePublication(publicationName, publication, locale, localeConfig) {
  const publicationWorkDir = path.join(workRoot, publicationName, locale);
  await fs.rm(publicationWorkDir, {recursive: true, force: true});
  await fs.mkdir(publicationWorkDir, {recursive: true});

  const customAdmonitions = config.markdown?.admonitions ?? [];
  const entries = [];

  for (const sourcePath of localeConfig.contents) {
    const sourceAbsolute = path.join(projectRoot, sourcePath);
    const destinationAbsolute = path.join(publicationWorkDir, sourcePath);
    const markdown = await fs.readFile(sourceAbsolute, 'utf8');
    const transformed = transformAdmonitions(markdown, locale, customAdmonitions);

    await fs.mkdir(path.dirname(destinationAbsolute), {recursive: true});
    await fs.writeFile(destinationAbsolute, transformed, 'utf8');
    entries.push(sourcePath);
  }

  const themeSource = path.join(projectRoot, publication.theme);
  const themeDestination = path.join(publicationWorkDir, 'theme.css');
  await fs.copyFile(themeSource, themeDestination);

  const staticSource = path.join(projectRoot, 'static');
  const staticDestination = path.join(publicationWorkDir, 'static');
  await fs.cp(staticSource, staticDestination, {recursive: true});

  const task = {
    title: localeConfig.title,
    author: publication.author,
    language: locale,
    size: publication.size ?? 'A4',
    entry: entries,
    entryContext: publicationWorkDir,
    theme: themeDestination,
    toc: {
      title: localeConfig.tocTitle ?? (locale === 'fr' ? 'Sommaire' : 'Contents'),
      sectionDepth: 2,
    },
    ...(publication.cover ? {cover: publication.cover} : {}),
    output: outputTargets(publication.outputName ?? publicationName, locale, localeConfig.outputs),
    workspaceDir: '.vivliostyle',
    static: {
      '/': staticDestination,
    },
  };

  const configPath = path.join(publicationWorkDir, 'vivliostyle.config.json');
  await fs.writeFile(configPath, JSON.stringify(task, null, 2), 'utf8');
  return configPath;
}

async function main() {
  await fs.rm(workRoot, {recursive: true, force: true});
  await fs.rm(outputRoot, {recursive: true, force: true});
  await fs.mkdir(outputRoot, {recursive: true});

  for (const [publicationName, publication] of Object.entries(config.publications)) {
    for (const [locale, localeConfig] of Object.entries(publication.locales)) {
      console.log(`Building ${publicationName} (${locale})...`);
      const configPath = await preparePublication(
        publicationName,
        publication,
        locale,
        localeConfig,
      );
      await build({config: configPath, logLevel: 'info'});
    }
  }

  console.log(`Publications written to ${path.relative(projectRoot, outputRoot)}/`);
}

await main();
