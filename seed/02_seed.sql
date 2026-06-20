-- Popolamento della tabella "users" con utenti di esempio, tra cui un admin e due users. Le password sono hashate utilizzando bcrypt. Se un utente con la stessa email esiste già, l'inserimento viene ignorato.

INSERT INTO public.users (email, password, role, "createdAt", "updatedAt") VALUES
('admin@example.com', '$2a$12$yJesm7TPQZQ08Kvb69FSr./nXReZpCgCujVEExSnI916ifV3jrE7y', 'admin', NOW(), NOW()), -- password: Admin+123
('dario@example.com',  '$2a$12$ErM69G4J16h6cA12Mr1kOuZvtPkZrufmH6LOtVhaLb6IU6nd36D8u', 'user',  NOW(), NOW()), -- password: Dario+123
('andrea@example.com', '$2a$12$GC7DWWoNovTD7.dq3vmjrefLPtwacpWtd33qPW7Bc3t9F9uhFmjvC', 'user',  NOW(), NOW())  -- password: Andrea+123
ON CONFLICT (email) DO NOTHING;