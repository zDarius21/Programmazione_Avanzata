// Import dei messaggi di errore predefiniti
import * as ErrorMessages from './errorMessages';

// Interfaccia delle classi "error"
interface ErrorObj {
  getErrorObj(): { status: number; message: string };
}

// Classi per errori di Login e Registrazione
class MissingEmailPassword implements ErrorObj {
  getErrorObj() { return { status: 400, message: ErrorMessages.ERR_MISSING_EMAIL_PASSWORD }; }
}
class EmailAlreadyRegistered implements ErrorObj {
  getErrorObj() { return { status: 409, message: ErrorMessages.ERR_EMAIL_ALREADY_REGISTERED }; }
}
class InvalidCredentials implements ErrorObj {
  getErrorObj() { return { status: 401, message: ErrorMessages.ERR_INVALID_CREDENTIALS }; }
}

// Classi per errori relativi alle operazioni CRUD sugli utenti
class UserNotFound implements ErrorObj {
  getErrorObj() { return { status: 404, message: ErrorMessages.ERR_USER_NOT_FOUND }; }
}
class EmailPasswordRequired implements ErrorObj {
  getErrorObj() { return { status: 400, message: ErrorMessages.ERR_EMAIL_PASSWORD_REQUIRED }; }
}
class EmailAlreadyUsed implements ErrorObj {
  getErrorObj() { return { status: 409, message: ErrorMessages.ERR_EMAIL_ALREADY_USED }; }
}
class EmailInUse implements ErrorObj {
  getErrorObj() { return { status: 409, message: ErrorMessages.ERR_EMAIL_IN_USE }; }
}

// Classi per errori relativi alle operazioni CRUD sui documenti
class DocumentNotFound implements ErrorObj {
  getErrorObj() { return { status: 404, message: ErrorMessages.ERR_DOCUMENT_NOT_FOUND }; }
}
class TitleDescriptionRequired implements ErrorObj {
  getErrorObj() { return { status: 400, message: ErrorMessages.ERR_TITLE_DESCRIPTION_REQUIRED }; }
}
class DocumentAlreadyAnalyzed implements ErrorObj {
  getErrorObj() { return { status: 409, message: ErrorMessages.ERR_DOCUMENT_ALREADY_ANALYZED }; }
}

// Classi per errori relativi alle operazioni CRUD sulle normative
class RegulationNotFound implements ErrorObj {
  getErrorObj() { return { status: 404, message: ErrorMessages.ERR_REGULATION_NOT_FOUND }; }
}
class RegulationFieldsRequired implements ErrorObj {
  getErrorObj() { return { status: 400, message: ErrorMessages.ERR_REGULATION_FIELDS_REQUIRED }; }
}
class RegulationAlreadyExists implements ErrorObj {
  getErrorObj() { return { status: 409, message: ErrorMessages.ERR_REGULATION_ALREADY_EXISTS }; }
}

// Enum con tutti i tipi di errore 
export enum ErrorEnum {
  MissingEmailPassword     = 'MissingEmailPassword',
  EmailAlreadyRegistered   = 'EmailAlreadyRegistered',
  InvalidCredentials       = 'InvalidCredentials',
  UserNotFound             = 'UserNotFound',
  EmailPasswordRequired    = 'EmailPasswordRequired',
  EmailAlreadyUsed         = 'EmailAlreadyUsed',
  EmailInUse               = 'EmailInUse',
  DocumentNotFound         = 'DocumentNotFound',
  TitleDescriptionRequired = 'TitleDescriptionRequired',
  DocumentAlreadyAnalyzed  = 'DocumentAlreadyAnalyzed',
  RegulationNotFound       = 'RegulationNotFound',
  RegulationFieldsRequired = 'RegulationFieldsRequired',
  RegulationAlreadyExists  = 'RegulationAlreadyExists',
}

// Funzione che riceve il tipo di enum di errore e restituisce l'istanza della classe corrispondente
export function getError(type: ErrorEnum): ErrorObj {
  switch (type) {
    case ErrorEnum.MissingEmailPassword:     return new MissingEmailPassword();
    case ErrorEnum.EmailAlreadyRegistered:   return new EmailAlreadyRegistered();
    case ErrorEnum.InvalidCredentials:       return new InvalidCredentials();
    case ErrorEnum.UserNotFound:             return new UserNotFound();
    case ErrorEnum.EmailPasswordRequired:    return new EmailPasswordRequired();
    case ErrorEnum.EmailAlreadyUsed:         return new EmailAlreadyUsed();
    case ErrorEnum.EmailInUse:               return new EmailInUse();
    case ErrorEnum.DocumentNotFound:         return new DocumentNotFound();
    case ErrorEnum.TitleDescriptionRequired: return new TitleDescriptionRequired();
    case ErrorEnum.DocumentAlreadyAnalyzed:  return new DocumentAlreadyAnalyzed();
    case ErrorEnum.RegulationNotFound:       return new RegulationNotFound();
    case ErrorEnum.RegulationFieldsRequired: return new RegulationFieldsRequired();
    case ErrorEnum.RegulationAlreadyExists:  return new RegulationAlreadyExists();
  }
}
