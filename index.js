const express = require("express");
require("dotenv").config();

const { connection } = require("./config/db");
const userRouter = require('./routes/user.route');
const postRouter = require("./routes/post.route");
const productRouter = require("./routes/product.route");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/products', productRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DataBase!!!");
  } catch (error) {
    console.log("Error while connecting to DataBase");
  }
  console.log(`App is running on port - http://localhost:${port}`);
});
