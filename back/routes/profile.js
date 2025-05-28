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

router.post("/artists", async (req, res) => {
  const { artistIds } = req.body;
  const artistStr = artistIds.join(",");
  let access_token = req.cookies.access_token;

  try {
    request.get(
      {
        url: "https://api.spotify.com/v1/artists?ids=" + artistStr,
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      },
      function (err, response, artistJson) {
        if (!err && response.statusCode === 200) {
          return res.json(artistJson);
        } else {
          return res
            .status(500)
            .json({ error: "Failed to fetch artist data." });
        }
      }
    );
  } catch (e) {
    console.error("Error fetching artist data: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/songs", async (req, res) => {
  const { songsIds } = req.body;
  const songsStr = songsIds.join(",");
  let access_token = req.cookies.access_token;

  try {
    request.get(
      {
        url: "https://api.spotify.com/v1/tracks?ids=" + songsStr,
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      },
      function (err, response, songsJson) {
        if (!err && response.statusCode === 200) {
          return res.json(songsJson);
        } else {
          return res.status(500).json({ error: "Failed to fetch song data." });
        }
      }
    );
  } catch (e) {
    console.error("Error fetching song data: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/search/songs", async (req, res) => {
  const { query, offset } = req.body;
  let access_token = req.cookies.access_token;

  try {
    request.get(
      {
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&market=US&limit=10&offset=${offset}`,
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      },
      function (err, response, songsJson) {
        if (!err && response.statusCode === 200) {
          return res.json(songsJson);
        } else {
          return res.status(500).json({ error: "Failed to fetch song data." });
        }
      }
    );
  } catch (e) {
    console.error("Error fetching song search: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/search/artist", async (req, res) => {
  const { query, offset } = req.body;
  let access_token = req.cookies.access_token;

  try {
    request.get(
      {
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=artist&market=US&limit=10&offset=${offset}`,
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      },
      function (err, response, artistJson) {
        if (!err && response.statusCode === 200) {
          return res.json(artistJson);
        } else {
          return res
            .status(500)
            .json({ error: "Failed to fetch artist data." });
        }
      }
    );
  } catch (e) {
    console.error("Error fetching artist search: ", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
