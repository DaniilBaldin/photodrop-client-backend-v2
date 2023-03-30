import sharp from 'sharp';

export const imageConverter = async (fileBuffer: Buffer) => {
    try {
        const convertedFile = sharp(fileBuffer).toFormat('jpeg', { mozjpeg: true }).toBuffer();
        return convertedFile;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
