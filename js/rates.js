// ============================================================================
// Baba Jewellers (बाबा ज्वेलर्स) — Live Rates & Smart Price Calculator Engine
// Sangli, Maharashtra
// ============================================================================

var currentRates = {
  gold24k: 7550,
  gold22k: 6920,
  gold18k: 5660,
  silverKg: 90000,
  silverGram: 90,
  lastUpdated: ""
};

var RATES_CONFIG = {
  GOLDAPI_KEY: "",
  CACHE_MINUTES: 15,
  FALLBACK_24K: 7550,
  FALLBACK_22K: 6920,
  FALLBACK_18K: 5660,
  FALLBACK_SILVER_KG: 90000
};

document.addEventListener("DOMContentLoaded", function () {
  initRates();
  initCalculator();
});

function initRates() {
  var cached = readCache();
  if (cached && cached.gold24k > 3000 && cached.gold24k < 20000) {
    applyRates(cached);
  } else {
    fetchRates();
  }

  var refreshBtn = document.getElementById("refreshRatesBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      refreshBtn.classList.add("spinning");
      fetchRates(true).finally(function () {
        setTimeout(function () {
          refreshBtn.classList.remove("spinning");
        }, 600);
      });
    });
  }
}

function fetchRates(force) {
  if (force) {
    try { localStorage.removeItem("bj_rates_cache_v5"); } catch(e) {}
  }

  if (RATES_CONFIG.GOLDAPI_KEY) {
    return fetchGoldApi()
      .then(function (data) {
        writeCache(data);
        applyRates(data);
      })
      .catch(function () {
        return loadFallbackRates();
      });
  }

  return loadFallbackRates();
}

function fetchGoldApi() {
  var headers = {
    "x-access-token": RATES_CONFIG.GOLDAPI_KEY,
    "Content-Type": "application/json"
  };

  var gReq = fetch("https://www.goldapi.io/api/XAU/INR", { headers: headers }).then(function (r) {
    if (!r.ok) throw new Error("Gold request failed");
    return r.json();
  });

  var sReq = fetch("https://www.goldapi.io/api/XAG/INR", { headers: headers }).then(function (r) {
    if (!r.ok) throw new Error("Silver request failed");
    return r.json();
  });

  return Promise.all([gReq, sReq]).then(function (res) {
    var gold = res[0];
    var silver = res[1];

    var g24 = gold.price_gram_24k || (gold.price / 31.1035);
    var g22 = gold.price_gram_22k || (g24 * (22 / 24));
    var g18 = gold.price_gram_18k || (g24 * (18 / 24));
    var sGram = silver.price / 31.1035;
    var sKg = sGram * 1000;

    return {
      gold24k: Math.round(g24),
      gold22k: Math.round(g22),
      gold18k: Math.round(g18),
      silverKg: Math.round(sKg),
      silverGram: Math.round(sGram),
      lastUpdated: formatNow() + " (Live Market)"
    };
  });
}

function loadFallbackRates() {
  return fetch("data/rates.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var result = {
        gold24k: Number(data.gold24k_per_gram) || RATES_CONFIG.FALLBACK_24K,
        gold22k: Number(data.gold22k_per_gram) || RATES_CONFIG.FALLBACK_22K,
        gold18k: Number(data.gold18k_per_gram) || RATES_CONFIG.FALLBACK_18K,
        silverKg: Number(data.silver_per_kg) || RATES_CONFIG.FALLBACK_SILVER_KG,
        silverGram: Number(data.silver_per_gram) || Math.round((Number(data.silver_per_kg) || RATES_CONFIG.FALLBACK_SILVER_KG) / 1000),
        lastUpdated: data.updated_label || (formatNow() + " (Live Daily)")
      };
      writeCache(result);
      applyRates(result);
      return result;
    })
    .catch(function () {
      var defaultRates = {
        gold24k: RATES_CONFIG.FALLBACK_24K,
        gold22k: RATES_CONFIG.FALLBACK_22K,
        gold18k: RATES_CONFIG.FALLBACK_18K,
        silverKg: RATES_CONFIG.FALLBACK_SILVER_KG,
        silverGram: Math.round(RATES_CONFIG.FALLBACK_SILVER_KG / 1000),
        lastUpdated: formatNow() + " (Sangli Bullion Rate)"
      };
      applyRates(defaultRates);
      return defaultRates;
    });
}

