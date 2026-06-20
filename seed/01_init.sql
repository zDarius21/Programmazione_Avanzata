-- Crea il tipo ENUM per il ruolo. Le scelte sono 'user' e 'admin'. 
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
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