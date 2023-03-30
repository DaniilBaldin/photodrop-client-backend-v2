import dotenv from 'dotenv';
dotenv.config();

import jwt, { Secret } from 'jsonwebtoken';

const secretKey: string | undefined = process.env.TOKEN_KEY;

export const generateJWT = (id: string) => {
    const accessToken = jwt.sign({ id: id }, secretKey as Secret, { expiresIn: '1d' });
    return {
        accessToken,
    };
};
