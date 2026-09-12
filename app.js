/* ==========================================================================
   SPHL 3D DIGITAL BUSINESS CARD — CORE APPLICATION JAVASCRIPT
   ========================================================================== */

// --- 1. PROFILES DATABASE ---
const PROFILES = {
  arjun: {
    id: "arjun",
    name: "ARJUN PANSAREY",
    fullName: "Arjun Pansarey",
    role: "BUSINESS DEVELOPMENT MANAGER",
    phone: "+918452000345",
    phoneDisplay: "+91 8452000345",
    email: "sales@sphl.in",
    avatarInitials: "AP",
    whatsappMsg: "Hello Arjun, I connected with you via your SPHL Digital Business Card."
  },
  girish: {
    id: "girish",
    name: "GIRISH PANSAREY",
    fullName: "Girish Pansarey",
    role: "PROJECT MANAGER",
    phone: "+919892000345",
    phoneDisplay: "+91 9892000345",
    email: "admin@sphl.in",
    avatarInitials: "GP",
    whatsappMsg: "Hello Girish, I connected with you via your SPHL Digital Business Card."
  },
  javed: {
    id: "javed",
    name: "JAVED SHAIKH",
    fullName: "Javed Shaikh",
    role: "OPERATIONS MANAGER",
    phone: "+919921215763",
    phoneDisplay: "+91 99212 15763",
    email: "operations@sphl.in",
    avatarInitials: "JS",
    whatsappMsg: "Hello Javed, I connected with you via your SPHL Digital Business Card."
  }
};

let currentProfileId = "arjun";
let isFlipped = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let velX = 0;
let velY = 0;

// DOM Elements
const card3D = document.getElementById("card3D");
const cardViewport = document.getElementById("cardViewport");
const cardName = document.getElementById("cardName");
const cardRole = document.getElementById("cardRole");
const cardPhoneLink = document.getElementById("cardPhoneLink");
const cardPhoneText = document.getElementById("cardPhoneText");
const cardEmailLink = document.getElementById("cardEmailLink");
const cardEmailText = document.getElementById("cardEmailText");

const tileCall = document.getElementById("tileCall");
const tileWhatsapp = document.getElementById("tileWhatsapp");
const tileEmail = document.getElementById("tileEmail");
const toast = document.getElementById("toast");

// --- 2. AUDIO SYNTHESIZER (Tactile feedback) ---
let audioCtx = null;
function playSound(type = "click") {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === "flip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    // Silent fallback
  }
}

// --- 3. 3D INTERACTIVE PHYSICS ENGINE ---
function init3DEngine() {
  cardViewport.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  let hasMoved = false;
  cardViewport.addEventListener("pointerdown", () => { hasMoved = false; });
  cardViewport.addEventListener("pointermove", () => { hasMoved = true; });
  cardViewport.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    if (!hasMoved) {
      toggleCardFlip();
    }
  });

  requestAnimationFrame(renderLoop);
}

function onPointerDown(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  velX = 0;
  velY = 0;
}

function onPointerMove(e) {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  startX = e.clientX;
  startY = e.clientY;

  velX = deltaX * 0.45;
  velY = -deltaY * 0.45;

  targetRotY += velX;
  targetRotX = Math.max(-45, Math.min(45, targetRotX + velY));
}

function onPointerUp() {
  isDragging = false;
}

// Main 3D Animation Loop
function renderLoop() {
  if (!isDragging) {
    velX *= 0.92;
    velY *= 0.92;
    targetRotY += velX;
    targetRotX = Math.max(-45, Math.min(45, targetRotX + velY));
  }

  // Smooth Interpolation
  currentRotX += (targetRotX - currentRotX) * 0.15;
  currentRotY += (targetRotY - currentRotY) * 0.15;

  // Apply 3D Transform
  card3D.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

  // Dynamic Glare Angle & Opacity
  const glareAngle = (135 + currentRotY * 0.8 + currentRotX * 0.5) % 360;
  const glareOpacity = Math.max(0.08, Math.min(0.55, 0.28 + Math.abs(Math.sin(currentRotY * Math.PI / 180)) * 0.25));

  document.documentElement.style.setProperty("--glare-angle", `${glareAngle}deg`);
  document.documentElement.style.setProperty("--glare-opacity", glareOpacity.toFixed(2));

  requestAnimationFrame(renderLoop);
}

