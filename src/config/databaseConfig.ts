import dotenv from 'dotenv';
dotenv.config();

export const DATA_SOURCES = {
    mysql: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.USER_DB,
        DB_PASS: process.env.DB_PASSWORD,
        DB_NAME: process.env.DATABASE,
    },
};
