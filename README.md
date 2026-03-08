# SaaS Analyse d'Appels d'Offres

Application SaaS pour l'analyse IA des marchés publics destinée aux PME/TPE.

## 🎯 Fonctionnalités

- **Authentification** sécurisée avec Supabase
- **Upload multi-formats** : PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, ODT
- **Analyse IA** avec DeepSeek
- **Rapports structurés** avec recommandations
- **Dashboard** multi-tenant
- **Historique** des analyses

## 🚀 Déploiement Rapide

### 1. Cloner le repository

```bash
git clone https://github.com/votre-compte/saas-marches-publics
cd saas-marches-publics
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

### 4. Lancer en développement

```bash
npm run dev
```

## 🔧 Configuration

### Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon

# DeepSeek API
DEEPSEEK_API_KEY=votre-cle-deepseek

# Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FILE_SIZE_MB=20
```

### Configuration Supabase

1. **Créer un projet** sur [Supabase](https://supabase.com)
2. **Activer l'authentification** (Email/Password)
3. **Créer la table `analyses`** :

```sql
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Politique RLS : chaque utilisateur voit ses propres analyses
CREATE POLICY "Users can view their own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 🏗️ Architecture

- **Frontend** : Next.js 15 (App Router)
- **Backend** : API Routes Next.js
- **Base de données** : Supabase PostgreSQL
- **Authentification** : Supabase Auth
- **IA** : DeepSeek API
- **Déploiement** : Vercel

## 📁 Structure du projet

```
saas-marches-publics/
├── app/                    # Pages Next.js
│   ├── api/               # API Routes
│   ├── login/             # Page connexion
│   ├── signup/            # Page inscription
│   ├── dashboard/         # Dashboard principal
│   ├── upload/            # Upload PDF
│   └── analysis/[id]/     # Page d'analyse
├── lib/                   # Utilitaires
│   ├── supabase.ts       # Client Supabase
│   └── auth-context.tsx  # Contexte d'authentification
└── public/               # Assets statiques
```

## 🔒 Sécurité

- **Authentification** obligatoire pour toutes les routes
- **RLS** (Row Level Security) pour l'isolation des données
- **Validation** des fichiers uploadés (PDF, max 10MB)
- **Tokens JWT** pour les appels API

## 🚀 Déploiement sur Vercel

1. **Pousser sur GitHub**
2. **Importer sur Vercel**
3. **Configurer les variables d'environnement**
4. **Déployer**

## 📄 Licence

Propriétaire - Pour usage interne
