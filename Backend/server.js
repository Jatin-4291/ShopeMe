import mongoose from "mongoose";
import app from "./app.js";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import User from "./Models/userModels.js";
const oauth2Stratergy = Strategy;
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const frontendURL = process.env.FRONTEND_URL;
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Exception!");
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const port = process.env.PORT;
const dbUrl = process.env.DB_URI.replace("<password>", process.env.DB_PASS);

mongoose.connect(dbUrl).then(() => {
  console.log("Database is running");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new oauth2Stratergy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECTRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email "],
    },
    async (AccessToken, refreshToken, profile, done) => {
      console.log(profile);

      try {
        // Find or create a user
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Try to get phone number from profile if available
          const phoneNumber = profile.phoneNumbers
            ? profile.phoneNumbers[0].value
            : null;

          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });

          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${frontendURL}/redirect`,
    failureRedirect: `${frontendURL}/login`,
  })
);
app.get("/login/sucess", async (req, res) => {
  console.log(req.user);

  if (req.user) {
    res.status(200).json({ message: "user logged in", data: req.user });
  } else {
    res.status(400).json({ message: "not autherised" });
  }
});
const server = app.listen(port, () => {
  console.log("Server is running on the port ", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!");
  server.close(() => {
    process.exit(1);
  });
});
