const express = require("express");
const userRouter = require("./routers/user");
const app = express();
const bcryptjs = require("bcryptjs");
const port = process.env.PORT || 3000;
require("./db/mongoose");

app.use(express.json());
app.use(userRouter);

// const pswFunction = async () => {
//   const password = "R123456";
//   const hashedPw = await bcryptjs.hash(password, 8);
// };
// pswFunction();

app.listen(port, () => {
  console.log(`Server Is Running in ${port}`);
});
