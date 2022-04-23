# Storefront API Project
how to setup and connect to the database
what ports the backend and database are running on
package installation instructions

## This project using the following:
    NodeJS      for runtime.
    Express     for backend.
    dotenv      for environment 
    Jasmine     for unit testing.
    db-migrate  for database migration.
    PostgreSQL  for relational database.
    Typescript  as  programming language.
    Bcrypt      for password salting and peppering.


## setup and connect to the database

    Using PSQL terminal we can create  databases one for production and one for testing one for development.
    Using PSQL terminal we can do the following:
    ### 
    psql -U username 
    { Enter Password}
  [  CREATE DATABASE test_database_name;        ]   for test
  [  CREATE DATABASE dev_database_name;         ]   for development
  [  CREATE DATABASE production_database_name;  ]   for production


## setup dotenv for environment 
     -inside root directory run>>[ npm install ]   this will install dotenv and db-migrate along all required package dependencies .
       -change .env file variables to match you postgres info user name and password   ,server and  database
            POSTGRES_HOST      =your_host
            POSTGRES_USER      =your_potgres_user_name
            POSTGRES_PASSWORD  =your_postgres_password
            POSTGRES_TEST_DB   =test_database_name
            POSTGRES_DEV_DB    =dev_database_name
            POSTGRES_DB        =production_database_name

    - run >>[ npm run test] to run jasmine test 
    - run >> [npm run dev ]to run development  mode 
    - to run production mode First run [db-migrate  up]
    - run >> [npm run start ]to run production  mode 

## how API works
    - create user [http://localhost:3000/user/add ] its a post  request
      -  example req body data ={"firstname":"test", "lastname":"tested", "email":"tesst@uda.com","password":"pass" }
      -  you will receive user data and a >> Token  
   - lets add some products 
     - http://localhost:3000/product/add [you must add Token to Auth Bearer]  its a post  request
       -  example req body data ={"name":"car", "price":1000}
       -  example req body data ={"name":"phone", "price":100}
       -  example req body data ={"name":"laptop", "price":500}
    -  lets add order to user table 
       -  http://localhost:3000/order/add [you must add Token to Auth Bearer]  its a post  request
       - example req body data ={ "user_id":1, "status":"active"} 
       - you can get users IDs list from http://localhost:3000/user/ [you must add Token to Auth Bearer]
    - lets add products to user order
       - http://localhost:3000/order/add/product [you must add Token to Auth Bearer]
       - example req body data ={"order_id":1, "product_id":1,"quantity":7} 
         - order_id is the order we just created 
         - product_id from product table 
         - you can add other products to user order
       -  you can git products list from http://localhost:3000/product/ [token required]
       -  to check current order http://localhost:3000/order/ [you must add Token to Auth Bearer] its Get request
