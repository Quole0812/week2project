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
  var state = generateRandomString(16);
  var scope = "user-read-private user-read-email";

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
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // set up post req
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
                    bio: "",
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

              // TODO: change redirect to dashboard url
              res.redirect("/");
            } else {
              console.error("Error fetching Spotify profile:", err || profile);
              res.redirect(
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

  //TODO: replace with dashboard url
  res.redirect("/");
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
        const refresh_token = body.refresh_token || refresh_token;

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
              res.json(userData);
            } else {
              res.status(500).json({ error: "Failed to fetch user profile" });
            }
          }
        );
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

module.exports = router;
