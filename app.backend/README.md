# ContIQ Backend Server

Backend-ul aplicației ContIQ, dezvoltat cu Express.js și PostgreSQL pentru gestionarea utilizatorilor și a datelor companiei.

## 🚀 Funcționalități

- **Autentificare și Autorizare**: Sistem complet cu JWT tokens și bcrypt pentru hashing parole
- **Gestionare Utilizatori**: Înregistrare, login, activare manuală după plată
- **Profile Utilizatori**: Detalii personale complete cu toate setările din frontend
- **Date Companie**: Informații complete pentru firme cu toate câmpurile necesare
- **Control Acces**: Sistem de roluri (user, administrator, contabil)
- **API RESTful**: Endpoints complete pentru toate operațiunile

## 📂 Structura Proiectului

```
app.backend/
├── index.js              # Entry point - server setup și routing
├── config/               # Configuration files
│   ├── database.js       # PostgreSQL connection
│   └── initDatabase.js   # Database schema initialization
├── models/               # Data models (business logic)
│   ├── User.js          # User model cu constante și metode
│   ├── UserType.js      # UserType model și enumerări
│   ├── UserDetails.js   # UserDetails model cu schema
│   └── CompanyData.js   # CompanyData model cu constante
├── controllers/          # Business logic handlers
│   ├── authController.js # Autentificare și înregistrare
│   ├── userController.js # Profile și date utilizatori
│   └── adminController.js # Funcții administrative
├── routes/              # API endpoints definition
│   ├── auth.js         # /api/auth/* routes
│   ├── user.js         # /api/* user routes
│   └── admin.js        # /api/admin/* routes
├── middleware/          # Custom middleware functions
│   └── auth.js         # JWT authentication și autorizare
├── .env.example         # Environment variables template
├── .env                 # Environment variables (nu se commitează)
├── .gitignore          # Git ignore rules
└── README.md           # Această documentație
```

## 📁 Structura Bazei de Date

### Relațiile între Tabele

```
user_types
├── id (PK)
├── type_name (UNIQUE)
├── description
└── timestamps

users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── activated (BOOLEAN)
├── user_type_id (FK → user_types.id)
└── timestamps

user_details
├── id (PK)
├── user_id (UNIQUE FK → users.id) [CASCADE DELETE]
├── nume, telefon, pozitie, companie, locatie
├── bio, website, linkedin
├── tema, limba, timezone, date_format, currency
├── sounds, animations, compact_mode
├── two_factor_enabled, session_timeout
├── login_notifications, device_tracking
├── notifications_email (JSONB)
├── notifications_push (JSONB)
├── notifications_sms (JSONB)
└── timestamps

company_data
├── id (PK)
├── user_id (UNIQUE FK → users.id) [CASCADE DELETE]
├── nume_firma, cui, nr_reg_comert
├── adresa_sediu, oras, judet, cod_postal, tara
├── telefon, email, website
├── capital_social, cont_bancar, banca, platitor_tva
├── reprezentant_legal, functie_reprezentant, cnp_reprezentant
├── an_fiscal, moneda_principala, limba_implicita, timp_zona
└── timestamps
```

## 🔗 Relațiile Datelor

### 1. user_types ↔ users (One-to-Many)
- Fiecare utilizator are un singur tip (user, administrator, contabil)
- Un tip poate fi asociat cu mai mulți utilizatori
- **Foreign Key**: `users.user_type_id → user_types.id`
- **Default**: Utilizatorii noi sunt de tip "user"

### 2. users ↔ user_details (One-to-One)
- Fiecare utilizator are exact un set de detalii personale
- Detaliile conțin toate setările din pagina "Setări Cont"
- **Foreign Key**: `user_details.user_id → users.id`
- **Cascade Delete**: Ștergerea utilizatorului șterge automat detaliile

### 3. users ↔ company_data (One-to-One)
- Fiecare utilizator poate avea o singură companie asociată
- Conține toate informațiile din pagina "Date Firmă"
- **Foreign Key**: `company_data.user_id → users.id`
- **Cascade Delete**: Ștergerea utilizatorului șterge automat datele companiei

## 🛡️ Securitate

### Hashing Parole
- Folosește **bcrypt** cu 12 salt rounds
- Parolele sunt stocate doar ca hash-uri în baza de date
- Verificarea se face prin `bcrypt.compare()`

### JWT Authentication
- Token-uri JWT cu expirare de 24h
- Secret key configurabil prin variabile de mediu
- Middleware `authenticateToken` pentru protecția rutelor

