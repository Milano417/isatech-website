# Site ISATech — HTML / CSS / JavaScript + espace admin

## Contenu du dossier

| Élément | Rôle |
|---|---|
| `index.html` | **Tout le site public** : accueil, à propos, formations, admission, actualités, galerie, contact |
| `assets/css/style.css`, `assets/js/site.js` | Style et script du site public |
| `assets/images/` | Logo et photos d'origine |
| `admin/` | Espace administration |
| `api/index.php` | Petit serveur PHP qui lit et enregistre le contenu |
| `data/*.json` | Le contenu du site : formations, actualités, galerie, infos, options, messages |
| `uploads/` | Photos envoyées depuis l'admin |
| `outils/` | Serveur de test local (Node.js), inutile en production — ne pas envoyer en ligne |

### Adresses des rubriques

Toutes les rubriques sont dans `index.html`, on passe de l'une à l'autre avec la fin de l'adresse :

| Rubrique | Adresse |
|---|---|
| Accueil | `/` |
| À propos | `/#/a-propos` |
| Formations | `/#/formations` |
| Une formation | `/#/formation/ida` (ou `fcge`, `gec`, `cv`, `th`, `rhcom`, `ad`, `rit`) |
| Admission | `/#/admission` |
| Actualités & infos | `/#/actualites` |
| Un article | `/#/article/n1` |
| Galerie | `/#/galerie` |
| Contact | `/#/contact` |
| Administration | `/admin/` |

Les anciennes adresses (`formations.html`, `contact.html`…) sont redirigées automatiquement par le fichier `.htaccess`.

## Choisir l'hébergement

| Hébergement | Site public | Espace admin |
|---|---|---|
| **Avec PHP** (Hostinger, o2switch, LWS, PlanetHoster…) | ✅ | ✅ |
| **Sans PHP** (GitHub Pages, Netlify, Vercel) | ✅ (lecture des fichiers `data/`) | ❌ rien ne peut être enregistré |

➡️ Pour que l'administration puisse ajouter des photos, des actualités, etc., il faut un **hébergement avec PHP 7.4 ou plus récent**.

## Première mise en ligne (hébergement PHP)

1. Envoyez **tout le contenu de ce dossier**, sauf `outils/`, `README.md` et `.git`, à la racine du site (`public_html` ou `www`) par FTP (FileZilla) ou par le gestionnaire de fichiers de l'hébergeur.
2. Vérifiez que les dossiers `data/` et `uploads/` sont **modifiables en écriture** par le serveur (droits 755, ou 775 si besoin).
3. Allez sur `https://votre-site/admin/`. À la première visite, l'admin vous demande de **choisir le mot de passe administrateur**.

> Sur Apache, les fichiers `.htaccess` fournis bloquent l'accès direct au dossier `data/` (messages et mot de passe) et empêchent l'exécution de scripts dans `uploads/`. Sur un serveur Nginx, ajoutez des règles équivalentes.

## Redéployer après une modification du code

Le **contenu** (photos, formations, actualités, infos, options) se modifie dans l'admin, directement en ligne : pas besoin de redéployer.

Pour une modification du **code** (HTML, CSS, JS, PHP) :

1. Envoyez sur le serveur uniquement les fichiers de code modifiés : `index.html`, `assets/`, `admin/`, `api/`, `.htaccess`.
2. ⚠️ **N'écrasez jamais `data/` ni `uploads/` sur le serveur** : ils contiennent ce que l'admin a saisi en ligne (et le mot de passe). Les fichiers `data/` de ce dossier ne servent qu'à la toute première installation.
3. Rechargez le site avec **Ctrl + F5** pour voir les changements.

Si l'hébergeur est relié au dépôt GitHub (déploiement automatique), il suffit de pousser les modifications :

```
git push origin main
```

## Ce que l'admin peut faire

- **Galerie photos** : ajouter plusieurs photos à la fois (elles sont réduites automatiquement), changer la légende et la catégorie, supprimer.
- **Formations** : modifier tout le contenu d'une filière (texte, photo, objectifs, compétences, programme par semestre, débouchés, conditions), masquer, ajouter ou supprimer une filière.
- **Actualités** : publier des articles avec photo, les garder en brouillon, les supprimer.
- **Infos & communiqués** : messages courts (info, important, urgent). Une info peut s'afficher dans un **bandeau en haut du site**.
- **Options du site** : nom, devise, téléphones, email, WhatsApp, horaires, adresse, texte et photo de l'accueil, ouverture ou fermeture des inscriptions, catégories.
- **Messages** : messages du formulaire de contact, avec réponse par email ou WhatsApp.
- **Sécurité** : changer le mot de passe.

## Mot de passe oublié

Supprimez le fichier `data/auth.json` sur le serveur, puis retournez sur `/admin/` : vous pourrez créer un nouveau mot de passe.

## Sauvegarde

Tout le contenu se trouve dans `data/` et `uploads/` **sur le serveur**. Téléchargez ces deux dossiers régulièrement pour avoir une sauvegarde.

## Tester sur votre ordinateur

Avec Node.js installé, depuis ce dossier :

```
node outils/dev-server.cjs
```

Puis ouvrez http://localhost:8080 (et http://localhost:8080/admin/).
Le mot de passe local est stocké à part (`data/auth.dev.json`) et ne sert pas en ligne.

## Ancienne version (React)

L'ancien site React a été retiré du dossier. Il reste disponible dans git, sur la branche `ancien-site-react` :

```
git checkout ancien-site-react
```
