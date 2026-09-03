---
title: Bien démarrer
sidebar_position: 2
---

# Bien démarrer

L'édition anglaise se trouve dans `docs/`. Sa version française se trouve dans
`i18n/fr/docusaurus-plugin-content-docs/current/` et conserve les mêmes noms de
fichiers et les mêmes identifiants explicites de titres.

## Personnaliser le projet {/* #customize-the-project */}

1. Modifiez `site.config.ts`.
2. Remplacez les pages d'exemple dans les deux langues.
3. Remplacez les variables du thème neutre dans `src/css/custom.css` par
   l'identité visuelle du jeu.
4. Exécutez `npm run check` avant de pousser les changements.

Le nom du dépôt GitHub et le chemin de base de Pages sont déduits
automatiquement dans GitHub Actions. `SITE_URL` et `SITE_BASE_URL` permettent de
les remplacer pour un domaine personnalisé ou un déploiement inhabituel.

## Publier {/* #publishing */}

Le workflow inclus valide les pull requests. Un push sur `main` compile et
publie également les deux éditions localisées avec GitHub Pages.

L'administrateur du dépôt doit sélectionner une fois **GitHub Actions** comme
source Pages dans **Settings → Pages**.
