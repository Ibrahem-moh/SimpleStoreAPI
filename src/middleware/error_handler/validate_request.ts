import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const validateRequestData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(401).json({ errors: errors.array() });
	}
	next();
};

const validationChain_Login = [
	//body('email').isEmail().withMessage('email must be a valid email address'),
	body('username')
		.isLength({ min: 3 })
		.isAlphanumeric()
		.withMessage('user name must be Alphanumeric '),
	body('password')
		.isLength({ min: 3 })
		.withMessage('password must be at least 3 characters  '),
];
const validationChain_create = [
	body('email').isEmail().withMessage('email must be a valid email address'),
	body('password')
		.isLength({ min: 3 })
		.withMessage('password must be at least 3 characters  '),
	body('firstname')
		.isLength({ min: 3 })
		.withMessage('firstname must be at least 3 characters  '),
	body('lastname')
		.isLength({ min: 3 })
		.withMessage('lastname must be at least 3 characters  '),
];

export { validationChain_Login, validationChain_create, validateRequestData };
