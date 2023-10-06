const express = require('express');
const axios = require('axios');
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

  const authorizeUrl = `${process.env.ZAPIER_REDIRECT_URI}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  // Send an access token
  res.redirect(authorizeUrl);
});

// OAuth2 Access Token getter
app.post('/token', async (req, res) => {
  const { code, client_id, grant_type, redirect_uri, code_verifier } = req.body;

  try {
    const response = await axios.post('https://zapier.com/oauth/token', {
      code,
      client_id,
      grant_type,
      redirect_uri,
      code_verifier
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
