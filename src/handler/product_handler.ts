import express, { Request, Response } from 'express';
import { product, ProductStore } from '../models/product_model';
import { verifyUserToken } from '../utlis/token_helper';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
	try {
		const product = await store.index();
		res.json(product);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const show = async (req: Request, res: Response) => {
	//chk if param   iss undefined
	if (req.params.id === undefined) {
		res.status(400);
		return res.send('missing or invalid id   price >>');
	}

	try {
		const product = await store.show(Number.parseInt(req.params.id));
		res.json(product);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const create = async (req: Request, res: Response) => {
	const { name, price } = req.body;
	//chk if any req.body  param   is undefined
	if (name === undefined || price === undefined) {
		res.status(400);
		return res.send(
			'Expected name ,price but received >>' + JSON.stringify(req.body)
		);
	}
	try {
		const productData: product = {
			name: name,
			price: price,
		};

		const newProduct = await store.create(productData);

		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const destroy = async (req: Request, res: Response) => {
	//chk if param   iss undefined
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
const update = async (req: Request, res: Response) => {
	const { id, name, price } = req.body;
	//chk if any req.body  param   is undefined
	if (id === undefined || name === undefined || price === undefined) {
		res.status(400);
		return res.send(
			'missing or invalid id , name or price >>' +
				JSON.stringify(req.body)
		);
	}

	const product: product = { id, name, price };
	try {
		const updated = await store.update(product);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${product}`);
	}
};
const productRoutes = (app: express.Application) => {
	app.get('/product', index);
	app.get('/product/:id', show);
	app.post('/product/add', verifyUserToken, create);
	app.delete('/product/del', verifyUserToken, destroy);
	app.put('/product/update', verifyUserToken, update);
};

export default productRoutes;
