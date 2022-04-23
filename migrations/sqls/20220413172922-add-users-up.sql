 
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email text UNIQUE,
    firstName text,
    lastName text,
    password text
);
  