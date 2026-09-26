# POWPC — Batteries & Chargeurs pour PC Portables

> **Trouvez l'énergie de votre PC.**

Plateforme e-commerce spécialisée dans la vente de **batteries et chargeurs pour ordinateurs portables**, conçue pour répondre aux besoins du marché sénégalais.

POWPC permet aux clients de rechercher des produits compatibles avec leur ordinateur, consulter les caractéristiques techniques, gérer leur panier et passer une commande simplement.

L'application intègre également un **back-office d'administration** permettant de gérer les produits, les stocks, les commandes, les marques, les modèles d'ordinateurs et les demandes clients.

---

## 🚀 Démonstration

🌐 **Application :** `À ajouter`

📦 **Repository GitHub :** `À ajouter`

📱 **Compatible desktop, tablette et mobile**

---

## ✨ Fonctionnalités principales

### 🛍️ Boutique

* Catalogue de batteries et chargeurs
* Recherche de produits
* Recherche par référence et modèle de PC
* Finder de compatibilité
* Fiches produits détaillées
* Gestion du panier
* Produits favoris
* Commande sans création de compte
* Suivi de commande par référence
* Demande de disponibilité
* Interface responsive

### 🔎 Recherche & compatibilité

Le système permet de rechercher un produit à partir de différentes informations :

* marque du PC
* modèle
* référence de batterie
* référence de chargeur
* puissance

Exemple :

`HP → 250 G7 → Batterie → HT03XL`

Le système retourne automatiquement les produits compatibles.

### 👨‍💼 Back-office

L'administration permet de gérer :

* Dashboard
* Produits
* Marques
* Modèles de PC
* Compatibilités
* Commandes
* Clients
* Demandes de disponibilité
* Stocks
* Mouvements de stock

### 📦 Gestion des stocks

Le stock est automatiquement mis à jour lors du traitement d'une commande.

Les mouvements de stock sont également enregistrés afin de conserver un historique des opérations.

### ❤️ Favoris

Les utilisateurs peuvent enregistrer leurs produits favoris.

Les favoris sont conservés localement dans le navigateur afin de permettre leur récupération après actualisation de la page.

### 📱 Expérience mobile

L'interface est pensée **mobile-first** avec :

* navigation adaptée aux petits écrans
* barre d'onglets mobile
* recherche accessible rapidement
* panier accessible
* navigation simplifiée

---

# 🛠️ Technologies

| Technologie      | Utilisation               |
| ---------------- | ------------------------- |
| **Next.js 15**   | Framework web             |
| **React**        | Interface utilisateur     |
| **TypeScript**   | Typage statique           |
| **Tailwind CSS** | Design & responsive       |
| **PostgreSQL**   | Base de données           |
| **Prisma ORM**   | Accès aux données         |
| **Zod**          | Validation des données    |
| **jose**         | Gestion JWT               |
| **bcryptjs**     | Hashage des mots de passe |
| **Cloudinary**   | Hébergement des images    |
| **Docker**       | PostgreSQL local          |

---

# 🏗️ Architecture

POWPC utilise une architecture séparant clairement :

```text
┌─────────────────────────────────────┐
│             Next.js 15              │
│          App Router + React         │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          Server Actions             │
│       Validation avec Zod           │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          Business Services          │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│             Prisma ORM              │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          PostgreSQL                 │
└─────────────────────────────────────┘
```

### Principe architectural

Les composants de `app/` n'accèdent jamais directement à Prisma.

Le flux recommandé est :

```text
Component
    ↓
Server Action
    ↓
Validation Zod
    ↓
Service métier
    ↓
Prisma
    ↓
PostgreSQL
```

Cette séparation facilite la maintenance, les tests et l'évolution de l'application.

---

# 🗄️ Modèle de données

Le modèle de données utilise un système de produits générique permettant d'ajouter facilement de nouvelles catégories.

```text
Product
 ├── BatterySpec
 └── ChargerSpec

Laptop
 └── Compatibility
       └── Product

User
 └── Order
       └── OrderItem
```

Cette approche permet notamment d'ajouter ultérieurement :

* SSD
* écrans
* claviers
* adaptateurs
* autres accessoires informatiques

sans devoir reconstruire toute l'architecture e-commerce.

---

# 🔐 Sécurité

Plusieurs mesures de sécurité sont intégrées au projet.

### Authentification

* JWT avec `jose`
* mots de passe hashés avec `bcryptjs`
* cookies `httpOnly`
* contrôle des accès administrateur

### Protection des commandes

Le prix d'un produit n'est **jamais considéré comme fiable lorsqu'il provient du client**.

Lors de la création d'une commande, le serveur :

1. récupère les produits depuis PostgreSQL ;
2. vérifie leur disponibilité ;
3. vérifie les quantités ;
4. calcule le montant côté serveur ;
5. crée la commande.

### Protection du stock

Les transactions PostgreSQL utilisent un verrouillage `SELECT ... FOR UPDATE` afin d'éviter les problèmes de concurrence lors de commandes simultanées.

### Autres protections

* Validation des données avec Zod
* Rate limiting
* Validation des variables d'environnement
* Headers HTTP de sécurité
* Protection des routes administrateur
* Aucun secret exposé côté client
* Protection du JSON-LD contre l'injection

---

# 📁 Structure du projet

