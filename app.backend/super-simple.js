require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ONLY CORS - nothing else
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'Super simple server works!' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint works!', body: req.body });
});

app.listen(3003, () => {
  console.log('Super simple server running on port 3003');
});