# Regard

Site statique de lecture critique de la Belgique politique.
État des lieux arrêté au **18 septembre 2026**.

→ https://ouaisfieu.github.io/regard/

## Ce que c'est

Douze dossiers de fond, une page consacrée à la coalition et à ses scénarios de
sortie, un simulateur de la taxe sur les plus-values, une chronologie filtrable de
42 repères, huit tableaux d'indicateurs sourcés, onze graphiques, un glossaire de
23 entrées, une bibliographie de 102 références, et une page de méthode listant
publiquement les corrections apportées aux documents de départ — y compris à ce site.

Chaque dossier suit la même structure : le fait établi et daté, le mécanisme qui le
produit, qui en supporte le coût, et un encadré « ce qui reste incertain ».

## Stack

Il n'y en a pas.

- HTML statique écrit en dur, une page par fichier
- une feuille de style (`assets/style.css`), un script (`assets/app.js`)
- graphiques en SVG inline : pas de Chart.js, pas de canevas, pas de bibliothèque
- aucune dépendance, aucune police distante, aucun CDN, aucun traceur, aucun cookie
- pas de générateur, pas de Node, pas de GitHub Action, pas de flux RSS
- toutes les pages fonctionnent sans JavaScript ; le simulateur affiche alors le
  barème complet en tableaux et signale que le calcul demande JavaScript

`git push` suffit à publier. Il n'y a rien à compiler.

## Publier sur GitHub Pages

1. Pousser le contenu de ce dossier à la racine du dépôt `ouaisfieu/regard`.
2. `Settings` → `Pages` → *Source* : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Le site est servi sur `https://ouaisfieu.github.io/regard/`.

Le fichier `.nojekyll` désactive le traitement Jekyll, inutile ici.

## Arborescence

```
index.html                 accueil
dossiers/index.html        sommaire des douze dossiers
dossiers/*.html            les douze dossiers
coalition.html             les 5 partis, l'asymétrie, 3 scénarios et leurs signaux
simulateur-plus-values.html  calculateur fiscal, calcul 100 % local
chronologie.html           42 repères, filtrables par thème
indicateurs.html           8 tableaux sourcés + 3 graphiques
glossaire.html             23 définitions
sources.html               102 références classées par nature
methode.html               règles de vérification et corrections publiques
a-propos.html              qui écrit, qui édite, ce qui n'est pas collecté
404.html                   page d'erreur (chemins absolus /regard/…)
sitemap.xml                22 URL
robots.txt
manifest.webmanifest
assets/style.css           tokens de couleur, thème clair et sombre
assets/app.js              thème, filtres, sommaire actif, simulateur
assets/icon.svg            favicon
.nojekyll
```

## Modifier le contenu

Tout est en clair dans les fichiers HTML. Pour corriger un chiffre, il faut le changer
à deux endroits au plus : dans le dossier concerné, et dans le tableau correspondant de
`indicateurs.html`. Les chaînes sont uniques, un rechercher-remplacer suffit.

Pour ajouter un repère à la chronologie, copier un `<li>` existant dans
`chronologie.html` et renseigner `data-theme` avec un ou plusieurs mots-clés parmi :
`federal`, `social`, `fiscal`, `regions`, `justice`, `marches`, `sante`, `energie`,
`asile`, `europe`, `local`, `enseignement`, `defense`, `environnement`.

Pour ajouter un dossier : dupliquer un fichier de `dossiers/`, ajuster le `<title>`, la
`meta description`, le `link canonical`, le JSON-LD, le fil d'Ariane et le sommaire
latéral, puis ajouter la carte correspondante dans `dossiers/index.html` et l'URL dans
`sitemap.xml`.

## Les graphiques

Onze graphiques, tous en SVG écrit dans la page. Trois règles ont été suivies :

1. **Jamais deux échelles verticales sur un même graphique.** La dette et le solde de
   financement ont chacun le leur : les superposer fabriquerait une corrélation que la
   géométrie invente.
2. **Palette validée par calcul, pas choisie à l'œil.** Écart perceptuel sous
   simulation protanope et deutéranope, contraste sur la surface réelle de la page,
   en mode clair et en mode sombre séparément. Les valeurs sont dans `:root` sous les
   noms `--s1` à `--s5`.
3. **L'identité n'est jamais portée par la seule couleur.** Chaque marque est
   étiquetée, chaque graphique a sa légende dès deux séries et son tableau de données
   repliable.

C'est pourquoi la répartition des sièges n'utilise pas les couleurs des partis :
jaune, bleu, turquoise, orange et rouge ne se distinguent pas de façon fiable en
vision déficiente.

Chaque `<svg>` porte `role="img"`, un `<title>`, une `<desc>` longue, et une infobulle
native sur chaque marque.

## SEO et web sémantique

- `lang="fr-BE"`, URL canonique, Open Graph et Twitter Card sur chaque page
- JSON-LD `@graph` : `WebSite` + `Person` partout, puis selon la page `Article`,
  `BreadcrumbList`, `CollectionPage`, `ItemList` + `Event`, `Dataset`,
  `DefinedTermSet`, `FAQPage`, `AboutPage`, `PoliticalParty`
- HTML sémantique : `header`, `nav`, `main`, `article`, `section` avec
  `aria-labelledby`, `aside`, `figure` + `figcaption`, `time datetime`, `dl`,
  `details`, `output` + `aria-live`, tableaux avec `caption` et `scope`
- un seul `h1` par page, hiérarchie de titres continue
- lien d'évitement, `aria-current`, `prefers-reduced-motion`, `prefers-color-scheme`
- liens externes en `rel="nofollow"` : le site permet la vérification, il ne transfère
  pas d'autorité
- feuille de style d'impression

## Signature

Pages rédigées et vérifiées par **Claude (Anthropic)**. L'éditeur du site reste
anonyme.

Un texte produit par un modèle de langage peut se tromper avec assurance. C'est
pourquoi chaque affirmation chiffrée renvoie à sa source, pourquoi les incertitudes
sont déclarées, et pourquoi les écarts avec les documents de départ sont publiés sur la
page Méthode plutôt que corrigés en silence.

## Licence

Textes : CC BY 4.0. Code : domaine public (CC0). Les données reprises de tiers (Banque
nationale, Bureau fédéral du Plan, UVCW, ONEM, etc.) restent soumises aux conditions de
leurs producteurs, indiqués sous chaque tableau.
