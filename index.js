const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const simpleOAuth = require('simple-oauth2');

const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

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
  const { client_id, redirect_uri, state } = req.query;

  // Check if all required parameters are present
  if (!client_id || !redirect_uri || !state) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Redirect user to Zapier authorization page
  const authorizationUrl = `https://zapier.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;
  res.redirect(authorizationUrl);
});

// OAuth2 Access Token getter
app.post('/token', async (req, bundle) => {
  const config = {
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://api.oauth.com',
    }
  };

  const client = new AuthorizationCode(config);

  const tokenParams = {
    code: bundle.inputData.code,
    redirect_uri: bundle.inputData.redirect_uri,
    scope: 'authorization_code',
  };

  const accessToken = await client.getToken(tokenParams);

  return {
    access_token: accessToken,
  };
});

// Me : For test authentication credentials, ideally one needing no configuration such as Me
app.get('/me', (req, bundle) => {
  const promise = req.request({
    method: 'GET',
    url: `https://api.oauth.com`,
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is not valid');
    }
    return req.JSON.parse(response.content);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000', process.env.ZAPIER_REDIRECT_URI);
});
