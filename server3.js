const express = require('express');
const app = express();
const axios = require('axios');
const cron = require('node-cron');
const { Client } = require('pg');

const PORT = process.env.PORT || 3000;

// PostgreSQL client setup
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'bitcoin_db',
  password: 'kamal',
  port: 5432,
});
client.connect();

// Function to create the table
async function createTable() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS bitcoin_data (
        id SERIAL PRIMARY KEY,
        time TIMESTAMP NOT NULL,
        value NUMERIC NOT NULL
      )
    `);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error.message);
  }
}

// Fetch and store data from 3rd party API
async function fetchDataAndStore() {
  try {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    const bitcoinPrice = response.data.bpi.USD.rate_float;

    const query = 'INSERT INTO bitcoin_data(time, value) VALUES($1, $2)';
    const values = [new Date(), bitcoinPrice];

    await client.query(query, values);
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Schedule cron job to run every 1 minute
cron.schedule('* * * * *', () => {
  fetchDataAndStore();
});

// Create the table on server start
createTable();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});