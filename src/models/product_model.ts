import Client from '../utlis/databseconn';

export type product = {
	id?: number
	name: string
	price: number
}

export class ProductStore {
	async index(): Promise<product[]> {
		try {
			const conn = await Client.connect();
			const sql = 'SELECT * FROM product  ';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`cannot get products list${error}`);
		}
	}

	async show(id: number): Promise<product> {
		try {
			const sql = 'SELECT * FROM product WHERE id=($1) ';
			const conn = await Client.connect();

			const result = await conn.query(sql, [id]);

			conn.release();

			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find product ${id}. Error: ${err}`);
		}
	}

	async create(new_product: product): Promise<product> {
		try {
			const sql =
				'INSERT INTO product (name,price) VALUES($1, $2) RETURNING *';

			const conn = await Client.connect();

			const result = await conn.query(sql, [
				new_product.name,
				new_product.price,
			]);

			const re_Product = result.rows[0];

			conn.release();
			return re_Product;
		} catch (error) {
			throw new Error(
				`Could not add new product ${new_product.name}. Error: ${error}`
			);
		}
	}

	async delete(id: number): Promise<product> {
		try {
			const sql = 'DELETE FROM product WHERE id=($1)RETURNING *';

			const conn = await Client.connect();

			const result = await conn.query(sql, [id]);

			const product = result.rows[0];

			conn.release();

			return product;
		} catch (err) {
			throw new Error(`Could not delete product ${id}. Error: ${err}`);
		}
	}

	async update(update_product: product): Promise<product> {
		try {
			const conn = await Client.connect();
			const sql =
				'UPDATE product SET name=($2), price=($3) WHERE id=($1) RETURNING *';
			const result = await conn.query(sql, [
				update_product.id,
				update_product.name,
				update_product.price,
			]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(
				`Could not update product ${update_product.id}, ${error}`
			);
		}
	}
}
