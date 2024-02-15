const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard',
  password: 'pass',
  port: 5433, // Default PostgreSQL port
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database:', res.rows[0].now);
  }
});

// Optionally, export the pool to use it throughout your application
module.exports = pool;
