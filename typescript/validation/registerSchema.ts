import { z } from 'zod';
import * as V from '../factory/errorMessages';

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()\-_=+[\]{};':",.<>/?\\|`~]/;

export const registerSchema = z.object({
  email: z
    .string({ required_error: V.VAL_EMAIL_REQUIRED })
    .trim()
    .email(V.VAL_EMAIL_INVALID),
  password: z
    .string({ required_error: V.VAL_PASSWORD_REQUIRED })
    .trim()
    .regex(/^\S+$/,           V.VAL_PASSWORD_NO_SPACES)
    .min(8,                   V.VAL_PASSWORD_MIN)
    .regex(/[A-Z]/,           V.VAL_PASSWORD_UPPERCASE)
    .regex(/[a-z]/,           V.VAL_PASSWORD_LOWERCASE)
    .regex(/\d/,              V.VAL_PASSWORD_NUMBER)
    .regex(SPECIAL_CHAR_REGEX, V.VAL_PASSWORD_SPECIAL),
});

export type RegisterInput = z.infer<typeof registerSchema>;
