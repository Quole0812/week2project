const db = require("../firebase");
const express = require("express");
const router = express.Router();


// get all posts 

router.get("/posts", async (req, res) => {
    try {
        const ss = await db.collection("posts").orderBy("createdAt", "desc").get();
        const posts = ss.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(posts);
    } catch (error) {
        console.error("my brother in christ i can't get the posts");
        res.status(500).json({ error: 'Internal server error'});
    }
})

// post method create a post
router.post("/posts", async (req, res) => {
    try {
      const { userId, title, content, flair } = req.body; 
    const post = {
        userId, 
        title, 
        content, 
        flair,
        upvote: 0,
        commentCount: 0,
        createdAt: new Date(),
    };
    const ref = await db.collection("posts").add(post);
    res.json({ id: ref.id, message: "the post is made yuh" });
    } catch (error) {
      console.error("uh i can't make the post", error)
      res.status(500).json({ error: 'Internal server error'});
    }
});

//post method, upvote a post
router.post("/posts/:postId/upvote", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const voteRef = db.collection("upvotes").doc(`${userId}_${postId}`);
  const voteDoc = await voteRef.get();

  if (voteDoc.exists) {
    return res.status(400).json({ message: "Already upvoted" });
  }

  // Save upvote record of the person
  await voteRef.set({ userId, postId, type: "upvote", timestamp: new Date() });

  // then we increment the count
  await db.collection("posts").doc(postId).update({
    upvotes: admin.firestore.FieldValue.increment(1),
  });

  res.json({ message: "Upvote added" });
});


router.get("/users", async (req, res) => {
  // const id = req.params.id;
  try {
        const ss = await db.collection("users").get();
        const users = ss.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        console.error("my brother in christ i can't get the users");
        res.status(500).json({ error: 'Internal server error'});
    }
});


module.exports = router;