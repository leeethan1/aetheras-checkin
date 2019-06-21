/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE employees (
  -- id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE
  );
CREATE TABLE checkin (
  table_id SERIAL PRIMARY KEY,
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checkintime TIME
  );
CREATE TABLE checkout (
  table_id SERIAL PRIMARY KEY,
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checkouttime TIME
);

