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

const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
