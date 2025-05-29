const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3001;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

const apiRouter = require("./routes/api");
const profileRouter = require("./routes/profile");
const inboxRouter = require("./routes/inbox");
const forumRouter = require("./routes/forum");
const discoverRouter = require("./routes/discover");

app.use("/api", apiRouter);
app.use("/profile", profileRouter);
app.use("/inbox", inboxRouter);
app.use("/forum", forumRouter);
app.use("/discover", discoverRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on port ${port}`);
});
