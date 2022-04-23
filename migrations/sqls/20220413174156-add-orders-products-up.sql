CREATE TABLE IF NOT EXISTS products_orders (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id)ON DELETE CASCADE,
    product_id INTEGER REFERENCES product(id)ON DELETE CASCADE,
    quantity integer
);
 