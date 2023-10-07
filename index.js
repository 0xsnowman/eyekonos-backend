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
