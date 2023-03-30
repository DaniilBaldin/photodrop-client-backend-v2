import multer from 'multer';
import { Request } from 'express';

type FileNameCallback = (error?: Error | null, filename?: boolean) => void;

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
};

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: 100000000, files: 10 },
});
