# ContIQ - Sistem Complet de Management Contabil

## 🚀 Setup și Pornire

### Backend (API Server)
```bash
cd app.backend
npm install
npm start
```
Backend-ul va rula pe `http://localhost:3000`

### Frontend (React App)
```bash
cd app.frontend
npm install
npm run dev
```
Frontend-ul va rula pe `http://localhost:5173` sau `http://localhost:5174`

## 🔧 Configurare

### Backend (.env)
Fișierul `.env` din `app.backend` este deja configurat pentru dezvoltare:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=contiq_db
DB_USER=postgres
DB_PASSWORD=potasiu

# JWT
JWT_SECRET=3f4a9d8c7e5b2a6f9e8d7c4b3a9f8e5d6c4b3a9f8e7d5c2b1a9f8e7d5c4b3a
JWT_EXPIRES_IN=24h

# Server
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174

NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

## 📊 Baza de Date
Backend-ul folosește PostgreSQL și va rula automat migrările la pornire.

## 🎯 Funcționalități Implementate

### 🔐 Autentificare Completă
- **Înregistrare utilizatori** cu validare completă
- **Login securizat** cu JWT tokens  
- **Activare conturi** prin administrator
- **Protecție rute** automată

### 👤 Gestiune Profil Utilizator
- Date personale complete
- Setări cont (temă, limbă, notificări)
- Preferințe interfață
- Configurări securitate

### 🏢 Gestiune Date Companie
- Informații generale firmă
- Date financiare și bancare
- Reprezentant legal
- Setări sistem

## 🌊 Fluxul de Utilizare

1. **Înregistrare**: 
   - Accesează `http://localhost:5173/register`
   - Completează formularul multi-step
   - Vei fi redirectat la pagina de activare

2. **Activare Cont**:
   - Conturile noi trebuie activate de admin
   - Pagina de activare afișează statusul și timpul estimat
   - Contact: support@contiq.ro

3. **Login**:
   - Accesează `http://localhost:5173/login`
   - Introduci email și parola
   - Dacă contul este activat → Dashboard
   - Dacă nu → Pagina de activare

4. **Dashboard și Setări**:
   - `/dashboard` - Panoul principal
   - `/setari-cont` - Setări profil utilizator
   - `/date-firma` - Date companie

## 🛠️ API Endpoints

### Autentificare
- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Autentificare

### Utilizatori (protejate cu JWT)
- `GET /api/profile` - Profil complet
- `PUT /api/profile/details` - Actualizare date personale
- `PUT /api/profile/company` - Actualizare date companie

### Admin
- `GET /api/admin/users` - Lista utilizatori
- `POST /api/admin/users/:id/activate` - Activare cont

## 🔒 Securitate

- **JWT Authentication** cu expirare 24h
- **Rate limiting** pe toate rutele
- **CORS** configurat pentru frontend
- **Helmet** pentru security headers
- **Password hashing** cu bcrypt
- **Input validation** cu Joi
- **SQL injection protection**

## 📱 Interfață

- **Design responsive** pentru toate dispozitivele
- **Tema dark/light** configurabilă
- **Animații** și tranziții fluide
- **Componente reutilizabile**
- **Notificări** în timp real
- **Loading states** pentru UX optimal

## 🐛 Debugging

### Backend Logs
Backend-ul loghează automat:
- Pornirea serverului
- Migrările database
- Request-urile API
- Erorile de validare

### Frontend DevTools
- Network tab pentru API calls
- Console pentru erori JavaScript
- React DevTools pentru componente

## 📞 Contact Support

Dacă întâmpini probleme:
- Email: support@contiq.ro
- Telefon: +40 312 345 678
- Chat: Disponibil L-V, 09:00-17:00

---

**Dezvoltat cu ❤️ pentru managementul eficient al afacerilor românești!**