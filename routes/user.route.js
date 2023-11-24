const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const { User } = require("../models/user.model");
const RefreshToken = require('../models/refreshToken.model');

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      res
        .status(200)
        .json({ message: "Already registered, Please logging in!" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          res.status(500).json({ error: "Internal server error!" });
        } else {
          const user = new User({ username, email, password: hash });
          await user.save();
          res.status(201).json({ message: "User registered successfully!" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    } else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          const accessToken = jwt.sign(
            { user: user._id },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
          );
          const refreshToken = jwt.sign(
            { user: user._id },
            process.env.REFRESH_SECRET
          );

          await new RefreshToken({ token: refreshToken, userId: user._id }).save();

          res.status(200).json({
            message: "Logged In Successfully!",
            accessToken,
            refreshToken,
          });
        } else {
          res.status(401).json({ error: "Invalid Credentaials" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
    console.log(error);
  }
});

userRouter.post("/refresh", async(req, res) => {
  const refreshToken = req.body.refreshToken;

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, decoded) => {
    if (error) {
      res.status(401).json({ error: "Invalid refresh token" });
    } else {
      const accessToken = jwt.sign(
        { user: decoded.user },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    }
  });
});

userRouter.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const blacklistedData = JSON.parse(
      fs.readFileSync("./blacklisting.json", "utf-8")
    );
    blacklistedData.push(token);
    fs.writeFileSync("./blacklisting.json", JSON.stringify(blacklistedData));
    res.status(200).json({ message: "Logged Out Successfully!" });
  } else {
    res.status(400).json({ error: "Invalid request" });
  }
});

module.exports = userRouter;
