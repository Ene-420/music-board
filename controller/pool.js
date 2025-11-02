import { Pool } from "pg";
//import ('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();


export default new Pool({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PWD,
    port: 5432
});