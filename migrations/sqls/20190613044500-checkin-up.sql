/* Replace with your SQL commands */
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE, 
  ip VARCHAR UNIQUE
  );
CREATE TABLE checkin (
  id INTEGER REFERENCES employees(id), 
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checktime TIME,
  ip VARCHAR
  );
CREATE TABLE checkout (
  id INTEGER REFERENCES employees(id), 
  email VARCHAR NOT NULL, 
  checkdate DATE, 
  checktime TIME,
  ip VARCHAR
);
