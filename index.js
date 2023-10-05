const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Use the built-in middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Define a route for handling POST requests
app.post('/tickets', (req, res) => {
  // Extract the 'email' and 'ticket_id' parameters from the request body
  const email = req.query.email;
  const ticketId = req.query.ticket_id;

  // Do something with the parameters (e.g. save to database, send email, etc.)
  console.log(`Received ticket data: email=${email}, ticket_id=${ticketId}`);

  // Send a response to the client
  res.status(200).send(`Ticket data received. Payload: {${email}, ${ticketId}}`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
