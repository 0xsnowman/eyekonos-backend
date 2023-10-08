import express from 'express';
import bodyParser from 'body-parser';
import { AuthorizationCode, AuthorizationTokenConfig } from 'simple-oauth2';
import { getXataClient } from "./xata";
const xata = getXataClient();

const app = express();
const port = process.env.PORT || 3000;

const client = new AuthorizationCode({
  client: {
    id: process.env.CLIENT_ID as string,
    secret: process.env.CLIENT_SECRET as string,
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

app.use(bodyParser.json());

app.post('/tickets', async (req, res) => {
  const email = req.body.email;
  const ticket_id = req.body.ticket_id;

  await xata.db.execution_result.create({
    execution_result: `Ticket data received. Payload: {${email}, ${ticket_id}}`,
  });
  res.status(200).send(`Ticket data received. Payload: {${email}, ${ticket_id}}`);
});

app.get('/authorize', async (req, res) => {
  await xata.db.execution_result.create({
    execution_result: `Authroize uri created. Payload: {${authorizationUri}}`,
  });
  res.redirect(authorizationUri);
});

app.post('/token', async (req, res) => {
  const code = req.body.code;

  const options = {
    code,
    redirect_uri: process.env.ZAPIER_REDIRECT_URI,
  } as AuthorizationTokenConfig;

  try {
    const accessToken = await client.getToken(options);

    console.log('The resulting token: ', accessToken.token);

    await xata.db.execution_result.create({
      execution_result: `Access token created. Payload: { token: ${accessToken.token}, code: ${code} }, redirect_uri:`,
    });
    return res.status(200).json(accessToken.token);
  } catch (error) {
    await xata.db.execution_result.create({
      execution_result: `Error in Access token creation. Payload: { error: ${error}, code: ${code}}`,
    });
    return res.status(500).json('Authentication failed');
  }
});

app.get('/me', async (req, res) => {
  await xata.db.execution_result.create({
    execution_result: `Hello<br><a href="/auth">Log in with Zapier</a>`,
  });
  res.send('Hello<br><a href="/auth">Log in with Zapier</a>');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
