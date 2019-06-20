/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE employees (
  -- id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE,
  ip VARCHAR
  );
CREATE TABLE checkin (
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checkintime TIME,
  ip VARCHAR
  );
CREATE TABLE checkout (
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checkouttime TIME,
  ip VARCHAR
);