```text
POWPC/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── pg-trgm.sql
│
├── src/
│   ├── app/
│   │   ├── (shop)/
│   │   ├── admin/
│   │   └── api/
│   │
│   ├── actions/
│   ├── services/
│   ├── schemas/
│   ├── lib/
│   ├── components/
│   │   ├── ui/
│   │   ├── shop/
│   │   └── admin/
│   │
│   └── middleware.ts
│
├── public/
├── .env.example
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/powpc.git

cd powpc
```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Configurer les variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Puis configurer notamment :

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="..."
NEXT_PUBLIC_PHONE="..."
NEXT_PUBLIC_EMAIL="..."
```

Pour générer un secret :

```bash
openssl rand -base64 32
```

---

# 🗃️ Base de données

## Option 1 — PostgreSQL local avec Docker

```bash
docker run \
  --name powpc-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=powpc \
  -p 5432:5432 \
  -d postgres:16
```

Puis :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/powpc?schema=public"
```

## Option 2 — PostgreSQL cloud

Le projet peut utiliser :

* Neon
* Supabase
* Railway
* PostgreSQL auto-hébergé

Pour un déploiement gratuit, **Neon + Vercel** constitue une configuration adaptée au projet.

---

# 🌱 Initialiser la base

Créer les tables :

```bash
npx prisma migrate dev --name init
```

Charger les données de démonstration :

```bash
npm run db:seed
```

Le seed fournit notamment :

* 6 marques
* 17 modèles de PC
* 17 produits
* leurs relations de compatibilité

---

# ▶️ Lancer le projet

```bash
npm run dev
```

L'application sera disponible sur :

```text
http://localhost:3000
```

---

# 📋 Commandes disponibles

| Commande             | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Lance le serveur de développement             |
| `npm run build`      | Génère le build de production                 |
| `npm run start`      | Lance le serveur de production                |
| `npm run typecheck`  | Vérifie les types TypeScript                  |
| `npm run db:migrate` | Exécute les migrations                        |
| `npm run db:deploy`  | Déploie les migrations en production          |
| `npm run db:seed`    | Insère les données de démonstration           |
| `npm run db:studio`  | Ouvre Prisma Studio                           |
| `npm run db:trgm`    | Active l'optimisation de recherche PostgreSQL |

---

# ☁️ Déploiement

Architecture recommandée :

```text
GitHub
   │
   ▼
Vercel
   │
   │ Next.js
   ▼
Prisma
   │
   ▼
Neon PostgreSQL
```

### Déploiement

1. Créer une base PostgreSQL sur Neon.
2. Récupérer la `DATABASE_URL`.
3. Pousser le projet sur GitHub.
4. Importer le repository dans Vercel.
5. Ajouter les variables d'environnement.
6. Déployer l'application.
7. Exécuter les migrations de production.

```bash
npx prisma migrate deploy
```

Le projet peut également être déployé sur d'autres plateformes Node.js 20+.

---

# 🖼️ Gestion des images

POWPC utilise Cloudinary pour l'upload des images produits.

Les fichiers sont envoyés directement depuis le navigateur vers Cloudinary grâce à une signature générée côté serveur.

La clé secrète Cloudinary reste exclusivement côté serveur.

Une URL d'image peut également être renseignée manuellement.

---

# 📧 Mot de passe oublié

Le système de récupération de mot de passe comprend :

* génération d'un token unique ;
* expiration du token après 30 minutes ;
* page de réinitialisation ;
* validation côté serveur.

En environnement de développement, le lien est affiché dans les logs du serveur.

L'intégration d'un fournisseur d'email peut être ajoutée via :

```text
src/lib/mailer.ts
```

---

# 🧪 Parcours de test

### 1. Recherche par compatibilité

```text
Accueil
→ HP
→ 250 G7
→ Batterie
→ HT03XL
```

### 2. Recherche produit

Tester :

```text
HT03XL
250 G7
65W
```

### 3. Commande

```text
Produit
→ Panier
→ Commande
→ Confirmation
→ Référence PPC-...
```

### 4. Gestion du stock

```text
Admin
→ Commandes
→ Confirmer une commande
→ Stock mis à jour
```

### 5. Demande de disponibilité

```text
Demande de disponibilité
→ Admin
→ Demandes
→ Réponse WhatsApp
```

---

# 🔮 Roadmap

Les prochaines évolutions prévues comprennent :

* [ ] Paiement Wave
* [ ] Paiement Orange Money
* [ ] Intégration d'un fournisseur d'email
* [ ] Gestion complète du profil client
* [ ] Gestion des adresses
* [ ] Notifications WhatsApp / SMS
* [ ] Rate limiting distribué avec Redis / Upstash
* [ ] Système de notifications
* [ ] Amélioration des analytics e-commerce

---

# 🎯 Objectif du projet

POWPC est conçu comme une **solution e-commerce spécialisée pour le marché sénégalais**, avec une architecture suffisamment flexible pour évoluer vers une plateforme plus large de vente d'accessoires informatiques.

Le projet met l'accent sur :

* l'expérience utilisateur ;
* la compatibilité produit ;
* la sécurité ;
* la gestion des stocks ;
* la maintenabilité ;
* l'architecture évolutive ;
* l'adaptation au contexte local.

---

# 👨‍💻 Auteur

**Mamadou Yaly**

Développeur spécialisé en développement web et applications modernes.

### Technologies

`Next.js` · `React` · `TypeScript` · `Node.js` · `PostgreSQL` · `Prisma` · `Tailwind CSS`

---

## ⭐ Projet

Si vous trouvez le projet intéressant, n'hésitez pas à laisser une ⭐ sur le repository.
