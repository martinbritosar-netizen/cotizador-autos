const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const CLIENT_ID = '3202853558647082';
const CLIENT_SECRET = 'c0H0nXwCBSi9RP4MQzNJcc0b5Cw2QyWk';

app.get('/buscar', async (req, res) => {
  try {
    const { marca, modelo, anio } = req.query;
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    const q = encodeURIComponent(`${marca} ${modelo} ${anio}`);
    const searchRes = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?q=${q}&category=MLA1744&limit=50&condition=used`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await searchRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000);