### Control Acces
- **Utilizatori normali**: Acces la propriile date
- **Administratori**: Pot activa utilizatori și vizualiza lista utilizatorilor
- **Contabili**: Rol pentru funcționalități viitoare

## 🌐 API Endpoints

### Autentificare
- `POST /api/auth/register` - Înregistrare utilizator nou
- `POST /api/auth/login` - Autentificare utilizator

### Administrare
- `PUT /api/admin/activate-user/:userId` - Activare utilizator (doar admin)
- `GET /api/admin/users` - Lista utilizatori (doar admin)

### Profile
- `GET /api/profile` - Obținere profil complet
- `PUT /api/profile/details` - Actualizare detalii utilizator
- `PUT /api/profile/company` - Actualizare date companie

### Health Check
- `GET /health` - Verificare stare server

## 🔧 Configurare

### Configurare Variabile de Mediu

1. **Copiază fișierul de configurare**:
```bash
cp .env.example .env
```

2. **Editează `.env` cu datele tale**:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=contiq_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

**IMPORTANT**: Nu commita niciodată fișierul `.env` în repository! Este adăugat în `.gitignore`.

### Dependințe
- **express**: Framework web
- **postgres**: Driver PostgreSQL
- **bcrypt**: Hashing parole (v6.0.0+)
- **jsonwebtoken**: JWT tokens
- **express-cors**: CORS middleware

## 🚀 Pornire Server

```bash
cd app.backend
npm install
node index.js
```

Serverul va rula pe portul 3000 și va inițializa automat baza de date.

## 🏗️ Arhitectura Standard Node.js

### Config (config/)
- **database.js**: Conexiunea PostgreSQL (configurație)
- **initDatabase.js**: Schema și inițializarea tabelelor

### Models (models/)  
- **User.js**: Model utilizator cu constante (TABLE, FIELDS) și operații CRUD
- **UserType.js**: Model tipuri utilizatori cu enumerări (TYPES) 
- **UserDetails.js**: Model detalii utilizator cu schema completă
- **CompanyData.js**: Model date companie cu toate constantele de câmpuri

### Controllers (controllers/)
- **authController.js**: Business logic autentificare (register, login, hashing)
- **userController.js**: Logic gestionare profile și actualizări 
- **adminController.js**: Logic funcții administrative și control acces

### Routes (routes/)
- **auth.js**: Definire endpoints autentificare (`/api/auth/*`)
- **user.js**: Definire endpoints utilizatori (`/api/*`)
- **admin.js**: Definire endpoints administrative (`/api/admin/*`)

### Middleware (middleware/)
- **auth.js**: JWT authentication, verificare roluri, middleware autorizare

## 📊 Flow-ul Datelor

### 1. Înregistrare Utilizator
```
POST /api/auth/register
├── Verifică email unic
├── Creează înregistrare în `users` (activated = false)
├── Creează înregistrare în `user_details` cu numele
└── Returnează utilizatorul neactivat
```

### 2. Activare Manuală
```
PUT /api/admin/activate-user/:userId (doar admin)
├── Verifică permisiuni administrator
├── Actualizează users.activated = true
└── Utilizatorul poate acum să se autentifice
```

### 3. Autentificare
```
POST /api/auth/login
├── Verifică email și parolă
├── Verifică că utilizatorul este activat
├── Generează JWT token
└── Returnează token și info utilizator
```

### 4. Actualizare Profile
```
PUT /api/profile/details
├── Verifică JWT token
├── Actualizează user_details pentru utilizatorul curent
└── Returnează datele actualizate

PUT /api/profile/company
├── Verifică JWT token
├── INSERT sau UPDATE în company_data
└── Returnează datele companiei
```

## 🔄 Auto-Update Timestamps
Toate tabelele au trigger-e PostgreSQL care actualizează automat `updated_at` la modificare.

## 📝 Note Importante

1. **Activarea Utilizatorilor**: Doar administratorii pot activa utilizatorii după plata abonamentului
2. **Relații Cascade**: Ștergerea unui utilizator șterge automat detaliile și datele companiei
3. **Notificări JSONB**: Setările de notificări sunt stocate ca obiecte JSON pentru flexibilitate
4. **Unicitate Email**: Fiecare email poate fi folosit doar pentru un singur cont
5. **Validare Tip Utilizator**: Doar tipurile predefinite sunt acceptate la înregistrare

Toate datele sunt structurate să corespundă exact cu formularele din frontend (SetariCont.jsx și DateFirma.jsx).