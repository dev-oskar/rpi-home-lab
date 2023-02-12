const { Pool } = require('pg');
const sensor = require("node-dht-sensor").promises;

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

async function getReadings() {
  try {
    const res = await sensor.read(11, 4);
    console.log(
      `log from getReadings() ` +
      `temp: ${res.temperature.toFixed(1)}°C, ` +
      `humidity: ${res.humidity.toFixed(1)}%`
    );

    if (res.humidity && res.temperature) {
      return {
        temperature: res.temperature.toFixed(1),
        humidity: res.humidity.toFixed(1)
      }
    } else {
      throw "Failed to read sensor data!";
    }
  } catch (err) {
    console.error("Failed to read sensor data: ", err);
    res.status(500);
    res.json({ err: err });
  }
}

export default async function handler(req, res) {
  debugger;

  try {
    const readings = await getReadings();
    const db = await pool.connect();
    const now = new Date();

    const query = `INSERT INTO sensors (TEMPERATURE, HUMIDITY, MEASURE_DATE) VALUES ($1, $2, $3) RETURNING *;`;
    const query_response = await db.query(query, [readings.temperature, readings.humidity, now]);

    if (query_response) {
      console.log(query_response);
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