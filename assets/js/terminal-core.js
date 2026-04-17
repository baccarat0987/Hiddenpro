import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// --- CONFIGURATION ---
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

// --- DOM ELEMENTS ---
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const statusMsg = document.getElementById('statusMsg');
const topAuthBtn = document.getElementById('topAuthBtn');
const authBtnText = document.getElementById('authBtnText');
const premiumBadge = document.getElementById('premiumBadge');
const softwareContainer = document.getElementById('softwareList');

// --- SOFTWARE DATABASE ---
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

// --- INITIALIZE UI ---
if (softwareContainer) {
    softwareList.forEach(s => {
        const card = document.createElement('div');
        card.classList.add('sw-card');
        card.innerHTML = `
            <div>
                <h2>${s.name}</h2>
                <p>${s.desc}</p>
            </div>
            <button onclick="handleEngineClick('${s.name}')">Start Engine</button>`;
        softwareContainer.appendChild(card);
    });
}

// --- CORE FUNCTIONS (Global) ---
window.toggleAuth = async () => {
    if (auth.currentUser) { 
        await signOut(auth); 
    } else { 
        try { 
            await signInWithPopup(auth, provider); 
        } catch(err) { 
            console.error("Auth Error:", err); 
        } 
    }
};

window.handleEngineClick = async (engineName) => {
    if(!auth.currentUser) { 
        await window.toggleAuth(); 
        return; 
    }
    
    const userEmail = auth.currentUser.email.toLowerCase();
    statusMsg.textContent = "VERIFYING ACCESS...";
    const userDoc = await getDoc(doc(db, "users", userEmail));
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const now = new Date().getTime();
        if (userData.expiry === 'LIFETIME' || userData.expiry > now) {
            const appData = softwareList.find(s => s.name === engineName);
            if (appData) {
                statusMsg.textContent = "ACCESS GRANTED: LAUNCHING...";
                setTimeout(() => { window.location.href = appData.file; }, 1000);
                return;
            }
        }
    }
    statusMsg.textContent = "ACCESS DENIED: PAYMENT REQUIRED";
    window.openPricing();
};

window.openPricing = async () => {
    const priceDoc = await getDoc(doc(db, "settings", "pricing"));
    const p = priceDoc.exists() ? priceDoc.data() : { p1:300, p3_new:400, p12_new:1600, p_life:5000 };
    overlay.style.display = "flex";
    overlayContent.innerHTML = `
        <h1 style="letter-spacing:10px; margin-bottom:10px; font-size:40px;">ELITE ACCESS</h1>
        <p style="color: #00ffff; margin-bottom:40px;">Choose a subscription to unlock all professional tools.</p>
        <div class="card-wrap">
            <div class="p-card" onclick="buy(${p.p1})"><h3>1 MONTH</h3><div class="price">$${p.p1}</div><div class="btn-buy">PURCHASE</div></div>
            <div class="p-card" onclick="buy(${p.p3_new})"><h3>3 MONTHS</h3><div class="price">$${p.p3_new}</div><div class="btn-buy">PURCHASE</div></div>
            <div class="p-card" onclick="buy(${p.p12_new})"><h3>1 YEAR</h3><div class="price">$${p.p12_new}</div><div class="btn-buy">PURCHASE</div></div>
            <div class="p-card" onclick="buy(${p.p_life})"><h3>LIFETIME</h3><div class="price" style="font-size:28px;">$${p.p_life}</div><div class="btn-buy">PURCHASE</div></div>
        </div>
    `;
};

window.buy = (amt) => {
    if (!auth.currentUser) {
        alert("Please login first.");
        window.toggleAuth();
        return;
    }
    const email = auth.currentUser.email.toLowerCase();
    const paypalURL = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=edzelkeith0@gmail.com&amount=${amt}&currency_code=USD&item_name=Elite_Terminal_Access&custom=${email}&return=https://hiddenpro.qzz.io`;
    window.location.href = paypalURL;
};

window.closeOverlay = () => { 
    overlay.style.display = "none"; 
};

// --- AUTH STATE OBSERVER ---
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
            } else {
                premiumBadge.style.display = "none";
            }
        }
    } else {
        statusMsg.textContent = "SYSTEM STATUS: OFFLINE";
        authBtnText.textContent = "GMAIL LOGIN";
        topAuthBtn.classList.remove('logged-in');
        premiumBadge.style.display = "none";
    }
});

// --- ATTACH LISTENERS ---
topAuthBtn.addEventListener('click', window.toggleAuth);
