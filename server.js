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
    if (!token) throw new Error('Sin token: ' + JSON.stringify(tokenData));

    const q = encodeURIComponent(`${modelo} ${anio}`);
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${q}&category=MLA1743&limit=5&condition=used`;
    console.log('Buscando:', url);

    const searchRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const raw = await searchRes.text();
    console.log('Respuesta cruda:', raw.substring(0, 500));
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(process.env.PORT || 3000);
