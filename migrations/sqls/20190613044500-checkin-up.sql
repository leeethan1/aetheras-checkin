/* Replace with your SQL commands */
CREATE TABLE admins
(
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE
);
CREATE TABLE employees
(
  -- id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR UNIQUE,
  refresh_token VARCHAR
);
CREATE TABLE checkin
(
  table_id SERIAL PRIMARY KEY,
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL,
  checkdate DATE,
  checkintime TIME
);
CREATE TABLE checkout
(
  table_id SERIAL PRIMARY KEY,
  -- id uuid REFERENCES employees(id), 
  id INTEGER REFERENCES employees(id),
  email VARCHAR NOT NULL,
  checkdate DATE,
  checkouttime TIME
);

-- FOR TESTING PURPOSES
INSERT INTO admins
  (id, firstname, lastname, email)
VALUES
  (1, 'Josh', 'Lai', 'c@c.com'),
  (2, 'Ethan', 'Lee', 'lee.ethan168@gmail.com');
SELECT setval('admins_id_seq', (SELECT MAX(id)
  from "admins"));
INSERT INTO employees
  (id, firstname, lastname, email)
VALUES
  (1, 'john', 'doe', 'a@a.com'),
  (2, 'jane', 'doe', 'b@b.com'),
  (3, 'Josh', 'Lai', 'c@c.com'),
  (4, 'Ethan', 'Lee', 'lee.ethan168@gmail.com');
SELECT setval('employees_id_seq', (SELECT MAX(id)
  from "employees"));
INSERT INTO checkin
  (id, email, checkdate, checkintime)
VALUES
  (1, 'a@a.com', '2019-01-01', '01:00'),
  (1, 'a@a.com', '2019-02-01', '02:00'),
  (1, 'a@a.com', '2019-03-01', '03:00'),
  (2, 'b@b.com', '2019-03-01', '04:00'),
  (3, 'c@c.com', '2019-04-01', '05:00'),
  (3, 'c@c.com', '2019-04-03', '06:00'),
  (1, 'a@a.com', '2019-06-14', '10:00');
INSERT INTO checkout
  (id, email, checkdate, checkouttime)
VALUES
  (1, 'a@a.com', '2019-01-01', '01:30'),
  (1, 'a@a.com', '2019-02-01', '02:30'),
  (1, 'a@a.com', '2019-03-01', '03:30'),
  (2, 'b@b.com', '2019-03-01', '04:30'),
  (3, 'c@c.com', '2019-04-01', '05:30'),
  (3, 'c@c.com', '2019-04-03', '06:30'); 
  