const express = require('express');
const { createLogger, transports } = require('winston');

const app = express();
const port = 3000;

const logger = createLogger({
  transports: [new transports.Console()],
});

app.get('/', (req, res) => {
  // Log info message
  logger.info('Received GET request for user data');

  const user = {
    name: "Amar Kamal",
    age: 23,
    university: "UiTM Shah Alam",
    hobby: "Badminton",
  };

  res.json(user);

  // Log sample data
  logger.debug({ user }); // Use debug level for detailed data

  // Simulate error
  if (Math.random() > 0.5) {
    throw new Error('Something went wrong!');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  logger.info('Server started successfully');
});

// Handle errors globally (optional)
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
});
