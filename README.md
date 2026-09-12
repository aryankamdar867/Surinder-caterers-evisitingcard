# SPHL — 3D Digital Interactive Visiting Card

A luxury 3D interactive digital business card application built for **Surinder Prime Hospitality Private Ltd. (SPHL)**, featuring realistic 3D lighting, smooth card drag-and-flip physics, direct contact export (vCard), and instant networking actions.

---

## 🌟 Features

- **Realistic 3D Card Engine**:
  - Smooth 360° mouse drag / touch swiping in 3D space with inertia damping.
  - Specular gold foil reflection and lighting glare tracking viewing angle.
  - Centered **"Flip Card"** button & direct tap-to-flip interaction.
- **Accurate Front & Back Corporate Design**:
  - **Front Side**: SPHL branding, golden diamond filigree accents, executive details, and contact buttons.
  - **Back Side**: **"OUR BRANDS"** showcase reproducing:
    - *Khalsa Junction*
    - *Surinder Caterers*
    - *Sant Da Chulha*
    - *Mahalaxmi Khaman Dhokla*
    - *Head Office Address (Shop No. 95, Patil Plaza, Mitra Mandal Colony, Pune - 411009)*
- **Multi-Profile Selector**:
  - Instant switching between **Arjun Pansarey**, **Girish Pansarey**, and **Javed Shaikh**.
  - URL query parameter support (e.g. `?card=girish`, `?card=javed`) to open direct cards via custom links or QR codes.
- **1-Tap Networking Hub**:
  - **Save to Phone Contacts**: 1-tap `.vcf` vCard download.
  - **Direct Actions**: Instant Call, WhatsApp (with greeting), Email, Google Maps Office Directions, and Web Share.

---

## 🚀 Live Deployment via GitHub Pages

To host this digital card live online for free on GitHub Pages:

1. Go to this repository on GitHub: `https://github.com/aryankamdar867/Surinder-caterers-evisitingcard`
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and root `/` folder, then click **Save**.
4. Within a minute, your card will be live at:
   `https://aryankamdar867.github.io/Surinder-caterers-evisitingcard/`
5. You can generate a QR code pointing to that URL to print on physical cards or banners!

---

## 💻 Local Preview

Run any local HTTP server in this directory:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.