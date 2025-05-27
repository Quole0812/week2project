const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3001;

app.use(cookieParser());
app.use(express.json());

const apiRouter = require("./routes/api");
const profileRouter = require("./routes/profile");

app.use("/api", apiRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
