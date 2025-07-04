ecoMatch/
│
├── backend/                           # 🔧 Proiectul Django (REST API)
│   ├── core/                          # 🧠 Aplicația principală: modele, view-uri, serializatoare
│   │   ├── models.py                  # Definește modelele bazei de date (User, Request etc.)
│   │   ├── serializers.py             # Convertește modelele în JSON și invers
│   │   ├── views.py                   # Logica pentru endpointuri API (ViewSets)
│   │   ├── urls.py                    # Înregistrează rutele locale ale aplicației `core`
│   │   ├── admin.py                   # Configurează ce apare în Django admin
│   │   ├── apps.py                    # Configurația aplicației Django `core`
│   │   └── utils/
│   │       └── email.py               # Funcție utilitară pentru trimiterea de emailuri (confirmare cont etc.)
│   │
│   ├── templates/email/              # 📧 Șabloane HTML pentru emailuri trimise prin SMTP
│   │   └── confirmation_email.html    # Email pentru confirmarea adresei de email
│   │
│   ├── tests/                         # 🧪 Teste automate pentru backend
│   │   ├── test_users.py              # Teste pentru înregistrare/autentificare utilizatori
│   │   └── test_requests.py           # Teste pentru cererile clienților
│   │
│   ├── settings/                      # ⚙️ Configurare împărțită pe medii
│   │   ├── base.py                    # Config comun (folosit de dev/prod)
│   │   ├── dev.py                     # Setări pentru dezvoltare (DEBUG=True)
│   │   └── prod.py                    # Setări pentru producție (DEBUG=False, logging, security)
│   │
│   ├── manage.py                      # Scriptul principal pentru comenzile Django
│   ├── requirements.txt               # Lista de pachete Python necesare proiectului
│   └── .env                           # 🔐 Variabile secrete (chei, parole SMTP etc.)
│
├── frontend/                          # 💻 Aplicația React (SPA cu TypeScript)
│   ├── public/                        # Fișiere statice vizibile publicului (index.html, favicon etc.)
│   ├── src/                           # Toată logica aplicației React
│   │   ├── api/
│   │   │   └── axios.ts               # Instanță Axios preconfigurată cu JWT + baseURL
│   │   │
│   │   ├── auth/                      # 🔐 Autentificare + protecție rute
│   │   │   ├── AuthContext.tsx        # Context global cu token + funcții login/logout
│   │   │   └── ProtectedRoute.tsx     # Componentă care blochează accesul dacă nu ești logat
│   │   │
│   │   ├── components/                # 🔄 Componente UI reutilizabile
│   │   │   └── common/                # Inputuri, butoane, layout-uri etc.
│   │   │
│   │   ├── features/                  # 🧩 Componente grupate pe funcționalitate
│   │   │   ├── ClientProfile/
│   │   │   │   └── ClientSetupForm.tsx # Formular setup pentru clienți (profil, adresă etc.)
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx          # Pagină de login
│   │   │   │   └── Signup.tsx         # Pagină de înregistrare (client/provider)
│   │   │
│   │   ├── pages/                     # 📄 Pagini principale ale aplicației
│   │   │   ├── Dashboard.tsx          # Dashboard client sau provider (în funcție de rol)
│   │   │   ├── ConfirmEmail.tsx       # Pagina afișată după confirmarea contului
│   │   │   └── NotFound.tsx           # Pagină 404 (pentru rute inexistente)
│   │   │
│   │   ├── App.tsx                    # Componenta principală care definește routing-ul
│   │   └── index.tsx                  # Punctul de intrare al aplicației React (rendează App.tsx)
│
│   ├── .env                           # 🔐 Variabile frontend (ex: REACT_APP_API_URL)
│   ├── package.json                   # 📦 Pachete și scripturi NPM
│   ├── tsconfig.json                  # Config TypeScript pentru proiectul React
│   └── README.md                      # Documentație pentru frontend
│
├── docs/                              # 📚 Documentație pentru echipă / dezvoltatori
│   ├── README.md                      # Descriere generală a proiectului
│   ├── changelog.md                   # Istoric cu toate modificările din v3 (profesionist)
│   ├── api-contract.md                # Definirea endpointurilor backend
│   └── v3-restructure-notes.md        # Ce s-a modificat în această restructurare
│
├── db.sqlite3                         # Baza de date locală Django (pentru testare)
├── .gitignore                         # Fișiere/foldere excluse din Git
└── LICENSE                            # Licența proiectului (MIT, GPL, etc.)
