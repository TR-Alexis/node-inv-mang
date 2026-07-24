import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found';
import apiRouter from './routes';

dotenv.config();

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (_request, response) => {
  response.type('text').send('Hello Inventory API');
});

app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
