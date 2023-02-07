const { Pool } = require('pg');

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

export default async function handler(req, res) {
  debugger;
  const query = "SELECT * from sensors;";
  try {
    pool.connect((err, client, done) => {
      if (err) throw err;
      client.query(query, (err, qRes) => {
        done();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'max-age=180000');
        if (err) {
          console.log(err.stack);
          res.status(500);
          res.json(err);
        } else {
          if (qRes.rows.length > 0) {
            res.status(200);
            res.json(qRes.rows)
          } else {
            res.status(404);
            res.json({});
          }
        }
      });
    });
  } catch (error) {
    res.status(error).json({});
  }
}