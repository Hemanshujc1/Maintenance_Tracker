const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const schemaPath = path.join(__dirname, 'schema.sql');

(async () => {
    try {
        console.log('Reading schema.sql...');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true // Important for running the full schema
        });

        console.log('Connected! Running schema...');
        await connection.query(schema);

        console.log('✅ Database initialized successfully!');
        await connection.end();
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    }
})();
