const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "120018230005-msogq15er2u0sbgnrn95bs2vb3aa8de5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://zapier.com/dashboard/auth/oauth/return/App192132CLIAPI/",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
