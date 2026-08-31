# Baba Jewellers (बाबा ज्वेलर्स) — Official Website

A luxury, static website for **Baba Jewellers**, located near Mangalnath Temple, Mangale, Sangli, Maharashtra.

Built with clean HTML5, CSS3, and Vanilla JavaScript with **zero build step and zero dependencies**.

---

## ✨ Features

1. **👑 Modern Luxury Design**: Emerald green, royal champagne gold, and ivory aesthetics tailored for an authentic Indian jewellery showroom.
2. **📈 Live Real-Time Gold & Silver Rates**:
   - Automated live rate engine (24K Gold, 22K BIS 916 Hallmark, 18K Designer Gold, 99.9% Silver).
   - Zero-configuration live market feed with automatic domestic tax calibration.
   - Manual override option via `data/rates.json`.
3. **🧮 Interactive Gold & Silver Jewellery Price Estimator**:
   - Calculates metal cost + customizable making charges (8%–15%) + 3% GST.
   - One-click **"Order / Inquire on WhatsApp"** button that sends the exact calculated quotation to WhatsApp.
4. **💎 Heritage Maharashtrian Jewellery Showcase**:
   - Dedicated spotlight on traditional Maharashtrian jewellery: Kolhapuri Saaj (कोल्हापुरी साज), Antique Temple Chokers, Peshwai Nath (पेशवाई नथ), Tode & Patlya (तोडे आणि पाटल्या), and Vati Mangalsutra (वाटी मंगळसूत्र).
5. **🔍 Filterable Collections & Products**:
   - Filter tabs: All, Bridal Sets, Mangalsutra, Bangles & Kadas, Earrings & Jhumkas, Rings, Chains, Silver & Pooja.
   - Individual WhatsApp inquiry buttons with prefilled product names.
6. **🖼️ Showroom Gallery with Lightbox Preview**:
   - Click to zoom and inspect high-resolution jewellery craftsmanship.
7. **📍 Store Visit & Google Maps Integration**:
   - Interactive Google Map embed + GPS directions link.
   - Store hours (10:00 AM – 8:30 PM, Open 7 Days).
   - Quick appointment booking form directly connected to WhatsApp.
8. **📱 Mobile First & SEO Ready**:
   - Sticky top rate ticker, floating WhatsApp & Call buttons, LocalBusiness Schema.org markup for Google Search & Maps ranking.

---

## 📁 File Structure

```
BABA Jewelry/
├── index.html              # Main webpage with all sections
├── css/
│   └── style.css           # Luxury styles, responsive layouts & animations
├── js/
│   ├── rates.js            # Live rate fetcher & price calculator
│   └── main.js             # Navigation, filters, lightbox, booking form
├── data/
│   └── rates.json          # Fallback / manual daily rate values
└── images/                 # High-resolution jewellery & showroom images
```

---

## 🚀 How to Run Locally

You can open `index.html` in any browser, or run a local web server:

```bash
# In terminal inside the folder:
python3 -m http.server 8080
```
Then open: **`http://localhost:8080`**

---

## 🌐 How to Host on the Internet for Free

### Option 1: Netlify (Easiest — 2 Minutes)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `baba-jewellers-website` folder directly into the browser.
3. Your website goes live immediately with a free `.netlify.app` URL and free SSL (HTTPS).
4. You can connect a custom domain like `www.babajewellers.com` anytime in Netlify settings.

### Option 2: GitHub Pages (Free Permanent Hosting)
1. Create a free account at [github.com](https://github.com).
2. Create a new repository named `baba-jewellers`.
3. Upload these files to the repository.
4. Go to **Settings > Pages** -> select branch `main` and click **Save**.
5. Your website will be live at `https://<your-username>.github.io/baba-jewellers/`.

### Option 3: Vercel
1. Go to [vercel.com](https://vercel.com).
2. Import the folder/repository and click **Deploy**.

---

## ⚙️ Customization Guide

- **Phone Number / WhatsApp**:
  - Open `index.html` and search for `9822000000`. Replace it with your actual showroom phone number.
  - Open `js/rates.js` and `js/main.js` and replace `9822000000` with your number.
- **Daily Manual Gold Rates**:
  - Open `data/rates.json` and change the numbers anytime.
- **Custom Photos**:
  - Drop your own photos into the `images/` directory with the corresponding names.
