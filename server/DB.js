const { Pool } = require('pg');
require('dotenv').config();

console.log('Using database user:', process.env.DB_USERNAME); 

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DBPORT,
    database: 'todos'
}); 

module.exports = pool;
