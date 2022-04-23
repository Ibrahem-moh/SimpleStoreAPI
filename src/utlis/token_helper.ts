import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization as string;
		const token = authorizationHeader.split(' ')[1];
		jwt.verify(token, process.env.TOKEN as string);
		next();

		return true;
	} catch (err) {
		next(res.status(401).json('Access denied, invalid token'));
	}
};
const generateUserToken = (userName: string): string | null => {
	try {
		const token = jwt.sign({ user: userName }, process.env.TOKEN as string);

		return token;
	} catch (error) {
		throw new Error('err generating token ');
	}
};
export { generateUserToken, verifyUserToken };
