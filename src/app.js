const express = require("express");
const userRouter = require("./routers/user");
const newsRouter = require("./routers/news");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
require("./db/mongoose");

app.use(express.json());
app.use(userRouter);
app.use(newsRouter);

app.listen(port, () => {
  console.log(`Server is running in port:${port}`);
});
