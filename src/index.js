const express = require('express');
const bodyParser = require('body-parser');
const { getXataClient } = require("./xata");

const xata = getXataClient();

const app = express();
const port = process.env.PORT ?? 3000;

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
    execution_result: `authorized url: https://auth-json-server.zapier-staging.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${res.inputData.state}&redirect_uri=${process.env.ZAPIER_REDIRECT_URI}&response_type=code`,
  });
  res.redirect(`https://auth-json-server.zapier-staging.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${res.inputData.state}&redirect_uri=${process.env.ZAPIER_REDIRECT_URI}&response_type=code`)
});

app.post('/token', async (req, res) => {
  const response = await req.request({
    url: 'https://auth-json-server.zapier-staging.com/oauth/access-token',
    method: 'POST',
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: res.inputData.code,
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
  await xata.db.execution_result.create({
    execution_result: `access token: ${response.access_token}`,
  });
  return {
    access_token: response.access_token
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
