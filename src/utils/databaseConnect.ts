import { drizzle } from 'drizzle-orm/mysql2';

import mysql from 'mysql2/promise';

import { DATA_SOURCES } from '~/config/databaseConfig';

const data = DATA_SOURCES.mysql;

const connection = mysql.createPool({
    host: data.DB_HOST,
    user: data.DB_USER,
    password: data.DB_PASS,
    database: data.DB_NAME,
});

export const db = drizzle(connection);
