const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

// Use the built-in middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// Define a route for handling POST requests
app.post('/tickets', (req, res) => {
  // Extract the 'email' and 'ticket_id' parameters from the request body
  console.log(req.body);
  const email = req.body.email;
  const ticket_id = req.body.ticket_id;

  // Do something with the parameters (e.g. save to database, send email, etc.)
  console.log(`Received ticket data: email=${email}, ticket_id=${ticket_id}`);

  // Send a response to the client
  res.status(200).send(`Ticket data received. Payload: {${email}, ${ticket_id}}`);
});

// OAuth2 authentication
app.post('/auth', (req, res) => {
  console.log(req.body);
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;
  const res_token = 'fail';

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Authorized successfully, payload: {${client_id}, ${client_secret}}`);

  // Send an access token
  res.status(200).send(`${res_token}`);
});

// OAuth2 Access Token getter
app.post('/set_access_token', (req, res) => {
  console.log(req.body);
  const access_token = req.body.access_token;
  const result = 'fail';

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Access Token received successfully, payload: ${access_token}`);

  // Send an access token
  res.status(200).send(`${result}`);
});

// OAuth2 refresh token
app.post('/refresh_access_token', (req, res) => {
  console.log(req.body);
  const refresh_token = req.body.refresh_token;
  const result = 'fail';

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Refreshed access token successfully, payload: ${refresh_token}`);

  // Send an access token
  res.status(200).send(`${result}`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000', process.env.ZAPIER_REDIRECT_URI);
});
