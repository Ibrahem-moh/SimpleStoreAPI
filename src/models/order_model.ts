import client from '../utlis/databseconn';
export type order = {
	id?: number
	status: string
	user_id: number
}

export class orderStore {
	async index(): Promise<order[]> {
		try {
			const conn = await client.connect();
			const sql2 = `SELECT orders.*,
			array_agg(row_to_json(products_orders)) AS product
			FROM orders
			FULL JOIN products_orders ON orders.id = products_orders.order_id
			GROUP BY orders.id`;

			const sql = `SELECT *    
			FROM products_orders    
			FULL  JOIN orders    
			ON products_orders.order_id = orders.id 
			GROUP BY orders.id;`;
			const result = await conn.query(sql2);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`Could not get orders, ${error}`);
		}
	}

	async show(id: number): Promise<order> {
		try {
			const sql = 'SELECT * FROM orders WHERE id=($1)';

			const conn = await client.connect();

			const result = await conn.query(sql, [id]);

			conn.release();

			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not get order ${id}. Error: ${error}`);
		}
	}

	async create(new_Order: order): Promise<order> {
		try {
			const sql =
				'INSERT INTO orders (user_id,status) VALUES($1, $2 ) RETURNING *';

			const conn = await client.connect();

			const result = await conn.query(sql, [
				new_Order.user_id,
				new_Order.status,
			]);

			const re_order = result.rows[0];

			conn.release();

			return re_order;
		} catch (error) {
			throw new Error(
				`Could not create order ${new_Order.id}. Error: ${error}`
			);
		}
	}
	async updateOrder(update_Order: order): Promise<order> {
		try {
			const connection = await client.connect();
			const sql =
				'UPDATE orders SET user_id=($2), status=($3) WHERE id=($1) RETURNING *';

			const result = await connection.query(sql, [
				update_Order.id,
				update_Order.user_id,
				update_Order.status,
			]);
			connection.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(
				`Could not update order ${update_Order.id}. Error: ${error}`
			);
		}
	}

	async addProductOrder(
		order_id: number,
		product_id: number,
		quantity: number
	): Promise<order> {
		try {
			const conn = await client.connect();

			const sql =
				'INSERT INTO products_orders ( order_id, product_id,quantity) VALUES($1, $2, $3) RETURNING *';
			const result = await conn.query(sql, [
				order_id,
				product_id,
				quantity,
			]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(
				`Could not add to products_orders ${product_id}   order ${order_id}: ${error}`
			);
		}
	}
	async delete(id: number): Promise<order> {
		try {
			const sql = 'DELETE FROM orders WHERE id=($1) RETURNING * ';
			const conn = await client.connect();

			const result = await conn.query(sql, [id]);

			const order = result.rows[0];

			conn.release();

			return order;
		} catch (error) {
			throw new Error(`Could not delete order ${id}. Error: ${error}`);
		}
	}
}
