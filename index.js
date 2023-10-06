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
app.get('/authorize', (req, res) => {
  const clientId = req.query.client_id;
  const state = req.query.state;
  const redirectUri = req.query.redirect_uri;
  const responseType = req.query.response_type;

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Authorized successfully, payload: {${clientId}, ${state}, ${redirectUri}, ${responseType}}`);

  // Send an access token
  res.send(`${clientId}, ${state}, ${redirectUri}, ${responseType}`);
});

// OAuth2 Access Token getter
app.post('/token', (req, res) => {
  const code = req.body.code;
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;
  const grant_type = req.body.grant_type;
  const redirect_uri = req.body.redirect_uri;
  const code_verifier = req.body.code_verifier;

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Access Token received successfully, payload: ${code}, ${client_id}, ${client_secret}, ${grant_type}, ${redirect_uri}, ${code_verifier}`);

  // Send an access token
  res.status(200).send(`Access Token received successfully, payload: ${code}, ${client_id}, ${client_secret}, ${grant_type}, ${redirect_uri}, ${code_verifier}`);
});

// Me : For test authentication credentials, ideally one needing no configuration such as Me
app.get('/me', (req, res) => {
  const platform = req.query.platform;
  const event_id = req.query.event_id;

  // Send response with event_id
  res.status(200).send(`${platform}, ${event_id}`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000', process.env.ZAPIER_REDIRECT_URI);
});
