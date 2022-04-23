
# API route information

## Orders

|     Endpoint       	| Request Type 	|             Params             	| Token Required 	|                  Usage                  	|
|:------------------:	|:------------:	|:------------------------------:	|:--------------:	|:---------------------------------------:	|
| /order             	|      get     	| no Params Required             	|      TRUE      	| index list of Products made by our user 	|
| /order/:id         	|      get     	| id                             	|      TRUE      	| show order by id                        	|
| /order/add         	|     post     	| user_id, status                	|      TRUE      	| add new order                           	|
| /order/del         	|    delete    	| id                             	|      TRUE      	| delete order by id                      	|
| /order/update      	|     put     	| user_id, status                 	|      TRUE      	| update order                      	|
| /order/add/product 	|     post     	| order_id, product_id, quantity 	|      TRUE      	| add product to user order               	|

## Users
|  Endpoint    | Request Type |                Params                    | Token Required |        Usage        |
|:------------:|:------------:|:----------------------------------------:|:--------------:|:-------------------:|
| /user        |      get     | no Params Required                       |      TRUE      | index list of users |
| /user/:id    |      get     | id                                       |      TRUE      | show user by id     |
| /user/add    |     post     | firstname, lastname, password, email     |      FALSE     | add new user        |
| /user/del    |    delete    | id                                       |      TRUE      | delete user by id   |
| /user/login  |     post     | username, password                       |      FALSE     | login to API        |
| /user/update |      put     | id firstname, lastname, password, email  |      TRUE      | update user         |


## products
|    Endpoint     | Request Type |       Params       | Token Required |         Usage         |
|:---------------:|:------------:|:------------------:|:--------------:|:---------------------:|
| /product        |      get     | no Params Required |      FALSE     | index list of product |
| /product/:id    |      get     | id                 |      FALSE     | show product by id    |
| /product/add    |     post     | name, price        |      TRUE      | add new product       |
| /product/del    |    delete    | id                 |      TRUE      | delete product by id  |
| /product/update |      put     | id, name, price    |      TRUE      | update product        |

# Database schema

## Users
                              Table "users"
  Column   |  Type   | Nullable |              Default
-----------+---------|----------+-----------------------------------
 id        | integer | not null | nextval('users_id_seq'::regclass)
 email     | text    |          |
 firstname | text    |          |
 lastname  | text    |          |
 password  | text    |          |

Indexes:"users_pkey" PRIMARY KEY, btree (id)
        "users_email_key" UNIQUE CONSTRAINT, btree (email)

## Products

                            Table "product"
 Column |  Type   | Nullable |               Default
--------+---------|----------+-------------------------------------
 id     | integer | not null | nextval('product_id_seq'::regclass)
 name   | text    |          |
 price  | integer |          |
 
Indexes: "product_pkey" PRIMARY KEY, btree (id)



## Orders
                             Table "orders"
 Column  |  Type   | Nullable |              Default
---------+---------|----------+------------------------------------
 id      | integer | not null | nextval('orders_id_seq'::regclass)
 user_id | integer | not null |
 status  | text    |          |
Indexes:"orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:"orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
Referenced by:TABLE "products_orders" CONSTRAINT "products_orders_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE



## products_orders
                              Table "products_orders"
   Column   |  Type   | Nullable |                   Default
------------+---------|----------+---------------------------------------------
 id         | integer | not null | nextval('products_orders_id_seq'::regclass)
 order_id   | integer |          |
 product_id | integer |          |
 quantity   | integer |          |

Indexes:
    "products_orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "products_orders_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    "products_orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE

