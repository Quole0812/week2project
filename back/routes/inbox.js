const db = require("../firebase");
const request = require("request");

const express = require("express");
const router = express.Router();

router.get("/getChats/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const chatsSnapshot = await db
      .collection("chats")
      .where("members", "array-contains", id)
      .get();
    const chats = chatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(chats);
  } catch (e) {
    console.log("Error fetching chats: ", e);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

router.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const userRef = await db.collection("users").doc(id);
    const userDoc = await userRef.get();

    res.status(200).json({
      id: userDoc.id,
      ...userDoc.data(),
    });
  } catch (e) {
    console.log("Error fetching users: ", e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/createChat", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    let existingChat = null;
    const chatSnapshot = await db
      .collection("chats")
      .where("members", "array-contains", user1)
      .get();

    chatSnapshot.forEach((doc) => {
      const members = doc.data().members;
      if (members.includes(user2)) {
        existingChat = { id: doc.id, ...doc.data() };
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChatRef = await db.collection("chats").add({
      members: [user1, user2],
      messages: [],
    });

    const newChat = await newChatRef.get();
    return res.status(201).json({ id: newChat.id, ...newChat.data() });
  } catch (e) {
    console.log("Error fetching chat: ", e);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.get("/getChat/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const chatDoc = await db.collection("chats").doc(id).get();

    return res.status(200).json({
      id: chatDoc.id,
      ...chatDoc.data(),
    });
  } catch (e) {
    console.log("Error fetching chat: ", e);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.put("/updateChat", async (req, res) => {
  const { id, chatData } = req.body;

  try {
    const chatRef = db.collection("chats").doc(id);
    const chatRes = await chatRef.set(chatData, { merge: true });
    res.status(200).json({ message: "User updated successfully" });
  } catch (e) {
    console.log("Error updating chat: ", e);
    res.status(500).json({ error: "Failed to update chat" });
  }
});

module.exports = router;
