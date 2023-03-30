import { TypedRequestBody, TypedResponse } from '~/types/types';
import { NextFunction } from 'express';

import twilio from 'twilio';
import { phoneSchema } from '~/validation/phoneValidation';
import Boom from '@hapi/boom';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const loginClient = async (
    req: TypedRequestBody<{ phone_number: string }>,
    res: TypedResponse<{ message: string; success: boolean }>,
    next: NextFunction,
) => {
    try {
        const { phone_number } = req.body;
        const { value, error } = phoneSchema.validate({
            phone_number: phone_number,
        });
        if (error) throw Boom.badRequest(error.message);
        if (value) {
            const verification = await client.verify.v2.services(serviceSid as string).verifications.create({
                to: phone_number,
                channel: 'sms',
            });
            if (!verification) throw Boom.badImplementation('Something went wrong! Code was not sent!');
            res.status(200).json({
                message: 'Verification code sent!',
                success: true,
            });
        }
    } catch (err) {
        next(err);
    }
};
