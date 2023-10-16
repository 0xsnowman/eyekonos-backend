const express = require('express');
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const { getXataClient } = require("./xata");

const xata = getXataClient();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  await xata.db.execution_result.create({
    execution_result: `Root path called: Not logged in state`,
  });
  res.json({ message: "You are not logged in" });
});

app.get("/failed", async (req, res) => {
  await xata.db.execution_result.create({
    execution_result: `Failed.`,
  });
  res.send("Failed");
});
app.get("/success", async (req, res) => {
  await xata.db.execution_result.create({
    execution_result: `Success.`,
  });
  res.send(`Welcome ${req.user.email}`);
});

app.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ],
  }),
  async (req, res) => {
    await xata.db.execution_result.create({
      execution_result: `/google path called. authenticating.`,
    });
  }
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  async (req, res) => {
    await xata.db.execution_result.create({
      execution_result: `/google/callback path called. redirecting.`,
    });
    res.redirect("/success");
  }
);

app.listen(port, () => console.log("server running on port " + port));