const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  let ret = [];
  res.status(200).json(ret);
});

module.exports = router;
