// require('dotenv').config();
// const { drizzle } = require('drizzle-orm/neon-http');
// const { neon } = require('@neondatabase/serverless');
// require('dotenv').config();

// const sql = neon(process.env.DATABASE_URL);
// const db = drizzle(sql);

// module.exports = db; 

// config/dbClient.js
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
