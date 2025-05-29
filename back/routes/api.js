const db = require("../firebase");

const express = require("express");
const router = express.Router();

const querystring = require("querystring");
const dotenv = require("dotenv");
const request = require("request");
dotenv.config();

let client_id = process.env.client_id;
let client_secret = process.env.client_secret;
let redirect_uri = "http://127.0.0.1:3001/api/callback";
const redirect_url = "http://127.0.0.1:5173";

function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

router.get("/login", function (req, res) {
  const redirectPath = req.query.redirect || redirect_url + "/";
  const state = generateRandomString(16) + "::" + redirectPath;
  const scope = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-top-read",
    "user-read-recently-played",
  ].join(" ");

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

router.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  // redirected if bad state (tampered)
  if (state === null) {
    res.redirect(
      redirect_url +
        "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // set up post req
    const [stateValue, redirectPath] = state.split("::");
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        request.get(
          {
            url: "https://api.spotify.com/v1/me",
            headers: {
              Authorization: "Bearer " + access_token,
            },
            json: true,
          },
          // add user to db
          async (err, response, profile) => {
            if (!err && response.statusCode === 200) {
              const userId = profile.id;
              const email = profile.email;
              const displayName = profile.display_name;

              const userRef = db.collection("users").doc(userId);
              const userDoc = await userRef.get();

              const data = {
                email: email,
                name: displayName,
              };

              // create new user if not already exists
              try {
                if (!userDoc.exists) {
                  await userRef.set({
                    ...data,
                    displayedArtists: [],
                    displayedSongs: [],
                    bio: "Music Lover!",
                    profile_picture: profile.images[0].url,
                  });
                } else {
                  // await db
                  //   .collection("users")
                  //   .doc(userId)
                  //   .set(data, { merge: true });
                }
              } catch (e) {
                console.error("Error creating/updating user info: ", e);
              }

              // set cookies
              res.cookie("access_token", access_token, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 3600 * 1000,
              });

              res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 30 * 24 * 3600 * 1000,
              });

              res.redirect(
                redirectPath ? redirect_url + redirectPath : redirect_url + "/"
              );
            } else {
              console.error("Error fetching Spotify profile:", err || profile);
              res.redirect(
                redirect_url +
                  "/#" +
                  querystring.stringify({
                    error: "profile_fetch_failed",
                  })
              );
            }
          }
        );
      } else {
        console.error("Token exchange failed:", body || error);
        res.redirect(
          redirect_url +
            "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

router.get("/logout", (req, res) => {
  // clears cookies to logout
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json({ message: "User logged out. " });
});

router.get("/me", async (req, res) => {
  let access_token = req.cookies.access_token;
  let refresh_token = req.cookies.refresh_token;

  // access token is expired
  if (!access_token) {
    // refresh token is also expired (need to log back in)
    if (!refresh_token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const new_access_token = body.access_token;
        const new_refresh_token = body.refresh_token || refresh_token;

        // store new access token in cookies
        res.cookie("access_token", new_access_token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 3600 * 1000,
        });

        request.get(
          {
            url: "https://api.spotify.com/v1/me",
            headers: {
              Authorization: "Bearer " + new_access_token,
            },
            json: true,
          },
          function (err, response, userData) {
            if (!err && response.statusCode === 200) {
              return res.json(userData);
            } else {
              return res
                .status(500)
                .json({ error: "Failed to fetch user profile" });
            }
          }
        );
      } else {
        return res.status(401).json({ error: "Failed to refresh token" });
      }
    });
  } else {
    // access token is valid still
    request.get(
      {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        json: true,
      },
      function (err, response, userData) {
        if (!err && response.statusCode === 200) {
          res.json(userData);
        } else {
          res.status(500).json({ error: "Failed to fetch user profile" });
        }
      }
    );
  }
});

