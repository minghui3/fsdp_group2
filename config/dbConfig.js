require('dotenv').config();

module.exports = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    connectionTimeoutMillis: 2000,
};

