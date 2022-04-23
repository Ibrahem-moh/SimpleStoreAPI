import { order, orderStore } from '../models/order_model';
import { user, userStore } from '../models/user_model';

const store = new orderStore();
const testOrder: order = {
	user_id: 1,
	status: 'testorder1',
};

const UsersStore = new userStore();
const myTsetUser: user = {
	firstname: 'testUserFirestName',
	lastname: 'testUserLastname',
	email: 'testUserforOrders@user.com',
	password: 'testforUserPassword',
};

describe('orders Store Model', () => {
	beforeAll(async () => {
		const addeduser = await UsersStore.create(myTsetUser);
		myTsetUser.id = addeduser.id;

		const tempo = await store.create(testOrder);
		testOrder.id = tempo.id;
	});

	it('create order store method should add an order', async () => {
		const addedOrder = await store.create({
			user_id: 1,
			status: 'testorder2',
		});

		expect(addedOrder).toEqual({
			id: addedOrder.id as number,
			user_id: 1,
			status: 'testorder2',
		});
	});

	it('order store method should return a list of orders', async () => {
		const result = await store.index();
		expect(result).toContain(jasmine.objectContaining(testOrder));
	});

	it('show order store method should return the correct order', async () => {
		const result = await store.show(testOrder.id as number);
		expect(result).toEqual({
			id: testOrder.id,
			status: testOrder.status,
			user_id: testOrder.user_id,
		});
	});

	it('Store method addProductOrder should  list constants added product   ', async () => {
		testOrder.status = 'Active';
		const result = await store.updateOrder(testOrder);

		expect(result).toEqual({
			id: testOrder.id,
			user_id: testOrder.user_id,
			status: 'Active',
		});
	});

	it('delete order store method should remove the order', async () => {
		const result = await store.delete(testOrder.id as number);

		expect(result.id).toEqual(testOrder.id);
	});
});