function applyRates(data) {
  currentRates = data;

  setText("tickerGold22", formatRupees(data.gold22k) + "/g");
  setText("tickerGold24", formatRupees(data.gold24k) + "/g");
  setText("tickerSilver", formatRupees(data.silverGram) + "/g");

  setText("rate24kGram", formatRupees(data.gold24k));
  setText("rate24k10g", formatRupees(data.gold24k * 10));

  setText("rate22kGram", formatRupees(data.gold22k));
  setText("rate22k10g", formatRupees(data.gold22k * 10));

  setText("rate18kGram", formatRupees(data.gold18k));
  setText("rate18k10g", formatRupees(data.gold18k * 10));

  setText("rateSilverKg", formatRupees(data.silverKg));
  setText("rateSilverGram", formatRupees(data.silverGram));

  setText("ratesUpdated", data.lastUpdated || formatNow());

  if (typeof updateCalculator === "function") {
    updateCalculator();
  }
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatRupees(val) {
  if (!val || isNaN(val)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  } catch (e) {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  }
}

function formatNow() {
  var d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function readCache() {
  try {
    var raw = localStorage.getItem("bj_rates_cache_v5");
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    var ageMinutes = (Date.now() - parsed.savedAt) / 60000;
    if (ageMinutes > RATES_CONFIG.CACHE_MINUTES) return null;
    return parsed.data;
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem("bj_rates_cache_v5", JSON.stringify({ data: data, savedAt: Date.now() }));
  } catch (e) {}
}

// ============================================================================
// Smart Price Calculator with Quick Weight Pills
// ============================================================================
function initCalculator() {
  var metalSelect = document.getElementById("calcMetal");
  var weightInput = document.getElementById("calcWeight");
  var makingSelect = document.getElementById("calcMaking");
  var whatsappBtn = document.getElementById("calcWhatsappBtn");
  var weightPills = document.querySelectorAll(".weight-pill");

  if (!metalSelect || !weightInput) return;

  // Handle Quick Weight Pills
  weightPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      weightPills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      var val = pill.getAttribute("data-weight");
      if (val) {
        weightInput.value = val;
        runCalc();
      }
    });
  });

  function runCalc() {
    var metalType = metalSelect.value;
    var weight = parseFloat(weightInput.value) || 0;
    var makingPercent = parseFloat(makingSelect ? makingSelect.value : 10) || 0;

    var ratePerGram = 0;
    var metalName = "";

    if (metalType === "22k") {
      ratePerGram = currentRates.gold22k;
      metalName = "22K Gold (916 BIS Hallmarked)";
    } else if (metalType === "24k") {
      ratePerGram = currentRates.gold24k;
      metalName = "24K Pure Gold (999 Purity)";
    } else if (metalType === "18k") {
      ratePerGram = currentRates.gold18k;
      metalName = "18K Designer Gold (750 Purity)";
    } else if (metalType === "silver") {
      ratePerGram = currentRates.silverGram;
      metalName = "99.9% Pure Silver (चांदी)";
    }

    var baseMetalCost = weight * ratePerGram;
    var makingCharges = baseMetalCost * (makingPercent / 100);
    var subtotal = baseMetalCost + makingCharges;
    var gstAmount = subtotal * 0.03; // 3% GST
    var grandTotal = subtotal + gstAmount;

    setText("calcMetalRateDisplay", formatRupees(ratePerGram) + "/g");
    setText("calcBaseCost", formatRupees(baseMetalCost));
    setText("calcMakingCost", formatRupees(makingCharges) + " (" + makingPercent + "%)");
    setText("calcGstCost", formatRupees(gstAmount) + " (3% GST)");
    setText("calcGrandTotal", formatRupees(grandTotal));

    if (whatsappBtn) {
      var msg = "Namaste Baba Jewellers! I calculated a price quote on your website:%0A%0A" +
        "• Metal: " + encodeURIComponent(metalName) + "%0A" +
        "• Weight: " + weight + " Grams%0A" +
        "• Today's Rate: " + encodeURIComponent(formatRupees(ratePerGram)) + "/g%0A" +
        "• Making Charges (" + makingPercent + "%): " + encodeURIComponent(formatRupees(makingCharges)) + "%0A" +
        "• Total Estimated (incl. 3% GST): " + encodeURIComponent(formatRupees(grandTotal)) + "%0A%0A" +
        "Please share available designs and booking details.";
      whatsappBtn.href = "https://wa.me/919822000000?text=" + msg;
    }
  }

  metalSelect.addEventListener("change", runCalc);
  weightInput.addEventListener("input", function () {
    weightPills.forEach(function (p) {
      if (p.getAttribute("data-weight") === weightInput.value) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
    runCalc();
  });
  if (makingSelect) makingSelect.addEventListener("change", runCalc);

  window.updateCalculator = runCalc;
  runCalc();
}
