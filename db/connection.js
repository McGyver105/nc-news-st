const knex = require('knex');
const ENV = process.env.NODE_ENV;

const dbconfig = 
    ENV === 'production' ?
        {
            client: 'pg',
            connection: {
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false,
                }
            }
        }
        : require('../knexfile')

const connection = knex(dbconfig);

module.exports = connection;