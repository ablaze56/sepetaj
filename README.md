# Šepetaj mi

Majhna spletna aplikacija: šepetaj v telefon, barva strani se spreminja glede na jakost zvoka. Primerno za Android (ali katerikoli brskalnik z mikrofonom).

## Kako zagnati

1. Odpri `index.html` v brskalniku (na telefonu raje prek **HTTPS**, npr. GitHub Pages).
2. Pritisni **Začni** in dovoli dostop do mikrofona.
3. Šepetaj – ozadje se bo mehko spreminjalo od vijolične do roza.

## Objava na GitHub Pages

1. Ustvari nov repozitorij na GitHubu (npr. `whisper-color`).
2. Naloži vse datoteke te mape (index.html, style.css, app.js, manifest.json, README.md).
3. V repozitoriju: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** (ali master), folder **/ (root)** → Save.
4. Stran bo na `https://<tvoj-username>.github.io/<ime-repo>/`.

Na Androidu odpri ta URL v Chrome ali Firefox; mikrofon deluje, ker je stran na HTTPS.

## Datoteke

- `index.html` – stran z gumbom „Začni” in podpisom ♥ M
- `style.css` – pastelna tema, pisava Cormorant Garamond
- `app.js` – zajem zvoka (Web Audio API), merjenje jakosti, barva ozadja
- `manifest.json` – opcijsko za „Dodaj na domači zaslon”
