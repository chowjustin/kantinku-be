const app = require('./app');
const dotenv = require('dotenv');
const pool = require('./config/database'); // Use the correct export from database.js

dotenv.config();
const port = process.env.PORT || 8080;

// Test the database connection before starting the server
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server, DB connection error:', err);
  });