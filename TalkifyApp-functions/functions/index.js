const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const config = {
  apiKey: "AIzaSyAmvAlYqUq_pqtF1NhIVuWiFkpYmufq3bg",
  authDomain: "talkifyapp-7a461.firebaseapp.com",
  databaseURL: "https://talkifyapp-7a461.firebaseio.com",
  projectId: "talkifyapp-7a461",
  storageBucket: "talkifyapp-7a461.appspot.com",
  messagingSenderId: "189219151978",
  appId: "1:189219151978:web:80dfcd528195920810ea13",
};

const express = require("express");
const app = express();

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

exports.api = functions.region("asia-northeast1").https.onRequest(app);
