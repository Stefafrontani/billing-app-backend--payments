# billing-app-backend : payments microservice

## Project description
Repository for payments microservice

## Branch Naming

Same as billing-app/README.md

## Running server

### Local - No docker

Follow these steps

1- Download postgres
2- Install it
3- Initialize the postgres server
  
  $ pg_ctl -D 'C:/Program Files/PostgreSQL/13/data' start
    -D: set the directory of the PGDATA file

4- Create billing user

  $ npm run create-user (place the password you put in the installaion process)
  
It is created with a superuser called postgres. If you dont have it, you should create id. The password is the one you set. Not password in this case

5- Change password

  $ npm run change-password

This will alter the password of the previously created role to 'password'. It will used the postgres role mentioned in item (4). You should used the same password used in that item

6- Create the database

  $ npm run create-db

Enter billinguser password

7- Run migrations

  $ npm run migrate-up

8- Initialize the server
 
  Inside _./src_

  $ npm run start

### With docker :: TODO

When trying to run server and db, we have to make the connect between each other. For this, we have to do some specific stuff:
- override the POSTGRES_HOST environment variable so that the .env file ignore the "localhost" value.That variable works only when server and database are being host on the same host, when running in your local machine.
- create a network and use it when running both containers: server and db

Long story short, follow the steps:

1- Build the image

  Inside _./src_
  
  $ docker build --no-cache -t payments .

2- Create network

  $ docker network create payments-paymentsdb

3- Run the server with the image on (1) and the network on (2)

  $ docker run `
    --name payments `
    -it `
    -p 4000:4000 `
    -v ${PWD}/src:/payments/src/ `
    -e POSTGRES_HOST=paymentsdb `
    -e DATABASE_URL=postgres://billinguser:password@paymentsdb:5432/paymentsdb `
    --network payments-paymentsdb `
    payments

-v ${PWD}/src:/payments/src/: Enables hotreload. Creates a volume so the source code is copy to the container from the host whenever it changes.

-e POSTGRES_HOST=paymentsdb: this line overrides the .env POSTGRES_HOST value

--network payments-paymentsdb: this line uses the network created before

4- Run PG container with same credentials set on backend container inside the .env file
  
  $ docker run `
    --name paymentsdb `
    -d `
    -p 5432:5432 `
    -v ${PWD}/src/database/data:/var/lib/postgresql/data/ `
    -e POSTGRES_USER=billinguser `
    -e POSTGRES_DB=paymentsdb `
    -e POSTGRES_PASSWORD=password `
    --network payments-paymentsdb `
    postgres:alpine


-e POSTGRES_USER=billinguser -e POSTGRES_DB=paymentsdb -e POSTGRES_PASSWORD=password: this line set some variable needed in order to use the postgres image. The values o f those variables must match the values inside the .env files

--network payments-paymentsdb: this line uses the network created before

5- Enter to the service container

  $ docker exec -it payments sh

6- Create migrations inside

  $ npm run migrate-up

(Optional)

7- Enter the database run in container

  $ docker exec -it babedb bash
  # psql -U billinguser -d paymentsdb -p 5432

8- Insert the query on
  \src
    \database
      \querysExamples
        - 1-insert-payments.sql
