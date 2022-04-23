import express, { Request, Response } from 'express';
import { order, orderStore } from '../models/order_model';

import { verifyUserToken } from '../utlis/token_helper';
const store = new orderStore();

const index = async (_req: Request, res: Response) => {
	try {
		const order = await store.index();
		res.json(order);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const show = async (req: Request, res: Response) => {
	if (req.params.id === undefined) {
		res.status(400);
		return res.send('missing or invalid id ');
	}
	try {
		const order = await store.show(parseInt(req.params.id));
		res.json(order);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const create = async (req: Request, res: Response) => {
	const { user_id: user_id, status } = req.body;
	//chk if any req.body  param   is undefined
	if (user_id === undefined || status === undefined) {
		res.status(400);
		return res.send(
			'error expect user_id, status received  >>' +
				JSON.stringify(req.body)
		);
	}
	try {
		const myNeworder: order = {
			user_id: req.body.user_id,
			status: req.body.status,
		};

		const neworder = await store.create(myNeworder);
		res.json({ msg: 'order created', order: neworder });
	} catch (err) {
		res.json();
	}
};

const destroy = async (req: Request, res: Response) => {
	//chk if param   iss undefined
	if (req.query.id === undefined) {
		res.status(400);
		return res.send('missing or invalid id >>');
	}
	const id: number = parseInt(req.query.id as string);

	try {
		const deleted = await store.delete(id);
		res.json(deleted);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};
const update = async (req: Request, res: Response) => {
	const { id, user_id, status } = req.body;
	if (user_id === undefined || status === undefined || id === undefined) {
		res.status(400);
		return res.send(
			'missing or invalid id . expected user_id, status but got >>' +
				JSON.stringify(req.body)
		);
	}

	const myOrder: order = { id, user_id: user_id, status };
	try {
		const updated = await store.updateOrder(myOrder);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${myOrder}`);
	}
};

const addProductOrder = async (req: Request, res: Response) => {
	const { order_id, product_id, quantity } = req.body;

	if (
		order_id === undefined ||
		product_id === undefined ||
		quantity === undefined
	) {
		res.status(400);
		return res.send(
			`Invalid param expected order_id, product_id, quantity but got${JSON.stringify(
				req.body
			)} `
		);
	}

	try {
		const addProduct = await store.addProductOrder(
			order_id,
			product_id,
			quantity
		);
		res.json(addProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};
const orderRoutes = (app: express.Application) => {
	//TODO remember to  uncomment  to apply verifyUserToken
	app.get('/order', verifyUserToken, index);
	app.get('/order/:id', verifyUserToken, show);
	app.post('/order/add', verifyUserToken, create);
	app.delete('/order/del', verifyUserToken, destroy);
	app.put('/order/update', verifyUserToken, update);
	app.post('/order/add/product', verifyUserToken, addProductOrder);

	// app.get('/order', index)
	// app.get('/order/:id', show)
	// app.post('/order/add', create)
	// app.delete('/order/del', destroy)
	// app.put('/order/update', update)
	//app.post('/order/add/product', addProductOrder)
};

export default orderRoutes;
