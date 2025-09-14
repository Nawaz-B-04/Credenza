// config/schema.js
import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'), // user, admin
});

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('store'),
});

export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  storeId: integer('store_id').references(() => stores.id),
  rating: integer('rating').notNull(), // 1-5
});
