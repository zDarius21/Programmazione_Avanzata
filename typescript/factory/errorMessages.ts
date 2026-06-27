// Messaggi di errore predefinite da utilizzare nei factory methods
export const ERR_TOKEN_MISSING               = 'Token mancante';
export const ERR_TOKEN_INVALID               = 'Token non valido o scaduto';
export const ERR_FORBIDDEN                   = 'Accesso riservato agli admin';
export const ERR_MISSING_EMAIL_PASSWORD      = 'Email e password obbligatori';
export const ERR_EMAIL_ALREADY_REGISTERED    = 'Email già registrata';
export const ERR_INVALID_CREDENTIALS         = 'Credenziali non valide';
export const ERR_USER_NOT_FOUND              = 'Utente non trovato';
export const ERR_EMAIL_PASSWORD_REQUIRED     = 'Email e password sono obbligatori';
export const ERR_EMAIL_ALREADY_USED          = 'Email già utilizzata';
export const ERR_EMAIL_IN_USE                = 'Email già in uso';
export const ERR_DOCUMENT_NOT_FOUND          = 'Documento non trovato';
export const ERR_TITLE_DESCRIPTION_REQUIRED  = 'title e description sono obbligatori';
export const ERR_DOCUMENT_ALREADY_ANALYZED   = 'Il documento è già stato analizzato';
export const ERR_REGULATION_NOT_FOUND        = 'Normativa non trovata';
export const ERR_REGULATION_FIELDS_REQUIRED  = 'name, description e version sono obbligatori';
export const ERR_REGULATION_ALREADY_EXISTS   = 'Normativa già esistente';
export const ERR_FILE_REQUIRED               = 'Il file PDF è obbligatorio';
export const ERR_FILE_NOT_AVAILABLE          = 'Il file originale non è disponibile per questo documento';
export const ERR_INVALID_FILE_TYPE           = 'Solo file PDF sono accettati';
export const ERR_REPORT_NOT_READY            = 'Il report non è ancora disponibile, eseguire prima l\'analisi del documento';
export const ERR_STORAGE_ERROR               = 'Errore durante l\'operazione sul file storage';
export const ERR_ANALYSIS_NOT_FOUND          = 'Analisi non trovata';
export const ERR_REPORT_NOT_FOUND            = 'Report non trovato';
export const ERR_INSUFFICIENT_TOKENS         = 'Token insufficienti per eseguire l\'analisi';
export const ERR_DATABASE_ERROR              = 'Errore durante l\'operazione sul database';
export const ERR_NOTHING_TO_UPDATE          = 'Non si possono utilizzare valori uguali a quelli presenti';
export const ERR_INVALID_TOKEN_AMOUNT       = 'Il campo tokens deve essere un intero positivo';
export const ERR_TOKEN_CAP_EXCEEDED         = 'La ricarica supera il massimo consentito di 100 token';
export const ERR_VALIDATION                 = 'Dati della richiesta non validi';

// Messaggi di validazione a livello di singolo campo (usati negli schemi Zod)
export const VAL_ID_INVALID                 = 'id deve essere un intero positivo';
export const VAL_EMAIL_INVALID              = 'Email non valida';
export const VAL_PASSWORD_MIN               = 'La password deve avere almeno 8 caratteri';
export const VAL_PASSWORD_REQUIRED          = 'Password obbligatoria';
export const VAL_NOTHING_TO_UPDATE          = 'Specificare almeno un campo da aggiornare';
export const VAL_TOKENS_TYPE                = 'Il campo tokens deve essere un numero';
export const VAL_TOKENS_INT                 = 'Il campo tokens deve essere un intero';
export const VAL_TOKENS_POSITIVE            = 'Il campo tokens deve essere positivo';
export const VAL_TOKENS_MAX                 = 'La ricarica non può superare i 100 token';
export const VAL_TITLE_REQUIRED             = 'Il titolo è obbligatorio';
export const VAL_DESCRIPTION_REQUIRED       = 'La descrizione è obbligatoria';
export const VAL_TITLE_EMPTY                = 'Il titolo non può essere vuoto';
export const VAL_DESCRIPTION_EMPTY          = 'La descrizione non può essere vuota';
export const VAL_NAME_REQUIRED              = 'Il nome è obbligatorio';
export const VAL_VERSION_REQUIRED           = 'La versione è obbligatoria';

