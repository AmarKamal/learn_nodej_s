const express = require('express');
const axios = require('axios');
const { createLogger, transports } = require('winston');
const cron = require('node-cron'); // Install node-cron

const app = express();
const port = 3000;

const logger = createLogger({
  transports: [new transports.Console()],
});

const coinDeskURL = 'https://api.coindesk.com/v1/bpi/currentprice.json';

const fetchData = async () => {
  try {
    const response = await axios.get(coinDeskURL);
    const data = response.data;
    
    // Store data in database (replace with your database logic)
    console.log('Fetched and stored coin data:', data);
    logger.info('Coin data fetched successfully');
  } catch (error) {
    logger.error('Error fetching coin data:', error.message);
  }
};

// Schedule cron job to run every minute
cron.schedule('* * * * *', fetchData);

app.get('/', (req, res) => {
  res.send('API for fetching and storing data');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  logger.info('Server started successfully');
});