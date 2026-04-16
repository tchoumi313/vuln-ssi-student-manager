# GES — Gestion des Étudiants d'une Salle

Projet final et mini-projets SSI — ING4 Cybersécurité — ECE Paris 2025-2026

**Catherine NGANGO KOLOKO · Ulrich TCHOKOUAHA TCHOUAMO · Beaudouin Donald TCHOUMI NZIKEU**

Application web full stack de gestion des notes étudiants, développée dans le cadre d'un exercice Red Team / Blue Team.

---

## Stack

| | |
|---|---|
| Backend | Node.js + Express 4 |
| Base de données | MongoDB 7 (Mongoose 8) |
| Frontend | React 18 + Vite |
| Auth | JWT + bcrypt |
| Déploiement | Docker + Traefik + Let's Encrypt |

---

## Liens

| | |
|---|---|
| Application | https://ssi.buildupdev.com |
| API | https://ssiapi.buildupdev.com/api |

---

## Branches Git

| Branche | Contenu |
|---|---|
| `main` | Version corrigée — failles rémédiées après rapport Red Team |
| [`vuln-version-before-fix`](../../tree/vuln-version-before-fix) | Version vulnérable originale — avant toute correction (cible Red Team) |

---

## Structure du projet

```
ssi-student-manager/
│
├── backend/                   # API REST Express
│   ├── index.js               # Point d'entrée (CORS, Helmet, rate limiting)
│   ├── connect.js             # Connexion MongoDB
│   ├── seed.js                # Données initiales
│   ├── models/                # User, Student, Grade
│   ├── controllers/           # authController, studentController, gradeController
│   ├── routes/                # authRoutes, studentRoutes, gradeRoutes
│   ├── middleware/auth.js     # Middleware JWT verifyToken
│   └── .env.example
│
├── frontend/                  # SPA React
│   └── src/
│       ├── App.jsx            # Routage + guards par rôle
│       ├── context/           # AuthContext (token, user, login/logout)
│       ├── components/        # Navbar
│       └── screens/
│           ├── Login.jsx
│           ├── Dashboard.jsx      # Vue staff — statistiques globales
│           ├── Students.jsx       # Liste + CRUD étudiants
│           ├── StudentDetail.jsx  # Fiche individuelle + notes
│           └── MyGrades.jsx       # Vue étudiant — ses propres notes
│
├── rapport/                           → voir Livrables / Rapports
│   ├── markdown/                          # Sources Markdown des rapports
│   ├── rapport_blue_team_phase1.pdf       # Phase 1 & 2 — app vulnérable + stratégie
│   ├── rapport_blue_team_phase2.pdf       # Phase 4 — remédiation post Red Team
│   └── rapport_red_team.docx              # Rapport de pentest de la Red Team
│
├── mini-projet/                       → voir Livrables / Mini-projets
│   ├── MINI-PROJET 1.docx
│   ├── Mini-projet2.docx
│   └── Mini-projet3.docx
│
├── video/                             → voir Livrables / Vidéo
│   └── frontend.mp4                       # Démonstration vidéo de l'application
│
├── curl-exploits.sh           # Démonstration des 4 vulnérabilités (Red Team)
└── docker-compose.yml         # Stack de production (VPS)
```

---

## Lancement local

```bash
# Backend
cd backend
cp .env.example .env      # renseigner MONGODB_URI et JWT_SECRET
npm install
npm run seed              # créer les données initiales
npm run dev               # → http://localhost:5000

# Frontend (second terminal)
cd frontend
npm install
npm run dev               # → http://localhost:5173
```

### Comptes disponibles après seed

| Utilisateur | Mot de passe | Rôle |
|---|---|---|
| `admin` | `admin123` | Administrateur |
| `prof.dupont` | `dupont2024` | Enseignant |
| `catherine` | `cath2024` | Étudiant |
| `ulrich` | `ulrich2024` | Étudiant |
| `donald` | `donald2024` | Étudiant |

---

## Déploiement (production)

L'application tourne sur un VPS avec Docker. Traefik gère le reverse proxy et les certificats TLS.

```bash
# Sur le VPS — /opt/ges/app/
docker compose up -d
```

MongoDB est isolé sur un réseau Docker interne et n'est jamais exposé à l'extérieur.

---

## Démonstration des vulnérabilités

Le script `curl-exploits.sh` reproduit les 4 attaques documentées dans les rapports (backend démarré requis) :

```bash
bash curl-exploits.sh
```

| # | Type | Endpoint |
|---|---|---|
| 1 | NoSQL Injection | `POST /api/auth/login` |
| 2 | Broken Access Control | `GET /api/students` (sans token) |
| 3 | Stored XSS | `POST /api/grades` (commentaire HTML) |
| 4 | IDOR | `GET /api/grades/student/:id` (token tiers) |

> Ces vulnérabilités sont présentes dans la branche [`vuln-version-before-fix`](../../tree/vuln-version-before-fix). La branche `main` contient la version corrigée.

---

## Livrables

### [Rapports](./rapport/)

| Document | Contenu |
|---|---|
| [rapport_blue_team_phase1.pdf](./rapport/rapport_blue_team_phase1.pdf) | Phase 1 & 2 — présentation de l'application, architecture, déploiement, fonctionnalités, stratégie de sécurité |
| [rapport_blue_team_phase2.pdf](./rapport/rapport_blue_team_phase2.pdf) | Phase 4 — analyse du rapport Red Team, corrections appliquées, validation |
| [rapport_red_team.docx](./rapport/rapport_red_team.docx) | Rapport de pentest Red Team — findings, exploits, recommandations |

### [Mini-projets](./mini-projet/)

| Document | |
|---|---|
| [MINI-PROJET 1.docx](./mini-projet/MINI-PROJET%201.docx) | Mini-projet 1 |
| [Mini-projet2.docx](./mini-projet/Mini-projet2.docx) | Mini-projet 2 |
| [Mini-projet3.docx](./mini-projet/Mini-projet3.docx) | Mini-projet 3 |

### [Vidéo](./video/)

| Fichier | Contenu |
|---|---|
| [frontend.mp4](./video/frontend.mp4) | Démonstration de l'application (Blue Team) |
