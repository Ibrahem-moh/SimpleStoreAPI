import { user, userStore } from '../models/user_model';

const UsersStore = new userStore();
const myTsetUser: user = {
	firstname: 'testUserFirestName',
	lastname: 'testUserLastname',
	email: 'testUser@user.com',
	password: 'testUserPassword',
};

describe('user Model', () => {
	it('create Store method should add a user', async () => {
		const addeduser = await UsersStore.create({
			firstname: 'testUserFirestName2',
			lastname: 'testUserLastname2',
			email: 'testUser2@user.com',
			password: 'testUserPassword2',
		});
		expect(addeduser).toEqual({
			id: addeduser.id,
			firstname: 'testUserFirestName2',
			lastname: 'testUserLastname2',
			email: 'testUser2@user.com',
		} as user);
	});
	beforeAll(async () => {
		const createdUser = await UsersStore.create(myTsetUser);
		myTsetUser.id = createdUser.id;
	});
	it('index Store method should return a list of users', async () => {
		const result = await UsersStore.index();

		expect(result.length).not.toBe(0);

		expect(result).toContain(
			jasmine.objectContaining({
				firstname: 'testUserFirestName2',
				lastname: 'testUserLastname2',
				email: 'testUser2@user.com',
			})
		);
	});

	it('show Store method should return   correct user', async () => {
		const result = await UsersStore.show(myTsetUser.id as number);
		expect(result).toEqual({
			id: myTsetUser.id as number,
			firstname: myTsetUser.firstname,
			lastname: myTsetUser.lastname,
			email: myTsetUser.email,
		} as user);
	});

	it('update Store method should update  user', async () => {
		myTsetUser.firstname = 'updatedfirestname';
		myTsetUser.lastname = 'updatedlastname';
		myTsetUser.password = 'updatedpassword';
		myTsetUser.email = 'updatedemail@user.com';
		const result = await UsersStore.update(myTsetUser);

		expect(result).toEqual({
			firstname: 'updatedfirestname',
			lastname: 'updatedlastname',
			email: 'updatedemail@user.com',
			id: myTsetUser.id,
		} as user);
	});
	it('delete Store method should remove   user', async () => {
		const result = await UsersStore.delete(myTsetUser.id as number);

		expect(result).toEqual({
			id: myTsetUser.id as number,
			firstname: myTsetUser.firstname,
			lastname: myTsetUser.lastname,
			email: myTsetUser.email,
		} as user);
	});
});
