# Programmazione Avanzata — Document Compliance Checker

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

## Rotte Disponibili

### Autenticazione

Le **rotte di autenticazione** permettono all'utente di registrarsi e di effettuare il login.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `POST` | /auth/register | No | Registra un nuovo utente e restituisce un token JWT |
| `POST` | /auth/login | No | Verifica le credenziali e restituisce un token JWT |

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



### Normative

Le **rotte delle normative** permettono agli utenti di ottenere la lista delle normative e all'admin di poter modificare quest'ultima.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /regulations | Sì | Restituisce la lista di tutte le normative |
| `GET` | /regulations/:id | Sì | Restituisce i dettagli di una singola normativa |
| `POST` | /regulations | Sì (admin) | Aggiunge una nuova normativa al catalogo |
| `PATCH` | /regulations/:id | Sì (admin) | Modifica una normativa esistente |
| `DELETE` | /regulations/:id | Sì (admin) | Elimina una normativa dal catalogo |

### Documenti

Le **rotte dei documenti** permettono agli utenti di ottenere ed inviare nuovi documenti per l'analisi.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /documents | Sì | Restituisce la lista dei documenti dell'utente |
| `GET` | /documents/:id | Sì | Restituisce i dettagli di un singolo documento |
| `POST` | /documents | Sì | Carica i metadati di un nuovo documento |
| `PATCH` | /documents/:id | Sì | Modifica i metadati di un documento esistente |
| `DELETE` | /documents/:id | Sì | Elimina un documento |
| `POST` | /documents/:id/analyze | Sì | Avvia l'analisi di conformità su un documento |

### Analisi

Le **rotte dell'analisi** permettono agli utenti di recuperare le analisi effettuate in passato.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /analyses | Sì | Restituisce la lista di tutte le analisi dell'utente |
| `GET` | /analyses/:id | Sì | Restituisce i dettagli e i risultati di una singola analisi |

### Report

Le **rotte dei report** permettono agli utenti di recuperare i report generati in passato.

| METODO | ROTTA | JWT RICHIESTO | DESCRIZIONE |
|--------|-------|---------------|-------------|
| `GET` | /reports/:id | Sì | Restituisce il report generato da un'analisi |

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

## Autore
* Dario Tommasi ([Github](https://github.com/zDarius))
* Bargilli Andrea ([Github](https://github.com/Bargi20))

