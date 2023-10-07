const express = require('express');
const bodyParser = require('body-parser');
const { AuthorizationCode } = require('simple-oauth2');
import { getXataClient, writeToXataClient } from "./xata";
const xata = getXataClient();

require('dotenv').config();

const app = express();

app.use(bodyParser.json())
app.post('/tickets', (req, res) => {
  const email = req.body.email;
  const ticket_id = req.body.ticket_id;

  res.status(200).send(`Ticket data received. Payload: {${email}, ${ticket_id}}`);
});

const client = new AuthorizationCode({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://zapier.com',
    tokenPath: 'oauth/authorize'
  },
});

const authorizationUri = client.authorizeURL({
  redirect_uri: process.env.ZAPIER_REDIRECT_URI,
  scope: 'User.Read',
});

app.get('/authorize', async (req, res) => {
  // writeToXataClient(authorizationUri);
  res.redirect(authorizationUri);
});

app.post('/token', async (req, res) => {
  const code = req.body.code;

  const options = {
    code,
    redirect_uri: process.env.ZAPIER_REDIRECT_URI,
  };

  try {
    const accessToken = await client.getToken(options);

    console.log('The resulting token: ', accessToken.token);

    // writeToXataClient("Access token was created: " + accessToken.token);
    return res.status(200).json(accessToken.token);
  } catch (error) {
    console.error('Access Token Error', error.message);
    // writeToXataClient("Error creating access token: " + error.message);
    return res.status(500).json('Authentication failed');
  }
});

app.get('/me', (req, res) => {
    // writeToXataClient('Hello<br><a href="/auth">Log in with Zapier</a>');
    res.send('Hello<br><a href="/auth">Log in with Zapier</a>');
});

app.listen(3000, () => {
  console.log('Server started on port 3000', process.env.ZAPIER_REDIRECT_URI);
});
