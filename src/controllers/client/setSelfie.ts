import { NextFunction } from 'express';

import Boom from '@hapi/boom';

import { imageConverter } from '~/utils/imageConverter';
import { s3Upload } from '~/utils/s3upload';

import { db } from '~/utils/databaseConnect';
import { clients } from '~/schema/clients';
import { like } from 'drizzle-orm/expressions';

import { TypedRequest, TypedResponse } from '~/types/types';

export const setSelfie = async (
    req: TypedRequest<{ id: string; iat: number; exp: number }>,
    res: TypedResponse<{
        data: {
            id: string | undefined;
            selfie_url: string;
        };
        success: boolean;
    }>,
    next: NextFunction,
) => {
    try {
        if (!req.file) throw Boom.badData('No files selected!');

        const id = req.person?.id;

        const file: Express.Multer.File = req.file;
        let type = file.originalname.split('.').reverse()[0];
        let fileBuffer = file.buffer;

        if (type === 'HEIC' || type === 'heic') {
            fileBuffer = await imageConverter(fileBuffer);
            type = 'jpeg';
        }

        const selfieURL = await s3Upload(fileBuffer, type);
        if (!selfieURL) throw Boom.badImplementation('Something went wrong! Upload was not successfull.');

        const selfieUpdate = await db
            .update(clients)
            .set({ selfie_image: selfieURL })
            .where(like(clients.id, `${id}`));

        if (!selfieUpdate) throw Boom.notImplemented('Data update was not successfull!');

        res.status(202).json({
            data: {
                id: id,
                selfie_url: selfieURL,
            },
            success: true,
        });
    } catch (error) {
        next(error);
    }
};
