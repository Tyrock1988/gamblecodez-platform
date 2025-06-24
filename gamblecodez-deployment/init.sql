-- Initialize GambleCodez database
CREATE DATABASE IF NOT EXISTS gamblecodez;
CREATE USER IF NOT EXISTS gamblecodez_user WITH PASSWORD 'secure_password_change_me';
GRANT ALL PRIVILEGES ON DATABASE gamblecodez TO gamblecodez_user;

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";