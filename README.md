# Programmazione Avanzata — Document Compliance Checker

## Indice

| Sezione | Contenuto |
|--------|-----------|
| [Obiettivo del Progetto](#obiettivo-del-progetto) | Scopo del backend e funzionalita principali |
| [Diagramma dei Casi d'Uso](#diagramma-dei-casi-duso) | Attori e interazioni principali con il sistema |
| [Rotte Disponibili](#rotte-disponibili) | Panoramica completa degli endpoint |
| [Autenticazione](#autenticazione) | Login e registrazione |
| [Utenti](#utenti) | CRUD utenti e gestione token |
| [Normative](#normative) | Catalogo normative e operazioni admin |
| [Documenti](#documenti) | Gestione metadati e avvio analisi |
| [Analisi](#analisi) | Recupero analisi precedenti |
| [Report](#report) | Download report generati |
| [Design Pattern Implementati](#design-pattern-implementati) | Pattern architetturali usati |
| [Avvio del Servizio](#avvio-del-servizio) | Esecuzione locale con Docker |
| [Testing](#testing) | Collection Postman ed environment |
| [Note](#note) | Software e tecnologie usate |
| [Autore](#autore) | Team e riferimenti GitHub |

## Obiettivo del Progetto
Il progetto consiste nell'implementare il backend del progetto realizzato per l'Hack-AI-Thon, volto a verificare la conformità di documenti rispetto a normative ESG.
Gli utenti autenticati possono caricare i metadati di un documento e richiederne l'analisi: il sistema produce un'`Analysis` con i relativi `ComplianceResult`, esportabile come report.

Le operazioni principali sono:
* Autenticazione e registrazione con rilascio di JWT firmati in RS256
* Gestione utenti (solo admin)
* Gestione del catalogo normative (lettura pubblica, scrittura solo admin)
* Gestione dei metadati dei documenti e avvio analisi
* Consultazione delle analisi e dei risultati di conformità
* Recupero e download dei report

## Diagramma dei Casi d'Uso

Il diagramma mostra i tre attori del sistema e le operazioni che ciascuno può compiere. L'**Admin** eredita tutti i casi d'uso dell'**Utente autenticato** e ha accesso esclusivo alle operazioni di gestione.

```mermaid
flowchart LR
    NC(["👤 Utente\nnon autenticato"]):::attore
    U(["👤 Utente"]):::attore
    A(["👤 Admin"]):::attore

    A -. generalizzazione .-> U

    subgraph Sistema["Document Compliance Checker"]
        subgraph Auth["Autenticazione"]
            UC1(["Registrarsi"])
            UC2(["Effettuare il login"])
            UC3(["Visualizzare il proprio profilo"])
            UC4(["Modificare il proprio profilo"])
        end

        subgraph Docs["Documenti"]
            UC5(["Visualizzare lista documenti"])
            UC6(["Visualizzare dettaglio documento"])
            UC7(["Scaricare file PDF"])
            UC8(["Caricare nuovo documento"])
            UC9(["Modificare documento"])
            UC10(["Eliminare documento"])
            UC11(["Avviare analisi di conformità"])
        end

        subgraph Regs["Normative"]
            UC12(["Visualizzare lista normative"])
            UC13(["Visualizzare dettaglio normativa"])
            UC14(["Creare normativa"])
            UC15(["Modificare normativa"])
            UC16(["Eliminare normativa"])
        end

        subgraph Analyses["Analisi"]
            UC17(["Visualizzare lista analisi"])
            UC18(["Visualizzare dettaglio analisi"])
        end

        subgraph Reports["Report"]
            UC19(["Scaricare report"])
        end

        subgraph Users["Utenti & Token"]
            UC20(["Visualizzare token rimanenti"])
            UC21(["Aggiungere token a utente"])
            UC22(["Visualizzare lista utenti"])
            UC23(["Creare utente"])
            UC24(["Modificare utente"])
            UC25(["Eliminare utente"])
        end
    end

    NC --> UC1 & UC2

    U --> UC3 & UC4
    U --> UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11
    U --> UC12 & UC13
    U --> UC17 & UC18
    U --> UC19
    U --> UC20

    A --> UC14 & UC15 & UC16
    A --> UC21 & UC22 & UC23 & UC24 & UC25

    classDef attore fill:#e8f4fd,stroke:#2980b9,stroke-width:2px,font-weight:bold
```

## Rotte Disponibili

### Autenticazione

Le **rotte di autenticazione** permettono all'utente di registrarsi e di effettuare il login.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `POST` | /auth/register | No | Registra un nuovo utente e restituisce un token JWT |
| `POST` | /auth/login | No | Verifica le credenziali e restituisce un token JWT |
| `GET` | /auth/me | Si | Restituisce all'utente le proprie informazioni |
| `PATCH` | /auth/me | Si | Permette all'utente di modificare le proprie informazioni |

---

#### POST /auth/register

Registra un nuovo utente nel sistema assegnandogli automaticamente il ruolo `user`. Dopo la registrazione avvenuta con successo, viene restituito un token JWT pronto all'uso.

**Body richiesta:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
> La password deve contenere almeno 8 caratteri.

**Errori possibili:**
- `400 Bad Request` — email non valida o password troppo corta
- `409 Conflict` — email già registrata

**Successo:** `201 Created` — Ritorna il token JWT e il ruolo `user`

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/auth/register
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as AuthController
    participant DAO as UserDAO
    participant DB@{ "type": "database" } as Database
    participant JWT as JWT (RS256)

    Client->>+Router: POST /auth/register<br/>{ email, password }

    Router->>+Validate: validate({ body: registerSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida body (email valida,<br/>password >= 8 caratteri)
        alt email non valida o password troppo corta
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: register(req, res)

    Controller->>+DAO: findByEmail(email)
    DAO->>+DB: SELECT * FROM users<br/>WHERE email = ?
    DB-->>-DAO: User | null
    DAO-->>-Controller: User | null

    rect rgb(255, 240, 240)
        alt email gia registrata
            Controller-->>Client: 409 Conflict<br/>{ error: "Email gia registrata" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,DB: Creazione utente (sempre Role.User)
        Controller->>+JWT: bcrypt.hash(password, 10)
        JWT-->>-Controller: hashedPassword

        Controller->>+DAO: create({ email, password: hashed, role: Role.User })
        DAO->>+DB: INSERT INTO users (...)
        DB-->>-DAO: User
        DAO-->>-Controller: User

        Controller->>+JWT: jwt.sign({ id, email, role },<br/>privateKey, { algorithm: RS256,<br/>expiresIn: JWT_EXPIRES_IN })
        JWT-->>-Controller: accessToken
    end

    Controller-->>-Validate: { token, role }
    Validate-->>-Router: { token, role }
    Router-->>-Client: 201 Created<br/>{ token: "eyJ...", role: "user" }
```

---

#### POST /auth/login

Verifica le credenziali dell'utente e, se corrette, restituisce un token JWT firmato in RS256 da utilizzare nelle richieste successive.

**Body richiesta:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Errori possibili:**
- `400 Bad Request` — email non valida o password mancante
- `401 Unauthorized` — credenziali errate (utente non trovato o password sbagliata)

**Successo:** `200 OK` — Ritorna il token JWT e il ruolo dell'utente

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/auth/login
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as AuthController
    participant DAO as UserDAO
    participant DB@{ "type": "database" } as Database
    participant JWT as JWT (RS256)

    Client->>+Router: POST /auth/login<br/>{ email, password }

    Router->>+Validate: validate({ body: loginSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida body (email valida,<br/>password non vuota)
        alt email non valida o password mancante
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: login(req, res)

    Controller->>+DAO: findByEmail(email)
    DAO->>+DB: SELECT * FROM users<br/>WHERE email = ?
    DB-->>-DAO: User | null
    DAO-->>-Controller: User | null

    rect rgb(255, 240, 240)
        alt utente non trovato
            Controller-->>Client: 401 Unauthorized<br/>{ error: "Credenziali non valide" }
        end
    end

    Controller->>+JWT: bcrypt.compare(password, user.password)
    JWT-->>-Controller: boolean

    rect rgb(255, 240, 240)
        alt password errata
            Controller-->>Client: 401 Unauthorized<br/>{ error: "Credenziali non valide" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,JWT: Autenticazione riuscita
        Controller->>+JWT: jwt.sign({ id, email, role },<br/>privateKey, { algorithm: RS256,<br/>expiresIn: JWT_EXPIRES_IN })
        JWT-->>-Controller: accessToken
    end

    Controller-->>-Validate: { token, role }
    Validate-->>-Router: { token, role }
    Router-->>-Client: 200 OK<br/>{ token: "eyJ...", role: "..." }
```

---

#### GET /auth/me

Restituisce le informazioni del profilo dell'utente autenticato (email, ruolo, token rimanenti).


**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido

**Successo:** `200 OK` — Ritorna `{ id, email, role, tokens }`

---

#### PATCH /auth/me

Permette all'utente autenticato di aggiornare il proprio profilo (email e/o password).


**Body richiesta** (almeno un campo):
```json
{
  "email": "nuova@email.com",
  "password": "nuovaPassword123"
}
```

**Errori possibili:**
- `400 Bad Request` — body vuoto o dati non validi
- `401 Unauthorized` — token mancante o non valido
- `409 Conflict` — email già in uso da un altro utente

**Successo:** `200 OK` — Ritorna i dati aggiornati dell'utente

---

### Utenti

Le **rotte relative agli utenti** permettono all'**admin** di effettuare operazioni **CRUD** relativamente alle informazioni degli utenti.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /users | Sì (admin) | Restituisce la lista di tutti gli utenti |
| `GET` | /users/:id | Sì (admin) | Restituisce i dati di un singolo utente |
| `POST` | /users | Sì (admin) | Crea un nuovo utente |
| `PATCH` | /users/:id | Sì (admin) | Modifica i dati di un utente esistente |
| `DELETE` | /users/:id | Sì (admin) | Elimina un utente |
| `GET` | /users/token | Sì | Restituisce il numero di token rimanenti all'utente |
| `POST` | /users/:id/token | Sì (admin) | Permette all'admin di aggiungere token ad un utente |

---

#### GET /users

Restituisce la lista completa di tutti gli utenti registrati nel sistema. Accessibile solo agli amministratori.



**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin

**Successo:** `200 OK` — Ritorna un array di `{ id, email, role, tokens }`

---

#### GET /users/:id

Restituisce i dati di un singolo utente dato il suo `id`. Accessibile solo agli amministratori.



**Parametri URL:**
- `id` — intero positivo, identificatore dell'utente

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — utente non trovato

**Successo:** `200 OK` — Ritorna `{ id, email, role, tokens }`

---

#### POST /users

Crea un nuovo utente nel sistema. Operazione riservata agli amministratori. Il ruolo assegnato di default è `user`.


**Body richiesta:**
```json
{
  "email": "nuovo@utente.com",
  "password": "password123"
}
```

**Errori possibili:**
- `400 Bad Request` — email non valida o password troppo corta (< 8 caratteri)
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `409 Conflict` — email già in uso

**Successo:** `201 Created` — Ritorna `{ id, email, role: "user" }`

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/users
    participant Auth as authenticate<br/>(JWT RS256)
    participant Role as requireAdmin
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as UserController
    participant DAO as UserDAO
    participant DB@{ "type": "database" } as Database

    Client->>+Router: POST /users<br/>Authorization: Bearer token<br/>{ email, password }

    rect rgb(255, 240, 240)
        note over Auth,Validate: Chain of Responsibility (middleware)
        Router->>+Auth: authenticate(req, res, next)
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
        Auth-->>-Router: req.user

        Router->>+Role: requireAdmin(req, res, next)
        alt ruolo != Role.Admin
            Role-->>Client: 403 Forbidden<br/>{ error: "Accesso riservato agli admin" }
        end
        Role-->>-Router: next()

        Router->>+Validate: validate({ body: createUserSchema })
        alt email non valida o password < 8 caratteri
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
        Validate-->>-Router: next()
    end

    Router->>+Controller: createUser(req, res)

    Controller->>+DAO: findByEmail(email)
    DAO->>+DB: SELECT * FROM users<br/>WHERE email = ?
    DB-->>-DAO: User | null
    DAO-->>-Controller: User | null

    rect rgb(255, 240, 240)
        alt email gia in uso
            Controller-->>Client: 409 Conflict<br/>{ error: "Email gia utilizzata" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,DB: Creazione utente
        Controller->>Controller: bcrypt.hash(password, 10)
        Controller->>+DAO: create({ email, password: hashed, role: Role.User })
        DAO->>+DB: INSERT INTO users (...)
        DB-->>-DAO: User
        DAO-->>-Controller: User
    end

    Controller-->>-Router: { id, email, role }
    Router-->>-Client: 201 Created<br/>{ id, email, role: "user" }
```

---

#### PATCH /users/:id

Aggiorna i dati di un utente esistente (email, password, ruolo). Operazione riservata agli amministratori. Il ruolo può essere promosso solo da `user` ad `admin` e non viceversa.


**Parametri URL:**
- `id` — intero positivo, identificatore dell'utente

**Body richiesta** (almeno un campo):
```json
{
  "email": "aggiornata@email.com",
  "password": "nuovaPassword123",
  "role": "admin"
}
```

**Errori possibili:**
- `400 Bad Request` — id non valido, body vuoto o ruolo non riconosciuto
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — utente non trovato
- `409 Conflict` — email già in uso da un altro utente

**Successo:** `200 OK` — Ritorna `{ id, email, role }`

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/users/:id
    participant Auth as authenticate<br/>(JWT RS256)
    participant Role as requireAdmin
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as UserController
    participant DAO as UserDAO
    participant DB@{ "type": "database" } as Database

    Client->>+Router: PATCH /users/:id<br/>Authorization: Bearer token<br/>{ email?, password?, role? }

    rect rgb(255, 240, 240)
        note over Auth,Validate: Chain of Responsibility (middleware)
        Router->>+Auth: authenticate(req, res, next)
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
        Auth-->>-Router: req.user

        Router->>+Role: requireAdmin(req, res, next)
        alt ruolo != Role.Admin
            Role-->>Client: 403 Forbidden<br/>{ error: "Accesso riservato agli admin" }
        end
        Role-->>-Router: next()

        Router->>+Validate: validate({ params: idParamSchema,<br/>body: updateUserSchema })
        alt id non intero, body vuoto o role non valido
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
        Validate-->>-Router: next()
    end

    Router->>+Controller: updateUser(req, res)

    Controller->>+DAO: findByIdFull(req.params.id)
    DAO->>+DB: SELECT * FROM users<br/>WHERE id = ?
    DB-->>-DAO: User | null
    DAO-->>-Controller: User | null

    rect rgb(255, 240, 240)
        alt utente non trovato
            Controller-->>Client: 404 Not Found<br/>{ error: "Utente non trovato" }
        end
    end

    rect rgb(240, 240, 255)
        note over Controller,DB: Aggiornamento campi (solo se presenti)
        alt email presente
            Controller->>+DAO: findByEmail(email)
            DAO->>+DB: SELECT * FROM users<br/>WHERE email = ?
            DB-->>-DAO: User | null
            DAO-->>-Controller: User | null
            alt email gia in uso da altro utente
                Controller-->>Client: 409 Conflict<br/>{ error: "Email gia in uso" }
            end
            Controller->>Controller: user.email = email
        end

        alt password presente
            Controller->>Controller: user.password = bcrypt.hash(password, 10)
        end

        alt role == Role.Admin e ruolo attuale == Role.User
            Controller->>Controller: user.role = Role.Admin
        end
    end

    rect rgb(240, 255, 240)
        Controller->>+DAO: user.save()
        DAO->>+DB: UPDATE users SET ...<br/>WHERE id = ?
        DB-->>-DAO: User
        DAO-->>-Controller: User
    end

    Controller-->>-Router: { id, email, role }
    Router-->>-Client: 200 OK<br/>{ id, email, role }
```

---

#### DELETE /users/:id

Elimina definitivamente un utente dal sistema. Operazione riservata agli amministratori.



**Parametri URL:**
- `id` — intero positivo, identificatore dell'utente

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — utente non trovato

**Successo:** `200 OK` — Conferma dell'eliminazione

---

#### GET /users/token

Restituisce il numero di token rimanenti dell'utente autenticato.


**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido

**Successo:** `200 OK` — Ritorna `{ tokens: <numero> }`

---

#### POST /users/:id/token

Aggiunge token all'account di un utente specifico. Operazione riservata agli amministratori.


**Parametri URL:**
- `id` — intero positivo, identificatore dell'utente

**Body richiesta:**
```json
{
  "amount": 50
}
```

**Errori possibili:**
- `400 Bad Request` — id non valido o quantità non positiva
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — utente non trovato

**Successo:** `200 OK` — Ritorna i token aggiornati dell'utente

---

### Normative

Le **rotte delle normative** permettono agli utenti di ottenere la lista delle normative e all'admin di poter modificare quest'ultima.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /regulations | Sì | Restituisce la lista di tutte le normative |
| `GET` | /regulations/:id | Sì | Restituisce i dettagli di una singola normativa |
| `POST` | /regulations | Sì (admin) | Aggiunge una nuova normativa al catalogo |
| `PATCH` | /regulations/:id | Sì (admin) | Modifica una normativa esistente |
| `DELETE` | /regulations/:id | Sì (admin) | Elimina una normativa dal catalogo |

---

#### GET /regulations

Restituisce la lista completa di tutte le normative presenti nel catalogo.


**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido

**Successo:** `200 OK` — Ritorna un array di `{ id, name, version, description }`

---

#### GET /regulations/:id

Restituisce i dettagli di una singola normativa dato il suo `id`.



**Parametri URL:**
- `id` — intero positivo, identificatore della normativa

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — normativa non trovata

**Successo:** `200 OK` — Ritorna `{ id, name, version, description }`

---

#### POST /regulations

Aggiunge una nuova normativa al catalogo. La descrizione può essere fornita direttamente nel body oppure estratta automaticamente da un file PDF allegato. Operazione riservata agli amministratori.



**Body richiesta** (`multipart/form-data`):
```
name        → nome della normativa (es. "ISO 14001")
version     → versione (es. "2015")
file        → (opzionale) file PDF da cui estrarre la descrizione
```
> Se non viene allegato un PDF, il campo `description` deve essere incluso nel body.

**Errori possibili:**
- `400 Bad Request` — nome o versione mancanti, file non PDF o descrizione assente
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `409 Conflict` — normativa con lo stesso nome già esistente

**Successo:** `201 Created` — Ritorna `{ id, name, version, description }`

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/regulations
    participant Auth as authenticate<br/>(JWT RS256)
    participant Role as requireAdmin
    participant Upload as uploadPdf<br/>(multer memoryStorage)
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as RegulationController
    participant PDF as PDFParse<br/>(pdf-parse)
    participant DAO as RegulationDAO
    participant DB@{ "type": "database" } as Database

    Client->>+Router: POST /regulations<br/>Authorization: Bearer token<br/>multipart/form-data { name, version, file? }

    rect rgb(255, 240, 240)
        note over Auth,Validate: Chain of Responsibility (middleware)
        Router->>+Auth: authenticate(req, res, next)
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
        Auth-->>-Router: req.user

        Router->>+Role: requireAdmin(req, res, next)
        alt ruolo != Role.Admin
            Role-->>Client: 403 Forbidden<br/>{ error: "Accesso riservato agli admin" }
        end
        Role-->>-Router: next()

        Router->>+Upload: uploadPdf(req, res, next)
        alt file non PDF o > 10MB
            Upload-->>Client: 400 Bad Request<br/>{ error: "Tipo di file non valido" }
        end
        Upload-->>-Router: req.file (buffer in RAM)

        Router->>+Validate: validate({ body: createRegulationSchema })
        alt name o version mancanti
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
        Validate-->>-Router: next()
    end

    Router->>+Controller: createRegulation(req, res)

    rect rgb(240, 240, 255)
        note over Controller,PDF: Estrazione testo dal PDF (se allegato)
        alt req.file presente
            Controller->>+PDF: getText({ data: req.file.buffer })
            PDF-->>-Controller: description = result.text.trim()
        end
    end

    rect rgb(255, 240, 240)
        note over Controller: description obbligatoria (dal body o dal PDF)
        alt description mancante
            Controller-->>Client: 400 Bad Request<br/>{ error: "Campi normativa richiesti" }
        end
    end

    Controller->>+DAO: findByName(name)
    DAO->>+DB: SELECT * FROM regulations<br/>WHERE name = ?
    DB-->>-DAO: Regulation | null
    DAO-->>-Controller: Regulation | null

    rect rgb(255, 240, 240)
        alt normativa gia esistente
            Controller-->>Client: 409 Conflict<br/>{ error: "Normativa gia esistente" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,DB: Creazione normativa
        Controller->>+DAO: create({ name, description, version })
        DAO->>+DB: INSERT INTO regulations (...)
        DB-->>-DAO: Regulation
        DAO-->>-Controller: Regulation
    end

    Controller-->>-Router: Regulation
    Router-->>-Client: 201 Created<br/>{ id, name, version, description }
```

---

#### PATCH /regulations/:id

Aggiorna i campi di una normativa esistente (nome, descrizione, versione). Operazione riservata agli amministratori.


**Parametri URL:**
- `id` — intero positivo, identificatore della normativa

**Body richiesta** (almeno un campo):
```json
{
  "name": "ISO 14001 aggiornata",
  "description": "Nuova descrizione",
  "version": "2024"
}
```

**Errori possibili:**
- `400 Bad Request` — id non intero o body vuoto
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — normativa non trovata

**Successo:** `200 OK` — Ritorna la normativa aggiornata

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/regulations/:id
    participant Auth as authenticate<br/>(JWT Middleware)
    participant Role as requireAdmin<br/>(Role Middleware)
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as RegulationController
    participant DAO as RegulationDAO
    participant DB@{ shape: "database" } as Database

    Client->>+Router: PATCH /regulations/:id<br/>Authorization: Bearer token<br/>{ name?, description?, version? }

    Router->>+Auth: authenticate(req, res, next)

    rect rgb(255, 240, 240)
        note over Auth: Verifica JWT
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
    end

    Auth->>+Role: requireAdmin(req, res, next)

    rect rgb(255, 240, 240)
        alt ruolo != Role.Admin
            Role-->>Client: 403 Forbidden<br/>{ error: "Accesso negato" }
        end
    end

    Role->>+Validate: validate({ params: idParamSchema,<br/>body: updateRegulationSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida :id (intero) e body<br/>(almeno un campo, non vuoti)
        alt id non intero o body vuoto
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: updateRegulation(req, res)

    Controller->>+DAO: findById(req.params.id)
    DAO->>+DB: SELECT * FROM regulations<br/>WHERE id = ?
    DB-->>-DAO: Regulation | null
    DAO-->>-Controller: Regulation | null

    rect rgb(255, 240, 240)
        alt normativa non trovata
            Controller-->>Client: 404 Not Found<br/>{ error: "Normativa non trovata" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,DB: Aggiornamento normativa
        Controller->>+DAO: regulation.update({ name, description, version })
        DAO->>+DB: UPDATE regulations SET<br/>name, description, version WHERE id = ?
        DB-->>-DAO: ok
        DAO-->>-Controller: Regulation aggiornata
    end

    Controller-->>-Validate: { regulation }
    Validate-->>-Role: { regulation }
    Role-->>-Auth: { regulation }
    Auth-->>-Router: { regulation }
    Router-->>-Client: 200 OK<br/>{ regulation }
```

---

#### DELETE /regulations/:id

Elimina definitivamente una normativa dal catalogo. Operazione riservata agli amministratori.



**Parametri URL:**
- `id` — intero positivo, identificatore della normativa

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `403 Forbidden` — l'utente non ha il ruolo admin
- `404 Not Found` — normativa non trovata

**Successo:** `200 OK` — Conferma dell'eliminazione

---

### Documenti

Le **rotte dei documenti** permettono agli utenti di ottenere ed inviare nuovi documenti per l'analisi.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /documents | Sì | Restituisce la lista dei documenti dell'utente |
| `GET` | /documents/:id | Sì | Restituisce i dettagli di un singolo documento |
| `GET` | /documents/:id/file | Sì | Scarica il file PDF originale del documento |
| `POST` | /documents | Sì | Carica i metadati di un nuovo documento |
| `PATCH` | /documents/:id | Sì | Modifica i metadati di un documento esistente |
| `DELETE` | /documents/:id | Sì | Elimina un documento |
| `POST` | /documents/:id/analyze | Sì | Avvia l'analisi di conformità su un documento |

---

#### GET /documents

Restituisce la lista di tutti i documenti caricati dall'utente autenticato.



**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido

**Successo:** `200 OK` — Ritorna un array di `{ id, title, description, status, createdAt }`

---

#### GET /documents/:id

Restituisce i dettagli di un singolo documento dell'utente autenticato.



**Parametri URL:**
- `id` — intero positivo, identificatore del documento

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — documento non trovato o non appartenente all'utente

**Successo:** `200 OK` — Ritorna `{ id, title, description, status, filePath, createdAt }`

---

#### GET /documents/:id/file

Scarica il file PDF originale associato a un documento dell'utente. Il file viene recuperato da MinIO e restituito come stream.



**Parametri URL:**
- `id` — intero positivo, identificatore del documento

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — documento non trovato o file non disponibile

**Successo:** `200 OK` — Ritorna il file PDF con `Content-Type: application/pdf`

---

#### POST /documents

Carica un nuovo documento nel sistema. Il file PDF viene salvato su MinIO in maniera atomica: se l'upload fallisce, la riga nel database viene annullata tramite rollback della transazione.



**Body richiesta** (`multipart/form-data`):
```
title       → titolo del documento (stringa non vuota)
description → descrizione del documento (stringa non vuota)
file        → file PDF (max 10 MB)
```

**Errori possibili:**
- `400 Bad Request` — titolo/descrizione mancanti o file non PDF/assente
- `401 Unauthorized` — token mancante o non valido
- `503 Service Unavailable` — errore durante l'upload su MinIO

**Successo:** `201 Created` — Ritorna i metadati del documento creato

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/documents
    participant Auth as authenticate<br/>(JWT Middleware)
    participant Upload as uploadPdf<br/>(Multer)
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as DocumentController
    participant DAO as DocumentDAO
    participant DB@{ shape: "database" } as Database
    participant Minio as MinIO Storage

    Client->>+Router: POST /documents<br/>multipart/form-data<br/>{ title, description, file }

    Router->>+Auth: authenticate(req, res, next)

    rect rgb(255, 240, 240)
        note over Auth: Verifica JWT
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
    end

    Auth->>+Upload: uploadPdf(req, res, next)

    rect rgb(255, 240, 240)
        note over Upload: Validazione file (max 10MB)
        alt file non PDF
            Upload-->>Client: 400 Bad Request<br/>{ error: "Tipo file non valido" }
        end
    end

    Upload->>+Validate: validate({ body: createDocumentSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida body (title, description<br/>stringhe non vuote)
        alt title o description mancanti/vuoti
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: createDocument(req, res)

    rect rgb(255, 240, 240)
        alt file assente (req.file)
            Controller-->>Client: 400 Bad Request<br/>{ error: "File obbligatorio" }
        end
    end

    rect rgb(240, 248, 255)
        note over Controller,Minio: Transazione DB (atomica)<br/>create + upload + update filePath
        Controller->>+DB: BEGIN TRANSACTION

        Controller->>DAO: create({ userId, title, description }, transaction)
        DAO->>DB: INSERT INTO documents<br/>{ userId, title, description }

        Controller->>+Minio: putObject(DOCUMENTS_BUCKET,<br/>"<id>/original.pdf", buffer)
        Minio-->>-Controller: ok

        Controller->>DAO: document.update({ filePath }, { transaction })
        DAO->>DB: UPDATE documents SET filePath = ?

        Controller->>DB: COMMIT
        DB-->>-Controller: Document
    end

    rect rgb(255, 240, 240)
        alt errore upload MinIO o scrittura DB
            note over Controller,Minio: ROLLBACK automatico (INSERT annullato)<br/>+ rimozione file orfano se già caricato
            Controller->>+Minio: removeObject(DOCUMENTS_BUCKET, fileKey)
            Minio-->>-Controller: ok
            Controller-->>Client: 503 Service Unavailable<br/>{ error: "Errore storage" }
        end
    end

    Controller-->>-Validate: { document }
    Validate-->>-Upload: { document }
    Upload-->>-Auth: { document }
    Auth-->>-Router: { document }
    Router-->>-Client: 201 Created<br/>{ document }
```

---

#### PATCH /documents/:id

Aggiorna i metadati (titolo e/o descrizione) di un documento esistente dell'utente autenticato. Il documento deve appartenere all'utente che effettua la richiesta.



**Parametri URL:**
- `id` — intero positivo, identificatore del documento

**Body richiesta** (almeno un campo):
```json
{
  "title": "Nuovo titolo",
  "description": "Nuova descrizione"
}
```

**Errori possibili:**
- `400 Bad Request` — id non intero o body vuoto/non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — documento non trovato o non appartenente all'utente

**Successo:** `200 OK` — Ritorna il documento aggiornato

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/documents/:id
    participant Auth as authenticate<br/>(JWT Middleware)
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as DocumentController
    participant DAO as DocumentDAO
    participant DB@{ shape: "database" } as Database

    Client->>+Router: PATCH /documents/:id<br/>{ title?, description? }

    Router->>+Auth: authenticate(req, res, next)

    rect rgb(255, 240, 240)
        note over Auth: Verifica JWT
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
    end

    Auth->>+Validate: validate({ params: idParamSchema,<br/>body: updateDocumentSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida :id (intero) e body<br/>(title?/description?, almeno uno)
        alt dati non validi
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: updateDocument(req, res)

    Controller->>+DAO: findByIdAndUser(id, userId)
    DAO->>+DB: SELECT * FROM documents<br/>WHERE id = ? AND userId = ?
    DB-->>-DAO: Document | null
    DAO-->>-Controller: Document | null

    rect rgb(255, 240, 240)
        alt documento non trovato
            Controller-->>Client: 404 Not Found<br/>{ error: "Documento non trovato" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,DB: Aggiornamento documento
        Controller->>+DAO: document.update({ title, description })
        DAO->>+DB: UPDATE documents<br/>SET title = ?, description = ?<br/>WHERE id = ?
        DB-->>-DAO: ok
        DAO-->>-Controller: Document aggiornato
    end

    Controller-->>-Validate: { document }
    Validate-->>-Auth: { document }
    Auth-->>-Router: { document }
    Router-->>-Client: 200 OK<br/>{ document }
```

---

#### DELETE /documents/:id

Elimina un documento dell'utente autenticato. Il documento deve appartenere all'utente che effettua la richiesta.



**Parametri URL:**
- `id` — intero positivo, identificatore del documento

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — documento non trovato o non appartenente all'utente

**Successo:** `200 OK` — Conferma dell'eliminazione

---

#### POST /documents/:id/analyze

Avvia l'analisi di conformità ESG su un documento. Il sistema genera un report PDF, lo carica su MinIO e registra l'analisi nel database tramite transazione atomica. Il costo dell'operazione è **10 token**. Il documento deve essere nello stato `pending` (non ancora analizzato).



**Parametri URL:**
- `id` — intero positivo, identificatore del documento

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `402 Payment Required` — token insufficienti (< 10)
- `404 Not Found` — documento non trovato o non appartenente all'utente
- `409 Conflict` — documento già analizzato
- `503 Service Unavailable` — errore nella generazione del PDF o upload MinIO
- `500 Internal Server Error` — errore durante la transazione DB (con cleanup del file su MinIO)

**Successo:** `200 OK` — Ritorna `{ document, reportId, tokensRemaining }`

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as Router<br/>/documents/:id/analyze
    participant Auth as authenticate<br/>(JWT Middleware)
    participant Validate as validate<br/>(Zod Middleware)
    participant Controller as DocumentController
    participant DocDAO as DocumentDAO
    participant UserDAO as UserDAO
    participant DB@{ shape: "database" } as Database
    participant Minio as MinIO Storage
    participant ReportDAO as ReportDAO

    Client->>+Router: POST /documents/:id/analyze

    Router->>+Auth: authenticate(req, res, next)

    rect rgb(255, 240, 240)
        note over Auth: Verifica JWT
        alt token mancante o non valido
            Auth-->>Client: 401 Unauthorized<br/>{ error: "Token non valido" }
        end
    end

    Auth->>+Validate: validate({ params: idParamSchema })

    rect rgb(255, 240, 240)
        note over Validate: Valida :id (intero positivo)
        alt id non valido
            Validate-->>Client: 400 Bad Request<br/>{ error: "Dati della richiesta non validi",<br/>details: [...] }
        end
    end

    Validate->>+Controller: analyzeDocument(req, res)

    Controller->>+DocDAO: findByIdAndUser(id, userId)
    DocDAO->>+DB: SELECT * FROM documents<br/>WHERE id = ? AND userId = ?
    DB-->>-DocDAO: Document | null
    DocDAO-->>-Controller: Document | null

    rect rgb(255, 240, 240)
        alt documento non trovato
            Controller-->>Client: 404 Not Found<br/>{ error: "Documento non trovato" }
        end
    end

    rect rgb(255, 240, 240)
        alt document.status === "analyzed"
            Controller-->>Client: 409 Conflict<br/>{ error: "Documento già analizzato" }
        end
    end

    Controller->>+UserDAO: findByIdFull(userId)
    UserDAO->>+DB: SELECT * FROM users WHERE id = ?
    DB-->>-UserDAO: User | null
    UserDAO-->>-Controller: User | null

    rect rgb(255, 240, 240)
        alt utente non trovato o tokens < ANALYSIS_TOKEN_COST (10)
            Controller-->>Client: 402 Payment Required<br/>{ error: "Token insufficienti" }
        end
    end

    rect rgb(240, 255, 240)
        note over Controller,Minio: Generazione e upload report ESG
        Controller->>Controller: generateReport(document)
        note over Controller: Genera PDF ESG<br/>con pdfkit in memoria
        Controller->>+Minio: putObject(REPORTS_BUCKET,<br/>"<id>/report.pdf", pdfBuffer)
        Minio-->>-Controller: ok
    end

    rect rgb(255, 240, 240)
        alt errore generazione PDF o upload MinIO
            Controller-->>Client: 503 Service Unavailable<br/>{ error: "Errore storage" }
        end
    end

    rect rgb(240, 248, 255)
        note over Controller,ReportDAO: Transazione DB (atomica)<br/>tutte le scritture o nessuna
        Controller->>+DB: BEGIN TRANSACTION

        Controller->>DocDAO: document.update({ status: "analyzed", reportPath }, { transaction })
        DocDAO->>DB: UPDATE documents SET<br/>status, reportPath WHERE id = ?

        Controller->>UserDAO: deductTokens(userId, 10, transaction)
        UserDAO->>DB: UPDATE users SET<br/>tokens = tokens - 10 WHERE id = ?

        Controller->>ReportDAO: create({ documentId, userId, filePath }, transaction)
        ReportDAO->>DB: INSERT INTO reports<br/>{ documentId, userId, filePath }

        Controller->>DB: COMMIT
        DB-->>-Controller: reportId
    end

    rect rgb(255, 240, 240)
        alt errore durante la transazione
            note over Controller,Minio: ROLLBACK + cleanup file orfano
            Controller->>+Minio: removeObject(REPORTS_BUCKET, reportKey)
            Minio-->>-Controller: ok
            Controller-->>Client: 500 Internal Server Error<br/>{ error: "Errore database" }
        end
    end

    Controller-->>-Validate: { document, reportId, tokensRemaining }
    Validate-->>-Auth: { document, reportId, tokensRemaining }
    Auth-->>-Router: { document, reportId, tokensRemaining }
    Router-->>-Client: 200 OK<br/>{ document, reportId, tokensRemaining }
```

---

### Analisi

Le **rotte dell'analisi** permettono agli utenti di recuperare le analisi effettuate in passato.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /analyses | Sì | Restituisce la lista di tutte le analisi dell'utente |
| `GET` | /analyses/:id | Sì | Restituisce i dettagli e i risultati di una singola analisi |

---

#### GET /analyses

Restituisce la lista di tutte le analisi effettuate dall'utente autenticato, ordinate dalla più recente.



**Errori possibili:**
- `401 Unauthorized` — token mancante o non valido

**Successo:** `200 OK` — Ritorna un array di `{ id, documentId, createdAt, complianceResults }`

---

#### GET /analyses/:id

Restituisce i dettagli completi di una singola analisi, inclusi tutti i `ComplianceResult` associati. L'analisi deve appartenere all'utente autenticato.



**Parametri URL:**
- `id` — intero positivo, identificatore dell'analisi

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — analisi non trovata o non appartenente all'utente

**Successo:** `200 OK` — Ritorna `{ id, documentId, createdAt, complianceResults: [...] }`

---

### Report

Le **rotte dei report** permettono agli utenti di recuperare i report generati in passato.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /reports/:id | Sì | Restituisce il report generato da un'analisi |

---

#### GET /reports/:id

Scarica il report PDF generato in seguito all'analisi di conformità ESG di un documento. Il file viene recuperato da MinIO e restituito come stream. Il report deve appartenere all'utente autenticato.


**Parametri URL:**
- `id` — intero positivo, identificatore del report

**Errori possibili:**
- `400 Bad Request` — id non valido
- `401 Unauthorized` — token mancante o non valido
- `404 Not Found` — report non trovato o non appartenente all'utente

**Successo:** `200 OK` — Ritorna il file PDF con `Content-Type: application/pdf`

---

## Design Pattern Implementati

**Singleton** gestisce la connessione al database garantendo un'unica istanza condivisa lungo tutto il ciclo di vita dell'applicazione.

**Factory** crea oggetti di risposta standardizzati (successo/errore) con HTTP status code e messaggi coerenti in tutti gli endpoint.

**Chain of Responsibility** filtra le richieste attraverso livelli middleware: validazione JWT → verifica ruolo (admin/user) → logica di business → gestione errori.

**Model-View-Controller** gestisce in maniera strutturata le richieste, tramite la divisione degli incarichi tra i vari elementi.

**Data Access Object** fornisce un'astrazione per l'accesso ai dati del database.

## Avvio del Servizio
Requisiti: Docker installato

```bash
$ docker-compose up
```

Il servizio è disponibile sulla porta **3000** tramite cURL o Postman.

## Testing
Importare la collection Postman fornita `postman_collection.json`  e l'environment fornito `postman_environment.json` per eseguire i test predefiniti su tutti gli endpoint. I token JWT sono firmati con chiave RS256.

## Note

### Software Utilizzati

* [Visual Studio Code](https://code.visualstudio.com/) - IDE
* [Docker](https://www.docker.com/) - Gestore di container
* [Postman](https://www.postman.com/) - API Testing Platform

### Tecnologie usate

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguaggio utilizzato per lo sviluppo
- **Express** - Framework web per API REST
- **Sequelize** - ORM per database relazionali
- **PostgreSQL** - Database relazionale
- **JWT (RS256) con jsonwebtoken** - Autenticazione e autorizzazione
- **bcryptjs** - Hashing sicuro delle password
- **dotenv** - Gestione delle variabili d'ambiente
- **multer** - Gestione upload multipart/form-data
- **MinIO (SDK minio)** - Object storage per file e documenti
- **pdf-parse** - Estrazione contenuto dai PDF
- **PDFKit** - Generazione report in formato PDF
- **pg / pg-hstore** - Driver PostgreSQL per Sequelize
- **express-async-errors** - Gestione errori asincroni in Express
- **ts-node-dev** - Ambiente di sviluppo con reload automatico


## Autore
* Dario Tommasi ([Github](https://github.com/zDarius))
* Bargilli Andrea ([Github](https://github.com/Bargi20))
