import { body } from 'express-validator';

const schema = [
	body('email').isEmail().withMessage('email must be a valid email address'),
	body('password')
		.isLength({ min: 3 })
		.withMessage('password must be at least 3 characters  '),
];

export { schema as registerSchema };
