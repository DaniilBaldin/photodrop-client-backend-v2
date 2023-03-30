import { TypedRequestBody, TypedResponse } from '~/types/types';
import { NextFunction } from 'express';

import twilio from 'twilio';
import { phoneCodeSchema } from '~/validation/phoneValidation';
import Boom from '@hapi/boom';

import { eq } from 'drizzle-orm/expressions';
import { Client, clients } from '~/schema/clients';
import { db } from '~/utils/databaseConnect';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { generateJWT } from '~/utils/generateJWT';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const verifyClient = async (
    req: TypedRequestBody<{ phone_number: string; code: string }>,
    res: TypedResponse<{
        data: {
            client: Client;
            newUser: boolean;
            token: string;
        };
        success: boolean;
    }>,
    next: NextFunction,
) => {
    try {
        const { phone_number, code } = req.body;
        const { value, error } = phoneCodeSchema.validate({
            phone_number: phone_number,
            code: code,
        });
        if (error) throw Boom.badRequest(error.message);
        if (value) {
            const verification = await client.verify.v2.services(serviceSid as string).verificationChecks.create({
                to: phone_number,
                code: code,
            });
            if (verification.valid) {
                const client = await db
                    .select()
                    .from(clients)
                    .where(eq(clients.phone_number, `${phone_number}`));
                if (!client.length) {
                    const newClient: Client = {
                        id: 0,
                        phone_number: phone_number,
                        client_name: '',
                        verified: 'true',
                        selfie_image: '',
                        albums_owned: '',
                    };
                    const newUser: MySqlRawQueryResult = await db.insert(clients).values(newClient);
                    const id = newUser[0].insertId.toString();
                    const token = generateJWT(id);
                    res.status(201).json({
                        data: {
                            client: newClient,
                            newUser: true,
                            token: token.accessToken,
                        },
                        success: true,
                    });
                }
                const id = client[0].id.toString();
                const token = generateJWT(id);
                res.status(202).json({
                    data: {
                        client: client[0],
                        newUser: false,
                        token: token.accessToken,
                    },
                    success: true,
                });
            } else {
                throw Boom.badData('Code is not valid!');
            }
        }
    } catch (error) {
        next(error);
    }
};
