import Client from '../utlis/databseconn';
import bcrypt from 'bcrypt';
export type user = {
	id?: number
	email: string
	firstname: string
	lastname: string
	password: string
}

export class userStore {
	async index(): Promise<user[]> {
		try {
			const conn = await Client.connect();
			const sql = 'SELECT  id, firstname, lastname,email  FROM users';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`cannot get users list ${error}`);
		}
	}

	async show(user_id: number): Promise<user> {
		try {
			const sql = 'SELECT * FROM users WHERE id=($1)  ';
			const conn = await Client.connect();

			const result = await conn.query(sql, [user_id]);

			conn.release();
			// remove password from returned data
			const { id, firstname, lastname, email } = result.rows[0];

			return { id, firstname, lastname, email } as user;
		} catch (err) {
			throw new Error(`Could not find user ${user_id}. Error: ${err}`);
		}
	}

	async create(new_user: user): Promise<user> {
		try {
			const sql =
				'INSERT INTO users (firstname,lastname,email,password) VALUES($1, $2, $3,$4 ) RETURNING id, firstname, lastname,email ';

			const conn = await Client.connect();

			const result = await conn.query(sql, [
				new_user.firstname,
				new_user.lastname,
				new_user.email,
				hashUserPassword(new_user.password),
			]);

			const re_user = result.rows[0];
			conn.release();

			return re_user;
		} catch (error) {
			throw new Error(
				`Could not create user ${new_user.email}   Error: ${error}`
			);
		}
	}
	async update(updae_user: user): Promise<user> {
		try {
			const connection = await Client.connect();

			const sql = `UPDATE users
			          SET firstname=$2, lastname=$3, email=$4,  password=$5
			          WHERE id=$1
			          RETURNING id,  firstname, lastname ,email `;

			const result = await connection.query(sql, [
				updae_user.id,
				updae_user.firstname,
				updae_user.lastname,
				updae_user.email,
				hashUserPassword(updae_user.password as string),
			]);

			connection.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(
				`Could not update user ${updae_user.id}. Error: ${error}`
			);
		}
	}
	async delete(id: number): Promise<user> {
		try {
			const sql =
				'DELETE FROM users WHERE id=($1)  RETURNING  id, firstname, lastname,email';
			const conn = await Client.connect();

			const result = await conn.query(sql, [id]);

			const product = result.rows[0];

			conn.release();

			return product;
		} catch (error) {
			throw new Error(`Could not delete user ${id}. Error: ${error}`);
		}
	}
}
const hashUserPassword = (password: string): string => {
	const hashedPassword = bcrypt.hashSync(
		password + process.env.BCRYPT_PASS,
		parseInt(process.env.MY_SALT_NUM as string)
	);
	return hashedPassword;
};
