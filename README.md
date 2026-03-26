# Langly Frontend

Application web Angular pour la gestion des écoles de langues.

## Stack technique

- **Framework :** Angular 21 (Standalone Components)
- **Langage :** TypeScript
- **Gestion d'état :** NgRx (actions, reducers, effects, selectors)
- **Authentification :** JWT (access token + refresh token)

## Structure du projet

```
src/
├── app/
│   ├── core/               # Éléments centraux de l'application
│   │   ├── auth/           # Service et logique d'authentification
│   │   ├── constants/      # Enums et constantes (rôles, statuts)
│   │   ├── guards/         # Guards de routes (auth, no-auth, role)
│   │   ├── interceptors/   # Intercepteurs HTTP (auth, erreur)
│   │   ├── models/         # Modèles partagés (notification, sidebar)
│   │   ├── pages/          # Pages globales (401, 404, 500)
│   │   ├── services/       # Services globaux (notification)
│   │   └── store/          # Store NgRx (actions, effects, reducers, selectors)
│   │
│   ├── features/           # Modules fonctionnels par rôle
│   │   ├── admin/          # Espace School Admin (équipe, cours, étudiants, inscriptions, facturation)
│   │   ├── auth/           # Pages de connexion / déconnexion
│   │   ├── home/           # Page d'accueil
│   │   ├── student/        # Espace Étudiant (cours actifs, présence, certifications)
│   │   ├── superAdmin/     # Espace Super Admin (écoles, abonnements)
│   │   └── teacher/        # Espace Enseignant (cours, séances)
│   │
│   ├── layouts/            # Layout principal (sidebar)
│   │
│   └── shared/             # Éléments réutilisables
│       ├── components/     # Composants partagés (Table, Modal, etc.)
│       └── ui/             # Composants UI de base (Button, Input, etc.)
│
├── environments/           # Configuration par environnement (dev, prod)
└── public/                 # Assets statiques (images)
```

## Rôles utilisateur

| Rôle | Accès |
|------|-------|
| **Super Admin** | Gestion de toutes les écoles et abonnements |
| **School Admin** | Gestion des cours, étudiants, inscriptions et facturation de son école |
| **Teacher** | Gestion de ses cours et séances |
| **Student** | Consultation de ses cours, présence et certifications |

## Scripts disponibles

```bash
npm start       # Démarrer le serveur de développement
npm run build   # Compiler l'application
npm test        # Lancer les tests
```
