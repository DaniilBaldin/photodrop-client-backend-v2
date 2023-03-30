import { Request, Response } from 'express';
import { Send } from 'express-serve-static-core';
import { JwtPayload } from 'jsonwebtoken';

export interface TypedResponse<ResBody> extends Response {
    json: Send<ResBody, this>;
}

export interface TypedRequestBody<T> extends Request {
    body: T;
}

export interface TypedRequestJWT extends Request {
    person: string | JwtPayload;
}

export interface TypedRequest<T> extends Request {
    person?: T;
}
