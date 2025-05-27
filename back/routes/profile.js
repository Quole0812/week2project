const db = require("../firebase");

const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const userRef = db.collection("users").doc(id);

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(doc.data());
  } catch (e) {
    console.error("Error fetching data: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
