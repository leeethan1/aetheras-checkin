/* Replace with your SQL commands */
CREATE TABLE employees (id SERIAL PRIMARY KEY, email VARCHAR UNIQUE);
CREATE TABLE checkin (id INTEGER REFERENCES employees(id), email VARCHAR NOT NULL, checkdate DATE, checktime TIME);
CREATE TABLE checkout (id INTEGER REFERENCES employees(id), email VARCHAR NOT NULL, checkdate DATE, checktime TIME);
