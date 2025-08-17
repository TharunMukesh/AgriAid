import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAlwhdlweyRf4RLXnZRs_Net1nTfZWSrOs",
    authDomain: "agriculture-47132.firebaseapp.com",
    projectId: "agriculture-47132",
    storageBucket: "agriculture-47132.firebasestorage.app",
    messagingSenderId: "660108076827",
    appId: "1:660108076827:web:0858085bd5124fca4d55be",
    measurementId: "G-0L58C88X03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {
    auth,
    db,
    analytics
};
