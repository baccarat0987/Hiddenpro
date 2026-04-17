import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHkhd7O2rJ2goNTCudeRUxQjrTFe2KoHc",
    authDomain: "my-software-portal.firebaseapp.com",
    projectId: "my-software-portal",
    storageBucket: "my-software-portal.firebasestorage.app",
    messagingSenderId: "1072405993700",
    appId: "1:1072405993700:web:b66ca016c8de667d46f4f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const statusMsg = document.getElementById('statusMsg');
const topAuthBtn = document.getElementById('topAuthBtn');
const authBtnText = document.getElementById('authBtnText');
const premiumBadge = document.getElementById('premiumBadge');
const softwareContainer = document.getElementById('softwareList');

const softwareList = [
    {name:"Viper Roulette", file:"viper-roulette.html", desc:"Advanced table tracking with high-velocity pattern recognition."},
    {name:"AI Baccarat Trend", file:"baccarat-trend.html", desc:"Neural network trained on millions of shoes to detect trend shifts."},
    {name:"Baccarat Analysis", file:"baccarat-analysis.html", desc:"Deep statistical breakdown of Banker/Player/Tie probabilities."},
    {name:"Baccarat Pro Series", file:"baccarat-predictor-series.html", desc:"Real-time calculation 7 step engine."},
    {name:"Baccarat PRO", file:"baccarat-pro.html", desc:"The elite version featuring secret sequence 'Neutral Engine' logic."},
    {name:"Roulette PRO", file:"roulette-pro.html", desc:"Precision sector tracking and neighbor betting optimization."},
    {name:"AI Card Counting", file:"card-counting.html", desc:"A digital counter for baccarat variants to keep the edge on your side."},
    {name:"Gemini Ultra", file:"gemini-ultra.html", desc:"AI-integrated terminal for complex casino data interpretation."},
    {name:"Google AI", file:"google-ai.html", desc:"Utilizing massive datasets for pattern loophole identification."},
    {name:"VisionWave Baccarat", file:"visionwave.html", desc:"Visual pattern analysis software for rapid shoe sequences."},
    {name:"Baccarat Neutral Engine", file:"Baccarat-engine.html", desc:"Pattern Analysis that combine trend and match pattern."}
];

// Load software cards
softwareList.forEach(s => {
    const card = document.createElement('div');
    card.classList.add('sw-card');
    card.innerHTML = `<div><h2>${s.name}</h2><p>${s.desc}</p></div><button onclick="handleEngineClick('${s.name}')">Start Engine</button>`;
    softwareContainer.appendChild(card);
});

async function toggleAuth() {
    if (auth.currentUser) { await signOut(auth); } 
    else { try { await signInWithPopup(auth, provider); } catch(err) { console.error(err); } }
}

onAuthStateChanged(auth, async (user) => {
    if(user) {
        statusMsg.textContent = "ENCRYPTED: " + user.email.toUpperCase();
        authBtnText.textContent = "LOGOUT";
        topAuthBtn.classList.add('logged-in');
        const userDoc = await getDoc(doc(db, "users", user.email.toLowerCase()));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const now = new Date().getTime();
            if (userData.expiry === 'LIFETIME' || userData.expiry > now) {
                premiumBadge.style.display = "inline-block";
                statusMsg.textContent = "SYSTEM STATUS: PREMIUM ACTIVE";
            }
        }
    } else {
        statusMsg.textContent = "SYSTEM STATUS: OFFLINE";
        authBtnText.textContent = "GMAIL LOGIN";
        topAuthBtn.classList.remove('logged-in');
        premiumBadge.style.display = "none";
    }
});

window.handleEngineClick = async (engineName) => {
    if(!auth.currentUser) { await toggleAuth(); return; }
    const userEmail = auth.currentUser.email.toLowerCase();
    statusMsg.textContent = "VERIFYING...";
    const userDoc = await getDoc(doc(db, "users", userEmail));
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const now = new Date().getTime();
        if (userData.expiry === 'LIFETIME' || userData.expiry > now) {
            const appData = softwareList.find(s => s.name === engineName);
            if (appData) {
                // SUCCESS: This points to the main folder where your HTML files are
                window.location.href = "/" + appData.file; 
                return;
            }
        }
    }
    openPricing();
};

window.openPricing = async () => {
    const priceDoc = await getDoc(doc(db, "settings", "pricing"));
    const p = priceDoc.exists() ? priceDoc.data() : { p1:300, p3_new:400, p12_new:1600, p_life:5000 };
    overlay.style.display = "flex";
    overlayContent.innerHTML = `<h1 style="letter-spacing:10px; margin-bottom:10px; font-size:40px;">ELITE ACCESS</h1><div class="card-wrap"><div class="p-card" onclick="buy(${p.p1})"><h3>1 MONTH</h3><div class="price">$${p.p1}</div><div class="btn-buy">PURCHASE</div></div><div class="p-card" onclick="buy(${p.p_life})"><h3>LIFETIME</h3><div class="price">$${p.p_life}</div><div class="btn-buy">PURCHASE</div></div></div>`;
};

window.buy = (amt) => {
    const email = auth.currentUser.email.toLowerCase();
    window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=edzelkeith0@gmail.com&amount=${amt}&currency_code=USD&item_name=Elite_Access&custom=${email}&return=https://hiddenpro.qzz.io`;
};

window.closeOverlay = () => { overlay.style.display = "none"; };
topAuthBtn.addEventListener('click', toggleAuth);
