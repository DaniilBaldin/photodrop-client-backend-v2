import Joi from 'joi';

export const phoneSchema = Joi.object({
    phone_number: Joi.string()
        .length(13)
        .pattern(new RegExp('^[+][0-9]+$'))
        .required()
        .messages({ 'string.pattern.base': `Phone number must have 13 digits and start with plus` }),
});

export const phoneCodeSchema = Joi.object({
    phone_number: Joi.string()
        .length(13)
        .pattern(new RegExp('^[+][0-9]+$'))
        .required()
        .messages({ 'string.pattern.base': `Phone number must have 13 digits and start with plus` }),
    code: Joi.string().length(6).required(),
});
