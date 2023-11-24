const jwt = require("jsonwebtoken");
const fs = require("fs");

const authenticator = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const blacklistedData = JSON.parse(
      fs.readFileSync("./blacklisting.json", "utf-8")
    );
    if (blacklistedData.includes(token)) {
      res
        .status(401)
        .json({ error: "Token is blacklisted. Please login again!" });
    } else {
      jwt.verify(token, process.env.ACCESS_SECRET, (error, decoded) => {
        if (error) {
          res.status(401).json({ error: "Please login again!" });
          console.log("Error while verifying the token", error.message);
        } else {
          req.body.user = decoded.user;
          next();
        }
      });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticator;
