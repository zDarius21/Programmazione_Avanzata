-- Crea il tipo ENUM per il ruolo. Le scelte sono 'user' e 'admin'.
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Crea il tipo ENUM per lo stato di un documento.
DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('pending', 'analyzed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Crea la tabella users se non è stata creata in precedenza, impostando come ruolo predefinito 'user' e aggiungendo i timestamp di creazione e aggiornamento al momento in cui viene eseguita l'istruzione.
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        user_role     NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Crea la tabella regulations per le normative ESG supportate dalla piattaforma.
CREATE TABLE IF NOT EXISTS regulations (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL UNIQUE,
  description   TEXT          NOT NULL,
  version       VARCHAR(255)  NOT NULL,
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Crea la tabella documents per i documenti caricati dagli utenti da analizzare.
CREATE TABLE IF NOT EXISTS documents (
  id            SERIAL PRIMARY KEY,
  "userId"      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(255)  NOT NULL,
  description   TEXT          NOT NULL,
  status        document_status NOT NULL DEFAULT 'pending',
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);