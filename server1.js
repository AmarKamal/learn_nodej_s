const express = require('express');
const winston = require('winston');
const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.get('/', (req, res) => {
  logger.info('Request received');
  res.json({ message: 'Hello World' });
});

// Triggering an error for demonstration
app.get('/error', (req, res) => {
  logger.error('An error occurred');
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});