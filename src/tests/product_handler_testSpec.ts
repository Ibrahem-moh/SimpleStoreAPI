import { product, ProductStore } from '../models/product_model';
import supertest from 'supertest';
import app from '../server';
import { user } from '../models/user_model';
const productStore = new ProductStore();

const testproductForEndPoint: product = {
	name: 'testproductname',
	price: 250,
};
// user model test
const request = supertest(app);

let myToken = '';

beforeAll(async () => {
	const tempo = await productStore.create(testproductForEndPoint);
	testproductForEndPoint.id = tempo.id;
	const res = await request
		.post('/user/add')
		.set('Content-type', 'application/json')

		.send({
			firstname: 'testUserForProducthHandler',
			lastname: 'testUserForProducthHandler',
			email: 'test@testUserForProducthHandler.com',
			password: 'testUserForProducthHandler',
		} as user);
	myToken = res.body.token;
});

describe('Prodect EndPoint :: ', () => {
	//test product index method
	it('Test /product .. index  should return list of products ', async () => {
		const res = await request
			.get('/product')
			.set('Content-type', 'application/json');

		expect(res.status).toBe(200);

		expect(res.body).toContain(
			jasmine.objectContaining({
				name: testproductForEndPoint.name,
				price: testproductForEndPoint.price,
			})
		);
	});

	it('Test product/id .. show  should return one product only ', async () => {
		const res = await request
			.get(`/product/${testproductForEndPoint.id}`)
			.set('Content-type', 'application/json');

		expect(res.status).toBe(200);
		expect(res.body.name).toBe(testproductForEndPoint.name);
		expect(res.body.price).toBe(testproductForEndPoint.price);
	});

	it('Test /product/update with valid token', async () => {
		const res = await request
			.put('/product/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)
			.send({
				id: testproductForEndPoint.id,
				name: 'updateProdcutName',
				price: 500,
			} as product);

		expect(res.status).toBe(200);
		expect(res.body.name).toBe('updateProdcutName');
		expect(res.body.price).toBe(500);
	});
	it('Test /user/product with invalid token', async () => {
		const res = await request
			.put('/product/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invalid token'}`)
			.send({
				id: testproductForEndPoint.id,
				name: 'updateProdcutName',
				price: 500,
			} as product);
		expect(res.status).toBe(401);
	});
	it('Test /product/del with valid token', async () => {
		const res = await request
			.delete(`/product/del?id=${testproductForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`);

		expect(res.status).toBe(200);
		expect(res.body.name).toBe('updateProdcutName');
		expect(res.body.price).toBe(500);
	});
});
