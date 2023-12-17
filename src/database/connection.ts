import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const port: unknown = process.env.DB_PORT;
const portAsNumber = port as number;

const client = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: portAsNumber
});

export default client;