router.get("/liked-songs", async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  let access_token = req.cookies.access_token;
  let refresh_token = req.cookies.refresh_token;

  const fetchSaved = (token) =>
    new Promise((resolve, reject) => {
      request.get(
        {
          url: "https://api.spotify.com/v1/me/tracks",
          qs: { limit, offset },
          headers: { Authorization: "Bearer " + token },
          json: true,
        },
        (err, { statusCode }, body) => {
          if (err) return reject(err);
          if (statusCode === 401) return reject({ code: 401 });
          if (statusCode !== 200) return reject(body);
          resolve(body);
        }
      );
    });

  try {
    const data = await fetchSaved(access_token);
    const tracks = data.items.map(({ added_at, track }) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images?.[1]?.url ?? "",
      preview: track.preview_url,
      added_at,
    }));
    return res.json({
      tracks,
      nextOffset: +offset + tracks.length,
      total: data.total,
    });
  } catch (e) {
    if (e.code === 401 && refresh_token) {
      /* refresh then retry once */
      request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          form: { grant_type: "refresh_token", refresh_token },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(client_id + ":" + client_secret).toString("base64"),
          },
          json: true,
        },
        async (err, r, body) => {
          if (err || r.statusCode !== 200)
            return res.status(401).json({ error: "token_refresh_failed" });

          access_token = body.access_token;
          res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 3600 * 1000,
          });

          try {
            const data = await fetchSaved(access_token);
            const tracks = data.items.map(({ added_at, track }) => ({
              id: track.id,
              name: track.name,
              artists: track.artists.map((a) => a.name).join(", "),
              albumArt: track.album.images?.[1]?.url ?? "",
              preview: track.preview_url,
              added_at,
            }));
            return res.json({
              tracks,
              nextOffset: +offset + tracks.length,
              total: data.total,
            });
          } catch (err2) {
            console.error(err2);
            return res.status(500).json({ error: "spotify_fetch_failed" });
          }
        }
      );
    } else {
      console.error(e);
      return res.status(500).json({ error: "spotify_fetch_failed" });
    }
  }
});

router.get("/top-artists", async (req, res) => {
  let access_token = req.cookies.access_token;
  let refresh_token = req.cookies.refresh_token;

  if (!access_token) {
    if (!refresh_token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    // Refresh token logic
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token || refresh_token;

        // store new access token in cookies
        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 3600 * 1000,
        });

        // Now fetch top artists with new token
        fetchTopArtists(access_token);
      } else {
        return res.status(401).json({ error: "Failed to refresh token" });
      }
    });
  } else {
    // If we have a valid access token, use it directly
    fetchTopArtists(access_token);
  }

  function fetchTopArtists(token) {
    const timeRange = req.query.time_range || 'medium_term'; // short_term, medium_term, or long_term
    const limit = req.query.limit || 20;

    request.get(
      {
        url: `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          return res.json(body);
        } else {
          console.error("Error fetching top artists:", error || body);
          return res.status(500).json({ error: "Failed to fetch top artists" });
        }
      }
    );
  }
});

router.get("/recently-played", async (req, res) => {
  const limit         = req.query.limit || 5;
  let   access_token  = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  const fetchRecent = (token) => new Promise((resolve, reject) => {
    request.get(
      {
        url: "https://api.spotify.com/v1/me/player/recently-played",
        qs:  { limit },
        headers: { Authorization: "Bearer " + token },
        json: true,
      },
      (err, { statusCode }, body) => {
        if (err)               return reject(err);
        if (statusCode === 401) return reject({ code: 401 });
        if (statusCode !== 200) return reject(body);
        resolve(body);
      }
    );
  });

  try {
    const data = await fetchRecent(access_token);
    const songs = data.items.map(({ track }) => ({
      id:   track.id,
      name: track.name,
    }));
    res.json({ songs });
  } catch (e) {
    if (e.code === 401 && refresh_token) {
      request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          form: { grant_type: "refresh_token", refresh_token },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
          },
          json: true,
        },
        async (err2, r2, body2) => {
          if (err2 || r2.statusCode !== 200)
            return res.status(401).json({ error: "token_refresh_failed" });

          access_token = body2.access_token;
          res.cookie("access_token", access_token, {
            httpOnly: true, secure: false, sameSite: "Lax", maxAge: 3600 * 1000,
          });

          try {
            const data2 = await fetchRecent(access_token);
            const songs = data2.items.map(({ track }) => ({
              id: track.id,
              name: track.name,
            }));
            res.json({ songs });
          } catch (e2) {
            res.status(500).json({ error: "spotify_fetch_failed" });
          }
        }
      );
    } else {
      res.status(500).json({ error: "spotify_fetch_failed" });
    }
  }
});

module.exports = router;
