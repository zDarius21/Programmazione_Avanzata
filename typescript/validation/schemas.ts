import { z } from 'zod';
import * as Messages from '../factory/errorMessages';
import { Role } from '../enums/role';

/**
 * Schemi di validazione Zod per body e params delle richieste.
 * Vengono applicati nelle rotte tramite il middleware `validate`.
 * La validazione di shape/tipo degli input vive qui, mentre i controlli
 * di business (esistenza risorsa, unicità email, cap token) restano nei controller.
 * I messaggi sono centralizzati in factory/errorMessages.ts (costanti VAL_*).
 */

// Param :id riutilizzabile: deve essere un intero positivo espresso come stringa
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, Messages.VAL_ID_INVALID),
});

// Email valida e password con lunghezza minima ragionevole
const email = z.string().email(Messages.VAL_EMAIL_INVALID);
const password = z.string().min(8, Messages.VAL_PASSWORD_MIN);

/* ----------------------------- AUTH ----------------------------- */

// In fase di login non imponiamo la lunghezza minima: serve solo a confrontare
// con la password già salvata, eventualmente creata con regole precedenti.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, Messages.VAL_PASSWORD_REQUIRED),
});

export const registerSchema = z.object({
  email,
  password,
});

// Aggiornamento profilo: almeno uno tra email e password deve essere presente
export const updateMeSchema = z
  .object({
    email: email.optional(),
    password: password.optional(),
  })
  .refine((d) => d.email !== undefined || d.password !== undefined, {
    message: Messages.VAL_NOTHING_TO_UPDATE,
  });

/* ----------------------------- USERS (admin) ----------------------------- */

export const createUserSchema = z.object({
  email,
  password,
});

export const updateUserSchema = z
  .object({
    email: email.optional(),
    password: password.optional(),
    role: z.nativeEnum(Role).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: Messages.VAL_NOTHING_TO_UPDATE,
  });

// Ricarica token: accetta anche stringhe numeriche e le converte in numero
export const rechargeTokensSchema = z.object({
  tokens: z.coerce
    .number({ invalid_type_error: Messages.VAL_TOKENS_TYPE })
    .int(Messages.VAL_TOKENS_INT)
    .positive(Messages.VAL_TOKENS_POSITIVE)
    .max(100, Messages.VAL_TOKENS_MAX),
});

/* ----------------------------- DOCUMENTS ----------------------------- */

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1, Messages.VAL_TITLE_REQUIRED),
  description: z.string().trim().min(1, Messages.VAL_DESCRIPTION_REQUIRED),
});

export const updateDocumentSchema = z
  .object({
    title: z.string().trim().min(1, Messages.VAL_TITLE_EMPTY).optional(),
    description: z.string().trim().min(1, Messages.VAL_DESCRIPTION_EMPTY).optional(),
  })
  .refine((d) => d.title !== undefined || d.description !== undefined, {
    message: Messages.VAL_NOTHING_TO_UPDATE,
  });

/* ----------------------------- REGULATIONS ----------------------------- */

// La description è opzionale: può arrivare dal testo estratto dal PDF allegato.
// Il controller verifica che, dopo l'eventuale estrazione, sia comunque presente.
export const createRegulationSchema = z.object({
  name: z.string().trim().min(1, Messages.VAL_NAME_REQUIRED),
  version: z.string().trim().min(1, Messages.VAL_VERSION_REQUIRED),
  description: z.string().trim().min(1).optional(),
});

export const updateRegulationSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    version: z.string().trim().min(1).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: Messages.VAL_NOTHING_TO_UPDATE,
  });
