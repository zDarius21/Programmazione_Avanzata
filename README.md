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

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| POST | /auth/register | No |
| POST | /auth/login | No |

### Utenti 

Le **rotte relative agli utenti** permettono all'**admin** di effettuare operazioni **CRUD** relativamente alle informazioni degli utenti.

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| GET | /users | Sì (admin) |
| GET | /users/:id | Sì (admin) |
| POST | /users | Sì (admin) |
| PUT | /users/:id | Sì (admin) |
| DELETE | /users/:id | Sì (admin) |

### Normative

Le **rotte delle normative** permettono agli utenti di ottenere la lista delle normative e all'admin di poter modificare quest'ultima.

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| GET | /regulations | Sì |
| GET | /regulations/:id | Sì |
| POST | /regulations | Sì (admin) |
| PUT | /regulations/:id | Sì (admin) |
| DELETE | /regulations/:id | Sì (admin) |

### Documenti

Le **rotte dei documenti** permettono agli utenti di ottenere ed inviare nuovi documenti per l'analisi.

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| GET | /documents | Sì |
| GET | /documents/:id | Sì |
| POST | /documents | Sì |
| PUT | /documents/:id | Sì |
| DELETE | /documents/:id | Sì |
| POST | /documents/:id/analyze | Sì |



### Analisi

Le **rotte dell'analisi** permettono agli utenti di recuperare le analisi effettuate in passato.

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| GET | /analyses | Sì |
| GET | /analyses/:id | Sì |

### Report

Le **rotte dei report** permettono agli utenti di recuperare i report generati in passato.

| METODO | ROTTA | JWT RICHIESTO |
|--------|-------|---------------|
| GET | /reports/:id | Sì |

## Design Pattern Implementati

**Singleton** gestisce la connessione al database garantendo un'unica istanza condivisa lungo tutto il ciclo di vita dell'applicazione.

**Factory** crea oggetti di risposta standardizzati (successo/errore) con HTTP status code e messaggi coerenti in tutti gli endpoint.

**Chain of Responsibility** filtra le richieste attraverso livelli middleware: validazione JWT → verifica ruolo (admin/user) → logica di business → gestione errori.

## Avvio del Servizio
Requisiti: Docker installato

```bash
$ docker-compose up
```

Il servizio è disponibile sulla porta **3000** tramite cURL o Postman.

## Testing
Importare la collection Postman fornita (`postman_collection.json`) per eseguire i test predefiniti su tutti gli endpoint. I token JWT sono firmati con chiave RS256.

## Autore
* Dario Tommasi ([Github](https://github.com/zDarius))
* Bargilli Andrea ([Github](https://github.com/Bargi20))