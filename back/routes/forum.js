const db = require("../firebase");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}


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
        upvotes: 0,
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

router.get("/posts/:postId", async (req, res) => {
const { postId } = req.params;
  try {
    const doc = await db.collection("posts").doc(postId).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }

})


router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const snapshot = await db
      .collection("comments")
      .where("postId", "==", postId)
      // .orderBy("createdAt", "asc")
      .get();

    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (error) {
    console.error("cant get comment fam", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  const newComment = {
    postId,
    userId,
    content,
    createdAt: new Date(),
  };

  try {
    const ref = await db.collection("comments").add(newComment);

    // increment the comment count
    await db.collection("posts").doc(postId).update({
      commentCount: admin.firestore.FieldValue.increment(1),
    });

    res.status(201).json({ id: ref.id, message: "Comment added" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})




module.exports = router;