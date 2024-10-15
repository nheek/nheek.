CREATE TABLE IF NOT EXISTS "ContactForm" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(100),
    message TEXT
);
