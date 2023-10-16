const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const { getXataClient } = require("./xata");

require('./passport');

const xata = getXataClient();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key11", "key22"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ message: "You are not logged in" });
});

app.get("/failed", (req, res) => {
  res.send("Failed");
});
app.get("/success", (req, res) => {
  res.send(`Welcome ${req.user.email}`);
});

app.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      // "https://www.googleapis.com/auth/userinfo.email",
      // "https://www.googleapis.com/auth/userinfo.profile",
      "email",
      "profile",
      "openid",
    ],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    res.redirect("/success");
  }
);

app.listen(port, () => console.log("server running on port " + port));
