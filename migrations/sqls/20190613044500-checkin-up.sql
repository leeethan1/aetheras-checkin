/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE employees (
  -- id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE,
  ip VARCHAR UNIQUE
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

-- FOR TESTING PURPOSES
INSERT INTO employees (id, email) VALUES 
(1, 'a@a.com'), 
(2, 'b@b.com'), 
(3, 'c@c.com');
INSERT INTO checkin (id, email, checkdate, checkintime) VALUES 
(1, 'a@a.com', '2019-01-01', '01:00'),
(1, 'a@a.com', '2019-02-01', '02:00'),
(1, 'a@a.com', '2019-03-01', '03:00'),
(2, 'b@b.com', '2019-03-01', '03:00');
INSERT INTO checkout (email, checkdate, checkouttime) VALUES 
(1, 'a@a.com', '2019-01-01', '01:30'),
(1, 'a@a.com', '2019-02-01', '02:30'),
(1, 'a@a.com', '2019-03-01', '03:30');
(2, 'b@b.com', '2019-03-01', '03:30');