// Flip Card Action
function toggleCardFlip() {
  playSound("flip");
  isFlipped = !isFlipped;
  targetRotY = isFlipped ? 180 : 0;
  targetRotX = 0;
  velX = 0;
  velY = 0;
}

// --- 4. PROFILE SWITCHING ---
function switchProfile(profileId) {
  if (!PROFILES[profileId]) return;
  currentProfileId = profileId;
  playSound("click");

  const p = PROFILES[profileId];

  // Update Tabs
  document.querySelectorAll(".profile-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-profile") === profileId);
  });

  // Smoothly update Card Front Information
  cardName.textContent = p.name;
  cardRole.textContent = p.role;
  cardPhoneLink.href = `tel:${p.phone}`;
  cardPhoneText.textContent = p.phoneDisplay;
  cardEmailLink.href = `mailto:${p.email}`;
  cardEmailText.textContent = p.email;

  // Update Action Tiles
  tileCall.href = `tel:${p.phone}`;
  tileWhatsapp.href = `https://wa.me/${p.phone.replace("+", "")}?text=${encodeURIComponent(p.whatsappMsg)}`;
  tileEmail.href = `mailto:${p.email}?subject=Connecting%20via%20SPHL%20Digital%20Card`;

  // Subtle confetti burst on switch
  triggerConfetti();

  // Update URL without page reload
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("card", profileId);
  window.history.replaceState({}, "", newUrl);
}

// Check URL query param on initial load
function checkUrlProfile() {
  const params = new URLSearchParams(window.location.search);
  const cardParam = params.get("card") || params.get("profile") || params.get("p");
  if (cardParam && PROFILES[cardParam.toLowerCase()]) {
    switchProfile(cardParam.toLowerCase());
  } else {
    switchProfile("arjun");
  }
}

// --- 5. VCARD (.VCF) DOWNLOAD ---
function downloadVCard() {
  playSound("success");
  const p = PROFILES[currentProfileId];

  const vCardData = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.fullName}`,
    `N:${p.fullName.split(" ").slice(1).join(" ")};${p.fullName.split(" ")[0]};;;`,
    "ORG:Surinder Prime Hospitality Private Ltd. (SPHL)",
    `TITLE:${p.role}`,
    `TEL;TYPE=CELL,VOICE,PREF:${p.phone}`,
    `EMAIL;TYPE=WORK,INTERNET,PREF:${p.email}`,
    "ADR;TYPE=WORK:;;Shop No. 95, Patil Plaza, Mitra Mandal Colony;Pune;Maharashtra;411009;India",
    "URL:https://sphl.in",
    "NOTE:Brands: Khalsa Junction | Surinder Caterers | Sant Da Chulha | Mahalaxmi Khaman Dhokla",
    "END:VCARD"
  ].join("\r\n");

  const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.fullName.replace(" ", "_")}_SPHL.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  triggerConfetti();
  showToast(`Saved ${p.fullName} to your contacts!`);
}

// --- 6. SHARE DIGITAL CARD (Web Share / Copy Link) ---
function shareDigitalCard() {
  playSound("click");
  const p = PROFILES[currentProfileId];
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("card", currentProfileId);
  const shareUrl = currentUrl.toString();

  if (navigator.share) {
    navigator.share({
      title: `${p.fullName} — SPHL Digital Visiting Card`,
      text: `Digital business card for ${p.fullName} (${p.role}) at Surinder Prime Hospitality Pvt. Ltd.`,
      url: shareUrl
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Card link copied to clipboard!");
    });
  } else {
    showToast("Link: " + shareUrl);
  }
}

// --- 7. THEME & TOAST UTILITIES ---
function toggleTheme() {
  playSound("click");
  const isCurrentlyLight = document.body.classList.contains("theme-light");
  if (isCurrentlyLight) {
    document.body.classList.remove("theme-light");
    document.body.classList.add("theme-luxury");
  } else {
    document.body.classList.remove("theme-luxury");
    document.body.classList.add("theme-light");
  }
  
  const icon = document.getElementById("themeIcon");
  if (document.body.classList.contains("theme-light")) {
    icon.setAttribute("data-lucide", "moon");
  } else {
    icon.setAttribute("data-lucide", "sun-medium");
  }
  if (window.lucide) lucide.createIcons();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#fef08a", "#d4af37", "#b8860b", "#0f172a", "#10b981"]
    });
  }
}

// --- 8. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  init3DEngine();
  checkUrlProfile();
});
