const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//import prisma to our app
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/userSchema");
const argon = require("argon2");
const config = require("config")
const { OAuth2Client } = require("google-auth-library");

const appSecret = config.get("appSecret")
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { sendWelcomeBackEmail } = require("../services/mailServices");


router.post("/google-login", async (req, res, next) => {
  try {
    const {googleToken} = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();

    console.log(googlePayload);
    const { email } = googlePayload;

    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: {
          email: email,
          profile: {
            create: {},
          }
        },
      });
    }

    //create payload and define jwtOption
    const payload = {
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    }

    const jwtOption = {expiresIn: 3600};

    //sign the token
    const token = await jwt.sign(payload, config.get("appSecret"), jwtOption);

    //return the token to client
    return res.status(200).json({token: token})

  } catch (error) {
    next(error);
  }
});



router.post("/login", async (req, res, next) => {
  try {
    //user validation of inputs using joi
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    if (valResult.error) {
      return res.status(400).send(valResult.error.details);
    }

    const { email, password } = req.body;

    //check if the user already on the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //if user not found
    if (!existingUser) {
      return res.status(404).json({ message: "email is not on our database" });
    }

    //verify password
    const verifyPassword = await argon.verify(existingUser.password, password);

    if (!verifyPassword) {
      return res.status(404).json({ message: "invalid credentials" });
    }

    // try {
    //   await sendWelcomeBackEmail(email);
    // } catch (error) {
    //   console.error("Error sending welcome back email:", error);
    // }

    //create payload and define jwtOption
    const payload = {
        sub: existingUser.id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
    }

    const jwtOption = {expiresIn: 3600};

    //sign the token
    const token = await jwt.sign(payload, config.get("appSecret"), jwtOption);

    //return the token to client
    return res.status(200).json({token: token})
  } catch (error) {
    next(error);
  }
});

module.exports = router;
