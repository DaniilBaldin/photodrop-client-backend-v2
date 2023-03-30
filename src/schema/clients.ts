import { varchar, mysqlTable, serial } from 'drizzle-orm/mysql-core';
import { InferModel } from 'drizzle-orm';

export const clients = mysqlTable('clients', {
    id: serial('id').primaryKey().notNull(),
    client_name: varchar('client_name', { length: 45 }).notNull(),
    phone_number: varchar('phone_number', { length: 45 }).notNull(),
    verified: varchar('verified', { length: 45 }).notNull(),
    selfie_image: varchar('selfie_image', { length: 45 }).notNull(),
    albums_owned: varchar('albums_owned', { length: 45 }).notNull(),
});

export type Client = InferModel<typeof clients>;
