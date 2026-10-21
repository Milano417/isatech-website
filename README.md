# Site ISATech — 100 % HTML / CSS / JavaScript

Aucun PHP, aucune base de données, aucun serveur à installer.

## Contenu du dossier

| Élément | Rôle |
|---|---|
| `index.html` | **Tout le site public** : accueil, à propos, formations, admission, actualités, galerie, contact |
| `assets/css/style.css`, `assets/js/site.js` | Style et script du site public |
| `assets/images/` | Logo et photos d'origine |
| `admin/` | Espace administration |
| `data/*.json` | Le contenu du site : formations, actualités, galerie, infos, options |
| `uploads/` | Photos ajoutées depuis l'admin |
| `.nojekyll` | Indique à GitHub Pages de publier les fichiers tels quels |

## Comment ça marche

```
 Admin (navigateur) ──enregistre──▶ Dépôt GitHub (data/*.json, uploads/)
                                          │
                                          ▼ republication automatique (1-2 min)
 Visiteurs ◀──────────── GitHub Pages (site public)
```

- Le site public lit son contenu dans `data/*.json`.
- L'espace admin enregistre les modifications **directement dans le dépôt GitHub** `Milano417/isatech-website`, grâce à l'API GitHub (en JavaScript).
- GitHub Pages republie le site tout seul : les changements sont visibles **1 à 2 minutes** après l'enregistrement.
- Le formulaire de contact ouvre **WhatsApp** ou **l'email** du visiteur avec le message déjà rédigé. Les messages arrivent donc sur le WhatsApp et l'email indiqués dans « Options du site ».

## Mise en ligne (une seule fois)

### 1. Publier le site avec GitHub Pages

1. Envoyez le code sur GitHub : `git push origin main`
2. Sur GitHub, ouvrez le dépôt → **Settings** → **Pages**.
3. **Source** : « Deploy from a branch » → Branche **main**, dossier **/ (root)** → **Save**.
4. Après 1 à 2 minutes, le site est en ligne à l'adresse `https://milano417.github.io/isatech-website/`.
5. (Facultatif) Nom de domaine personnalisé, ex. `www.isatech-ci.com` : même page, champ **Custom domain**, puis suivez les instructions DNS de GitHub.

> ⚠️ Pour GitHub Pages gratuit, le dépôt doit être **public**. Le site étant public de toute façon, ça ne pose pas de problème : aucun mot de passe n'est stocké dans le code.

### 2. Créer le jeton de l'administrateur

L'admin se connecte avec un **jeton GitHub** (une sorte de mot de passe limité à ce seul dépôt).

1. Connectez-vous à GitHub puis ouvrez https://github.com/settings/personal-access-tokens/new
2. **Token name** : `Admin ISATech` — **Expiration** : 1 an (par exemple).
3. **Repository access** : « Only select repositories » → `isatech-website`.
4. **Permissions** → Repository permissions → **Contents : Read and write**.
5. Cliquez sur **Generate token** et copiez le jeton (`github_pat_…`).
6. Ouvrez `https://votre-site/admin/`, collez le jeton, cliquez sur **Se connecter**.

Le jeton reste mémorisé dans ce navigateur. Pour un autre ordinateur, recollez-le (ou créez-en un autre).
**Jeton perdu ou volé** : supprimez-le sur la même page GitHub, il ne fonctionne plus immédiatement.

## Ce que l'admin peut faire

- **Galerie photos** : ajouter plusieurs photos à la fois (elles sont réduites automatiquement), changer la légende et la catégorie, supprimer.
- **Formations** : modifier tout le contenu d'une filière (texte, photo, objectifs, compétences, programme par semestre, débouchés, conditions), masquer, ajouter ou supprimer une filière.
- **Actualités** : publier des articles avec photo, les garder en brouillon, les supprimer.
- **Infos & communiqués** : messages courts (info, important, urgent). Une info peut s'afficher dans un **bandeau en haut du site**.
- **Options du site** : nom, devise, téléphones, email, WhatsApp, horaires, adresse, texte et photo de l'accueil, ouverture ou fermeture des inscriptions, catégories.

Chaque enregistrement crée une version dans GitHub : l'historique complet est visible sur la page **Commits** du dépôt, et toute erreur peut être annulée.

## Redéployer après une modification du code

Le **contenu** se modifie dans l'admin : rien à redéployer.

Pour une modification du **code** (HTML, CSS, JS) :

```
git pull          # récupère d'abord ce que l'admin a enregistré en ligne
git add -A
git commit -m "Description de la modification"
git push
```

GitHub Pages republie le site en 1 à 2 minutes. Rechargez avec **Ctrl + F5**.

> ⚠️ Faites toujours `git pull` avant de modifier : l'admin enregistre dans le même dépôt, sinon `git push` sera refusé.

## Adresses des rubriques

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

## Tester sur votre ordinateur

Le site doit être ouvert via un petit serveur local (un double-clic sur `index.html` ne suffit pas, le navigateur bloque la lecture des fichiers `data/`) :

- **VS Code** : extension « Live Server » → clic droit sur `index.html` → « Open with Live Server ».
- **ou** en ligne de commande : `npx serve .`

Attention : l'admin ouvert en local enregistre quand même dans le vrai dépôt GitHub.

## Ancienne version (React)

L'ancien site React reste disponible dans git, sur la branche `ancien-site-react`.
