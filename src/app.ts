import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import clientRouter from './routes/clientRouter';

import { errorHandler } from '~/utils/errorHandler';

const { PORT } = process.env || 4000;

const app = express();

app.use(bodyParser.json());

app.use(
    cors({
        origin: '*',
        methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'Access-Control-Allow-Origin'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }),
);

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello there! General Kenobi!');
});

app.use('/', clientRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
