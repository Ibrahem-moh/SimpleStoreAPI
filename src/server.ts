import express, { Request, Response } from 'express';
import userRoutes from './handler/users_handler';
import cors from 'cors';
import productRoutes from './handler/product_handler';
import orderRoutes from './handler/order_handler';
import bodyParser from 'body-parser';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(cors());

userRoutes(app);
productRoutes(app);
orderRoutes(app);
app.get('/', function (req: Request, res: Response) {
	res.status(200).send('Store API on 3000');
});
app.listen(3000);

export default app;
