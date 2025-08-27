// Frontend logic (vanilla JS)
// Fetch languages from backend, populate selects, perform translate request.
// Focus: clear, accessible, minimal but polished UX.

const sourceText = document.getElementById('sourceText');
const resultBox = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');

let languages = [];

// Utility: show simple status in button
function setLoading(on) {
  translateBtn.disabled = on;
  translateBtn.textContent = on ? 'Translating…' : 'Translate';
}

async function fetchLanguages() {
  try {
    const res = await fetch('/languages');
    if (!res.ok) throw new Error('Failed to fetch languages');
    languages = await res.json();
    populateLanguageSelects();
  } catch (err) {
    console.error(err);
    // Fallback: a small curated list
    languages = [
      {code:'en', name:'English'},
      {code:'hi', name:'Hindi'},
      {code:'es', name:'Spanish'},
      {code:'fr', name:'French'},
      {code:'de', name:'German'}
    ];
    populateLanguageSelects();
  }
}

function populateLanguageSelects() {
  // Clear existing options (except auto for source)
  const sAuto = sourceLang.querySelector('option[value="auto"]');
  sourceLang.innerHTML = '';
  sourceLang.appendChild(sAuto);

  targetLang.innerHTML = '';
  languages.forEach(l => {
    const opt1 = document.createElement('option');
    opt1.value = l.code;
    opt1.textContent = `${l.name} (${l.code})`;
    sourceLang.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = l.code;
    opt2.textContent = `${l.name} (${l.code})`;
    targetLang.appendChild(opt2);
  });

  // sensible defaults
  sourceLang.value = 'auto';
  targetLang.value = 'en';
}

async function translate() {
  const text = sourceText.value.trim();
  if (!text) {
    resultBox.value = '';
    return;
  }

  const payload = {
    q: text,
    source: sourceLang.value === 'auto' ? 'auto' : sourceLang.value,
    target: targetLang.value,
    format: 'text'
  };

  setLoading(true);
  try {
    const res = await fetch('/translate', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Translation failed');
    }
    const data = await res.json();
    // LibreTranslate returns { translatedText: "..." }
    resultBox.value = data.translatedText ?? '';
  } catch (err) {
    console.error(err);
    resultBox.value = 'Error: ' + (err.message || 'Unable to translate');
  } finally {
    setLoading(false);
  }
}

translateBtn.addEventListener('click', translate);
clearBtn.addEventListener('click', () => {
  sourceText.value = '';
  resultBox.value = '';
});
swapBtn.addEventListener('click', () => {
  // Swap languages and swap text
  const prevSource = sourceLang.value;
  sourceLang.value = targetLang.value || 'auto';
  targetLang.value = prevSource === 'auto' ? 'en' : prevSource;
  const t = sourceText.value;
  sourceText.value = resultBox.value;
  resultBox.value = t;
});

// init
fetchLanguages();

// hotkey: Ctrl+Enter to translate
sourceText.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    translate();
  }
});
