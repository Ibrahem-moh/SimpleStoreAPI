import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const {
	POSTGRES_HOST,
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_TEST_DB,
	POSTGRES_DEV_DB,
	ENV,
	BCRYPT_PASS,
	MY_SALT_NUM,
	TOKEN,
} = process.env;

const currentENV = process.env.ENV?.trim() as string;

let client = new Pool({
	host: POSTGRES_HOST,
	database: POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
});

if (process.env.ENV === 'prod') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
	});
} else if (process.env.ENV === 'test') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_TEST_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
	});
} else if (process.env.ENV === 'dev') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_DEV_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
	});
}
export default client;
