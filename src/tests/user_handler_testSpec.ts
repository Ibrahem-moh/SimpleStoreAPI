import { user, userStore } from '../models/user_model'
import supertest from 'supertest'
import app from '../server'
const UsersStore = new userStore()

const testUserForEndPoint: user = {
	firstname: 'testUserFirestName',
	lastname: 'testUserLastname',
	email: 'testUser@user_model.com',
	password: 'testUserPassword',
}
const request = supertest(app)

let myToken = ''

beforeAll(async () => {
	const tempo = await UsersStore.create(testUserForEndPoint)
	testUserForEndPoint.id = tempo.id
})

describe('User EndPoint   ', () => {
	it('login should be able to login and get a token', async () => {
		const res = await request
			.post('/user/login')
			.set('Content-type', 'application/json')
			.send({
				username: testUserForEndPoint.firstname,
				password: testUserForEndPoint.password,
			})
		expect(res.status).toBe(200)
		expect(res.body.token).toBeTruthy()

		myToken = res.body.token
	})
	it('should be failed to authenticate with wrong email', async () => {
		const res = await request
			.post('/user/login')
			.set('Content-type', 'application/json')
			.send({
				username: 'wronglogin@endpoint.com',
				password: 'wronglogin',
			})
		expect(res.status).toBe(401)
	})

	it(' user/add .. should create new user ', async () => {
		const res = await request
			.post('/user/add')
			.set('Content-type', 'application/json')
			.send({
				firstname: 'newUserAPIFirestName',
				lastname: 'newUserAPILastname',
				email: 'newUserAPI@endpoint.com',
				password: 'newUserAPI',
			} as user)

		expect(res.status).toBe(200)
		const { firstname, lastname, email } = res.body.user
		expect(email).toBe('newUserAPI@endpoint.com')
		expect(firstname).toBe('newUserAPIFirestName')
		expect(lastname).toBe('newUserAPILastname')
	})
	//test index method
	it('Test user/ .. index  should return list of users only with valid token', async () => {
		const res = await request
			.get('/user')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)

		expect(res.status).toBe(200)
		expect(res.body).toContain(
			jasmine.objectContaining({
				firstname: testUserForEndPoint.firstname,
				lastname: testUserForEndPoint.lastname,
				email: testUserForEndPoint.email,
				id: testUserForEndPoint.id,
			})
		)
	})

	it('Test user/ .. index   with invalid token', async () => {
		const res = await request
			.get('/user')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invlaid token'}`)
		expect(res.status).toBe(401)
	})
	//test user/id method
	it('Test user/id .. should return one user only ', async () => {
		const res = await request
			.get(`/user/${testUserForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)

		expect(res.status).toBe(200)
		expect(res.body.email).toBe(testUserForEndPoint.email)
		expect(res.body.id).toBe(testUserForEndPoint.id)
		expect(res.body.firstname).toBe(testUserForEndPoint.firstname)
	})

	it('Test user/id with invalid token', async () => {
		const res = await request
			.get(`/user/${testUserForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invlaid token'}`)

		expect(res.status).toBe(401)
	})

	it('Test /user/update with valid token', async () => {
		const res = await request
			.put('/user/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)
			.send({
				id: testUserForEndPoint.id,
				firstname: 'updateUserfirstname',
				lastname: 'updateUserlastname',
				email: 'updateUser@endpoint.com',
				password: 'updateUserpassword',
			} as user)

		expect(res.status).toBe(200)
		expect(res.body.id).toBe(testUserForEndPoint.id)
		expect(res.body.firstname).toBe('updateUserfirstname')
		expect(res.body.lastname).toBe('updateUserlastname')
		expect(res.body.email).toBe('updateUser@endpoint.com')
	})
	it('Test /user/update with invalid token', async () => {
		const res = await request
			.put('/user/update')
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invalid token'}`)
			.send({
				id: testUserForEndPoint.id,
				firstname: 'updateUserfirstname',
				lastname: 'updateUserlastname',
				email: 'updateUser@endpoint.com',
				password: 'updateUserpassword',
			} as user)
		expect(res.status).toBe(401)
	})
	it('Test /user/del with valid token', async () => {
		const res = await request
			.delete(`/user/del?id=${testUserForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${myToken}`)

		expect(res.status).toBe(200)
		expect(res.body.firstname).toBe('updateUserfirstname')
		expect(res.body.lastname).toBe('updateUserlastname')
		expect(res.body.email).toBe('updateUser@endpoint.com')
		expect(res.body.id).toBe(testUserForEndPoint.id)
	})
	it('Test /user/del with invalid token', async () => {
		const res = await request
			.delete(`/user/del?id=${testUserForEndPoint.id}`)
			.set('Content-type', 'application/json')
			.set('Authorization', `Bearer ${'invlaid token'}`)

		expect(res.status).toBe(401)
	})
})
