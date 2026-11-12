# Light / Dark : base de travail pour la refonte

## Comment ça marche
1. `_includes/theme-init.html` (dans le `<head>`) pose `data-theme` sur `<html>` AVANT l'affichage : choix mémorisé (`localStorage.theme`), sinon préférence système. → pas de flash.
2. `script.js` (bloc « Theme ») gère les boutons `[data-theme-toggle]` : bascule, mémorisation, `aria-checked`, `theme-color`, suivi du système tant qu'aucun choix n'est fait, synchro entre onglets.
3. `style.css` : les jetons de `:root` sont la version claire ; `html[data-theme="dark"]` ne surcharge que les jetons.

## Règles pour tous les nouveaux composants
- Jamais de couleur en dur (`#fff`, `#000`, `rgba(255,255,255…)`) : utiliser les jetons `--Background`, `--Surface`, `--SurfaceAlt*`, `--Ink`, `--Muted`, `--MinMuted`, `--LineRGB`.
- Texte bleu **petit** (< 24 px) : `var(--PrimaryDeep)`, pas `--Primary` (`--Primary` = 4.1:1 sur blanc, 3.2:1 sur le fond beige → sous le seuil AA de 4.5:1). `--Primary` reste réservé aux fonds, bordures, icônes et grands titres.
- Texte secondaire : `--Muted` ou `--MinMuted` ; éviter `--LightMuted` (#A3A3A3) comme couleur de texte sur fond clair (2.3:1).
- Zone « sombre par conception » (hero, NavBar, footer) : même couleur dans les deux thèmes, et on y redéfinit localement les jetons de texte (ex. `section.Hero { --PrimaryDeep: #7ab8f5; }`).
- Tout nouveau bouton de thème : `<button role="switch" aria-checked="false" data-theme-toggle>`. Il est branché automatiquement.

## Vérifier (avant chaque livraison)
```
pip install playwright && playwright install chromium
python tools/theme-test.py  http://localhost:4000/            # fonctionnement (15 vérifications)
python tools/theme-test.py  http://localhost:4000/ --mobile
python tools/theme-audit.py http://localhost:4000 / /services /about /contact   # contraste des 2 thèmes
```
