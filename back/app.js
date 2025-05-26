const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const loginRouter = require("./login");

app.use("/login", loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
