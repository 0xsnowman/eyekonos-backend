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
  const code = req.query.code;

  // Check with process.env.CLIENT_ID and process.env.CLIENT_SECRET
  console.log(`Authorized successfully, payload: {${clientId}, ${state}, ${redirectUri}, ${responseType}, ${code}}`);

  const authorizeUrl = `${process.env.ZAPIER_REDIRECT_URI}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&code=${code}`;

  // Send an access token
  res.redirect(authorizeUrl);
});

// OAuth2 Access Token getter
app.post('/token', async (req, bundle) => {
  const promise = z.request(`${process.env.ZAPIER_REDIRECT_URI}/oauth/token`, {
    method: 'POST',
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: bundle.inputData.redirect_uri,
      code_verifier: bundle.inputData.code_verifier,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token
    };
  });
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
