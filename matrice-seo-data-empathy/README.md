# Matrice SEO × GEO-IA × Performance — DATA-EMPATHY

Outil interne pour prioriser les pages de data-empathy.click selon 3 axes : SEO classique, préparation aux moteurs IA génératifs (GEO-IA), et performance technique (Core Web Vitals).

## Stack

- Vite (vanilla JS, pas de framework)
- Aucune dépendance runtime — tout le state est en mémoire (pas de backend, pas de base de données)

## Développement local

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (généralement `http://localhost:5173`).

## Build de production

```bash
npm run build
npm run preview   # pour tester le build localement
```

Le résultat est généré dans `dist/`.

## Déploiement — GitHub

1. Crée un nouveau repo sur GitHub : `matrice-seo-data-empathy` (vide, sans README/licence auto-générés)
2. Dans ce dossier local :
   ```bash
   git init
   git add .
   git commit -m "Initial commit — matrice SEO/GEO-IA/Performance"
   git branch -M main
   git remote add origin https://github.com/cubalibre59/matrice-seo-data-empathy.git
   git push -u origin main
   ```

## Déploiement — Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe le repo `matrice-seo-data-empathy`
3. Vercel détecte Vite automatiquement (Framework Preset: Vite) — ne change rien
4. Clique **Deploy**

Chaque futur `git push` sur `main` redéploiera automatiquement.

## Structure

```
matrice-seo-data-empathy/
├── index.html          → structure HTML de l'app
├── src/
│   ├── main.js          → logique (scores, rendu matrice, tableau éditable)
│   └── style.css        → styles (thème DATA-EMPATHY : Syne + DM Sans)
├── package.json
├── vite.config.js
└── .gitignore
```

## Notes

- Les données des pages sont pré-remplies dans `src/main.js` (variable `pages`) à partir de l'export Search Console du 03/09/2026. Modifie-les directement dans le code si tu veux changer les valeurs par défaut, ou utilise l'interface (tableau éditable + bouton "Ajouter une page").
- Aucune donnée n'est sauvegardée entre les sessions (pas de localStorage ni de backend) — c'est un outil de travail ponctuel, pas un tracker persistant.
