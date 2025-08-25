const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const postgres = require('postgres');
const cors = require('express-cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'contiq_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const initializeDatabase = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_types (
        id SERIAL PRIMARY KEY,
        type_name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO user_types (type_name, description) VALUES
      ('user', 'Utilizator standard cu acces limitat'),
      ('administrator', 'Administrator cu acces complet la sistem'),
      ('contabil', 'Contabil cu acces la modulele financiare')
      ON CONFLICT (type_name) DO NOTHING
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        activated BOOLEAN DEFAULT FALSE,
        user_type_id INTEGER REFERENCES user_types(id) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_details (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nume VARCHAR(255) NOT NULL,
        telefon VARCHAR(20),
        pozitie VARCHAR(100),
        companie VARCHAR(255),
        locatie VARCHAR(255),
        bio TEXT,
        website VARCHAR(255),
        linkedin VARCHAR(255),
        tema VARCHAR(20) DEFAULT 'light',
        limba VARCHAR(5) DEFAULT 'ro',
        timezone VARCHAR(50) DEFAULT 'Europe/Bucharest',
        date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
        currency VARCHAR(5) DEFAULT 'RON',
        sounds BOOLEAN DEFAULT true,
        animations BOOLEAN DEFAULT true,
        compact_mode BOOLEAN DEFAULT false,
        two_factor_enabled BOOLEAN DEFAULT false,
        session_timeout INTEGER DEFAULT 60,
        login_notifications BOOLEAN DEFAULT true,
        device_tracking BOOLEAN DEFAULT true,
        notifications_email JSONB DEFAULT '{"documente_noi": true, "cereri_concediu": true, "scadente": true, "newsletter": false, "marketing": false}',
        notifications_push JSONB DEFAULT '{"documente_noi": true, "cereri_concediu": true, "scadente": false, "mesaje": true}',
        notifications_sms JSONB DEFAULT '{"urgente": true, "autentificare": true}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS company_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nume_firma VARCHAR(255) NOT NULL,
        cui VARCHAR(50) NOT NULL,
        nr_reg_comert VARCHAR(100),
        adresa_sediu TEXT,
        oras VARCHAR(100),
        judet VARCHAR(100),
        cod_postal VARCHAR(20),
        tara VARCHAR(100) DEFAULT 'România',
        telefon VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        capital_social DECIMAL(15,2),
        cont_bancar VARCHAR(100),
        banca VARCHAR(255),
        platitor_tva BOOLEAN DEFAULT false,
        reprezentant_legal VARCHAR(255),
        functie_reprezentant VARCHAR(100),
        cnp_reprezentant VARCHAR(13),
        an_fiscal VARCHAR(4),
        moneda_principala VARCHAR(5) DEFAULT 'RON',
        limba_implicita VARCHAR(5) DEFAULT 'RO',
        timp_zona VARCHAR(50) DEFAULT 'Europe/Bucharest',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_user_details_updated_at ON user_details;
      CREATE TRIGGER update_user_details_updated_at 
      BEFORE UPDATE ON user_details 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_company_data_updated_at ON company_data;
      CREATE TRIGGER update_company_data_updated_at 
      BEFORE UPDATE ON company_data 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET || 'contiq-secret-key',
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'contiq-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nume, userType = 'user' } = req.body;

    if (!email || !password || !nume) {
      return res.status(400).json({ error: 'Email, password i nume sunt obligatorii' });
    }

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email-ul este deja înregistrat' });
    }

    const userTypeResult = await sql`SELECT id FROM user_types WHERE type_name = ${userType}`;
    if (userTypeResult.length === 0) {
      return res.status(400).json({ error: 'Tipul de utilizator nu este valid' });
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await sql`
      INSERT INTO users (email, password_hash, user_type_id, activated)
      VALUES (${email}, ${hashedPassword}, ${userTypeResult[0].id}, false)
      RETURNING id, email, activated
    `;

    await sql`
      INSERT INTO user_details (user_id, nume)
      VALUES (${user.id}, ${nume})
    `;

    res.status(201).json({
      message: 'Utilizator creat cu succes. Contul va fi activat dup plat.',
      user: { id: user.id, email: user.email, activated: user.activated }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Eroare la înregistrare' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email i parola sunt obligatorii' });
    }

    const [user] = await sql`
      SELECT u.*, ut.type_name 
      FROM users u 
      JOIN user_types ut ON u.user_type_id = ut.id 
      WHERE u.email = ${email}
    `;

    if (!user) {
      return res.status(401).json({ error: 'Email sau parol incorect' });
    }

    if (!user.activated) {
      return res.status(403).json({ error: 'Contul nu este activat. V rugm s efectuai plata abonamentului.' });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email sau parol incorect' });
    }

    const token = generateToken(user.id, user.type_name);

    res.json({
      message: 'Autentificare reuit',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.type_name,
        activated: user.activated
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Eroare la autentificare' });
  }
});

app.put('/api/admin/activate-user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'administrator') {
      return res.status(403).json({ error: 'Acces interzis. Doar administratorii pot activa utilizatorii.' });
    }

    const userId = parseInt(req.params.userId);
    
    const [updatedUser] = await sql`
      UPDATE users 
      SET activated = true 
      WHERE id = ${userId} 
      RETURNING id, email, activated
    `;

    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost gsit' });
    }

    res.json({
      message: 'Utilizator activat cu succes',
      user: updatedUser
    });
  } catch (error) {
    console.error('User activation error:', error);
    res.status(500).json({ error: 'Eroare la activarea utilizatorului' });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [profile] = await sql`
      SELECT 
        u.id, u.email, u.activated,
        ut.type_name as user_type,
        ud.*,
        cd.*
      FROM users u
      LEFT JOIN user_types ut ON u.user_type_id = ut.id
      LEFT JOIN user_details ud ON u.id = ud.user_id
      LEFT JOIN company_data cd ON u.id = cd.user_id
      WHERE u.id = ${req.user.userId}
    `;

    if (!profile) {
      return res.status(404).json({ error: 'Profilul nu a fost gsit' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Eroare la încrcarea profilului' });
  }
});

app.put('/api/profile/details', authenticateToken, async (req, res) => {
  try {
    const { 
      nume, telefon, pozitie, companie, locatie, bio, website, linkedin,
      tema, limba, timezone, date_format, currency, sounds, animations, 
      compact_mode, notifications_email, notifications_push, notifications_sms 
    } = req.body;

    const [updated] = await sql`
      UPDATE user_details 
      SET 
        nume = COALESCE(${nume}, nume),
        telefon = COALESCE(${telefon}, telefon),
        pozitie = COALESCE(${pozitie}, pozitie),
        companie = COALESCE(${companie}, companie),
        locatie = COALESCE(${locatie}, locatie),
        bio = COALESCE(${bio}, bio),
        website = COALESCE(${website}, website),
        linkedin = COALESCE(${linkedin}, linkedin),
        tema = COALESCE(${tema}, tema),
        limba = COALESCE(${limba}, limba),
        timezone = COALESCE(${timezone}, timezone),
        date_format = COALESCE(${date_format}, date_format),
        currency = COALESCE(${currency}, currency),
        sounds = COALESCE(${sounds}, sounds),
        animations = COALESCE(${animations}, animations),
        compact_mode = COALESCE(${compact_mode}, compact_mode),
        notifications_email = COALESCE(${JSON.stringify(notifications_email)}, notifications_email),
        notifications_push = COALESCE(${JSON.stringify(notifications_push)}, notifications_push),
        notifications_sms = COALESCE(${JSON.stringify(notifications_sms)}, notifications_sms)
      WHERE user_id = ${req.user.userId}
      RETURNING *
    `;

    if (!updated) {
      return res.status(404).json({ error: 'Detaliile utilizatorului nu au fost gsite' });
    }

    res.json({ message: 'Profil actualizat cu succes', details: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Eroare la actualizarea profilului' });
  }
});

app.put('/api/profile/company', authenticateToken, async (req, res) => {
  try {
    const {
      nume_firma, cui, nr_reg_comert, adresa_sediu, oras, judet, cod_postal,
      tara, telefon, email, website, capital_social, cont_bancar, banca,
      platitor_tva, reprezentant_legal, functie_reprezentant, cnp_reprezentant,
      an_fiscal, moneda_principala, limba_implicita, timp_zona
    } = req.body;

    const existingCompany = await sql`
      SELECT id FROM company_data WHERE user_id = ${req.user.userId}
    `;

    let result;
    if (existingCompany.length > 0) {
      [result] = await sql`
        UPDATE company_data 
        SET 
          nume_firma = COALESCE(${nume_firma}, nume_firma),
          cui = COALESCE(${cui}, cui),
          nr_reg_comert = COALESCE(${nr_reg_comert}, nr_reg_comert),
          adresa_sediu = COALESCE(${adresa_sediu}, adresa_sediu),
          oras = COALESCE(${oras}, oras),
          judet = COALESCE(${judet}, judet),
          cod_postal = COALESCE(${cod_postal}, cod_postal),
          tara = COALESCE(${tara}, tara),
          telefon = COALESCE(${telefon}, telefon),
          email = COALESCE(${email}, email),
          website = COALESCE(${website}, website),
          capital_social = COALESCE(${capital_social}, capital_social),
          cont_bancar = COALESCE(${cont_bancar}, cont_bancar),
          banca = COALESCE(${banca}, banca),
          platitor_tva = COALESCE(${platitor_tva}, platitor_tva),
          reprezentant_legal = COALESCE(${reprezentant_legal}, reprezentant_legal),
          functie_reprezentant = COALESCE(${functie_reprezentant}, functie_reprezentant),
          cnp_reprezentant = COALESCE(${cnp_reprezentant}, cnp_reprezentant),
          an_fiscal = COALESCE(${an_fiscal}, an_fiscal),
          moneda_principala = COALESCE(${moneda_principala}, moneda_principala),
          limba_implicita = COALESCE(${limba_implicita}, limba_implicita),
          timp_zona = COALESCE(${timp_zona}, timp_zona)
        WHERE user_id = ${req.user.userId}
        RETURNING *
      `;
    } else {
      [result] = await sql`
        INSERT INTO company_data (
          user_id, nume_firma, cui, nr_reg_comert, adresa_sediu, oras, judet,
          cod_postal, tara, telefon, email, website, capital_social, cont_bancar,
          banca, platitor_tva, reprezentant_legal, functie_reprezentant, 
          cnp_reprezentant, an_fiscal, moneda_principala, limba_implicita, timp_zona
        ) VALUES (
          ${req.user.userId}, ${nume_firma}, ${cui}, ${nr_reg_comert}, ${adresa_sediu},
          ${oras}, ${judet}, ${cod_postal}, ${tara}, ${telefon}, ${email}, ${website},
          ${capital_social}, ${cont_bancar}, ${banca}, ${platitor_tva}, ${reprezentant_legal},
          ${functie_reprezentant}, ${cnp_reprezentant}, ${an_fiscal}, ${moneda_principala},
          ${limba_implicita}, ${timp_zona}
        )
        RETURNING *
      `;
    }

    res.json({ message: 'Date firm actualizate cu succes', company: result });
  } catch (error) {
    console.error('Company update error:', error);
    res.status(500).json({ error: 'Eroare la actualizarea datelor firmei' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'administrator') {
      return res.status(403).json({ error: 'Acces interzis. Doar administratorii pot vizualiza utilizatorii.' });
    }

    const users = await sql`
      SELECT 
        u.id, u.email, u.activated, u.created_at,
        ut.type_name as user_type,
        ud.nume
      FROM users u
      LEFT JOIN user_types ut ON u.user_type_id = ut.id
      LEFT JOIN user_details ud ON u.id = ud.user_id
      ORDER BY u.created_at DESC
    `;

    res.json({ users });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Eroare la încrcarea utilizatorilor' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ContIQ Backend Server is running!' });
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`=€ ContIQ Backend Server running on port ${PORT}`);
  console.log(`=Ê Health check: http://localhost:${PORT}/health`);
});

process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await sql.end();
  process.exit(0);
});