# Check In API

> Check In API for Aetheras Employees

#### Description
This API allows access to a time and attendance system for keeping track of employee working hours. It also includes administrator tools to edit and manage the associated PostgreSQL database. All logins are managed using Google Single Sign-On.
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


# PostgreSQL Tutorial with Docker

This is a small example of how to start a postgres docker container and send commands to it.
```shell
# create a shared docker network named testnet
docker network create testnet

# start a detached postgres container named mydb with default password of 123456
docker run --rm --name mydb --network testnet -p 5432:5432 -e POSTGRES_PASSWORD=123456 -d postgres:11 

# start a interactive container using psql to connect to mydb
docker run -it --rm --network testnet postgres:11 psql -h mydb -U postgres
```

# Check In Web Client

> Web application for Check In API

#### Description
This webpage interacts with the Check In API to allow emloyees to check in/out and administrators to perform various tasks to manage the database.

#### Instructions
First, start the server with the commands previously listed. Then enter the /checkinweb directory and host the webpage with this command:

`$ npm run start`

This will host the webpage at [localhost:5000](http://localhost:5000)

