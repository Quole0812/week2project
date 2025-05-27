// import { initializeApp } from "firebase/app";
// const dotenv = require("dotenv");
// dotenv.config();

// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// export { db };

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const serviceAccount = require("./permissions.json");

const app = initializeApp(serviceAccount);
const db = getFirestore(app);

module.exports = db;
