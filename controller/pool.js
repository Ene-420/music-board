const {Pool} = require("pg");
require('dotenv').config();

module.exports = new Pool({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PWD,
    port: 5432
});