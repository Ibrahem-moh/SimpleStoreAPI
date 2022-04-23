import { product, ProductStore } from '../models/product_model';

const store = new ProductStore();
const testproduct: product = {
	name: 'testproductname',
	price: 333,
};
beforeAll(async () => {
	const tempo = await store.create(testproduct);
	testproduct.id = tempo.id;
});
describe('Product Store Model', () => {
	it('create user Store method should add a product', async () => {
		const addedProdect = await store.create({
			name: testproduct.name,
			price: testproduct.price,
		});
		expect(addedProdect).toEqual({
			id: addedProdect.id,
			name: testproduct.name,
			price: testproduct.price,
		});
	});

	it('index user Store method should return a list of products', async () => {
		const result = await store.index();
		expect(result).toContain(jasmine.objectContaining(testproduct));
	});

	it('show user Store method should return the correct product', async () => {
		const result = await store.show(testproduct.id as number);
		expect(result).toEqual({
			id: testproduct.id,
			name: testproduct.name,
			price: testproduct.price,
		});
	});
	it('update Store user Store method should update  product ', async () => {
		testproduct.name = 'testproductupdatedname';
		testproduct.price = 707;
		const result = await store.update(testproduct);

		expect(result).toEqual({
			id: testproduct.id,
			name: 'testproductupdatedname',
			price: 707,
		} as product);
	});

	it('delete user Store method should remove the product', async () => {
		const result = await store.delete(testproduct.id as number);

		expect(result.id).toEqual(testproduct.id);
	});
});
