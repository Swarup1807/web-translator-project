// Minimal Node.js backend (Express) to proxy requests to LibreTranslate.
// Keeps frontend simple and avoids CORS issues with third-party LibreTranslate instances.
//
// NOTE: This is a minimal demo suitable for learning / local testing.
// LibreTranslate public instances may have rate limits or require API keys.
// For production, host your own libretranslate instance or add API key management.

const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2/v3 depending on Node; package.json uses v2 for compatibility
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Replace this with a LibreTranslate instance you trust. Default uses libretranslate.de (public).
const LIBRE_URL = 'https://libretranslate.de';

app.get('/languages', async (req, res) => {
  try {
    const r = await fetch(`${LIBRE_URL}/languages`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('Failed to fetch languages: ' + err.message);
  }
});

app.post('/translate', async (req, res) => {
  const { q, source, target, format } = req.body;
  if (!q || !target) return res.status(400).send('Missing required fields');

  try {
    const payload = {
      q,
      source: source || 'auto',
      target,
      format: format || 'text'
    };

    const r = await fetch(`${LIBRE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).send('LibreTranslate error: ' + txt);
    }
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('Translation failed: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Translator backend running on http://localhost:${PORT}`);
});
