/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE employees (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE, 
  password VARCHAR,
  ip VARCHAR UNIQUE
  );
CREATE TABLE checkin (
  id uuid REFERENCES employees(id), 
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checktime TIME,
  ip VARCHAR
  );
CREATE TABLE checkout (
  id uuid REFERENCES employees(id), 
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checktime TIME,
  ip VARCHAR
);
