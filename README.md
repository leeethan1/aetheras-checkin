# Check In API

> Check In application for Aetheras Employees

#### Description
This application allows users to check in and check out, which the server will then update the database accordingly. Users log in through Google and the server determines whether the email associated is an admin. 

#### Instructions
Start a local development server with the following command:

`$ npm run dev`

This will:

- Fire up the server at [localhost:8080](http://localhost:8080)
- Set the `NODE_ENV` variable to `development`
- Watch for changes in the source files allowing the server to reload automatically

#### Deployment

For deployment use, start the server with:

`$ npm run start`


`$ npm run lint:fix`

#### API Docs
All the API is documented with [ReDoc](https://github.com/Rebilly/ReDoc) from an [OpenAPI](https://swagger.io/specification/) document.


#### Security Model

JWT Tokens must be included in Http only secure cookies.  CSRF token included inside the jwt.
- https://security.stackexchange.com/questions/151884/rest-api-authentication-with-jwt-and-csrf-protection-for-spa
- https://stackoverflow.com/questions/11008469/are-json-web-services-vulnerable-to-csrf-attacks


# Postgres Tutorial

This is a small example of how to start a postgres docker container and send commands to it.
```shell
# create a shared docker network named testnet
docker network create testnet

# start a detached postgres container named mydb with default password of 123456
docker run --rm --name mydb --network testnet -p 5432:5432 -e POSTGRES_PASSWORD=123456 -d postgres:11 

# start a interactive container using psql to connect to mydb
docker run -it --rm --network testnet postgres:11 psql -h mydb -U postgres
```


