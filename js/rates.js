// ============================================================================
// Baba Jewellers — Live Bullion Rates & Interactive Price Calculator
// Sangli, Maharashtra | Contact: 9168157092 / 9168156528
// ============================================================================

(function () {
  // Benchmark fallback bullion rates (Sangli / Maharashtra Market)
  var defaultRates = {
    gold24k: 7550,   // ₹7,550/g (₹75,500 / 10g)
    gold22k: 6920,   // ₹6,920/g (₹69,200 / 10g 916 Hallmark)
    gold18k: 5660,   // ₹5,660/g (₹56,600 / 10g 750 Hallmark)
    silver: 90,      // ₹90/g (₹90,000 / 1kg)
    gstPercent: 3,
    lastUpdated: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  };

  var currentRates = Object.assign({}, defaultRates);

  function formatCurrency(val) {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  }

  function updateRatesDisplay() {
    // Top Bar Ticker
    var ticker22 = document.getElementById("tickerGold22");
    var ticker24 = document.getElementById("tickerGold24");
    var tickerSilver = document.getElementById("tickerSilver");

    if (ticker22) ticker22.textContent = formatCurrency(currentRates.gold22k) + "/g";
    if (ticker24) ticker24.textContent = formatCurrency(currentRates.gold24k) + "/g";
    if (tickerSilver) tickerSilver.textContent = formatCurrency(currentRates.silver) + "/g";

    // Main Live Rates Section Cards
    var r24g = document.getElementById("rate24kGram");
    var r2410 = document.getElementById("rate24k10g");
    var r22g = document.getElementById("rate22kGram");
    var r2210 = document.getElementById("rate22k10g");
    var r18g = document.getElementById("rate18kGram");
    var r1810 = document.getElementById("rate18k10g");
    var rSilg = document.getElementById("rateSilverGram");
    var rSilKg = document.getElementById("rateSilverKg");
    var rUpdated = document.getElementById("ratesUpdated");

    if (r24g) r24g.textContent = formatCurrency(currentRates.gold24k);
    if (r2410) r2410.textContent = formatCurrency(currentRates.gold24k * 10);

    if (r22g) r22g.textContent = formatCurrency(currentRates.gold22k);
    if (r2210) r2210.textContent = formatCurrency(currentRates.gold22k * 10);

    if (r18g) r18g.textContent = formatCurrency(currentRates.gold18k);
    if (r1810) r1810.textContent = formatCurrency(currentRates.gold18k * 10);

    if (rSilg) rSilg.textContent = formatCurrency(currentRates.silver);
    if (rSilKg) rSilKg.textContent = formatCurrency(currentRates.silver * 1000);

    if (rUpdated) rUpdated.textContent = currentRates.lastUpdated || "Today (Live)";

    // Recalculate price calculator with updated rates
    calculateEstimate();
  }

  function fetchLiveRates() {
    var refreshBtn = document.getElementById("refreshRatesBtn");
    if (refreshBtn) refreshBtn.classList.add("spinning");

    fetch("data/rates.json?t=" + new Date().getTime())
      .then(function (res) {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then(function (data) {
        if (data && data.rates) {
          if (data.rates.gold_24k_10g) currentRates.gold24k = data.rates.gold_24k_10g / 10;
          if (data.rates.gold_22k_10g) currentRates.gold22k = data.rates.gold_22k_10g / 10;
          if (data.rates.gold_18k_10g) currentRates.gold18k = data.rates.gold_18k_10g / 10;
          if (data.rates.silver_1kg) currentRates.silver = data.rates.silver_1kg / 1000;
          if (data.last_updated) currentRates.lastUpdated = data.last_updated;
        }
        updateRatesDisplay();
      })
      .catch(function () {
        updateRatesDisplay();
      })
      .finally(function () {
        if (refreshBtn) {
          setTimeout(function () {
            refreshBtn.classList.remove("spinning");
          }, 400);
        }
      });
  }

  // ==========================================================================
  // Interactive Price Calculator Engine
  // ==========================================================================
  function calculateEstimate() {
    var metalSelect = document.getElementById("calcMetal");
    var weightInput = document.getElementById("calcWeight");
    var makingSelect = document.getElementById("calcMaking");

    if (!metalSelect || !weightInput || !makingSelect) return;

    var metal = metalSelect.value;
    var weight = parseFloat(weightInput.value) || 0;
    var makingPercent = parseFloat(makingSelect.value) || 10;

    if (weight <= 0) weight = 0;

    var ratePerGram = currentRates.gold22k;
    var metalName = "22K Gold (916 BIS Hallmark)";

    if (metal === "24k") {
      ratePerGram = currentRates.gold24k;
      metalName = "24K Pure Gold (999)";
    } else if (metal === "18k") {
      ratePerGram = currentRates.gold18k;
      metalName = "18K Designer Gold (750)";
    } else if (metal === "silver") {
      ratePerGram = currentRates.silver;
      metalName = "99.9% Pure Fine Silver";
    }

    var baseMetalCost = weight * ratePerGram;
    var makingCost = baseMetalCost * (makingPercent / 100);
    var subTotal = baseMetalCost + makingCost;
    var gstCost = subTotal * (currentRates.gstPercent / 100);
    var grandTotal = subTotal + gstCost;

    // Display Values
    var dRate = document.getElementById("calcMetalRateDisplay");
    var dBase = document.getElementById("calcBaseCost");
    var dMaking = document.getElementById("calcMakingCost");
    var dGst = document.getElementById("calcGstCost");
    var dTotal = document.getElementById("calcGrandTotal");
    var waBtn = document.getElementById("calcWhatsappBtn");

    if (dRate) dRate.textContent = formatCurrency(ratePerGram) + "/g";
    if (dBase) dBase.textContent = formatCurrency(baseMetalCost);
    if (dMaking) dMaking.textContent = formatCurrency(makingCost) + " (" + makingPercent + "%)";
    if (dGst) dGst.textContent = formatCurrency(gstCost) + " (3% GST)";
    if (dTotal) dTotal.textContent = formatCurrency(grandTotal);

    if (waBtn) {
      var message = "Namaste Baba Jewellers! I calculated a jewellery estimate on your website:%0A%0A" +
        "• Metal: " + encodeURIComponent(metalName) + "%0A" +
        "• Weight: " + weight + " grams%0A" +
        "• Rate Applied: " + formatCurrency(ratePerGram) + "/g%0A" +
        "• Base Cost: " + formatCurrency(baseMetalCost) + "%0A" +
        "• Making Charges: " + formatCurrency(makingCost) + " (" + makingPercent + "%)%0A" +
        "• 3% GST: " + formatCurrency(gstCost) + "%0A" +
        "• Estimated Total: " + formatCurrency(grandTotal) + "%0A%0A" +
        "Please let me know if this design is available in showroom.";

      waBtn.href = "https://wa.me/919168157092?text=" + message;
    }
  }

  // Quick weight pills event handling
  function initWeightPills() {
    var pills = document.querySelectorAll(".weight-pill");
    var weightInput = document.getElementById("calcWeight");

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var wt = pill.getAttribute("data-weight");
        if (weightInput && wt) {
          weightInput.value = wt;
          calculateEstimate();
        }
      });
    });

    if (weightInput) {
      weightInput.addEventListener("input", function () {
        var curVal = weightInput.value;
        pills.forEach(function (p) {
          if (p.getAttribute("data-weight") === curVal) {
            p.classList.add("active");
          } else {
            p.classList.remove("active");
          }
        });
        calculateEstimate();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateRatesDisplay();
    initWeightPills();

    var metalSelect = document.getElementById("calcMetal");
    var makingSelect = document.getElementById("calcMaking");
    var refreshBtn = document.getElementById("refreshRatesBtn");

    if (metalSelect) metalSelect.addEventListener("change", calculateEstimate);
    if (makingSelect) makingSelect.addEventListener("change", calculateEstimate);
    if (refreshBtn) refreshBtn.addEventListener("click", fetchLiveRates);

    fetchLiveRates();
  });
})();
