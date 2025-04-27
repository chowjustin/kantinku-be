const fs = require('fs');
const path = require('path');
const pool = require('../config/database')

const migrate = async () => {
    try {

        const sqlPath = path.join(__dirname, 'database.up.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sql);
        console.log('Migration successfull.');
        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    } 
}

migrate();
