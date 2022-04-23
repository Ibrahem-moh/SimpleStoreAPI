import { order, orderStore } from '../models/order_model';
import supertest from 'supertest';
import app from '../server';
import { user } from '../models/user_model';
import { product, ProductStore } from '../models/product_model';

const Store = new orderStore();
const testOrderForEndPoint: order = {
	status: 'test_status',
	user_id: 1,
};
const TestProdcutOrderHandler: product = {
	name: 'testproductname',
	price: 250,
};
const request = supertest(app);

let myToken = '';

describe('order EndPoint :: ', () => {
	beforeAll(async () => {
		const productSTORE = new ProductStore();

		const tempoProduct = await productSTORE.create(TestProdcutOrderHandler);
		TestProdcutOrderHandler.id = tempoProduct.id;
		const tempo = await Store.create(testOrderForEndPoint);
		testOrderForEndPoint.id = tempo.id;
		const res = await request
			.post('/user/add')
			.set('Content-type', 'application/json')

			.send({
				firstname: 'testUserFororderhHandler',
				lastname: 'testUserFororderhHandler',
				email: 'test@testUserFororderhHandler.com',
				password: 'testUserFororderhHandler',
			} as user);
		myToken = res.body.token;
	});

	//test order index method
	it('Test /order .. index  should return list of orders ', async () => {
		const res = await request
			.get('/order')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`);
		expect(res.status).toBe(200);

		expect(res.body).toContain(
			jasmine.objectContaining({
				status: testOrderForEndPoint.status,
				user_id: testOrderForEndPoint.user_id,
			})
		);
	});

	it('Test order/id .. show  should return one order only ', async () => {
		const res = await request
			.get(`/order/${testOrderForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`);

		expect(res.status).toBe(200);
		expect(res.body.status).toBe(testOrderForEndPoint.status);
		expect(res.body.user_id).toBe(testOrderForEndPoint.user_id);
	});

	it('Test /order/update with valid token', async () => {
		const res = await request
			.put('/order/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)
			.send({
				id: testOrderForEndPoint.id,
				status: 'Active',
				user_id: 1,
			} as order);

		expect(res.status).toBe(200);
		expect(res.body.status).toBe('Active');
		expect(res.body.user_id).toBe(testOrderForEndPoint.id);
	});
	it('Test /user/order with invalid token', async () => {
		const res = await request
			.put('/order/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invalid token'}`)
			.send({
				id: testOrderForEndPoint.id,
				status: 'Active',
				user_id: 1,
			} as order);
		expect(res.status).toBe(401);
	});
	//	app.post('/order/add/product', verifyUserToken, addProductOrder)
	it('Test /order/add/product with valid token', async () => {
		const res = await request
			.post('/order/add/product')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)
			.send({
				order_id: testOrderForEndPoint.id as number,
				product_id: TestProdcutOrderHandler.id,
				quantity: 50,
			});

		expect(res.status).toBe(200);
		expect(res.body.order_id).toBe(testOrderForEndPoint.id);
		expect(res.body.product_id).toBe(TestProdcutOrderHandler.id);
		expect(res.body.quantity).toBe(50);
	});

	it('Test /order/del with valid token', async () => {
		const res = await request
			.delete(`/order/del?id=${testOrderForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`);

		expect(res.status).toBe(200);
		expect(res.body.status).toBe('Active');
		expect(res.body.user_id).toBe(testOrderForEndPoint.user_id);
	});
	it('Test /order/del with invalid token', async () => {
		const res = await request
			.delete(`/order/del?id=${testOrderForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invalid token'}`);

		expect(res.status).toBe(401);
	});
});
