import express, { Request, Response } from 'express';
import { user, userStore } from '../models/user_model';
import bcrypt from 'bcrypt';
import Client from '../utlis/databseconn';
import { generateUserToken, verifyUserToken } from '../utlis/token_helper';
import {
	validationChain_Login,
	validationChain_create,
	validateRequestData,
} from '../middleware/error_handler/validate_request';
const store = new userStore();

const index = async (_req: Request, res: Response) => {
	const user = await store.index();
	res.json(user);
};

const show = async (req: Request, res: Response) => {
	//chk if param   iss undefined
	if (req.params.id === undefined) {
		return res.send(
			'missing or invalid id , name or price >>' +
				JSON.stringify(req.body)
		);
	}

	const user = await store.show(Number.parseInt(req.params.id));
	res.json(user);
};

const create = async (req: Request, res: Response) => {
	const { firstname, lastname, password, email } = req.body;
	//chk if any req.body  param   is undefined
	if (
		firstname === undefined ||
		lastname === undefined ||
		password === undefined ||
		email === undefined
	) {
		res.status(400);
		return res.send(
			'missing or invalid id , name or price >>' +
				JSON.stringify(req.body)
		);
	}
	try {
		const myNewUser: user = {
			firstname: firstname,
			lastname: lastname,
			password: password,
			email: email,
		};
		generateUserToken(myNewUser.firstname);
		const user: user = {
			firstname: firstname,
			lastname: lastname,
			email: email,
		} as user;

		res.json({
			token: generateUserToken(myNewUser.firstname),
			user,
		});
	} catch (err) {
		res.status(400).send(err);
	}
};

const destroy = async (req: Request, res: Response) => {
	//chk if param is undefined
	if (req.query.id === undefined) {
		res.status(400);
		return res.send('missing or invalid id   price >>');
	}

	const id: number = parseInt(req.query.id as string);

	try {
		const deleted = await store.delete(id);
		res.json(deleted);
	} catch (err) {
		res.status(400).send(err);
	}
};
const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const pepper: string = process.env.BCRYPT_PASS as string;

	//chk if any req.body  param   is undefined
	if (username === undefined || password === undefined) {
		res.status(400);
		return res.send(
			'missing or invalid id , name or price >>' +
				JSON.stringify(req.body)
		);
	}

	try {
		const conn = await Client.connect();
		const sql = 'SELECT password FROM users WHERE firstname=($1)';
		const result = await conn.query(sql, [username]);

		const user = result.rows[0];

		if (bcrypt.compareSync(password + pepper, user.password)) {
			return res.status(200).json({ token: generateUserToken(username) });
		} else {
			res.status(401);
			res.json('Access denied, invalid password or username');
		}
	} catch (error) {
		res.status(401);
		res.json(`Access denied, ${JSON.stringify(error)}`);
	}
};
const update = async (req: Request, res: Response) => {
	const { id, firstname, lastname, email, password } = req.body;
	//chk if any req.body param is undefined

	if (
		id === undefined ||
		firstname === undefined ||
		lastname === undefined ||
		email === undefined ||
		password === undefined
	) {
		res.status(400);
		return res.send(
			'missing or invalid id , name or price >>' +
				JSON.stringify(req.body)
		);
	}

	const updatedUser: user = {
		id,
		firstname,
		lastname,
		password,
		email,
	};

	try {
		const updated = await store.update(updatedUser);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${updatedUser}`);
	}
};

const userRoutes = (app: express.Application) => {
	app.get('/user', verifyUserToken, index);
	app.get('/user/:id', verifyUserToken, show);
	app.post('/user/add', validationChain_create, validateRequestData, create);
	app.delete('/user/del', verifyUserToken, destroy);
	app.post('/user/login', validationChain_Login, validateRequestData, login);
	app.put('/user/update', verifyUserToken, update);
};

export default userRoutes;
