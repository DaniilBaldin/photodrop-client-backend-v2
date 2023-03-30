import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

import jwt, { Secret } from 'jsonwebtoken';

import { TypedRequestJWT } from '~/types/types';

const secretKey: string | undefined = process.env.TOKEN_KEY;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw Boom.unauthorized('Auth error! Token is missing.');

        const person = jwt.verify(token, secretKey as Secret);
        (req as TypedRequestJWT).person = person;
        next();
    } catch (error) {
        next(error);
    }
};
