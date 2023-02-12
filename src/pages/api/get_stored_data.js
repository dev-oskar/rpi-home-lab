const { Pool } = require('pg');

export default async function handler(req, res) {
  const pool = new Pool({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
  });

  pool.on('error', (err, client) => {
    console.error('Error:', err);
  });

  try {

    const db = await pool.connect();
    const query = "SELECT * from sensors ORDER BY measure_date DESC;";

    const query_response = await db.query(query);

    if (query_response) {
      res.status(200);
      res.json(query_response);
    } else {
      res.status(404);
      res.json({});
    }
  } catch (error) {
    res.status(500);
    res.json(error);
  }
}