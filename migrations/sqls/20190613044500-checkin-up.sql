/* Replace with your SQL commands */
/*CREATE TABLE employees (id SERIAL PRIMARY KEY, email VARCHAR); */
CREATE TABLE checkin (email VARCHAR NOT NULL, checkdate DATE, checktime TIME);
CREATE TABLE checkout (email VARCHAR NOT NULL, checkdate DATE, checktime TIME);
