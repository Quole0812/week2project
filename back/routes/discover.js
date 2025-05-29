const db = require("../firebase");
const request = require("request");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (e) {
    console.error("Error fetching data: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
