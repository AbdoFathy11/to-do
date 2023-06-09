import dotenv from 'dotenv';
import { Pool } from "pg";
dotenv.config()

const {
    DB,
    HOST,
    DB_PORT,
    DB_USER,
    DB_POSSWORD
} = process.env;

const client = new Pool({
    database: DB,
    port: +DB_PORT,
    password: DB_POSSWORD,
    user: DB_USER,
    host: HOST
});

export default client;

