import admin from "firebase-admin";

const serviceAccount = require('../serviceAccountKey.json');

const fire = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default fire