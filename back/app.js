const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
