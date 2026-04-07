<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDHkhd7O2rJ2goNTCudeRUxQjrTFe2KoHc",
  authDomain: "my-software-portal.firebaseapp.com",
  projectId: "my-software-portal",
  storageBucket: "my-software-portal.firebasestorage.app",
  messagingSenderId: "1072405993700",
  appId: "1:1072405993700:web:b66ca016c8de667d46f4f1",
  measurementId: "G-KCJEWVQM61"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Login function
async function executeLogin() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Logged in as:", user.email);
        alert("Login successful: " + user.email);
    } catch(err) {
        console.error("Login Error:", err.message);
        alert("Login failed: " + err.message);
    }
}

// Example button
document.getElementById("topAuthBtn").addEventListener("click", executeLogin);
</script>