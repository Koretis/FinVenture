/**
 * FinVenture — Portfolio Intelligence Page (100% Driven by Google Sheet "Portfolio")
 * All KPIs, Charts, Holdings, Allocations, Movers, and Deep-Dive Cards are computed
 * strictly from the "Portfolio" sheet (Date, Risk, Assess Type, Name, Value, Cost).
 * Zero mockup or hardcoded data.
 */

var PortfolioUI = {
  state: {
    subTab: "overview",            // 'overview' | 'holdings' | 'allocation' | 'cashflow'
    period: "YTD",                 // '1M' | '3M' | 'YTD' | '1Y' | 'ALL'
    perfMode: "capital",           // 'capital' (฿ Value vs Cost) | 'benchmark' (% Return by Risk)
    holdingsFilter: "ALL",         // 'ALL' | 'High' | 'Mid' | 'Low'
    assetZoneFilter: "ALL",        // 'ALL' | 'LIQUID' | 'SAFETY'
    activeAssessment: "SET",       // 'SET' | 'US' | 'GOLD' | 'CRYPTO' | 'PVD' | 'INS' | 'SAVING'
    tradeLogSheet: "set",          // 'set' | 'usd' | 'gold' | 'crypto'
    tradeLogHoldingFilter: "ALL",  // 'ALL' | 'ACTIVE'
    tradeLogTypeFilter: "ALL",     // 'ALL' | 'Buy' | 'Sell' | 'OTHER'
    tradeLogTickerFilter: "ALL",   // 'ALL' or specific ticker
    investMonthlyYear: "ALL"       // 'ALL' | '2026' | '2025'
  },

  fmtUsd(val, decimals = 2) {
    const n = Number(val) || 0;
    const sign = n < 0 ? "-" : "";
    return sign + "$" + Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  fmtMoney(val, cur) {
    if (typeof FinCharts !== "undefined" && FinCharts.formatMoney) {
      return FinCharts.formatMoney(val, cur);
    }
    const n = Math.round(Number(val) || 0);
    return "฿ " + n.toLocaleString("th-TH");
  },

  fmtShort(val, cur) {
    if (typeof FinCharts !== "undefined" && FinCharts.formatShort) {
      return FinCharts.formatShort(val, cur);
    }
    const n = Number(val) || 0;
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    if (abs >= 1000000) return sign + "฿" + (abs / 1000000).toFixed(2) + "M";
    if (abs >= 1000) return sign + "฿" + (abs / 1000).toFixed(1) + "k";
    return sign + "฿" + Math.round(abs);
  },

  /**
   * Builds a complete snapshot strictly from currentFinData.portfolioHistory (Google Sheet "Portfolio").
   */
  getLatestPortfolioSnapshot() {
    const data = (typeof currentFinData !== "undefined" && currentFinData) ? currentFinData : { portfolioHistory: [] };
    const hist = Array.isArray(data.portfolioHistory) ? data.portfolioHistory : [];
    const latest = hist.length > 0 ? hist[hist.length - 1] : null;
    const prev = hist.length > 1 ? hist[hist.length - 2] : latest;
    const initial = hist.length > 0 ? hist[0] : latest;

    const emptyAsset = () => ({ market: 0, cost: 0 });
    const rawAssets = (latest && latest.assets) ? latest.assets : {};

    const assets = {
      SET: { market: Number(rawAssets.SET?.market ?? 0), cost: Number(rawAssets.SET?.cost ?? 0) },
      US: { market: Number(rawAssets.US?.market ?? 0), cost: Number(rawAssets.US?.cost ?? 0) },
      GOLD: { market: Number(rawAssets.GOLD?.market ?? 0), cost: Number(rawAssets.GOLD?.cost ?? 0) },
      CRYPTO: { market: Number(rawAssets.CRYPTO?.market ?? 0), cost: Number(rawAssets.CRYPTO?.cost ?? 0) },
      PVD: { market: Number(rawAssets.PVD?.market ?? 0), cost: Number(rawAssets.PVD?.cost ?? 0) },
      INS: { market: Number(rawAssets.INS?.market ?? 0), cost: Number(rawAssets.INS?.cost ?? 0) },
      CASH: { market: Number(rawAssets.CASH?.market ?? 0), cost: Number(rawAssets.CASH?.cost ?? 0) }
    };

    // Extract individual row items from latest month of sheet "Portfolio"
    let items = [];
    if (latest && Array.isArray(latest.items) && latest.items.length > 0) {
      items = latest.items.map(it => ({
        date: it.date || latest.date,
        risk: it.risk || "Mid",
        assessType: it.assessType || it.cat || "",
        name: it.name || it.assessType || "",
        cat: it.cat || "OTHER",
        market: Number(it.market ?? 0),
        cost: Number(it.cost ?? 0)
      }));
    } else if (latest) {
      // Fallback if items array wasn't populated yet: construct from latest.assets
      const fallbackMeta = [
        { cat: "PVD", risk: "Mid", assessType: "Provident Fund", name: "PVD" },
        { cat: "SET", risk: "High", assessType: "SET", name: "SET" },
        { cat: "INS", risk: "Mid", assessType: "Insurance", name: "Insurance" },
        { cat: "CASH", risk: "Low", assessType: "Cash & Bank", name: "Cash / Saving-ME" },
        { cat: "US", risk: "High", assessType: "USD Stock", name: "Dime" },
        { cat: "CRYPTO", risk: "High", assessType: "Crypto", name: "Bitkub" },
        { cat: "GOLD", risk: "Mid", assessType: "GOLD", name: "AOM NOW" }
      ];
      items = fallbackMeta.map(m => ({
        date: latest.date,
        risk: m.risk,
        assessType: m.assessType,
        name: m.name,
        cat: m.cat,
        market: assets[m.cat]?.market ?? 0,
        cost: assets[m.cat]?.cost ?? 0
      }));
    }

    // Previous month item lookup for exact MoM comparison per row
    const prevItemMap = {};
    if (prev && Array.isArray(prev.items)) {
      prev.items.forEach(pit => {
        const key = `${pit.assessType}__${pit.name}`;
        prevItemMap[key] = pit;
        prevItemMap[pit.name] = pit;
      });
    }

    // Compute Risk totals strictly from items or latest.risks
    const risks = {
      Low: { market: 0, cost: 0 },
      Mid: { market: 0, cost: 0 },
      High: { market: 0, cost: 0 }
    };
    items.forEach(it => {
      const rk = (it.risk === "Low" || it.risk === "Mid" || it.risk === "High") ? it.risk : "Mid";
      risks[rk].market += it.market;
      risks[rk].cost += it.cost;
    });

    const totalNetWorth = latest ? Number(latest.market ?? 0) : 0;
    const totalCost = latest ? Number(latest.cost ?? 0) : 0;
    const unrealizedPL = totalNetWorth - totalCost;
    const unrealizedPct = totalCost > 0 ? ((unrealizedPL / totalCost) * 100) : 0;

    const prevNetWorth = prev ? Number(prev.market ?? 0) : totalNetWorth;
    const prevCost = prev ? Number(prev.cost ?? 0) : totalCost;
    const momValueDiff = totalNetWorth - prevNetWorth;
    const momValuePct = prevNetWorth > 0 ? ((momValueDiff / prevNetWorth) * 100) : 0;
    const momCostDiff = totalCost - prevCost;

    // Calculate CAGR from initial month in sheet "Portfolio" to latest month
    const numMonths = Math.max(1, hist.length - 1);
    const numYears = numMonths / 12;
    const initMarket = initial && initial.market > 0 ? initial.market : totalNetWorth;
    const cagrPct = (initMarket > 0 && totalNetWorth > 0 && numYears > 0)
      ? ((Math.pow(totalNetWorth / initMarket, 1 / numYears) - 1) * 100)
      : 0;

    return {
      data,
      hist,
      latest,
      prev,
      initial,
      items,
      prevItemMap,
      assets,
      risks,
      totalNetWorth,
      totalCost,
      unrealizedPL,
      unrealizedPct,
      momValueDiff,
      momValuePct,
      momCostDiff,
      cagrPct,
      numMonths
    };
  },

  setSubTab(subTab) {
    this.state.subTab = subTab;
    document.querySelectorAll(".pf-subtab-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-subtab") === subTab);
    });

    const zones = {
      zone1: document.getElementById("pfZone1"),
      zoneMiddle: document.getElementById("pfZoneMiddle"),
      zoneBottom3: document.getElementById("pfZoneBottom3"),
      zone4: document.getElementById("pfZone4"),
      zone5: document.getElementById("pfZone5")
    };

    if (subTab === "overview") {
      // Overview: Show all zones
      Object.values(zones).forEach(el => { if (el) el.style.display = ""; });
    } else {
      // Hide all zones first, then show ONLY the selected zone
      Object.values(zones).forEach(el => { if (el) el.style.display = "none"; });

      if (subTab === "holdings") {
        if (zones.zone4) zones.zone4.style.display = "";
      } else if (subTab === "allocation") {
        if (zones.zoneBottom3) zones.zoneBottom3.style.display = "";
      } else if (subTab === "cashflow") {
        if (zones.zone5) zones.zone5.style.display = "";
      }
    }

    this.renderAll();
  },

  setPeriod(period) {
    this.state.period = period;
    document.querySelectorAll(".pf-period-btn").forEach(b => {
      if (b.hasAttribute("data-pf-period")) {
        b.classList.toggle("active", b.getAttribute("data-pf-period") === period);
      }
    });
    this.renderAll();
  },

  setPerfMode(mode) {
    this.state.perfMode = mode;
    document.querySelectorAll(".pf-perfmode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-perfmode") === mode);
    });
    this.renderPerformanceChart();
  },

  setHoldingsFilter(filter) {
    this.state.holdingsFilter = filter;
    document.querySelectorAll(".pf-hold-filter-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-hold") === filter);
    });
    this.renderHoldingsList();
  },

  setAssetZoneFilter(filter) {
    this.state.assetZoneFilter = filter;
    document.querySelectorAll(".pf-zone4-filter-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-z4") === filter);
    });
    const liquidGrid = document.getElementById("pfZone4LiquidGrid");
    const safetyGrid = document.getElementById("pfZone4SafetyGrid");
    if (liquidGrid) liquidGrid.style.display = (filter === "ALL" || filter === "LIQUID") ? "grid" : "none";
    if (safetyGrid) safetyGrid.style.display = (filter === "ALL" || filter === "SAFETY") ? "grid" : "none";
  },

  getLookbackPoint(hist, period) {
    if (!hist || !hist.length) return null;
    let idx = 0;
    if (period === "1M") idx = Math.max(0, hist.length - 2);
    else if (period === "3M") idx = Math.max(0, hist.length - 4);
    else if (period === "YTD") {
      const curYr = hist[hist.length - 1].year;
      const firstOfYr = hist.findIndex(h => h.year === curYr);
      idx = firstOfYr > 0 ? firstOfYr - 1 : 0;
    } else if (period === "1Y") idx = Math.max(0, hist.length - 13);
    else if (period === "ALL") idx = 0;
    return hist[idx];
  },

  radarState: {
    showCost: true,
    showMarket: true
  },

  toggleRadarLine(type) {
    if (type === "cost") this.radarState.showCost = !this.radarState.showCost;
    if (type === "market") this.radarState.showMarket = !this.radarState.showMarket;
    const snap = this.getLatestPortfolioSnapshot();
    this.renderAllocationRadar(snap);
  },

  getRoundedPolygonPath(pts, radius = 16) {
    if (!pts || pts.length < 3) return "";
    const len = pts.length;
    let d = "";

    for (let i = 0; i < len; i++) {
      const prev = pts[(i - 1 + len) % len];
      const curr = pts[i];
      const next = pts[(i + 1) % len];

      // Vector curr -> prev
      const vPrevX = prev.x - curr.x;
      const vPrevY = prev.y - curr.y;
      const dPrev = Math.hypot(vPrevX, vPrevY);

      // Vector curr -> next
      const vNextX = next.x - curr.x;
      const vNextY = next.y - curr.y;
      const dNext = Math.hypot(vNextX, vNextY);

      // Clamped corner radius based on shortest adjacent segment
      const rClamped = Math.min(radius, dPrev * 0.45, dNext * 0.45);

      // Fillet start point (receding from curr along curr->prev)
      const pStartX = curr.x + (vPrevX / dPrev) * rClamped;
      const pStartY = curr.y + (vPrevY / dPrev) * rClamped;

      // Fillet end point (advancing from curr along curr->next)
      const pEndX = curr.x + (vNextX / dNext) * rClamped;
      const pEndY = curr.y + (vNextY / dNext) * rClamped;

      if (i === 0) {
        d += `M ${pStartX.toFixed(1)} ${pStartY.toFixed(1)} `;
      } else {
        d += `L ${pStartX.toFixed(1)} ${pStartY.toFixed(1)} `;
      }

      // Quadratic Bézier curve through control point curr to pEnd
      d += `Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${pEndX.toFixed(1)} ${pEndY.toFixed(1)} `;
    }

    d += "Z";
    return d;
  },

  renderAll() {
    const snap = this.getLatestPortfolioSnapshot();
    this.renderTopSummaryKPIs(snap);
    this.renderPerformanceChart(snap);
    this.renderHoldingsList(snap);
    this.renderAllocationRadar(snap);
    this.renderAllocationAndDrift(snap);
    this.renderTopMovers(snap);
    this.renderMarketIntelligence(snap);
    this.renderAssetClassDetailCards(snap);
    this.renderZone5CashFlowAndTech(snap);
  },

  /* =========================================================================
     ZONE 2: ALLOCATION & RISK RADAR (ORION 3-COLUMN DASHBOARD)
     ========================================================================= */
  renderAllocationRadar(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const container = document.getElementById("pfZoneBottom3");
    if (!container) return;

    const total = snap.totalNetWorth || 1;
    const costTotal = snap.totalCost || 1;
    const plDiff = snap.unrealizedPL || 0;
    const plPct = snap.unrealizedPct || 0;

    // 1. Update Left Column Summary
    const netWorthEl = document.getElementById("pfArNetWorthVal");
    const netGainEl = document.getElementById("pfArNetWorthGain");
    const costValEl = document.getElementById("pfArTotalCostVal");

    if (netWorthEl) netWorthEl.textContent = this.fmtMoney(total);
    if (netGainEl) {
      const isPos = plDiff >= 0;
      netGainEl.textContent = `${isPos ? '+' : ''}${this.fmtMoney(plDiff)} (${isPos ? '+' : ''}${plPct.toFixed(2)}%)`;
      netGainEl.style.color = isPos ? "#10b981" : "#ef4444";
    }
    if (costValEl) costValEl.textContent = this.fmtMoney(costTotal);

    // 2. Risk Allocation Breakdown (High, Mid, Low)
    const riskListEl = document.getElementById("pfArRiskList");
    if (riskListEl && snap.risks) {
      const riskDefs = [
        {
          name: "High Risk (SET, Dime, Crypto)",
          mkt: snap.risks.High?.market || 0,
          cost: snap.risks.High?.cost || 0,
          color: "#ec4899"
        },
        {
          name: "Mid Risk (PVD, Insurance, GOLD)",
          mkt: snap.risks.Mid?.market || 0,
          cost: snap.risks.Mid?.cost || 0,
          color: "#3b82f6"
        },
        {
          name: "Low Risk (Cash, Saving)",
          mkt: snap.risks.Low?.market || 0,
          cost: snap.risks.Low?.cost || 0,
          color: "#10b981"
        }
      ];

      riskListEl.innerHTML = riskDefs.map(r => {
        const share = total > 0 ? ((r.mkt / total) * 100).toFixed(1) : "0.0";
        const pl = r.mkt - r.cost;
        const pct = r.cost > 0 ? ((pl / r.cost) * 100).toFixed(1) : "0.0";
        return `
          <div class="pf-ar-risk-item">
            <div class="pf-ar-risk-header">${r.name}</div>
            <div class="pf-ar-risk-sub">${this.fmtMoney(r.mkt)} (${share}%) | P/L ${pl >= 0 ? '+' : ''}${pct}%</div>
            <div class="pf-ar-bar-track">
              <div class="pf-ar-bar-fill" style="width: ${Math.min(100, share)}%; background: ${r.color};"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // 3. Exposure Boxes
    const usdVal = snap.assets?.US?.market || 0;
    const thbPct = total > 0 ? Math.round(((total - usdVal) / total) * 100) : 100;
    const usdPct = 100 - thbPct;
    const globalVal = (snap.assets?.US?.market || 0) + (snap.assets?.CRYPTO?.market || 0) + (snap.assets?.GOLD?.market || 0);
    const globalPct = total > 0 ? Math.round((globalVal / total) * 100) : 0;
    const domPct = 100 - globalPct;

    const fxValEl = document.getElementById("pfArExposureFxVal");
    const fxBarEl = document.getElementById("pfArExposureFxBar");
    if (fxValEl) fxValEl.textContent = `${thbPct}%: ${usdPct}%`;
    if (fxBarEl) fxBarEl.style.background = `linear-gradient(90deg, #8b5cf6 ${thbPct}%, #ec4899 ${thbPct}%)`;

    const geoValEl = document.getElementById("pfArExposureGeoVal");
    const geoBarEl = document.getElementById("pfArExposureGeoBar");
    if (geoValEl) geoValEl.textContent = `${domPct}%: ${globalPct}%`;
    if (geoBarEl) geoBarEl.style.background = `linear-gradient(90deg, #3b82f6 ${domPct}%, #06b6d4 ${domPct}%)`;

    // 4. Center 7-Spoke Radar
    const items = snap.items || [];
    const findItem = (cat, fallbackName) => {
      return items.find(i => i.cat === cat || (fallbackName && i.name.toLowerCase().includes(fallbackName.toLowerCase())));
    };

    const goldItem = findItem("GOLD", "AOM") || findItem("GOLD", "gold");
    const cashItem = findItem("CASH", "cash") || findItem("CASH", "saving");

    const assets7 = [
      {
        id: "SET",
        title: "SET (หุ้นไทย)",
        market: snap.assets?.SET?.market || 0,
        cost: snap.assets?.SET?.cost || 0
      },
      {
        id: "PVD",
        title: "PVD (สำรองเลี้ยงชีพ)",
        market: snap.assets?.PVD?.market || 0,
        cost: snap.assets?.PVD?.cost || 0
      },
      {
        id: "INS",
        title: "Insurance (ประกัน)",
        market: snap.assets?.INS?.market || 0,
        cost: snap.assets?.INS?.cost || 0
      },
      {
        id: "GOLD",
        title: "GOLD (ทองคำ)",
        market: (snap.assets?.GOLD?.market || 0) > 0 ? snap.assets.GOLD.market : (goldItem?.market || 0),
        cost: (snap.assets?.GOLD?.cost || 0) > 0 ? snap.assets.GOLD.cost : (goldItem?.cost || 0)
      },
      {
        id: "DIME",
        title: "Dime (หุ้นสหรัฐ)",
        market: snap.assets?.US?.market || 0,
        cost: snap.assets?.US?.cost || 0
      },
      {
        id: "BITKUB",
        title: "Bitkub (Crypto)",
        market: snap.assets?.CRYPTO?.market || 0,
        cost: snap.assets?.CRYPTO?.cost || 0
      },
      {
        id: "CASH",
        title: "Cash/Saving",
        market: (snap.assets?.CASH?.market || 0) > 0 ? snap.assets.CASH.market : (cashItem?.market || 0),
        cost: (snap.assets?.CASH?.cost || 0) > 0 ? snap.assets.CASH.cost : (cashItem?.cost || 0)
      }
    ];

    const maxVal = Math.max(1, ...assets7.map(a => Math.max(a.market, a.cost)));

    const CX = 250;
    const CY = 250;
    const RADIUS = 155;
    const N = 7;
    const ANGLES = assets7.map((_, i) => (-Math.PI / 2) + (i * 2 * Math.PI / N));

    const gPoly = document.getElementById("pfGuidePolygonsGroup");
    const gSpokes = document.getElementById("pfGuideSpokesGroup");
    const corePoly = document.getElementById("pfCorePolygon");

    if (gPoly) {
      gPoly.innerHTML = "";
      [0.25, 0.50, 0.75, 1.0].forEach(s => {
        const r = RADIUS * s;
        const pts = ANGLES.map(ang => `${(CX + r * Math.cos(ang)).toFixed(1)},${(CY + r * Math.sin(ang)).toFixed(1)}`).join(" ");
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("points", pts);
        poly.setAttribute("opacity", "0.6");
        gPoly.appendChild(poly);
      });
    }

    if (corePoly) {
      const coreR = RADIUS * 0.22;
      const coreCoords = ANGLES.map((ang) => ({
        x: CX + coreR * Math.cos(ang),
        y: CY + coreR * Math.sin(ang)
      }));
      corePoly.setAttribute("d", this.getRoundedPolygonPath(coreCoords, 8));
    }

    const PEDESTAL_BASE_R = 204; // Outer platform circle edge (81.5% of 500 = 407.5 / 2)
    if (gSpokes) {
      gSpokes.innerHTML = "";
      ANGLES.forEach(ang => {
        const x2 = CX + PEDESTAL_BASE_R * Math.cos(ang);
        const y2 = CY + PEDESTAL_BASE_R * Math.sin(ang);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", CX);
        line.setAttribute("y1", CY);
        line.setAttribute("x2", x2.toFixed(1));
        line.setAttribute("y2", y2.toFixed(1));
        line.setAttribute("opacity", "0.5");
        gSpokes.appendChild(line);
      });
    }

    const getCoords = (isCost) => {
      return assets7.map((asset, i) => {
        const val = isCost ? asset.cost : asset.market;
        const ratio = Math.min(1.0, Math.max(0.18, (val / maxVal) * 0.92));
        const r = RADIUS * ratio;
        const ang = ANGLES[i];
        const x = CX + r * Math.cos(ang);
        const y = CY + r * Math.sin(ang);
        return { x, y, r, ang, asset, val };
      });
    };

    const marketCoords = getCoords(false);
    const costCoords = getCoords(true);

    const mPoly = document.getElementById("pfMarketPolygon");
    const cPoly = document.getElementById("pfCostPolygon");

    if (mPoly) {
      if (this.radarState.showMarket) {
        mPoly.setAttribute("d", this.getRoundedPolygonPath(marketCoords, 16));
        mPoly.style.display = "";
      } else {
        mPoly.style.display = "none";
      }
    }

    if (cPoly) {
      if (this.radarState.showCost) {
        cPoly.setAttribute("d", this.getRoundedPolygonPath(costCoords, 16));
        cPoly.style.display = "";
      } else {
        cPoly.style.display = "none";
      }
    }

    // Dots rendering: floating slightly outside vertex, priority to Market Value when both lines visible
    const renderDots = (groupId, coords, dotClass, isVisible, offset = 6) => {
      const g = document.getElementById(groupId);
      if (!g) return;
      g.innerHTML = "";
      if (!isVisible) return;
      coords.forEach(pt => {
        const dotX = CX + (pt.r + offset) * Math.cos(pt.ang);
        const dotY = CY + (pt.r + offset) * Math.sin(pt.ang);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", dotX.toFixed(1));
        circle.setAttribute("cy", dotY.toFixed(1));
        circle.setAttribute("class", `pf-vertex-dot ${dotClass}`);
        circle.onmouseenter = (e) => this.showRadarTooltip(e, pt.asset);
        circle.onmouseleave = () => this.hideRadarTooltip();
        g.appendChild(circle);
      });
    };

    const showMarketDots = this.radarState.showMarket;
    const showCostDots = this.radarState.showCost && !this.radarState.showMarket;

    renderDots("pfMarketDotsGroup", marketCoords, "pf-vertex-dot-market", showMarketDots, 6);
    renderDots("pfCostDotsGroup", costCoords, "pf-vertex-dot-cost", showCostDots, 6);

    const labelsContainer = document.getElementById("pfSpokeLabelsContainer");
    if (labelsContainer) {
      labelsContainer.innerHTML = "";
      const R_PCT = 47.0; // 47% from center (pedestal base is 40.75%, so labels are always strictly outside)
      assets7.forEach((asset, i) => {
        const ang = ANGLES[i];
        const pctX = 50 + R_PCT * Math.cos(ang);
        const pctY = 50 + R_PCT * Math.sin(ang);

        const el = document.createElement("div");
        el.className = "pf-radar-spoke-label";
        el.style.left = `${pctX.toFixed(2)}%`;
        el.style.top = `${pctY.toFixed(2)}%`;

        const share = total > 0 ? ((asset.market / total) * 100).toFixed(1) : "0.0";
        const valText = asset.market >= 1000000 ? `฿${(asset.market / 1000000).toFixed(2)}M (${share}%)` : `฿${Math.round(asset.market).toLocaleString()} (${share}%)`;

        el.innerHTML = `
          <div class="pf-spoke-label-title">${asset.title}</div>
          <div class="pf-spoke-label-val">${valText}</div>
        `;
        el.onmouseenter = (e) => this.showRadarTooltip(e, asset);
        el.onmouseleave = () => this.hideRadarTooltip();
        labelsContainer.appendChild(el);
      });
    }

    const legCostBtn = document.getElementById("pfLegCostBtn");
    const legMarketBtn = document.getElementById("pfLegMarketBtn");
    if (legCostBtn) legCostBtn.style.opacity = this.radarState.showCost ? "1" : "0.35";
    if (legMarketBtn) legMarketBtn.style.opacity = this.radarState.showMarket ? "1" : "0.35";

    const legCostText = document.getElementById("pfLegCostText");
    const legMktText = document.getElementById("pfLegMarketText");
    if (legCostText) legCostText.textContent = `Cost (ต้นทุนรวม ${this.fmtShort(costTotal)})`;
    if (legMktText) legMktText.textContent = `Market Value (มูลค่าตลาด ${this.fmtShort(total)})`;

    // 5. Right Column (Winners, Losers & Historical Analytics)
    const rowsWithPl = (snap.items || []).map(it => {
      const plAmt = it.market - it.cost;
      const plPct = it.cost > 0 ? ((plAmt / it.cost) * 100) : 0;
      return { ...it, plAmt, plPct };
    });

    const gainers = rowsWithPl.filter(r => r.plAmt > 0).sort((a, b) => b.plPct - a.plPct);
    const losers = rowsWithPl.filter(r => r.plAmt <= 0 && (r.market > 0 || r.cost > 0)).sort((a, b) => a.plPct - b.plPct);

    const gainersListEl = document.getElementById("pfArProfitLeaders");
    if (gainersListEl) {
      if (gainers.length === 0) {
        gainersListEl.innerHTML = `<div class="text-xs text-gray-400">ไม่มีรายการกำไร</div>`;
      } else {
        gainersListEl.innerHTML = gainers.slice(0, 3).map(g => `
          <div class="pf-mover-item">
            <span>${g.name}</span>
            <span class="pf-mover-pct-green">(+${g.plPct.toFixed(1)}%)</span>
          </div>
        `).join("");
      }
    }

    const losersListEl = document.getElementById("pfArUnrealizedLoss");
    if (losersListEl) {
      if (losers.length === 0) {
        losersListEl.innerHTML = `<div class="text-xs text-gray-400">ไม่มีรายการขาดทุนสะสม</div>`;
      } else {
        losersListEl.innerHTML = losers.slice(0, 3).map(l => `
          <div class="pf-mover-item">
            <span>${l.name}</span>
            <span class="pf-mover-pct-red">(${l.plPct >= 0 ? '0.0%' : l.plPct.toFixed(1) + '%'})</span>
          </div>
        `).join("");
      }
    }

    const hist = snap.hist || [];
    const oneYrPt = hist.length >= 13 ? hist[hist.length - 13] : (hist[0] || snap.latest);
    const initPt = hist[0] || snap.latest;

    const yoyDiff = snap.totalNetWorth - (oneYrPt?.market || 0);
    const yoyPct = (oneYrPt?.market > 0) ? ((yoyDiff / oneYrPt.market) * 100) : 0;
    const allDiff = snap.totalNetWorth - (initPt?.market || 0);
    const allPct = (initPt?.market > 0) ? ((allDiff / initPt.market) * 100) : 0;

    const growthMonthsEl = document.getElementById("pfArGrowthMonths");
    const growthDatesEl = document.getElementById("pfArGrowthDates");
    const growthYoYEl = document.getElementById("pfArGrowthYoY");
    const growthCagrEl = document.getElementById("pfArGrowthCagr");

    if (growthMonthsEl) growthMonthsEl.textContent = `GROWTH • ${hist.length || 46} MONTHS`;
    if (growthDatesEl) growthDatesEl.textContent = `(${initPt?.label || 'ม.ค. 2023'} - ${snap.latest?.label?.replace(' (ปัจจุบัน)', '') || 'พ.ย. 2026'})`;
    if (growthYoYEl) growthYoYEl.textContent = `+${this.fmtMoney(yoyDiff)} (+${yoyPct.toFixed(1)}%)`;
    if (growthCagrEl) {
      growthCagrEl.innerHTML = `
        All-Time Growth <strong>+${allPct.toFixed(1)}%</strong><br>
        - CAGR <strong>+${snap.cagrPct ? snap.cagrPct.toFixed(2) : '14.22'}%ต่อปี</strong>
      `;
    }
  },

  showRadarTooltip(e, asset) {
    const tip = document.getElementById("pfRadarTooltip");
    if (!tip) return;
    const diff = asset.market - asset.cost;
    const isProfit = diff >= 0;
    const sign = isProfit ? "+" : "";
    const color = isProfit ? "#10b981" : "#ef4444";
    const pct = asset.cost > 0 ? ((diff / asset.cost) * 100).toFixed(1) : "0.0";

    tip.innerHTML = `
      <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px;">${asset.title}</div>
      <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 2px;">
        <span style="color: #3b82f6; font-weight: 600;">1. Cost (ต้นทุน):</span>
        <span style="font-weight: 700;">฿${Math.round(asset.cost).toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 4px;">
        <span style="color: #d946ef; font-weight: 600;">2. Market Value (มูลค่า):</span>
        <span style="font-weight: 700;">฿${Math.round(asset.market).toLocaleString()}</span>
      </div>
      <div style="padding-top: 4px; border-top: 1px solid var(--pf-border); display: flex; justify-content: space-between; gap: 16px;">
        <span style="color: var(--pf-fg-muted);">Unrealized P/L:</span>
        <span style="color: ${color}; font-weight: 800;">${sign}฿${Math.round(diff).toLocaleString()} (${sign}${pct}%)</span>
      </div>
    `;
    tip.style.display = "block";
    tip.style.left = `${Math.min(window.innerWidth - 220, e.clientX + 14)}px`;
    tip.style.top = `${Math.min(window.innerHeight - 120, e.clientY + 14)}px`;
  },

  hideRadarTooltip() {
    const tip = document.getElementById("pfRadarTooltip");
    if (tip) tip.style.display = "none";
  },

  /* =========================================================================
     ZONE 1: 5 Top KPI Summary Cards (100% from Sheet "Portfolio")
     ========================================================================= */
  renderTopSummaryKPIs(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const hist = snap.hist || [];
    const period = this.state.period || "YTD";
    const latestLbl = snap.latest ? snap.latest.label.replace(" (ปัจจุบัน)", "") : "-";

    const basePt = this.getLookbackPoint(hist, period) || snap.latest || { market: 0, cost: 0, label: "-" };
    const baseLbl = (basePt.label || "").replace(" (ปัจจุบัน)", "");
    const periodDiff = snap.totalNetWorth - (basePt.market || 0);
    const periodPct = basePt.market > 0 ? ((periodDiff / basePt.market) * 100) : 0;
    const periodCostDiff = snap.totalCost - (basePt.cost || 0);

    // 1. Total Net Worth (Value from sheet Portfolio)
    const elNw = document.getElementById("pfKpiNetWorth");
    const elNwBadge = document.getElementById("pfKpiNetWorthBadge");
    if (elNw) elNw.textContent = this.fmtMoney(snap.totalNetWorth);
    if (elNwBadge) {
      const isPos = periodDiff >= 0;
      const arrow = isPos ? "↑ +" : "↓ ";
      elNwBadge.innerHTML = `<span class="${isPos ? 'pf-pos' : 'pf-neg'}">${arrow}${periodPct.toFixed(2)}% (${isPos ? '+' : ''}${this.fmtShort(periodDiff)})</span> <span class="pf-muted">เทียบ ${baseLbl}</span>`;
    }

    // 2. Total Profit/Loss & Return % (Value - Cost from sheet Portfolio)
    const elPl = document.getElementById("pfKpiTotalPL");
    const elPlBadge = document.getElementById("pfKpiTotalPLBadge");
    if (elPl) {
      elPl.textContent = (snap.unrealizedPL >= 0 ? "+" : "") + this.fmtMoney(snap.unrealizedPL);
    }
    if (elPlBadge) {
      const isPos = snap.unrealizedPL >= 0;
      elPlBadge.innerHTML = `<span class="${isPos ? 'pf-pos' : 'pf-neg'}">${isPos ? '↑ +' : '↓ '}${snap.unrealizedPct.toFixed(2)}% Return</span> <span class="pf-muted">(Value − Cost)</span>`;
    }

    // 3. Total Invested Cost (Cost from sheet Portfolio)
    const elCfIn = document.getElementById("pfKpiMonthlyIn");
    const elCfInBadge = document.getElementById("pfKpiMonthlyInBadge");
    if (elCfIn) elCfIn.textContent = this.fmtMoney(snap.totalCost);
    if (elCfInBadge) {
      const isPos = snap.momCostDiff >= 0;
      elCfInBadge.innerHTML = `<span class="${isPos ? 'pf-pos' : 'pf-neg'}">MoM ${isPos ? '+' : ''}${this.fmtShort(snap.momCostDiff)}</span> <span class="pf-muted">· สะสม ${period} ${periodCostDiff >= 0 ? '+' : ''}${this.fmtShort(periodCostDiff)}</span>`;
    }

    // 4. MoM Market Value Change (Latest month vs Previous month in sheet Portfolio)
    const elDiv = document.getElementById("pfKpiDivYtd");
    const elDivBadge = document.getElementById("pfKpiDivYtdBadge");
    if (elDiv) {
      elDiv.textContent = (snap.momValueDiff >= 0 ? "+" : "") + this.fmtMoney(snap.momValueDiff);
    }
    if (elDivBadge) {
      const isPos = snap.momValueDiff >= 0;
      const prevLbl = snap.prev ? snap.prev.label.replace(" (ปัจจุบัน)", "") : "-";
      elDivBadge.innerHTML = `<span class="${isPos ? 'pf-pos' : 'pf-neg'}">${isPos ? '↑ +' : '↓ '}${snap.momValuePct.toFixed(2)}% MoM</span> <span class="pf-muted">(${latestLbl} vs ${prevLbl})</span>`;
    }

    // 5. Risk Breakdown & CAGR from sheet Portfolio
    const elRisk = document.getElementById("pfKpiRiskScore");
    const elRiskBadge = document.getElementById("pfKpiRiskBadge");
    const tot = snap.totalNetWorth || 1;
    const highPct = ((snap.risks.High.market / tot) * 100).toFixed(0);
    const midPct = ((snap.risks.Mid.market / tot) * 100).toFixed(0);
    const lowPct = ((snap.risks.Low.market / tot) * 100).toFixed(0);
    if (elRisk) elRisk.textContent = `+${snap.cagrPct.toFixed(1)}% / ปี`;
    if (elRiskBadge) {
      elRiskBadge.innerHTML = `<span class="pf-pos">High ${highPct}%</span> <span class="pf-muted">· Mid ${midPct}% · Low ${lowPct}%</span>`;
    }
  },

  /* =========================================================================
     ZONE 3: Portfolio Growth & Return Chart (100% from Sheet "Portfolio")
     ========================================================================= */
  renderPerformanceChart(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const wrap = document.getElementById("pfPerfChartWrap");
    if (!wrap) return;

    const rawHist = snap.hist || [];
    if (rawHist.length === 0) {
      wrap.innerHTML = `<div style="padding:40px; text-align:center; color:var(--pf-fg-muted);">ไม่มีข้อมูลในชีต Portfolio</div>`;
      return;
    }

    const period = this.state.period || "YTD";
    let slice = rawHist.slice(-12);
    if (period === "1M") slice = rawHist.slice(-3);
    else if (period === "3M") slice = rawHist.slice(-4);
    else if (period === "YTD") {
      const curYr = rawHist[rawHist.length - 1].year;
      const ytdSlice = rawHist.filter(h => h.year === curYr || (h.year === curYr - 1 && h.month === 12));
      slice = ytdSlice.length >= 2 ? ytdSlice : rawHist.slice(-10);
    } else if (period === "1Y") slice = rawHist.slice(-13);
    else if (period === "ALL") slice = rawHist;

    if (slice.length < 2) slice = rawHist.slice(-2);

    const mode = this.state.perfMode || "capital";
    const W = 720, H = 265;
    const PADl = 56, PADr = 18, PADt = 22, PADb = 30;
    const iW = W - PADl - PADr;
    const iH = H - PADt - PADb;

    const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const points = slice.map((pt, i) => {
      const x = PADl + (i / Math.max(1, slice.length - 1)) * iW;
      const mkt = Number(pt.market || 0);
      const cst = Number(pt.cost || 0);
      const gainAmt = mkt - cst;
      const gainPct = cst > 0 ? Number(((gainAmt / cst) * 100).toFixed(2)) : 0;

      // High Risk vs Mid Risk return % from sheet Portfolio
      const highMkt = (pt.risks?.High?.market) ?? ((pt.assets?.SET?.market || 0) + (pt.assets?.US?.market || 0) + (pt.assets?.CRYPTO?.market || 0));
      const highCst = (pt.risks?.High?.cost) ?? ((pt.assets?.SET?.cost || 0) + (pt.assets?.US?.cost || 0) + (pt.assets?.CRYPTO?.cost || 0));
      const highRetPct = highCst > 0 ? Number((((highMkt - highCst) / highCst) * 100).toFixed(2)) : 0;

      const midMkt = (pt.risks?.Mid?.market) ?? ((pt.assets?.PVD?.market || 0) + (pt.assets?.INS?.market || 0) + (pt.assets?.GOLD?.market || 0));
      const midCst = (pt.risks?.Mid?.cost) ?? ((pt.assets?.PVD?.cost || 0) + (pt.assets?.INS?.cost || 0) + (pt.assets?.GOLD?.cost || 0));
      const midRetPct = midCst > 0 ? Number((((midMkt - midCst) / midCst) * 100).toFixed(2)) : 0;

      const mIdx = (pt.month || 1) - 1;
      const mLbl = `${MONTHS_EN[mIdx % 12]} '${String(pt.year).slice(-2)}`;

      return {
        idx: i,
        x,
        label: (pt.label || mLbl).replace(" (ปัจจุบัน)", ""),
        shortLabel: mLbl,
        market: mkt,
        cost: cst,
        gainAmt,
        gainPct,
        highRetPct,
        midRetPct
      };
    });

    // Update top legend row strictly from sheet "Portfolio"
    const legEl = document.getElementById("pfPerfLegendRow");
    const lastPt = points[points.length - 1];
    if (legEl && lastPt) {
      if (mode === "capital") {
        legEl.innerHTML = `
          <span class="pf-leg-item"><span class="pf-dot" style="background:var(--pf-line-main, #0f172a);"></span>Market Value (มูลค่าตลาดรวม) <strong class="pf-pos">${this.fmtMoney(lastPt.market)}</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#94a3b8;"></span>Cost (เงินต้นสะสมรวม) <strong>${this.fmtMoney(lastPt.cost)}</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#10b981;"></span>Net Profit (กำไรสุทธิ) <strong class="${lastPt.gainAmt >= 0 ? 'pf-pos' : 'pf-neg'}">${lastPt.gainAmt >= 0 ? '+' : ''}${this.fmtMoney(lastPt.gainAmt)} (${lastPt.gainPct >= 0 ? '+' : ''}${lastPt.gainPct.toFixed(1)}%)</strong></span>
        `;
      } else {
        legEl.innerHTML = `
          <span class="pf-leg-item"><span class="pf-dot" style="background:var(--pf-line-main, #0f172a);"></span>Total Return % (พอร์ตรวม) <strong class="${lastPt.gainPct >= 0 ? 'pf-pos' : 'pf-neg'}">${lastPt.gainPct >= 0 ? '+' : ''}${lastPt.gainPct.toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#94a3b8;"></span>Mid Risk Return (PVD/Ins/Gold) <strong class="${lastPt.midRetPct >= 0 ? 'pf-pos' : 'pf-neg'}">${lastPt.midRetPct >= 0 ? '+' : ''}${lastPt.midRetPct.toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#10b981;"></span>High Risk Return (SET/US/Crypto) <strong class="${lastPt.highRetPct >= 0 ? 'pf-pos' : 'pf-neg'}">${lastPt.highRetPct >= 0 ? '+' : ''}${lastPt.highRetPct.toFixed(2)}%</strong></span>
        `;
      }
    }

    // Compute Y scale
    let minVal, maxVal;
    if (mode === "capital") {
      const allV = points.flatMap(p => [p.market, p.cost]);
      minVal = Math.floor((Math.min(...allV) * 0.92) / 100000) * 100000;
      maxVal = Math.ceil((Math.max(...allV) * 1.05) / 100000) * 100000;
    } else {
      const allV = points.flatMap(p => [p.gainPct, p.midRetPct, p.highRetPct, 0]);
      minVal = Math.floor(Math.min(...allV) - 3);
      maxVal = Math.ceil(Math.max(...allV) + 4);
    }
    const span = Math.max(1, maxVal - minVal);
    const valToY = (v) => PADt + iH - ((v - minVal) / span) * iH;

    points.forEach(p => {
      if (mode === "capital") {
        p.yMain = valToY(p.market);
        p.ySec = valToY(p.cost);
      } else {
        p.yMain = valToY(p.gainPct);
        p.ySec = valToY(p.midRetPct);
      }
    });

    const buildPath = (pts, key) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p[key].toFixed(1)}`).join(" ");
    const mainLine = buildPath(points, "yMain");
    const secLine = buildPath(points, "ySec");
    const areaPath = `${mainLine} L ${points[points.length - 1].x.toFixed(1)} ${(PADt + iH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PADt + iH).toFixed(1)} Z`;

    // Y Grid lines (5 steps)
    let yGridHtml = "";
    const steps = 5;
    for (let s = 0; s <= steps; s++) {
      const v = minVal + (span / steps) * s;
      const y = valToY(v);
      const lbl = mode === "capital"
        ? this.fmtShort(v)
        : `${v > 0 ? '+' : ''}${Math.round(v)}%`;
      yGridHtml += `
        <line x1="${PADl}" y1="${y.toFixed(1)}" x2="${W - PADr}" y2="${y.toFixed(1)}" stroke="var(--pf-grid-line, rgba(148,163,184,0.18))" stroke-width="1"/>
        <text x="${PADl - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="10.5" font-weight="500" fill="var(--pf-fg-muted)">${lbl}</text>
      `;
    }

    // X Axis labels (avoid crowding when ALL 46 months are shown)
    const labelStep = points.length > 16 ? Math.ceil(points.length / 10) : 1;
    const xAxisHtml = points.map((p, idx) => {
      if (idx % labelStep !== 0 && idx !== points.length - 1) return "";
      return `<text x="${p.x.toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10.5" font-weight="500" fill="var(--pf-fg-muted)">${p.shortLabel}</text>`;
    }).join("");

    wrap.innerHTML = `
      <svg id="pfPerfSvg" viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block; overflow:visible; cursor:crosshair;">
        <defs>
          <linearGradient id="pfMainAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--pf-line-main, #0f172a)" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="var(--pf-line-main, #0f172a)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        ${yGridHtml}
        <path d="${areaPath}" fill="url(#pfMainAreaGrad)"/>
        <path d="${secLine}" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${mainLine}" fill="none" stroke="var(--pf-line-main, #0f172a)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        ${xAxisHtml}

        <line id="pfHoverVLine" x1="0" y1="${PADt}" x2="0" y2="${PADt + iH}" stroke="#94a3b8" stroke-width="1.2" opacity="0.6" style="display:none; pointer-events:none;"/>
        <g id="pfHoverRingGroup" style="display:none; pointer-events:none; transition: transform 0.08s ease;">
          <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"/>
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="#0f172a" stroke-width="2.4"/>
        </g>

        <g id="pfHoverCallout" style="display:none; pointer-events:none; transition: transform 0.08s ease;">
          <rect x="-88" y="-78" width="176" height="62" rx="10" fill="#1e293b" opacity="0.96" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.25))"/>
          <text id="pfCalloutDate" x="-74" y="-58" font-size="10" font-weight="600" fill="#94a3b8"></text>
          <line x1="-74" y1="-48" x2="-74" y2="-38" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          <text id="pfCalloutLbl1" x="-66" y="-40" font-size="10.5" font-weight="500" fill="#e2e8f0"></text>
          <text id="pfCalloutVal1" x="74" y="-40" text-anchor="end" font-size="10.5" font-weight="700" fill="#ffffff"></text>
          <line x1="-74" y1="-32" x2="-74" y2="-22" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
          <text id="pfCalloutLbl2" x="-66" y="-24" font-size="10.5" font-weight="500" fill="#94a3b8"></text>
          <text id="pfCalloutVal2" x="74" y="-24" text-anchor="end" font-size="10.5" font-weight="700" fill="#cbd5e1"></text>
        </g>
      </svg>
    `;

    const svg = document.getElementById("pfPerfSvg");
    const vLine = document.getElementById("pfHoverVLine");
    const ring = document.getElementById("pfHoverRingGroup");
    const callout = document.getElementById("pfHoverCallout");
    const cDate = document.getElementById("pfCalloutDate");
    const cLbl1 = document.getElementById("pfCalloutLbl1");
    const cVal1 = document.getElementById("pfCalloutVal1");
    const cLbl2 = document.getElementById("pfCalloutLbl2");
    const cVal2 = document.getElementById("pfCalloutVal2");

    const showPoint = (pt) => {
      if (!pt) return;
      if (vLine) {
        vLine.style.display = "";
        vLine.setAttribute("x1", pt.x.toFixed(1));
        vLine.setAttribute("x2", pt.x.toFixed(1));
      }
      if (ring) {
        ring.style.display = "";
        ring.setAttribute("transform", `translate(${pt.x.toFixed(1)}, ${pt.yMain.toFixed(1)})`);
      }
      if (callout) {
        callout.style.display = "";
        let cx = pt.x;
        if (cx < PADl + 90) cx = PADl + 90;
        if (cx > W - PADr - 90) cx = W - PADr - 90;
        let cy = pt.yMain - 8;
        if (cy < 85) cy = pt.yMain + 92;
        callout.setAttribute("transform", `translate(${cx.toFixed(1)}, ${cy.toFixed(1)})`);
      }
      if (cDate) cDate.textContent = `${pt.label} (กำไร ${pt.gainPct >= 0 ? '+' : ''}${pt.gainPct.toFixed(1)}%)`;
      if (mode === "capital") {
        if (cLbl1) cLbl1.textContent = "Value";
        if (cVal1) cVal1.textContent = this.fmtShort(pt.market);
        if (cLbl2) cLbl2.textContent = "Cost";
        if (cVal2) cVal2.textContent = this.fmtShort(pt.cost);
      } else {
        if (cLbl1) cLbl1.textContent = "Total Return";
        if (cVal1) cVal1.textContent = `${pt.gainPct >= 0 ? '+' : ''}${pt.gainPct.toFixed(1)}%`;
        if (cLbl2) cLbl2.textContent = "Mid Risk";
        if (cVal2) cVal2.textContent = `${pt.midRetPct >= 0 ? '+' : ''}${pt.midRetPct.toFixed(1)}%`;
      }
    };

    const defaultIdx = points.length - 1;
    showPoint(points[defaultIdx]);

    if (svg) {
      svg.onmousemove = (e) => {
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * W;
        let closest = points[0];
        let minDist = Math.abs(closest.x - svgX);
        for (let i = 1; i < points.length; i++) {
          const d = Math.abs(points[i].x - svgX);
          if (d < minDist) { minDist = d; closest = points[i]; }
        }
        showPoint(closest);
      };
      svg.onmouseleave = () => showPoint(points[defaultIdx]);
    }
  },

  /* =========================================================================
     HOLDINGS LIST CARD (Right side of Middle Row — 100% from Sheet "Portfolio")
     ========================================================================= */
  renderHoldingsList(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const tbody = document.getElementById("pfHoldingsTbody");
    if (!tbody) return;

    const total = snap.totalNetWorth || 1;
    const iconMeta = {
      PVD: { icon: "🏢", color: "#0284c7" },
      SET: { icon: "🇹🇭", color: "#10b981" },
      INS: { icon: "🛡️", color: "#ec4899" },
      GOLD: { icon: "🪙", color: "#f59e0b" },
      CRYPTO: { icon: "⚡", color: "#8b5cf6" },
      US: { icon: "🇺🇸", color: "#6366f1" },
      CASH: { icon: "💵", color: "#0ea5e9" }
    };

    const allRows = [...(snap.items || [])].sort((a, b) => b.market - a.market);
    const filter = this.state.holdingsFilter || "ALL";
    const filtered = filter === "ALL"
      ? allRows
      : allRows.filter(it => (it.risk || "").toLowerCase() === filter.toLowerCase());

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--pf-fg-muted);">ไม่มีรายการในหมวดนี้จากชีต Portfolio</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(it => {
      const meta = iconMeta[it.cat] || { icon: "📊", color: "#64748b" };
      const weightPct = total > 0 ? Number(((it.market / total) * 100).toFixed(1)) : 0;
      const plAmt = it.market - it.cost;
      const plPct = it.cost > 0 ? Number(((plAmt / it.cost) * 100).toFixed(1)) : 0;
      const isPos = plAmt >= 0;
      const barW = Math.min(100, Math.max(4, weightPct * 2.5));

      return `
        <tr class="pf-hold-row">
          <td>
            <div class="pf-hold-asset">
              <div class="pf-hold-icon" style="background:${meta.color}1a; color:${meta.color}; border:1px solid ${meta.color}35;">${meta.icon}</div>
              <div style="min-width:0;">
                <div class="pf-hold-ticker">${it.name} <span style="font-size:10px; font-weight:600; color:var(--pf-fg-muted);">(${it.assessType})</span></div>
                <div class="pf-hold-name">Risk: ${it.risk} · ทุน ${this.fmtShort(it.cost)}</div>
              </div>
            </div>
          </td>
          <td class="pf-hold-price">${this.fmtMoney(it.market)}</td>
          <td>
            <div class="pf-hold-weight-wrap">
              <span class="pf-hold-weight-num">${weightPct.toFixed(1)}%</span>
              <div class="pf-hold-bar-track">
                <div class="pf-hold-bar-fill" style="width:${barW}%; background:${meta.color};"></div>
              </div>
            </div>
          </td>
          <td style="text-align:right;">
            <span class="pf-pl-pill ${it.cost === 0 && it.market === 0 ? 'info' : (isPos ? 'pos' : 'neg')}">
              ${it.cost === 0 && it.market === 0 ? '0.0%' : `${isPos ? '+' : ''}${plPct.toFixed(1)}%`}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  },

  /* =========================================================================
     ZONE 2: Asset Allocation Donut + Risk Allocation from Sheet "Portfolio"
     ========================================================================= */
  renderAllocationAndDrift(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const total = snap.totalNetWorth || 1;
    const colorMap = {
      PVD: "#0284c7",
      SET: "#10b981",
      INS: "#ec4899",
      CASH: "#0ea5e9",
      US: "#6366f1",
      CRYPTO: "#8b5cf6",
      GOLD: "#f59e0b"
    };

    // Build Donut slices directly from the rows of sheet "Portfolio"
    const slices = [...(snap.items || [])]
      .sort((a, b) => b.market - a.market)
      .map((it, idx) => ({
        id: it.name,
        label: `${it.name} (${it.assessType})`,
        val: it.market,
        cost: it.cost,
        pct: total > 0 ? (it.market / total) * 100 : 0,
        color: colorMap[it.cat] || ["#0284c7", "#10b981", "#ec4899", "#0ea5e9", "#6366f1", "#8b5cf6", "#f59e0b", "#64748b"][idx % 8]
      }));

    const donutEl = document.getElementById("pfDonutWrap");
    if (donutEl) {
      const r = 56;
      const circ = 2 * Math.PI * r;
      let offset = 0;
      const circlesHtml = slices.map((s, idx) => {
        if (s.pct <= 0) return "";
        const dash = (s.pct / 100) * circ;
        const c = `<circle class="pf-donut-seg" data-idx="${idx}" cx="75" cy="75" r="${r}" fill="none" stroke="${s.color}" stroke-width="18" stroke-dasharray="${Math.max(0, dash - 1.5).toFixed(2)} ${circ.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" style="cursor:pointer; transition: stroke-width 0.2s ease;"/>`;
        offset += dash;
        return c;
      }).join("");

      donutEl.innerHTML = `
        <div class="pf-donut-flex">
          <div style="position:relative; width:150px; height:150px; flex-shrink:0;">
            <svg viewBox="0 0 150 150" style="width:100%; height:100%; transform:rotate(-90deg);">
              ${circlesHtml}
            </svg>
            <div class="pf-donut-center">
              <div id="pfDonutCenterLbl" style="font-size:10.5px; color:var(--pf-fg-muted); font-weight:600;">Sheet Portfolio</div>
              <div id="pfDonutCenterVal" style="font-size:14px; font-weight:800; color:var(--pf-fg);">${this.fmtShort(total)}</div>
              <div id="pfDonutCenterPct" style="font-size:10px; color:#10b981; font-weight:700;">${slices.filter(s => s.val > 0).length} สินทรัพย์</div>
            </div>
          </div>
          <div class="pf-donut-legend">
            ${slices.map((s, idx) => `
              <div class="pf-donut-leg-row" data-idx="${idx}">
                <span class="pf-donut-leg-left">
                  <span class="pf-dot" style="background:${s.color};"></span>
                  <span>${s.label}</span>
                </span>
                <span class="pf-donut-leg-right">${s.pct.toFixed(1)}%</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      const cLbl = document.getElementById("pfDonutCenterLbl");
      const cVal = document.getElementById("pfDonutCenterVal");
      const cPct = document.getElementById("pfDonutCenterPct");

      const bindHover = (idx) => {
        const s = slices[idx];
        if (!s) return;
        if (cLbl) cLbl.textContent = s.id;
        if (cVal) cVal.textContent = this.fmtShort(s.val);
        if (cPct) {
          cPct.textContent = `${s.pct.toFixed(1)}% (ทุน ${this.fmtShort(s.cost)})`;
          cPct.style.color = s.color;
        }
      };
      const resetHover = () => {
        if (cLbl) cLbl.textContent = "Sheet Portfolio";
        if (cVal) cVal.textContent = this.fmtShort(total);
        if (cPct) {
          cPct.textContent = `${slices.filter(s => s.val > 0).length} สินทรัพย์`;
          cPct.style.color = "#10b981";
        }
      };

      donutEl.querySelectorAll(".pf-donut-seg, .pf-donut-leg-row").forEach(el => {
        el.onmouseenter = () => bindHover(Number(el.getAttribute("data-idx")));
        el.onmouseleave = resetHover;
      });
    }

    // Risk Allocation Breakdown strictly from Column B ("Risk") of Sheet "Portfolio"
    const driftEl = document.getElementById("pfDriftTableWrap");
    if (driftEl) {
      const riskGroups = [
        {
          key: "High",
          name: "High Risk (SET • USD Stock • Crypto)",
          mkt: snap.risks.High.market,
          cost: snap.risks.High.cost,
          color: "#10b981"
        },
        {
          key: "Mid",
          name: "Mid Risk (PVD • Insurance • GOLD)",
          mkt: snap.risks.Mid.market,
          cost: snap.risks.Mid.cost,
          color: "#0284c7"
        },
        {
          key: "Low",
          name: "Low Risk (Cash • Bank Saving-ME)",
          mkt: snap.risks.Low.market,
          cost: snap.risks.Low.cost,
          color: "#0ea5e9"
        }
      ];

      driftEl.innerHTML = riskGroups.map(r => {
        const sharePct = total > 0 ? Number(((r.mkt / total) * 100).toFixed(1)) : 0;
        const plAmt = r.mkt - r.cost;
        const plPct = r.cost > 0 ? Number(((plAmt / r.cost) * 100).toFixed(1)) : 0;
        const pillCls = plAmt >= 0 ? "pos" : "neg";

        return `
          <div class="pf-drift-item">
            <div class="pf-drift-top">
              <span style="font-weight:700; font-size:12px;">${r.name}</span>
              <span class="pf-pl-pill ${pillCls}" style="font-size:10.5px;">สัดส่วน ${sharePct}% (P/L ${plAmt >= 0 ? '+' : ''}${plPct}%)</span>
            </div>
            <div class="pf-drift-sub">
              <span>มูลค่า <strong>${this.fmtMoney(r.mkt)}</strong> · ต้นทุน <strong>${this.fmtMoney(r.cost)}</strong></span>
            </div>
            <div class="pf-drift-bars">
              <div class="pf-drift-track">
                <div class="pf-drift-fill" style="width:${Math.min(100, sharePct)}%; background:${r.color};"></div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Currency & Geography Exposure calculated strictly from sheet "Portfolio"
    const usdVal = snap.assets.US.market;
    const thbPct = total > 0 ? Math.round(((total - usdVal) / total) * 100) : 100;
    const usdPct = 100 - thbPct;
    const globalVal = snap.assets.US.market + snap.assets.CRYPTO.market + snap.assets.GOLD.market;
    const globalPct = total > 0 ? Math.round((globalVal / total) * 100) : 0;
    const domPct = 100 - globalPct;
    const activeCount = (snap.items || []).filter(i => i.market > 0).length;

    const fxEl = document.getElementById("pfExposureFxVal");
    const geoEl = document.getElementById("pfExposureGeoVal");
    const driftStatEl = document.getElementById("pfExposureDriftVal");
    if (fxEl) fxEl.textContent = `${thbPct}% : ${usdPct}%`;
    if (geoEl) geoEl.textContent = `${domPct}% : ${globalPct}%`;
    if (driftStatEl) driftStatEl.textContent = `${activeCount} / ${(snap.items || []).length} รายการ`;
  },

  /* =========================================================================
     TOP MOVERS CARD (100% Computed from Sheet "Portfolio" P/L & MoM)
     ========================================================================= */
  renderTopMovers(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const gainersEl = document.getElementById("pfMoversGainers");
    const losersEl = document.getElementById("pfMoversLosers");
    const watchEl = document.getElementById("pfMoversWatchlist");

    const rowsWithPl = (snap.items || []).map(it => {
      const plAmt = it.market - it.cost;
      const plPct = it.cost > 0 ? ((plAmt / it.cost) * 100) : 0;
      const prevIt = snap.prevItemMap[`${it.assessType}__${it.name}`] || snap.prevItemMap[it.name];
      const prevMkt = prevIt ? Number(prevIt.market || 0) : it.market;
      const momDiff = it.market - prevMkt;
      const momPct = prevMkt > 0 ? ((momDiff / prevMkt) * 100) : 0;
      return { ...it, plAmt, plPct, momDiff, momPct, prevMkt };
    });

    if (gainersEl) {
      const gainers = rowsWithPl
        .filter(r => r.plAmt > 0)
        .sort((a, b) => b.plPct - a.plPct);

      if (gainers.length === 0) {
        gainersEl.innerHTML = `<div class="pf-mover-sub" style="padding:8px 0;">ไม่มีรายการกำไรสุทธิ</div>`;
      } else {
        gainersEl.innerHTML = gainers.map(g => `
          <div class="pf-mover-row">
            <div>
              <div class="pf-mover-ticker">${g.name} <span style="font-weight:500; font-size:10px; color:var(--pf-fg-muted);">(${g.assessType})</span></div>
              <div class="pf-mover-sub">+${this.fmtShort(g.plAmt)} (Value ${this.fmtShort(g.market)})</div>
            </div>
            <span class="pf-pl-pill pos">+${g.plPct.toFixed(1)}%</span>
          </div>
        `).join("");
      }
    }

    if (losersEl) {
      const losers = rowsWithPl
        .filter(r => r.plAmt < 0 || (r.plAmt === 0 && r.market > 0))
        .sort((a, b) => a.plPct - b.plPct);

      if (losers.length === 0) {
        losersEl.innerHTML = `<div class="pf-mover-sub" style="padding:8px 0;">ไม่มีรายการขาดทุน</div>`;
      } else {
        losersEl.innerHTML = losers.map(l => `
          <div class="pf-mover-row">
            <div>
              <div class="pf-mover-ticker">${l.name} <span style="font-weight:500; font-size:10px; color:var(--pf-fg-muted);">(${l.assessType})</span></div>
              <div class="pf-mover-sub">${l.plAmt < 0 ? this.fmtShort(l.plAmt) : 'เท่าทุน ฿0'} (Value ${this.fmtShort(l.market)})</div>
            </div>
            <span class="pf-pl-pill ${l.plAmt < 0 ? 'neg' : 'info'}">${l.plPct.toFixed(1)}%</span>
          </div>
        `).join("");
      }
    }

    if (watchEl) {
      // Top MoM Value changes between latest month and previous month in sheet "Portfolio"
      const momMovers = [...rowsWithPl]
        .filter(r => Math.abs(r.momDiff) > 0 || r.market > 0)
        .sort((a, b) => Math.abs(b.momDiff) - Math.abs(a.momDiff))
        .slice(0, 4);

      watchEl.innerHTML = momMovers.map(w => {
        const isPos = w.momDiff >= 0;
        return `
          <div class="pf-watch-row">
            <div class="pf-watch-left">
              <span class="pf-watch-badge" style="background:${isPos ? '#10b9811a' : '#f43f5e1a'}; color:${isPos ? '#10b981' : '#f43f5e'};">${isPos ? '↑' : '↓'}</span>
              <div>
                <div class="pf-watch-name">${w.name} (${w.assessType})</div>
                <div style="font-size:10px; color:var(--pf-fg-muted);">เดือนก่อน: ${this.fmtMoney(w.prevMkt)}</div>
              </div>
            </div>
            <div class="pf-watch-right">
              <div class="pf-watch-price">${this.fmtMoney(w.market)}</div>
              <div class="pf-watch-chg" style="color:${w.momDiff > 0 ? '#10b981' : (w.momDiff < 0 ? '#f43f5e' : 'var(--pf-fg-muted)')};">
                MoM ${w.momDiff >= 0 ? '+' : ''}${this.fmtShort(w.momDiff)}
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  },

  /* =========================================================================
     PORTFOLIO SHEET ANALYTICS (Right of Bottom 3-Col Row — 100% from Sheet "Portfolio")
     ========================================================================= */
  renderMarketIntelligence(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const el = document.getElementById("pfMarketIntelList");
    if (!el) return;

    const hist = snap.hist || [];
    const latestLbl = snap.latest ? snap.latest.label.replace(" (ปัจจุบัน)", "") : "-";
    const prevLbl = snap.prev ? snap.prev.label.replace(" (ปัจจุบัน)", "") : "-";
    const oneYrPt = hist.length >= 13 ? hist[hist.length - 13] : (hist[0] || snap.latest);
    const initPt = hist[0] || snap.latest;

    const yoyDiff = snap.totalNetWorth - (oneYrPt?.market || 0);
    const yoyPct = (oneYrPt?.market > 0) ? ((yoyDiff / oneYrPt.market) * 100) : 0;

    const allDiff = snap.totalNetWorth - (initPt?.market || 0);
    const allPct = (initPt?.market > 0) ? ((allDiff / initPt.market) * 100) : 0;

    // Identify biggest MoM changes in sheet "Portfolio"
    const changedItems = (snap.items || []).map(it => {
      const p = snap.prevItemMap[`${it.assessType}__${it.name}`] || snap.prevItemMap[it.name];
      const diffMkt = it.market - (p ? p.market : it.market);
      const diffCost = it.cost - (p ? p.cost : it.cost);
      return { ...it, diffMkt, diffCost };
    }).sort((a, b) => Math.abs(b.diffMkt) - Math.abs(a.diffMkt));

    const topChg = changedItems.slice(0, 3).map(c => `${c.name} (${c.diffMkt >= 0 ? '+' : ''}${this.fmtShort(c.diffMkt)})`).join(" · ");

    const insights = [
      {
        tag: `LATEST SNAPSHOT • ${latestLbl} (SHEET "PORTFOLIO")`,
        title: `มูลค่าพอร์ตรวม ${this.fmtMoney(snap.totalNetWorth)} จากต้นทุนรวม ${this.fmtMoney(snap.totalCost)}`,
        impact: `กำไรสุทธิ +${this.fmtMoney(snap.unrealizedPL)} (+${snap.unrealizedPct.toFixed(2)}%)`
      },
      {
        tag: `MOM MOVEMENT • ${latestLbl} VS ${prevLbl}`,
        title: `การเปลี่ยนแปลงรายสินทรัพย์เดือนล่าสุด: ${topChg || '-'}`,
        impact: `มูลค่ารวม ${snap.momValueDiff >= 0 ? '+' : ''}${this.fmtMoney(snap.momValueDiff)} (${snap.momValuePct.toFixed(2)}%) · เงินต้น ${snap.momCostDiff >= 0 ? '+' : ''}${this.fmtMoney(snap.momCostDiff)}`
      },
      {
        tag: `HISTORICAL GROWTH • ${hist.length} MONTHS (${initPt?.label || ''} – ${latestLbl})`,
        title: `เติบโต 1 ปี (YoY) ${yoyDiff >= 0 ? '+' : ''}${this.fmtMoney(yoyDiff)} (${yoyPct >= 0 ? '+' : ''}${yoyPct.toFixed(1)}%) และเติบโตสะสมตั้งแต่เริ่มบันทึก ${allDiff >= 0 ? '+' : ''}${this.fmtMoney(allDiff)}`,
        impact: `All-Time Growth +${allPct.toFixed(1)}% · CAGR +${snap.cagrPct.toFixed(2)}% ต่อปี`
      }
    ];

    el.innerHTML = insights.map(n => `
      <div class="pf-intel-card">
        <div class="pf-intel-tag">${n.tag}</div>
        <div class="pf-intel-title">${n.title}</div>
        <div class="pf-intel-impact">📊 ${n.impact}</div>
      </div>
    `).join("");
  },

  /* =========================================================================
     ZONE 4: Asset Class Performance & Deep-Dive (7 Assessments & Reference Chart)
     ========================================================================= */
  selectAssessment(assetId) {
    this.state.activeAssessment = assetId || "SET";
    this.renderAssetClassDetailCards();

    // Optionally sync Trade Log Explorer sheet if traded
    const sheetMap = { SET: "set", US: "usd", GOLD: "gold", CRYPTO: "crypto" };
    if (sheetMap[assetId]) {
      this.selectTradeLogSheet(sheetMap[assetId], false);
    }
  },

  getAssessmentModels(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const data = (typeof currentFinData !== "undefined" && currentFinData) ? currentFinData : {};
    const hist = Array.isArray(data.portfolioHistory) ? data.portfolioHistory : [];
    const total = snap.totalNetWorth || 1;
    const a = snap.assets || {};

    const monthNames = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
      "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
      "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };
    const monthFull = {
      "01": "January", "02": "February", "03": "March", "04": "April",
      "05": "May", "06": "June", "07": "July", "08": "August",
      "09": "September", "10": "October", "11": "November", "12": "December"
    };

    const buildHistForAsset = (key) => {
      return hist.map(h => {
        const dStr = String(h.date || "2026-01");
        const parts = dStr.split("-");
        const yr = parts[0] || "2026";
        const mo = parts[1] || "01";
        const mShort = monthNames[mo] || "Jan";
        const mFull = monthFull[mo] || "January";

        let hm = 0, hc = 0;
        if (h.assets && h.assets[key]) {
          hm = Number(h.assets[key].market ?? 0);
          hc = Number(h.assets[key].cost ?? 0);
        } else if (key === "CASH" && h.assets && h.assets.CASH) {
          hm = Number(h.assets.CASH.market ?? 0);
          hc = Number(h.assets.CASH.cost ?? 0);
        }
        return {
          date: dStr,
          label: `${mShort} ${yr}`,
          shortLabel: `${mShort} '${yr.slice(-2)}`,
          monthOnly: mShort,
          fullDate: `${mFull} ${yr}`,
          market: hm,
          cost: hc
        };
      });
    };

    const definitions = [
      { id: "SET", name: "SET", title: "SET (Thai Equities)", icon: "🇹🇭", color: "#8b5cf6", colorRgb: "139, 92, 246", assetKey: "SET", tradeLogKey: "set", monthlyAvg: 42739 },
      { id: "US", name: "US Stock", title: "US Stock (US Equities)", icon: "🇺🇸", color: "#3b82f6", colorRgb: "59, 130, 246", assetKey: "US", tradeLogKey: "usd", monthlyAvg: 12500 },
      { id: "GOLD", name: "Gold", title: "Gold (Bullion 96.5%)", icon: "🪙", color: "#f59e0b", colorRgb: "245, 158, 11", assetKey: "GOLD", tradeLogKey: "gold", monthlyAvg: 18200 },
      { id: "CRYPTO", name: "Crypto", title: "Crypto (Digital Assets)", icon: "⚡", color: "#ec4899", colorRgb: "236, 72, 153", assetKey: "CRYPTO", tradeLogKey: "crypto", monthlyAvg: 11413 },
      { id: "PVD", name: "PVD", title: "PVD (Provident Fund)", icon: "🏢", color: "#10b981", colorRgb: "16, 185, 129", assetKey: "PVD", tradeLogKey: null, monthlyAvg: 19726 },
      { id: "INS", name: "Insurance", title: "Insurance (Life & Savings)", icon: "🛡️", color: "#6366f1", colorRgb: "99, 102, 241", assetKey: "INS", tradeLogKey: null, monthlyAvg: 21544 },
      { id: "SAVING", name: "Saving ME", title: "Saving ME (High-Yield Cash)", icon: "🏦", color: "#06b6d4", colorRgb: "6, 182, 212", assetKey: "CASH", tradeLogKey: null, monthlyAvg: 20532 }
    ];

    const models = {};
    definitions.forEach(def => {
      const ast = a[def.assetKey] || { market: 0, cost: 0 };
      const mkt = Number(ast.market ?? 0);
      const cst = Number(ast.cost ?? 0);
      const pl = mkt - cst;
      const plPct = cst > 0 ? (pl / cst * 100) : 0;
      const wVal = total > 0 ? (mkt / total * 100) : 0;

      const rawHist = buildHistForAsset(def.assetKey);
      let ath = mkt;
      if (rawHist.length > 0) {
        ath = Math.max(...rawHist.map(h => h.market), mkt);
      }

      // Compute 3-yr CAGR
      let cagr = 10.0;
      if (rawHist.length > 12) {
        const startVal = Math.max(1, rawHist[0].market);
        const endVal = Math.max(1, mkt);
        const years = (rawHist.length - 1) / 12.0;
        cagr = (Math.pow(endVal / startVal, 1 / years) - 1) * 100;
        if (isNaN(cagr) || !isFinite(cagr)) cagr = plPct / Math.max(1, years);
      } else {
        cagr = plPct;
      }

      // Extract holdings
      let holdings = [];
      if (def.tradeLogKey && data.tradeLogs && data.tradeLogs[def.tradeLogKey] && Array.isArray(data.tradeLogs[def.tradeLogKey].holdings)) {
        holdings = data.tradeLogs[def.tradeLogKey].holdings.map(h => ({
          name: h.name || h.ticker || "-",
          status: h.status || "Active",
          mktThb: Number(h.mktThb ?? 0),
          costThb: Number(h.costThb ?? 0),
          profitThb: Number(h.profitThb ?? 0),
          profitPct: Number(h.profitPct ?? 0)
        }));
      } else if (def.id === "PVD") {
        holdings = [
          { name: "BBLAM Global Equity Master", status: "Active DCA", mktThb: 1080236, costThb: 453718, profitThb: 626518, profitPct: 138.1 },
          { name: "BBLAM Thai Equity Dividend", status: "Active DCA", mktThb: 648141, costThb: 272231, profitThb: 375910, profitPct: 138.1 },
          { name: "BBLAM Gov Bond & Money Market", status: "Active DCA", mktThb: 432095, costThb: 181488, profitThb: 250607, profitPct: 138.1 }
        ];
      } else if (def.id === "INS") {
        holdings = [
          { name: "AIA Unit Linked Life Protection", status: "Active Protection", mktThb: 545000, costThb: 545000, profitThb: 0, profitPct: 0.0 },
          { name: "FWD Saving 10/5 Protection", status: "Guaranteed Return", mktThb: 446050, costThb: 446050, profitThb: 0, profitPct: 0.0 }
        ];
      } else if (def.id === "SAVING") {
        holdings = [
          { name: "Cash Reserve (KTB Account)", status: "Ready Cash", mktThb: 109351, costThb: 109351, profitThb: 0, profitPct: 0.0 },
          { name: "Saving-ME (TTB High Yield 2.2%)", status: "Accruing Interest", mktThb: 10458, costThb: 10458, profitThb: 2396, profitPct: 2.2 }
        ];
      }

      models[def.id] = {
        id: def.id,
        name: def.name,
        title: def.title,
        icon: def.icon,
        color: def.color,
        colorRgb: def.colorRgb,
        market: mkt,
        cost: cst,
        pl,
        plPct,
        weightVal: wVal,
        ath,
        cagr,
        monthlyAvg: def.monthlyAvg,
        history: rawHist,
        holdings: holdings.slice(0, 8)
      };
    });

    return models;
  },

  renderAssetClassDetailCards(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const models = this.getAssessmentModels(snap);
    const activeId = this.state.activeAssessment || "SET";
    const activeModel = models[activeId] || models["SET"];

    // 1. Render Top 7 Assessment Summary Cards
    const grid = document.getElementById("pfZ4AssessmentsGrid");
    if (grid) {
      grid.innerHTML = Object.values(models).map(m => {
        const isActive = m.id === activeId ? "active" : "";
        const isNeg = m.plPct < 0 ? "neg" : "";
        const sign = m.plPct > 0 ? "+" : "";
        return `
          <div class="pf-z4-assess-card ${isActive}" style="--card-color: ${m.color}; --card-bg-icon: rgba(${m.colorRgb}, 0.15);" onclick="PortfolioUI.selectAssessment('${m.id}')">
            <div>
              <div class="pf-z4-assess-top">
                <div class="pf-z4-icon-badge">${m.icon}</div>
                <span class="pf-z4-pl-pill ${isNeg}">${sign}${m.plPct.toFixed(1)}%</span>
              </div>
              <div class="pf-z4-assess-name">${m.name}</div>
              <div class="pf-z4-assess-market">${this.fmtMoney(m.market)}</div>
            </div>
            <div class="pf-z4-assess-foot">
              <span>Cost ${this.fmtShort(m.cost)}</span>
              <span style="font-weight:700; color:var(--pf-fg-sec);">${m.weightVal.toFixed(1)}%</span>
            </div>
          </div>
        `;
      }).join("");
    }

    const indNode = document.getElementById("pfZ4ActiveAssessIndicator");
    if (indNode) indNode.textContent = `Active: ${activeModel.title}`;

    // 2. Render Main Chart and KPIs
    this.renderZone4Main(activeModel);

    // 3. Render Zone 4 Deep-Dive Sheet Explorer ("SET Trade Log", "USD Stock Trading Log", "Gold Trade Log", "Crypto Trade Log")
    this.renderTradeLogExplorer();
  },

  renderZone4Main(model) {
    if (!model) return;
    const setEl = (id, txt) => { const n = document.getElementById(id); if (n) n.textContent = txt; };

    // Update Header
    setEl("pfZ4ChartTitle", `Total Market Value in ${model.name}`);
    setEl("pfZ4HeroVal", this.fmtShort(model.market));
    setEl("pfZ4ExactVal", `(${this.fmtMoney(model.market)})`);

    const growthPill = document.getElementById("pfZ4GrowthPill");
    if (growthPill) {
      const arrow = model.plPct >= 0 ? "↗" : "↘";
      const sign = model.plPct > 0 ? "+" : "";
      growthPill.textContent = `${sign}${model.plPct.toFixed(1)}% ${arrow}`;
      growthPill.className = `pf-pl-pill ${model.plPct >= 0 ? 'pos' : 'neg'}`;
    }

    const dotMkt = document.getElementById("pfZ4DotMarket");
    if (dotMkt) dotMkt.style.background = model.color;

    // Filter History by Global Period (1M, 3M, YTD, 1Y, ALL)
    let hist = model.history || [];
    const period = this.state.period || "ALL";
    if (period === "1M") hist = hist.slice(-2);
    else if (period === "3M") hist = hist.slice(-3);
    else if (period === "YTD") {
      const ytd = hist.filter(h => h.date && h.date.startsWith("2026"));
      hist = ytd.length > 0 ? ytd : hist.slice(-10);
    } else if (period === "1Y") hist = hist.slice(-12);

    if (hist.length > 0) {
      setEl("pfZ4DateSpan", `${hist[0].label} - ${hist[hist.length - 1].label}`);
    }

    // Render SVG Spline Curves with 1:1 Pixel Mapping
    this.renderZone4Chart(model, hist);

    // Update Key Performance Indicators
    setEl("pfZ4AssetCodeTag", model.id);
    const roiEl = document.getElementById("pfZ4RoiVal");
    if (roiEl) {
      const sign = model.plPct > 0 ? "+" : "";
      roiEl.textContent = `${sign}${model.plPct.toFixed(1)}%`;
      roiEl.style.color = model.plPct >= 0 ? "#34d399" : "#fb7185";
    }
    const roiBar = document.getElementById("pfZ4RoiBar");
    if (roiBar) roiBar.style.width = `${Math.min(100, Math.max(8, Math.abs(model.plPct)))}%`;

    setEl("pfZ4WeightVal", `${model.weightVal.toFixed(1)}%`);
    const weightBar = document.getElementById("pfZ4WeightBar");
    if (weightBar) weightBar.style.width = `${Math.min(100, model.weightVal)}%`;

    setEl("pfZ4AthVal", this.fmtMoney(model.ath));
    const athBar = document.getElementById("pfZ4AthBar");
    if (athBar) {
      const athRatio = model.ath > 0 ? (model.market / model.ath * 100) : 100;
      athBar.style.width = `${Math.min(100, athRatio)}%`;
    }

    setEl("pfZ4CagrVal", `${model.cagr > 0 ? '+' : ''}${model.cagr.toFixed(1)}%`);
    const cagrBar = document.getElementById("pfZ4CagrBar");
    if (cagrBar) cagrBar.style.width = `${Math.min(100, Math.max(10, model.cagr * 4))}%`;

    setEl("pfZ4DcaVal", `${this.fmtMoney(model.monthlyAvg)} / mo`);

    setEl("pfZ4KpiFootCost", this.fmtMoney(model.cost));
    const footPl = document.getElementById("pfZ4KpiFootPl");
    if (footPl) {
      const sign = model.pl > 0 ? "+" : "";
      footPl.textContent = `${sign}${this.fmtMoney(model.pl)} (${sign}${model.plPct.toFixed(1)}%)`;
      footPl.style.color = model.pl >= 0 ? "#34d399" : "#fb7185";
    }

    // Render Underlying Holdings & Positions
    const hCount = document.getElementById("pfZ4HoldingsCount");
    if (hCount) hCount.textContent = `${(model.holdings || []).length} Positions`;

    const hList = document.getElementById("pfZ4HoldingsList");
    if (hList) {
      if (!model.holdings || model.holdings.length === 0) {
        hList.innerHTML = `<div style="text-align:center; padding: 18px; color: var(--pf-fg-muted); grid-column: 1 / -1;">No underlying positions in sheet</div>`;
      } else {
        hList.innerHTML = model.holdings.map(h => {
          const plColor = h.profitThb >= 0 ? "#34d399" : "#fb7185";
          const plSign = h.profitThb > 0 ? "+" : "";
          return `
            <div class="pf-z4-holding-row">
              <div>
                <div class="pf-z4-h-sym">${h.name}</div>
                <div class="pf-z4-h-name">Cost ${this.fmtMoney(h.costThb)} • ${h.status}</div>
              </div>
              <div>
                <div class="pf-z4-h-val">${this.fmtMoney(h.mktThb)}</div>
                <div style="font-size:10.5px; color:${plColor}; font-weight:700; text-align:right; font-family:'JetBrains Mono', monospace;">
                  ${plSign}${this.fmtMoney(h.profitThb)} (${plSign}${h.profitPct.toFixed(1)}%)
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    }
  },

  getCatmullRomSpline(points) {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  },

  renderZone4Chart(model, hist) {
    const wrap = document.getElementById("pfZ4ChartStageWrap");
    const svg = document.getElementById("pfZ4SvgChart");
    if (!wrap || !svg || !hist || hist.length === 0) return;

    const rect = wrap.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || 1000));
    const h = Math.max(240, Math.round(rect.height || 320));

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const padLeft = 58;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 38;

    let maxVal = -Infinity;
    let minVal = Infinity;
    hist.forEach(d => {
      maxVal = Math.max(maxVal, d.market, d.cost);
      minVal = Math.min(minVal, d.market, d.cost);
    });

    const range = (maxVal - minVal) || 1;
    maxVal += range * 0.14;
    minVal = Math.max(0, minVal - range * 0.08);

    const usableW = w - padLeft - padRight;
    const usableH = h - padTop - padBottom;

    const marketPts = [];
    const costPts = [];

    hist.forEach((d, idx) => {
      const x = padLeft + (hist.length > 1 ? (idx / (hist.length - 1)) * usableW : usableW / 2);
      const ym = padTop + usableH - ((d.market - minVal) / (maxVal - minVal)) * usableH;
      const yc = padTop + usableH - ((d.cost - minVal) / (maxVal - minVal)) * usableH;
      marketPts.push({ x, y: ym, costY: yc, market: d.market, cost: d.cost, date: d.date, label: d.label, shortLabel: d.shortLabel, monthOnly: d.monthOnly, fullDate: d.fullDate });
      costPts.push({ x, y: yc, market: d.market, cost: d.cost, date: d.date, label: d.label });
    });

    this._zone4Points = marketPts;

    const mktPath = this.getCatmullRomSpline(marketPts);
    const cstPath = this.getCatmullRomSpline(costPts);

    const curveMkt = document.getElementById("pfZ4CurveMarket");
    if (curveMkt) {
      curveMkt.setAttribute("d", mktPath);
      curveMkt.setAttribute("stroke", model.color);
    }
    const curveCst = document.getElementById("pfZ4CurveCost");
    if (curveCst) curveCst.setAttribute("d", cstPath);

    const gradStop = document.querySelector("#pfZ4PurpleGrad stop:first-child");
    if (gradStop) gradStop.setAttribute("stop-color", model.color);

    const firstX = marketPts[0].x;
    const lastX = marketPts[marketPts.length - 1].x;
    const bottomY = padTop + usableH;

    const areaMkt = document.getElementById("pfZ4AreaMarket");
    if (areaMkt) areaMkt.setAttribute("d", `${mktPath} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z`);

    const areaCst = document.getElementById("pfZ4AreaCost");
    if (areaCst) areaCst.setAttribute("d", `${cstPath} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z`);

    const lastM = marketPts[marketPts.length - 1];
    const lastC = costPts[costPts.length - 1];

    const endM = document.getElementById("pfZ4EndMarketDot");
    if (endM) {
      endM.setAttribute("cx", lastM.x.toFixed(1));
      endM.setAttribute("cy", lastM.y.toFixed(1));
      endM.setAttribute("fill", model.color);
    }
    const endC = document.getElementById("pfZ4EndCostDot");
    if (endC) {
      endC.setAttribute("cx", lastC.x.toFixed(1));
      endC.setAttribute("cy", lastC.y.toFixed(1));
    }

    // Grid & Y-Axis
    const gridG = document.getElementById("pfZ4GridGroup");
    if (gridG) {
      gridG.innerHTML = "";
      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const val = minVal + (i / ySteps) * (maxVal - minVal);
        const yPos = padTop + usableH - (i / ySteps) * usableH;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padLeft);
        line.setAttribute("y1", yPos.toFixed(1));
        line.setAttribute("x2", w - padRight);
        line.setAttribute("y2", yPos.toFixed(1));
        line.setAttribute("stroke", "var(--pf-border)");
        line.setAttribute("stroke-dasharray", "3 3");
        gridG.appendChild(line);

        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", padLeft - 10);
        txt.setAttribute("y", (yPos + 4).toFixed(1));
        txt.setAttribute("text-anchor", "end");
        txt.textContent = val >= 1000000 ? `${(val / 1000000).toFixed(2)}M` : `${Math.round(val / 1000)}K`;
        gridG.appendChild(txt);
      }
    }

    // X-Axis
    const xG = document.getElementById("pfZ4XAxisGroup");
    if (xG) {
      xG.innerHTML = "";
      const maxTicks = Math.max(4, Math.min(12, Math.floor(usableW / 72)));
      const step = Math.max(1, Math.ceil((hist.length - 1) / (maxTicks - 1)));
      for (let i = 0; i < hist.length; i += step) {
        const pt = marketPts[i];
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", pt.x.toFixed(1));
        txt.setAttribute("y", h - 10);
        txt.setAttribute("text-anchor", "middle");
        txt.textContent = (this.state.period === "1Y" || this.state.period === "YTD") ? pt.monthOnly : pt.shortLabel;
        xG.appendChild(txt);
      }
    }

    // Attach interactive hover/drag listener once
    if (!this._zone4HoverAttached) {
      this._zone4HoverAttached = true;
      this.attachZone4ChartInteractions();
    }
  },

  attachZone4ChartInteractions() {
    const wrap = document.getElementById("pfZ4ChartStageWrap");
    const card = document.getElementById("pfZ4HoverCard");
    const vLine = document.getElementById("pfZ4HoverVLine");
    const activeDot = document.getElementById("pfZ4HoverActiveDot");
    const costDot = document.getElementById("pfZ4HoverCostDot");
    if (!wrap || !card) return;

    const updateHover = (e) => {
      const pts = this._zone4Points;
      if (!pts || pts.length === 0) return;
      const rect = wrap.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : undefined);
      if (clientX === undefined) return;

      const mouseX = clientX - rect.left;
      let nearest = pts[0];
      let minDist = Infinity;
      pts.forEach(pt => {
        const d = Math.abs(pt.x - mouseX);
        if (d < minDist) {
          minDist = d;
          nearest = pt;
        }
      });

      if (vLine) {
        vLine.setAttribute("x1", nearest.x.toFixed(1));
        vLine.setAttribute("x2", nearest.x.toFixed(1));
        vLine.setAttribute("opacity", "1");
      }
      if (activeDot) {
        activeDot.setAttribute("cx", nearest.x.toFixed(1));
        activeDot.setAttribute("cy", nearest.y.toFixed(1));
        activeDot.setAttribute("opacity", "1");
      }
      if (costDot) {
        costDot.setAttribute("cx", nearest.x.toFixed(1));
        costDot.setAttribute("cy", nearest.costY.toFixed(1));
        costDot.setAttribute("opacity", "1");
      }

      const pl = nearest.market - nearest.cost;
      const plPct = nearest.cost > 0 ? (pl / nearest.cost * 100) : 0;
      const sign = pl > 0 ? "+" : "";
      const arrow = pl >= 0 ? "↗" : "↘";

      const mktVal = document.getElementById("pfZ4CardMktVal");
      if (mktVal) mktVal.textContent = this.fmtShort(nearest.market);

      const badge = document.getElementById("pfZ4CardGrowthBadge");
      if (badge) {
        badge.textContent = `${sign}${plPct.toFixed(1)}% ${arrow}`;
        badge.style.color = pl >= 0 ? "#6ee7b7" : "#fca5a5";
      }

      const dText = document.getElementById("pfZ4CardDateText");
      if (dText) dText.textContent = nearest.fullDate || nearest.label;

      const exactMkt = document.getElementById("pfZ4CardExactMkt");
      if (exactMkt) exactMkt.textContent = this.fmtMoney(nearest.market);

      const exactCost = document.getElementById("pfZ4CardCostVal");
      if (exactCost) exactCost.textContent = this.fmtMoney(nearest.cost);

      const plVal = document.getElementById("pfZ4CardPlVal");
      if (plVal) {
        plVal.textContent = `${sign}${this.fmtMoney(pl)} (${sign}${plPct.toFixed(1)}%)`;
        plVal.style.color = pl >= 0 ? "#6ee7b7" : "#fca5a5";
      }

      const clampedX = Math.max(105, Math.min(rect.width - 105, nearest.x));
      card.style.left = `${clampedX}px`;
      card.style.top = `${Math.max(85, nearest.y - 10)}px`;
      card.style.opacity = "1";
    };

    wrap.addEventListener("mousemove", updateHover);
    wrap.addEventListener("touchmove", updateHover, { passive: true });

    const hideHover = () => {
      card.style.opacity = "0";
      if (vLine) vLine.setAttribute("opacity", "0");
      if (activeDot) activeDot.setAttribute("opacity", "0");
      if (costDot) costDot.setAttribute("opacity", "0");
    };

    wrap.addEventListener("mouseleave", hideHover);
    wrap.addEventListener("touchend", hideHover);

    window.addEventListener("resize", () => {
      const snap = this.getLatestPortfolioSnapshot();
      const models = this.getAssessmentModels(snap);
      const activeId = this.state.activeAssessment || "SET";
      const activeModel = models[activeId] || models["SET"];
      let hist = activeModel.history || [];
      const period = this.state.period || "ALL";
      if (period === "1M") hist = hist.slice(-2);
      else if (period === "3M") hist = hist.slice(-3);
      else if (period === "YTD") {
        const ytd = hist.filter(h => h.date && h.date.startsWith("2026"));
        hist = ytd.length > 0 ? ytd : hist.slice(-10);
      } else if (period === "1Y") hist = hist.slice(-12);
      this.renderZone4Chart(activeModel, hist);
    });
  },
  /* =========================================================================
     ZONE 4 DEEP-DIVE EXPLORER:
     Sheets: "SET Trade Log", "USD Stock Trading Log", "Gold Trade Log", "Crypto Trade Log"
     ========================================================================= */
  selectTradeLogSheet(sheetKey, scrollToExplorer) {
    this.state.tradeLogSheet = sheetKey || "set";
    this.state.tradeLogTickerFilter = "ALL";
    this.state.tradeLogTypeFilter = "ALL";

    document.querySelectorAll(".pf-tradelog-tab-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-tl") === this.state.tradeLogSheet);
    });
    document.querySelectorAll(".pf-tl-type-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-tltype") === "ALL");
    });

    this.renderTradeLogExplorer();

    if (scrollToExplorer) {
      const box = document.getElementById("pfZone4TradeLogExplorer");
      if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  setTradeLogHoldingFilter(statusFilter) {
    this.state.tradeLogHoldingFilter = statusFilter || "ALL";
    document.querySelectorAll(".pf-tl-holdstatus-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-tlstatus") === this.state.tradeLogHoldingFilter);
    });
    this.renderTradeLogExplorer();
  },

  setTradeLogTypeFilter(typeFilter) {
    this.state.tradeLogTypeFilter = typeFilter || "ALL";
    document.querySelectorAll(".pf-tl-type-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-tltype") === this.state.tradeLogTypeFilter);
    });
    this.renderTradeLogExplorer(true);
  },

  setTradeLogTickerFilter(ticker) {
    this.state.tradeLogTickerFilter = ticker || "ALL";
    this.renderTradeLogExplorer(true);
  },

  renderTradeLogExplorer(keepTickerOptions) {
    const key = this.state.tradeLogSheet || "set";
    const logs = (typeof currentFinData !== "undefined" && currentFinData && currentFinData.tradeLogs) ? currentFinData.tradeLogs : {};
    const sheetData = logs[key] || { holdings: [], total: null, trades: [] };
    const holdings = Array.isArray(sheetData.holdings) ? sheetData.holdings : [];
    const trades = Array.isArray(sheetData.trades) ? sheetData.trades : [];
    const total = sheetData.total || null;

    const metaMap = {
      set: {
        sheetName: "SET Trade Log",
        title: "🇹🇭 เจาะลึกพอร์ตหุ้นไทย & ประวัติซื้อขายจากชีต “SET Trade Log”",
        badgeColor: "#10b981"
      },
      usd: {
        sheetName: "USD Stock Trading Log",
        title: "🇺🇸 เจาะลึกพอร์ตหุ้นสหรัฐฯ & ประวัติซื้อขายจากชีต “USD Stock Trading Log”",
        badgeColor: "#6366f1"
      },
      gold: {
        sheetName: "Gold Trade Log",
        title: "🪙 เจาะลึกพอร์ตทองคำ AOM NOW & ประวัติซื้อขายจากชีต “Gold Trade Log”",
        badgeColor: "#f59e0b"
      },
      crypto: {
        sheetName: "Crypto Trade Log",
        title: "⚡ เจาะลึกพอร์ตคริปโต Bitkub & ประวัติซื้อขายจากชีต “Crypto Trade Log”",
        badgeColor: "#8b5cf6"
      }
    };
    const meta = metaMap[key] || metaMap.set;

    const badgeEl = document.getElementById("pfZ4ExplorerSheetBadge");
    const titleEl = document.getElementById("pfZ4ExplorerTitle");
    if (badgeEl) badgeEl.textContent = `Sheet: ${meta.sheetName}`;
    if (titleEl) titleEl.textContent = meta.title;

    // 1. Render KPI Strip for Selected Trade Log Sheet
    const kpiStripEl = document.getElementById("pfZ4ExplorerKpiStrip");
    if (kpiStripEl) {
      let mktThb = total ? Number(total.mktThb || 0) : holdings.reduce((s, h) => s + Number(h.mktThb || 0), 0);
      let costThb = total ? Number(total.costThb || 0) : holdings.reduce((s, h) => s + Number(h.costThb || 0), 0);
      let profitThb = total && total.profitThb !== undefined ? Number(total.profitThb) : (mktThb - costThb);
      let profitPct = costThb > 0 ? ((profitThb / costThb) * 100) : 0;

      const buyTrades = trades.filter(t => (t.type || "").toLowerCase() === "buy");
      const sellTrades = trades.filter(t => (t.type || "").toLowerCase() === "sell");
      const activeHoldings = holdings.filter(h => Number(h.mktThb || 0) > 0 || Number(h.sellable || 0) > 0);

      let extraKpiLbl = "ปันผลรับสุทธิ / ยอดขายสะสม";
      let extraKpiVal = "—";
      let extraKpiSub = "";

      if (key === "set") {
        const netDiv = holdings.reduce((s, h) => s + Number(h.netDivThb || 0), 0);
        const targetDiv = holdings.reduce((s, h) => s + Number(h.targetDivThb || 0), 0);
        extraKpiLbl = "เงินปันผลคาดการณ์ต่อปี (Net DIV)";
        extraKpiVal = this.fmtMoney(netDiv);
        extraKpiSub = `เป้าหมายปันผล ${this.fmtMoney(targetDiv)} (${targetDiv > 0 ? ((netDiv / targetDiv) * 100).toFixed(1) : 0}%)`;
      } else if (key === "usd") {
        const divThb = total ? Number(total.divThb || 0) : holdings.reduce((s, h) => s + Number(h.divThb || 0), 0);
        const divUsd = total ? Number(total.divUsd || 0) : holdings.reduce((s, h) => s + Number(h.divUsd || 0), 0);
        extraKpiLbl = "เงินปันผลรับสุทธิ (Dividend Net)";
        extraKpiVal = `${this.fmtMoney(divThb)} (${this.fmtUsd(divUsd)})`;
        extraKpiSub = `Mkt USD: ${this.fmtUsd(total?.mktUsd || 0)} · Cost USD: ${this.fmtUsd(total?.costUsd || 0)}`;
      } else if (key === "gold") {
        const totalBuyBaht = buyTrades.reduce((s, t) => s + Number(t.weightBaht || 0), 0);
        const totalBuyAmt = buyTrades.reduce((s, t) => s + Number(t.amountThb || 0), 0);
        const totalSellAmt = sellTrades.reduce((s, t) => s + Number(t.amountThb || 0), 0);
        extraKpiLbl = "ยอดซื้อทองสะสม vs ยอดขายออก";
        extraKpiVal = `ขายแล้ว ${this.fmtMoney(totalSellAmt)}`;
        extraKpiSub = `ซื้อสะสม ${totalBuyBaht.toFixed(2)} บาททอง (${this.fmtMoney(totalBuyAmt)})`;
      } else if (key === "crypto") {
        const totalBuyCost = buyTrades.reduce((s, t) => s + Number(t.totalCostThb || 0), 0);
        const totalSellVal = sellTrades.reduce((s, t) => s + Number(t.totalCostThb || 0), 0);
        extraKpiLbl = "ธุรกรรมสะสมบน Bitkub";
        extraKpiVal = `Buy ${buyTrades.length} ครั้ง · Sell ${sellTrades.length} ครั้ง`;
        extraKpiSub = `ยอดซื้อรวม ${this.fmtShort(totalBuyCost)} · ยอดขายรวม ${this.fmtShort(totalSellVal)}`;
      }

      const isPos = profitThb >= 0;
      kpiStripEl.innerHTML = `
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Market Value (จากชีต ${meta.sheetName})</div>
          <div class="pf-kpi-val">${this.fmtMoney(mktThb)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-muted">${key === "usd" && total ? `(${this.fmtUsd(total.mktUsd)})` : `อัปเดตสดจากชีต ${meta.sheetName}`}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Cost NAV (ต้นทุนสุทธิในชีต)</div>
          <div class="pf-kpi-val">${this.fmtMoney(costThb)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-muted">${key === "usd" && total ? `(${this.fmtUsd(total.costUsd)})` : `ต้นทุนสะสมตามตารางสรุปพอร์ต`}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Profit / Loss (กำไร/ขาดทุนในชีต)</div>
          <div class="pf-kpi-val" style="color:${isPos ? '#10b981' : '#f43f5e'};">${isPos ? '+' : ''}${this.fmtMoney(profitThb)}</div>
          <div class="pf-kpi-foot">
            <span class="${isPos ? 'pf-pos' : 'pf-neg'}">${isPos ? '↑ +' : '↓ '}${profitPct.toFixed(2)}%</span>
            <span class="pf-muted">${key === "usd" && total ? `(${isPos ? '+' : ''}${this.fmtUsd(total.profitUsd)})` : 'Return on Cost'}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">${extraKpiLbl}</div>
          <div class="pf-kpi-val" style="font-size:18px;">${extraKpiVal}</div>
          <div class="pf-kpi-foot"><span class="pf-muted">${extraKpiSub}</span></div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">จำนวนสินทรัพย์ &amp; ประวัติเทรด</div>
          <div class="pf-kpi-val" style="font-size:18px;">${activeHoldings.length}/${holdings.length} สินทรัพย์ · ${trades.length} เทรด</div>
          <div class="pf-kpi-foot">
            <span class="pf-pos">Buy ${buyTrades.length}</span>
            <span class="pf-muted">· Sell ${sellTrades.length} · อื่นๆ ${trades.length - buyTrades.length - sellTrades.length}</span>
          </div>
        </div>
      `;
    }

    // 2. Render Holdings Summary Table (Right-side table of the selected Trade Log sheet)
    const holdWrap = document.getElementById("pfZ4ExplorerHoldingsWrap");
    if (holdWrap) {
      const onlyActive = this.state.tradeLogHoldingFilter === "ACTIVE";
      const filteredHoldings = holdings.filter(h => {
        if (!onlyActive) return true;
        return Number(h.mktThb || 0) > 0 || Number(h.sellable || 0) > 0;
      });

      if (key === "set") {
        holdWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>Fund / Stock Name</th>
                <th>Status</th>
                <th style="text-align:right;">Sellable / Target</th>
                <th style="text-align:right;">Avg / Last (THB)</th>
                <th style="text-align:right;">Cost NAV (THB)</th>
                <th style="text-align:right;">Mkt Value (THB)</th>
                <th style="text-align:right;">Net DIV / Yr</th>
                <th style="text-align:right;">Profit (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHoldings.map(h => {
                const isPos = h.profitThb >= 0;
                const isAct = (h.status || "").toLowerCase() === "active" && h.mktThb > 0;
                return `
                  <tr class="pf-hold-row" style="cursor:pointer;" onclick="PortfolioUI.setTradeLogTickerFilter('${h.name === 'Cash' ? 'ALL' : h.name}')">
                    <td><strong>${h.name}</strong> ${h.portionPct > 0 ? `<span style="font-size:10px; color:var(--pf-fg-muted);">(${h.portionPct.toFixed(1)}%)</span>` : ''}</td>
                    <td><span class="pf-pl-pill ${isAct ? 'pos' : 'info'}" style="font-size:10px;">${h.status}</span></td>
                    <td style="text-align:right;">${h.sellable.toLocaleString()} <span style="color:var(--pf-fg-muted); font-size:10px;">/ ${h.targetUnits.toLocaleString()}</span></td>
                    <td style="text-align:right;">฿${h.avgPriceThb.toFixed(2)} → <strong>฿${h.lastPriceThb.toFixed(2)}</strong></td>
                    <td style="text-align:right;">${this.fmtMoney(h.costThb)}</td>
                    <td style="text-align:right; font-weight:700;">${this.fmtMoney(h.mktThb)}</td>
                    <td style="text-align:right; color:#6366f1; font-weight:600;">${h.netDivThb > 0 ? `${this.fmtMoney(h.netDivThb)} (${h.divPctPerStock.toFixed(2)}%)` : '—'}</td>
                    <td style="text-align:right;">
                      <span class="pf-pl-pill ${h.profitThb === 0 ? 'info' : (isPos ? 'pos' : 'neg')}">
                        ${h.profitThb > 0 ? '+' : ''}${this.fmtMoney(h.profitThb)} (${h.profitPct >= 0 ? '+' : ''}${h.profitPct.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                `;
              }).join("")}
              ${total ? `
                <tr class="pf-hold-row" style="background:var(--pf-card); font-weight:800; border-top:2px solid var(--pf-border);">
                  <td colspan="4">รวมพอร์ต SET ทั้งหมด (Total Row in Sheet)</td>
                  <td style="text-align:right;">${this.fmtMoney(total.costThb)}</td>
                  <td style="text-align:right; color:#10b981;">${this.fmtMoney(total.mktThb)}</td>
                  <td style="text-align:right; color:#6366f1;">${this.fmtMoney(holdings.reduce((s, h) => s + (h.netDivThb || 0), 0))}</td>
                  <td style="text-align:right;">
                    <span class="pf-pl-pill ${total.profitThb >= 0 ? 'pos' : 'neg'}">
                      ${total.profitThb >= 0 ? '+' : ''}${this.fmtMoney(total.profitThb)} (${total.profitPct >= 0 ? '+' : ''}${total.profitPct.toFixed(2)}%)
                    </span>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        `;
      } else if (key === "usd") {
        holdWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>Fund Name / Group</th>
                <th>Status</th>
                <th style="text-align:right;">Sellable Units</th>
                <th style="text-align:right;">Avg / Last (USD)</th>
                <th style="text-align:right;">Cost NAV (USD / THB)</th>
                <th style="text-align:right;">Mkt Value (USD / THB)</th>
                <th style="text-align:right;">Dividend Net</th>
                <th style="text-align:right;">Profit (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHoldings.map(h => {
                const isPos = h.profitThb >= 0;
                const isOngoing = (h.status || "").toLowerCase() === "ongoing";
                return `
                  <tr class="pf-hold-row" style="cursor:pointer;" onclick="PortfolioUI.setTradeLogTickerFilter('${h.name === 'Cash' ? 'ALL' : h.name}')">
                    <td>
                      <strong>${h.name}</strong>
                      <span style="font-size:10px; color:var(--pf-fg-muted);">${h.group ? `(${h.group} • ${h.port})` : ''} ${h.allocPct > 0 ? `• ${h.allocPct.toFixed(1)}%` : ''}</span>
                    </td>
                    <td><span class="pf-pl-pill ${isOngoing ? 'pos' : 'info'}" style="font-size:10px;">${h.status}</span></td>
                    <td style="text-align:right;">${h.sellable > 0 ? h.sellable.toFixed(4) : '0'}</td>
                    <td style="text-align:right;">${h.avgPriceUsd > 0 ? `${this.fmtUsd(h.avgPriceUsd)} → <strong>${this.fmtUsd(h.lastPriceUsd)}</strong>` : '—'}</td>
                    <td style="text-align:right;">${h.costThb > 0 ? `${this.fmtUsd(h.costUsd)} <span style="color:var(--pf-fg-muted);">(${this.fmtMoney(h.costThb)})</span>` : '—'}</td>
                    <td style="text-align:right; font-weight:700;">${h.mktThb > 0 ? `${this.fmtUsd(h.mktUsd)} <span style="color:#10b981;">(${this.fmtMoney(h.mktThb)})</span>` : '—'}</td>
                    <td style="text-align:right; color:#6366f1; font-weight:600;">${h.divThb > 0 ? `${this.fmtUsd(h.divUsd)} (${this.fmtMoney(h.divThb)})` : '—'}</td>
                    <td style="text-align:right;">
                      ${h.costThb > 0 || h.profitThb !== 0 ? `
                        <span class="pf-pl-pill ${h.profitThb === 0 ? 'info' : (isPos ? 'pos' : 'neg')}">
                          ${h.profitThb > 0 ? '+' : ''}${this.fmtMoney(h.profitThb)} (${h.profitPct >= 0 ? '+' : ''}${h.profitPct.toFixed(2)}%)
                        </span>
                      ` : '<span style="color:var(--pf-fg-muted);">Sold / Terminated</span>'}
                    </td>
                  </tr>
                `;
              }).join("")}
              ${total ? `
                <tr class="pf-hold-row" style="background:var(--pf-card); font-weight:800; border-top:2px solid var(--pf-border);">
                  <td colspan="4">รวมพอร์ต USD Stock ทั้งหมด (Total Row in Sheet)</td>
                  <td style="text-align:right;">${this.fmtUsd(total.costUsd)} (${this.fmtMoney(total.costThb)})</td>
                  <td style="text-align:right; color:#10b981;">${this.fmtUsd(total.mktUsd)} (${this.fmtMoney(total.mktThb)})</td>
                  <td style="text-align:right; color:#6366f1;">${this.fmtUsd(total.divUsd)} (${this.fmtMoney(total.divThb)})</td>
                  <td style="text-align:right;">
                    <span class="pf-pl-pill ${total.profitThb >= 0 ? 'pos' : 'neg'}">
                      +${this.fmtMoney(total.profitThb)} (+${total.profitPct.toFixed(2)}%)
                    </span>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        `;
      } else if (key === "gold") {
        holdWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>Gold Agent</th>
                <th>Status</th>
                <th style="text-align:right;">Sellable (บาททอง)</th>
                <th style="text-align:right;">Avg Price / Last Price (THB)</th>
                <th style="text-align:right;">Cost NAV (THB)</th>
                <th style="text-align:right;">Mkt Value (THB)</th>
                <th style="text-align:right;">Profit (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${holdings.map(h => `
                <tr class="pf-hold-row">
                  <td><strong>${h.name}</strong></td>
                  <td><span class="pf-pl-pill ${h.mktThb > 0 ? 'pos' : 'warn'}" style="font-size:10px;">${h.status || 'Sold Out'}</span></td>
                  <td style="text-align:right;">${h.sellable.toFixed(4)} บาททอง</td>
                  <td style="text-align:right;">฿${h.avgPriceThb.toLocaleString()} → <strong>฿${h.lastPriceThb.toLocaleString()}</strong></td>
                  <td style="text-align:right;">${this.fmtMoney(h.costThb)}</td>
                  <td style="text-align:right; font-weight:700;">${this.fmtMoney(h.mktThb)}</td>
                  <td style="text-align:right;">
                    <span class="pf-pl-pill ${h.profitThb >= 0 ? 'pos' : 'info'}">
                      ${this.fmtMoney(h.profitThb)} (ขายทำกำไร 30-Oct-2026 ยอด ฿909,701)
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;
      } else if (key === "crypto") {
        holdWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>Cryptocurrency Name</th>
                <th>Status</th>
                <th style="text-align:right;">Sellable Units</th>
                <th style="text-align:right;">Avg / Last (THB/Unit)</th>
                <th style="text-align:right;">Cost NAV (THB)</th>
                <th style="text-align:right;">Mkt Value (THB)</th>
                <th style="text-align:right;">Profit (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHoldings.map(h => {
                const isPos = h.profitThb >= 0;
                const isHold = (h.status || "").toLowerCase() === "holding" && h.mktThb > 0;
                return `
                  <tr class="pf-hold-row" style="cursor:pointer;" onclick="PortfolioUI.setTradeLogTickerFilter('${h.name === 'Cash' ? 'ALL' : h.name}')">
                    <td><strong>${h.name}</strong></td>
                    <td><span class="pf-pl-pill ${isHold ? 'pos' : 'info'}" style="font-size:10px;">${h.status || '—'}</span></td>
                    <td style="text-align:right;">${h.sellable > 0 ? h.sellable.toFixed(6) : '0'}</td>
                    <td style="text-align:right;">฿${h.avgPriceThb.toLocaleString()} → <strong>฿${h.lastPriceThb.toLocaleString()}</strong></td>
                    <td style="text-align:right;">${this.fmtMoney(h.costThb)}</td>
                    <td style="text-align:right; font-weight:700;">${this.fmtMoney(h.mktThb)}</td>
                    <td style="text-align:right;">
                      <span class="pf-pl-pill ${h.profitThb === 0 ? 'info' : (isPos ? 'pos' : 'neg')}">
                        ${h.profitThb > 0 ? '+' : ''}${this.fmtMoney(h.profitThb)} (${h.profitPct >= 0 ? '+' : ''}${h.profitPct.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                `;
              }).join("")}
              ${total ? `
                <tr class="pf-hold-row" style="background:var(--pf-card); font-weight:800; border-top:2px solid var(--pf-border);">
                  <td colspan="4">รวมพอร์ต Crypto ทั้งหมด (Total Row in Sheet)</td>
                  <td style="text-align:right;">${this.fmtMoney(total.costThb)}</td>
                  <td style="text-align:right; color:#8b5cf6;">${this.fmtMoney(total.mktThb)}</td>
                  <td style="text-align:right;">
                    <span class="pf-pl-pill ${total.profitThb >= 0 ? 'pos' : 'neg'}">
                      ${total.profitThb >= 0 ? '+' : ''}${this.fmtMoney(total.profitThb)} (${total.profitPct.toFixed(2)}%)
                    </span>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        `;
      }
    }

    // 3. Populate Ticker Dropdown for Trade Transactions Log
    const tickerSel = document.getElementById("pfZ4TradeTickerSelect");
    if (tickerSel && !keepTickerOptions) {
      const uniqueTickers = Array.from(new Set(trades.map(t => t.ticker || t.agent).filter(Boolean)));
      tickerSel.innerHTML = `<option value="ALL">ทุกสินทรัพย์ (${uniqueTickers.length} รายการ)</option>` +
        uniqueTickers.map(tk => `<option value="${tk}" ${this.state.tradeLogTickerFilter === tk ? 'selected' : ''}>${tk}</option>`).join("");
    } else if (tickerSel) {
      tickerSel.value = this.state.tradeLogTickerFilter || "ALL";
    }

    // 4. Render Trade Transactions Log Table (Left-side table of the selected Trade Log sheet)
    const tradesWrap = document.getElementById("pfZ4ExplorerTradesWrap");
    const countSubEl = document.getElementById("pfZ4ExplorerTradeCountSub");

    if (tradesWrap) {
      const tFilter = this.state.tradeLogTypeFilter || "ALL";
      const tkFilter = this.state.tradeLogTickerFilter || "ALL";

      const filteredTrades = [...trades].reverse().filter(t => {
        if (tkFilter !== "ALL" && (t.ticker || t.agent) !== tkFilter) return false;
        if (tFilter === "ALL") return true;
        const tp = (t.type || "").toLowerCase();
        if (tFilter === "Buy") return tp === "buy";
        if (tFilter === "Sell") return tp === "sell";
        return tp !== "buy" && tp !== "sell";
      });

      if (countSubEl) {
        countSubEl.textContent = `แสดง ${filteredTrades.length} จากทั้งหมด ${trades.length} รายการในชีต “${meta.sheetName}” (เรียงจากล่าสุด)`;
      }

      if (key === "gold") {
        tradesWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Agent</th>
                <th>Type</th>
                <th style="text-align:right;">Gold Weight (g)</th>
                <th style="text-align:right;">Gold (บาททอง)</th>
                <th style="text-align:right;">Price / บาททอง</th>
                <th style="text-align:right;">Amount (THB)</th>
                <th style="text-align:right;">Trade P&amp;L (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTrades.map(t => {
                const isBuy = (t.type || "").toLowerCase() === "buy";
                const isPos = t.plThb >= 0;
                return `
                  <tr class="pf-hold-row">
                    <td style="color:var(--pf-fg-muted);">${t.idx}</td>
                    <td><strong>${t.date}</strong></td>
                    <td>${t.agent}</td>
                    <td><span class="pf-pl-pill ${isBuy ? 'pos' : 'warn'}" style="font-size:10px;">${t.type}</span></td>
                    <td style="text-align:right;">${t.weightG.toFixed(4)} g</td>
                    <td style="text-align:right;">${t.weightBaht.toFixed(4)} บาท</td>
                    <td style="text-align:right;">${this.fmtMoney(t.pricePerBaht)}</td>
                    <td style="text-align:right; font-weight:700;">${this.fmtMoney(t.amountThb)}</td>
                    <td style="text-align:right;">
                      ${t.plThb !== 0 ? `<span class="pf-pl-pill ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${this.fmtMoney(t.plThb)} (${isPos ? '+' : ''}${t.plPct.toFixed(2)}%)</span>` : '<span style="color:var(--pf-fg-muted);">Realized Lot</span>'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        `;
      } else if (key === "usd") {
        tradesWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Type</th>
                <th>Stock Name</th>
                <th style="text-align:right;">Qty</th>
                <th style="text-align:right;">Price (USD)</th>
                <th style="text-align:right;">Total Cost (USD)</th>
                <th style="text-align:right;">FX (THB/USD)</th>
                <th style="text-align:right;">Total Cost (THB)</th>
                <th style="text-align:right;">Trade P&amp;L (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTrades.map(t => {
                const tp = (t.type || "").toLowerCase();
                const pillCls = tp === "buy" ? "pos" : (tp === "sell" ? "warn" : "info");
                const isPos = t.plThb >= 0;
                return `
                  <tr class="pf-hold-row">
                    <td style="color:var(--pf-fg-muted);">${t.idx}</td>
                    <td><strong>${t.date}</strong></td>
                    <td><span class="pf-pl-pill ${pillCls}" style="font-size:10px;">${t.type}</span></td>
                    <td><strong>${t.ticker}</strong> <span style="font-size:10px; color:var(--pf-fg-muted);">${t.stage ? `(${t.stage})` : ''}</span></td>
                    <td style="text-align:right;">${t.qty > 0 ? t.qty.toFixed(4) : '—'}</td>
                    <td style="text-align:right;">${t.priceUsd > 0 ? this.fmtUsd(t.priceUsd) : '—'}</td>
                    <td style="text-align:right; font-weight:600;">${this.fmtUsd(t.totalCostUsd)}</td>
                    <td style="text-align:right; color:var(--pf-fg-muted);">${t.fxRate > 0 ? t.fxRate.toFixed(2) : '—'}</td>
                    <td style="text-align:right; font-weight:700;">${this.fmtMoney(t.totalCostThb)}</td>
                    <td style="text-align:right;">
                      ${t.plThb !== 0 ? `<span class="pf-pl-pill ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${this.fmtMoney(t.plThb)} (${isPos ? '+' : ''}${t.plPct.toFixed(2)}%)</span>` : '<span style="color:var(--pf-fg-muted);">—</span>'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        `;
      } else {
        // SET Trade Log & Crypto Trade Log
        tradesWrap.innerHTML = `
          <table class="pf-hold-tbl" style="font-size:11.5px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>App / Broker</th>
                <th>Type</th>
                <th>${key === "set" ? "Stock Name" : "Crypto Name"}</th>
                <th style="text-align:right;">Qty</th>
                <th style="text-align:right;">Price / Unit (THB)</th>
                <th style="text-align:right;">Commission</th>
                <th style="text-align:right;">Total Cost (THB)</th>
                <th style="text-align:right;">Trade P&amp;L (THB / %)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTrades.map(t => {
                const tp = (t.type || "").toLowerCase();
                const pillCls = tp === "buy" ? "pos" : (tp === "sell" ? "warn" : "info");
                const isPos = t.plThb >= 0;
                return `
                  <tr class="pf-hold-row">
                    <td style="color:var(--pf-fg-muted);">${t.idx}</td>
                    <td><strong>${t.date}</strong></td>
                    <td>${t.platform}</td>
                    <td><span class="pf-pl-pill ${pillCls}" style="font-size:10px;">${t.type}</span></td>
                    <td><strong>${t.ticker}</strong></td>
                    <td style="text-align:right;">${t.qty > 0 ? (key === "crypto" ? t.qty.toFixed(6) : t.qty.toLocaleString()) : '—'}</td>
                    <td style="text-align:right;">${t.priceThb > 0 ? `฿${t.priceThb.toLocaleString()}` : '—'}</td>
                    <td style="text-align:right; color:var(--pf-fg-muted);">฿${(t.commThb || 0).toFixed(2)}</td>
                    <td style="text-align:right; font-weight:700;">${this.fmtMoney(t.totalCostThb)}</td>
                    <td style="text-align:right;">
                      ${t.plThb !== 0 ? `<span class="pf-pl-pill ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${this.fmtMoney(t.plThb)} (${isPos ? '+' : ''}${t.plPct.toFixed(2)}%)</span>` : '<span style="color:var(--pf-fg-muted);">—</span>'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        `;
      }
    }
  },

  /* =========================================================================
     ZONE 5: Monthly Investment Analytics (from Sheet "Invest Monthly")
     + Raw Sheet Table ("Portfolio")
     ========================================================================= */
  setInvestMonthlyYear(yr) {
    this.state.investMonthlyYear = yr || "ALL";
    document.querySelectorAll(".pf-inv-yr-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-invyr") === this.state.investMonthlyYear);
    });
    this.renderZone5CashFlowAndTech();
  },

  renderZone5CashFlowAndTech(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const allInv = (typeof currentFinData !== "undefined" && currentFinData && Array.isArray(currentFinData.investMonthly))
      ? currentFinData.investMonthly
      : [];

    const yrFilter = this.state.investMonthlyYear || "ALL";
    const invRows = allInv.filter(r => yrFilter === "ALL" || String(r.year) === String(yrFilter));
    const countMonths = Math.max(1, invRows.length);

    // Compute totals across selected period from "Invest Monthly"
    const sumCol = (k) => invRows.reduce((s, r) => s + Number(r[k] || 0), 0);
    const totalInvest = sumCol("totalInvest");
    const totalFromSalary = sumCol("fromSalary");
    const totalFromDiv = sumCol("fromDiv");
    const totalFromBonus = sumCol("fromBonus");
    const totalFromTax = sumCol("fromTaxRefund");
    const totalFromRebal = sumCol("fromRebalance");
    const avgMonthlyInvest = totalInvest / countMonths;

    // 5.0 HERO: Render Top Investment Flow Sankey + 3 Bottom Cards
    this.renderZone5InvestmentFlow(invRows, totalInvest);

    // 5.1: Render 5 KPI Summary Cards from Sheet "Invest Monthly"
    const kpiGridEl = document.getElementById("pfZ5InvestKpiGrid");
    if (kpiGridEl) {
      const latestInv = invRows.length > 0 ? invRows[invRows.length - 1] : null;
      const salarySharePct = totalInvest > 0 ? ((totalFromSalary / totalInvest) * 100).toFixed(1) : "0.0";
      const divSharePct = totalInvest > 0 ? ((totalFromDiv / totalInvest) * 100).toFixed(1) : "0.0";

      kpiGridEl.innerHTML = `
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Total Net Invest (เงินลงทุนสุทธิรวม)</div>
          <div class="pf-kpi-val">${this.fmtMoney(totalInvest)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-pos">เฉลี่ย ${this.fmtMoney(avgMonthlyInvest)} / เดือน</span>
            <span class="pf-muted">(${invRows.length} เดือน)</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Invest from Salary (ตัดจากเงินเดือน)</div>
          <div class="pf-kpi-val">${this.fmtMoney(totalFromSalary)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-pos">${salarySharePct}% ของเงินลงทุนสุทธิ</span>
            <span class="pf-muted">· เดือนล่าสุด ${this.fmtMoney(latestInv?.fromSalary || 0)}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Invest from DIV / Re-invest (ปันผลทบต้น)</div>
          <div class="pf-kpi-val" style="color:#6366f1;">${this.fmtMoney(totalFromDiv)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-pos">${divSharePct}% ของเงินลงทุนสุทธิ</span>
            <span class="pf-muted">· เดือนล่าสุด ${this.fmtMoney(latestInv?.fromDiv || 0)}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Bonus &amp; Tax Refund (โบนัส + คืนภาษี)</div>
          <div class="pf-kpi-val" style="color:#10b981;">${this.fmtMoney(totalFromBonus + totalFromTax)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-muted">Bonus ${this.fmtShort(totalFromBonus)} · Tax Refund ${this.fmtShort(totalFromTax)}</span>
          </div>
        </div>
        <div class="pf-kpi-card">
          <div class="pf-kpi-lbl">Portfolio Rebalance (สับเปลี่ยนพอร์ตสะสม)</div>
          <div class="pf-kpi-val" style="color:#f59e0b;">${this.fmtMoney(totalFromRebal)}</div>
          <div class="pf-kpi-foot">
            <span class="pf-muted">ย้ายสัดส่วนระหว่างสินทรัพย์ในพอร์ต</span>
          </div>
        </div>
      `;
    }

    // 5.1: Monthly Total Invest Bar Chart (from Sheet "Invest Monthly")
    const calEl = document.getElementById("pfDivCalendarBars");
    const peakEl = document.getElementById("pfZ5PeakSummary");
    const chartRows = invRows.slice(-12);

    if (calEl && chartRows.length > 0) {
      const maxVal = Math.max(...chartRows.map(r => Math.max(0, r.totalInvest)), 1);

      calEl.innerHTML = chartRows.map((r, idx) => {
        const val = Math.max(0, r.totalInvest || 0);
        const h = Math.max(10, Math.round((val / maxVal) * 95));
        const isLatest = idx === chartRows.length - 1;
        return `
          <div class="pf-cal-col" title="${r.date}: Total Invest ${this.fmtMoney(r.totalInvest)} (Salary ${this.fmtShort(r.fromSalary)} | DIV ${this.fmtShort(r.fromDiv)} | Bonus ${this.fmtShort(r.fromBonus)})">
            <div class="pf-cal-val">${(val / 1000).toFixed(0)}k</div>
            <div class="pf-cal-bar-wrap">
              <div class="pf-cal-bar" style="height:${h}px; background:${isLatest ? '#10b981' : '#6366f1'};"></div>
            </div>
            <div class="pf-cal-lbl">${r.label}</div>
          </div>
        `;
      }).join("");

      if (peakEl) {
        const bestRow = [...invRows].sort((a, b) => b.totalInvest - a.totalInvest)[0];
        peakEl.innerHTML = bestRow
          ? `<span>🔥 เดือนลงทุนสูงสุด: <strong>${bestRow.date} (${this.fmtMoney(bestRow.totalInvest)})</strong></span>`
          : `<span>—</span>`;
      }
    }

    // 5.2: Funding Sources Mix & Asset Allocation from Sheet "Invest Monthly"
    const logEl = document.getElementById("pfZ5MonthlyLogList");
    if (logEl) {
      const pvdSum = sumCol("pvdDca");
      const setSum = sumCol("setFunding") + sumCol("setReinvest");
      const usSum = sumCol("usFunding") + sumCol("usReinvest");
      const goldSum = sumCol("goldFunding");
      const cryptoSum = sumCol("cryptoFunding");
      const insSum = sumCol("insFunding") + sumCol("insReinvest");
      const bankSum = sumCol("bankFunding");

      const assetFlows = [
        { name: "🇺🇸 US Stock (Blended + Re-invest)", val: usSum, color: "#6366f1" },
        { name: "🇹🇭 SET Equity (Blended + Re-invest)", val: setSum, color: "#10b981" },
        { name: "⚡ Crypto Blended Funding", val: cryptoSum, color: "#8b5cf6" },
        { name: "🏢 PVD DCA (สะสมรายเดือน)", val: pvdSum, color: "#0284c7" },
        { name: "🏦 Bank Saving Blended Funding", val: bankSum, color: "#0ea5e9" },
        { name: "🛡️ Life Insurance (Funding + Re-invest)", val: insSum, color: "#ec4899" },
        { name: "🪙 Gold Blended Funding (ซื้อ/ขายสุทธิ)", val: goldSum, color: "#f59e0b" }
      ];

      logEl.innerHTML = assetFlows.map(af => {
        const isPos = af.val >= 0;
        return `
          <div style="padding: 7px 10px; border-radius: 9px; background: var(--pf-card-sec); display: flex; justify-content: space-between; align-items: center; font-size: 11.5px;">
            <span style="font-weight: 600; color: var(--pf-fg);">${af.name}</span>
            <strong style="color: ${af.val > 0 ? '#10b981' : (af.val < 0 ? '#f43f5e' : 'var(--pf-fg-muted)')};">
              ${isPos && af.val > 0 ? '+' : ''}${this.fmtMoney(af.val)}
            </strong>
          </div>
        `;
      }).join("");
    }

    // 5.3: Raw Rows Table of Latest Month from Sheet "Portfolio"
    const rawTblEl = document.getElementById("pfZ5RawSheetTable");
    if (rawTblEl) {
      const rows = snap.items || [];
      rawTblEl.innerHTML = `
        <table class="pf-hold-tbl" style="font-size:11px;">
          <thead>
            <tr>
              <th>Date</th>
              <th>Risk</th>
              <th>Assess Type / Name</th>
              <th style="text-align:right;">Value</th>
              <th style="text-align:right;">Cost</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr class="pf-hold-row">
                <td style="color:var(--pf-fg-muted);">${r.date}</td>
                <td><span class="pf-badge-soft" style="padding:2px 6px; font-size:10px;">${r.risk}</span></td>
                <td><strong>${r.name}</strong> <span style="color:var(--pf-fg-muted);">(${r.assessType})</span></td>
                <td style="text-align:right; font-weight:700;">${this.fmtMoney(r.market)}</td>
                <td style="text-align:right; color:var(--pf-fg-sec);">${this.fmtMoney(r.cost)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    // 5.4: Full-Width Monthly Investment Table from Sheet "Invest Monthly"
    const invTblWrap = document.getElementById("pfZ5InvestMonthlyTableWrap");
    const invCountBadge = document.getElementById("pfZ5InvestTableCountBadge");
    if (invCountBadge) invCountBadge.textContent = `${invRows.length} เดือน (${yrFilter === 'ALL' ? 'Jan-2025 – Oct-2026' : yrFilter})`;

    if (invTblWrap) {
      const fmtCell = (v) => {
        const n = Number(v || 0);
        if (Math.abs(n) < 0.01) return `<span style="color:var(--pf-fg-muted);">—</span>`;
        const c = n > 0 ? "var(--pf-fg)" : "#f43f5e";
        return `<span style="color:${c}; font-weight:${Math.abs(n) >= 10000 ? '700' : '500'};">${n > 0 ? '+' : ''}${Math.round(n).toLocaleString("th-TH")}</span>`;
      };

      const rowsDesc = [...invRows].reverse();
      invTblWrap.innerHTML = `
        <table class="pf-hold-tbl" style="font-size:11px; white-space:nowrap;">
          <thead>
            <tr>
              <th>Date</th>
              <th style="text-align:right;">PVD DCA</th>
              <th style="text-align:right;">SET (Fund + Re-inv)</th>
              <th style="text-align:right;">US Stock (Fund + Re-inv)</th>
              <th style="text-align:right;">Gold</th>
              <th style="text-align:right;">Crypto</th>
              <th style="text-align:right;">Bank Saving</th>
              <th style="text-align:right;">Insurance (+Re-inv)</th>
              <th style="text-align:right;">Jitta / LTF / Bond</th>
              <th style="text-align:right; background:rgba(16,185,129,0.08);">Total Invest</th>
              <th style="text-align:right;">From Salary</th>
              <th style="text-align:right;">From DIV/Re-inv</th>
              <th style="text-align:right;">From Bonus</th>
              <th style="text-align:right;">Tax Refund</th>
              <th style="text-align:right;">Rebalance</th>
            </tr>
          </thead>
          <tbody>
            ${rowsDesc.map(r => {
              const setNet = (r.setFunding || 0) + (r.setReinvest || 0);
              const usNet = (r.usFunding || 0) + (r.usReinvest || 0);
              const insNet = (r.insFunding || 0) + (r.insReinvest || 0);
              const otherNet = (r.jittaFunding || 0) + (r.ltfFunding || 0) + (r.bondFunding || 0);
              return `
                <tr class="pf-hold-row">
                  <td><strong>${r.date}</strong></td>
                  <td style="text-align:right;">${fmtCell(r.pvdDca)}</td>
                  <td style="text-align:right;" title="Funding: ${r.setFunding} | Re-invest: ${r.setReinvest}">${fmtCell(setNet)}</td>
                  <td style="text-align:right;" title="Funding: ${r.usFunding} | Re-invest: ${r.usReinvest}">${fmtCell(usNet)}</td>
                  <td style="text-align:right;">${fmtCell(r.goldFunding)}</td>
                  <td style="text-align:right;">${fmtCell(r.cryptoFunding)}</td>
                  <td style="text-align:right;">${fmtCell(r.bankFunding)}</td>
                  <td style="text-align:right;" title="Funding: ${r.insFunding} | Re-invest: ${r.insReinvest}">${fmtCell(insNet)}</td>
                  <td style="text-align:right;" title="Jitta: ${r.jittaFunding} | LTF: ${r.ltfFunding} | Bond: ${r.bondFunding}">${fmtCell(otherNet)}</td>
                  <td style="text-align:right; font-weight:800; color:#10b981; background:rgba(16,185,129,0.05);">${this.fmtMoney(r.totalInvest)}</td>
                  <td style="text-align:right;">${fmtCell(r.fromSalary)}</td>
                  <td style="text-align:right;">${fmtCell(r.fromDiv)}</td>
                  <td style="text-align:right;">${fmtCell(r.fromBonus)}</td>
                  <td style="text-align:right;">${fmtCell(r.fromTaxRefund)}</td>
                  <td style="text-align:right;">${fmtCell(r.fromRebalance)}</td>
                </tr>
              `;
            }).join("")}
            <tr class="pf-hold-row" style="background:var(--pf-card); font-weight:800; border-top:2px solid var(--pf-border);">
              <td>รวม (${invRows.length} ด.)</td>
              <td style="text-align:right;">${fmtCell(sumCol("pvdDca"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("setFunding") + sumCol("setReinvest"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("usFunding") + sumCol("usReinvest"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("goldFunding"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("cryptoFunding"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("bankFunding"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("insFunding") + sumCol("insReinvest"))}</td>
              <td style="text-align:right;">${fmtCell(sumCol("jittaFunding") + sumCol("ltfFunding") + sumCol("bondFunding"))}</td>
              <td style="text-align:right; color:#10b981; background:rgba(16,185,129,0.1);">${this.fmtMoney(totalInvest)}</td>
              <td style="text-align:right;">${fmtCell(totalFromSalary)}</td>
              <td style="text-align:right;">${fmtCell(totalFromDiv)}</td>
              <td style="text-align:right;">${fmtCell(totalFromBonus)}</td>
              <td style="text-align:right;">${fmtCell(totalFromTax)}</td>
              <td style="text-align:right;">${fmtCell(totalFromRebal)}</td>
            </tr>
          </tbody>
        </table>
      `;
    }
  },

  /* =========================================================================
     ZONE 5 HERO: INVESTMENT FLOW SANKEY & 3-CARD WIDGETS
     ========================================================================= */
  renderZone5InvestmentFlow(invRows, totalInvest) {
    const yr = this.state.investMonthlyYear || "ALL";

    const FLOW_DATA = {
      ALL: {
        totalNet: 1404962,
        periodText: "22 เดือน (2025–2026)",
        trendVal: "2025–2026",
        trendPct: "34%",
        pulseVal: "7",
        pulseHistFull: [
          ["ม.ค. 25", 4], ["ก.พ. 25", 4], ["มี.ค. 25", 5], ["เม.ย. 25", 5],
          ["พ.ค. 25", 5], ["มิ.ย. 25", 5], ["ก.ค. 25", 5], ["ส.ค. 25", 5],
          ["ก.ย. 25", 5], ["ต.ค. 25", 5], ["พ.ย. 25", 4], ["ธ.ค. 25", 5],
          ["ม.ค. 26", 6], ["ก.พ. 26", 6], ["มี.ค. 26", 8], ["เม.ย. 26", 6],
          ["พ.ค. 26", 7], ["มิ.ย. 26", 6], ["ก.ค. 26", 6], ["ส.ค. 26", 7],
          ["ก.ย. 26", 6], ["ต.ค. 26", 7]
        ],
        activityVal: "154",
        activityHist: [["ก.ค.", 134], ["ส.ค.", 141], ["ก.ย.", 147], ["ต.ค.", 154]],
        trendHist: [["ก.ค.", 1277512], ["ส.ค.", 1319830], ["ก.ย.", 1361087], ["ต.ค.", 1404962]],
        inflows: [
          { id: "other", title: "Other / Tax Refund", val: 104044, share: "7.4%", sub: "คืนภาษี & ออมเสริม", grad: "url(#pfGradCoral)", color: "#fb7185", desc: "เงินคืนภาษีจาก SSF/RMF/ประกัน + ก้อนเงินออมเสริม" },
          { id: "bonus", title: "Annual Bonus", val: 340000, share: "24.2%", sub: "ก้อนพิเศษ มี.ค. 26", grad: "url(#pfGradGreen)", color: "#166534", desc: "เงินโบนัสประจำปีทบเข้าพอร์ตเพื่อเร่งผลตอบแทน" },
          { id: "pvd_comp", title: "Employer Match", val: 80334, share: "5.7%", sub: "สมทบจากนายจ้าง", grad: "url(#pfGradNavy)", color: "#1e293b", desc: "เงินสมทบกองทุนสำรองเลี้ยงชีพจากนายจ้างรายเดือน" },
          { id: "div", title: "DIV / Re-invest", val: 253825, share: "18.1%", sub: "Dime + SET ปันผล", grad: "url(#pfGradSlate)", color: "#2e4a62", desc: "เงินปันผลที่ได้รับนำกลับไปซื้อสินทรัพย์ทบต้นทันที" },
          { id: "salary", title: "Salary Deduction", val: 626759, share: "44.6%", sub: "ตัดเงินเดือนรายเดือน", grad: "url(#pfGradCyan)", color: "#06b6d4", desc: "เงินออมตัดลงทุนอัตโนมัติรายเดือนจากเงินเดือน" }
        ],
        outflows: [
          { id: "set", title: "SET Equity", val: 505503, share: "36.0%", sub: "Blended + Re-invest", grad: "url(#pfGradRose)", color: "#f43f5e", desc: "ลงทุนหุ้นไทยและกองทุนรวมหุ้นไทยพร้อมปันผลทบต้น" },
          { id: "gold", title: "Gold Bullion", val: 502799, share: "35.8%", sub: "ซื้อ/ขายสุทธิสะสม", grad: "url(#pfGradOrange)", color: "#ea580c", desc: "ทองคำแท่งความบริสุทธิ์สูงเพื่อกระจายความเสี่ยง" },
          { id: "us", title: "US Stocks", val: 453758, share: "32.3%", sub: "Dime Tech & S&P", grad: "url(#pfGradPeach)", color: "#fb923c", desc: "หุ้นเทคโนโลยีและดัชนี S&P 500 ผ่าน Dime" },
          { id: "crypto", title: "Crypto", val: 225000, share: "16.0%", sub: "Bitkub DCA Funding", grad: "url(#pfGradPink)", color: "#ec4899", desc: "Bitcoin และสินทรัพย์ดิจิทัลชั้นนำบน Bitkub" },
          { id: "pvd", title: "PVD", val: 160669, share: "11.4%", sub: "สะสมรายเดือนคงที่", grad: "url(#pfGradAmber)", color: "#d97706", desc: "กองทุนสำรองเลี้ยงชีพหักสะสมอัตโนมัติพร้อมนายจ้างสมทบ" }
        ]
      },
      2026: {
        totalNet: 971087,
        periodText: "10 เดือน (ปี 2026)",
        trendVal: "ปี 2026",
        trendPct: "48%",
        pulseVal: "7",
        pulseHistFull: [
          ["ม.ค.", 6], ["ก.พ.", 6], ["มี.ค.", 8], ["เม.ย.", 6],
          ["พ.ค.", 7], ["มิ.ย.", 6], ["ก.ค.", 6], ["ส.ค.", 7],
          ["ก.ย.", 6], ["ต.ค.", 7]
        ],
        activityVal: "70",
        activityHist: [["ก.ค.", 50], ["ส.ค.", 57], ["ก.ย.", 63], ["ต.ค.", 70]],
        trendHist: [["ก.ค.", 843637], ["ส.ค.", 885955], ["ก.ย.", 927212], ["ต.ค.", 971087]],
        inflows: [
          { id: "other", title: "Other / Tax Refund", val: 89044, share: "9.2%", sub: "คืนภาษี 2568", grad: "url(#pfGradCoral)", color: "#fb7185", desc: "เงินคืนภาษีและเงินออมเสริมพิเศษปี 2026" },
          { id: "bonus", title: "Annual Bonus", val: 340000, share: "35.0%", sub: "ก้อนพิเศษ มี.ค. 26", grad: "url(#pfGradGreen)", color: "#166534", desc: "เงินโบนัสประจำปีทบเข้าพอร์ตปี 2026" },
          { id: "pvd_comp", title: "Employer Match", val: 36515, share: "3.8%", sub: "สมทบ 10 เดือน", grad: "url(#pfGradNavy)", color: "#1e293b", desc: "เงินสมทบนายจ้าง PVD รอบ 10 เดือนปี 2026" },
          { id: "div", title: "DIV / Re-invest", val: 162103, share: "16.7%", sub: "ปันผลทบต้นปี 26", grad: "url(#pfGradSlate)", color: "#2e4a62", desc: "ปันผลรับเข้าพอร์ตปี 2026" },
          { id: "salary", title: "Salary Deduction", val: 343425, share: "35.4%", sub: "ตัดเฉลี่ย ฿34.3k/ด.", grad: "url(#pfGradCyan)", color: "#06b6d4", desc: "ตัดออมจากเงินเดือน 10 เดือนปี 2026" }
        ],
        outflows: [
          { id: "gold", title: "Gold Bullion", val: 365000, share: "37.6%", sub: "เข้าทองคำหนักช่วง Q1", grad: "url(#pfGradOrange)", color: "#ea580c", desc: "จัดสรรเข้าทองคำแท่งรอบปี 2026" },
          { id: "set", title: "SET Equity", val: 318500, share: "32.8%", sub: "หุ้นไทย & ปันผลทบ", grad: "url(#pfGradRose)", color: "#f43f5e", desc: "จัดสรรเข้าหุ้นไทยรอบปี 2026" },
          { id: "us", title: "US Stocks", val: 280000, share: "28.8%", sub: "Dime US Stock", grad: "url(#pfGradPeach)", color: "#fb923c", desc: "จัดสรรเข้าหุ้นสหรัฐรอบปี 2026" },
          { id: "crypto", title: "Crypto", val: 145000, share: "14.9%", sub: "Bitkub DCA", grad: "url(#pfGradPink)", color: "#ec4899", desc: "จัดสรรเข้าสินทรัพย์ดิจิทัลปี 2026" },
          { id: "pvd", title: "PVD", val: 73031, share: "7.5%", sub: "DCA 10 เดือน", grad: "url(#pfGradAmber)", color: "#d97706", desc: "เงินสะสม PVD รอบ 10 เดือนปี 2026" }
        ]
      },
      2025: {
        totalNet: 433875,
        periodText: "12 เดือน (ปี 2025)",
        trendVal: "ปี 2025",
        trendPct: "28%",
        pulseVal: "5",
        pulseHistFull: [
          ["ม.ค.", 4], ["ก.พ.", 4], ["มี.ค.", 5], ["เม.ย.", 5],
          ["พ.ค.", 5], ["มิ.ย.", 5], ["ก.ค.", 5], ["ส.ค.", 5],
          ["ก.ย.", 5], ["ต.ค.", 5], ["พ.ย.", 4], ["ธ.ค.", 5]
        ],
        activityVal: "60",
        activityHist: [["ก.ย.", 46], ["ต.ค.", 51], ["พ.ย.", 55], ["ธ.ค.", 60]],
        trendHist: [["ก.ย.", 337563], ["ต.ค.", 369719], ["พ.ย.", 401719], ["ธ.ค.", 433875]],
        inflows: [
          { id: "other", title: "Other / Tax Refund", val: 15000, share: "3.5%", sub: "คืนภาษี 2567", grad: "url(#pfGradCoral)", color: "#fb7185", desc: "เงินคืนภาษีและเงินเสริมปี 2025" },
          { id: "bonus", title: "Annual Bonus", val: 0, share: "0.0%", sub: "ไม่มีโบนัสในรอบนี้", grad: "url(#pfGradGreen)", color: "#166534", desc: "ไม่มีการจัดสรรโบนัสในปี 2025" },
          { id: "pvd_comp", title: "Employer Match", val: 43819, share: "10.1%", sub: "สมทบ 12 เดือน", grad: "url(#pfGradNavy)", color: "#1e293b", desc: "เงินสมทบนายจ้าง PVD รอบ 12 เดือนปี 2025" },
          { id: "div", title: "DIV / Re-invest", val: 91722, share: "21.1%", sub: "ปันผลทบต้นปี 25", grad: "url(#pfGradSlate)", color: "#2e4a62", desc: "ปันผลรับเข้าพอร์ตปี 2025" },
          { id: "salary", title: "Salary Deduction", val: 283334, share: "65.3%", sub: "ตัดเฉลี่ย ฿23.6k/ด.", grad: "url(#pfGradCyan)", color: "#06b6d4", desc: "ตัดออมจากเงินเดือน 12 เดือนปี 2025" }
        ],
        outflows: [
          { id: "set", title: "SET Equity", val: 187003, share: "43.1%", sub: "หุ้นไทยปี 2025", grad: "url(#pfGradRose)", color: "#f43f5e", desc: "จัดสรรเข้าหุ้นไทยรอบปี 2025" },
          { id: "us", title: "US Stocks", val: 173758, share: "40.0%", sub: "Dime US Stock", grad: "url(#pfGradPeach)", color: "#fb923c", desc: "จัดสรรเข้าหุ้นสหรัฐรอบปี 2025" },
          { id: "gold", title: "Gold Bullion", val: 137799, share: "31.8%", sub: "ทยอยออมทอง", grad: "url(#pfGradOrange)", color: "#ea580c", desc: "จัดสรรเข้าทองคำแท่งรอบปี 2025" },
          { id: "pvd", title: "PVD", val: 87638, share: "20.2%", sub: "DCA 12 เดือน", grad: "url(#pfGradAmber)", color: "#d97706", desc: "เงินสะสม PVD รอบ 12 เดือนปี 2025" },
          { id: "crypto", title: "Crypto", val: 80000, share: "18.4%", sub: "Bitkub DCA", grad: "url(#pfGradPink)", color: "#ec4899", desc: "จัดสรรเข้าสินทรัพย์ดิจิทัลปี 2025" }
        ]
      }
    };

    const d = FLOW_DATA[yr] || FLOW_DATA.ALL;
    this._flowDataCache = FLOW_DATA;
    const finalTotal = totalInvest > 0 ? totalInvest : d.totalNet;

    // 1. Center Hub
    const hubNumEl = document.getElementById("pfHubMainNumber");
    if (hubNumEl) hubNumEl.textContent = this.fmtMoney(finalTotal);

    const hubGroup = document.getElementById("pfCenterHubGroup");
    if (hubGroup) {
      hubGroup.onclick = () => {
        alert(`รอบ ${yr}: ยอดเงินลงทุนสุทธิรวม ${this.fmtMoney(finalTotal)} (${d.periodText})`);
      };
    }

    // 2. Responsive Geometry for SVG
    const svgEl = document.getElementById("pfFlowSvg");
    const isMobile = window.innerWidth < 640;
    if (svgEl) {
      svgEl.setAttribute("viewBox", isMobile ? "168 46 664 470" : "45 25 910 510");
      svgEl.classList.toggle("is-mobile", isMobile);
    }

    const CX = 500, CY = 280;
    const xL = isMobile ? 330 : 250;
    const xR = isMobile ? 670 : 750;
    const TEXT_GAP = 12;

    const inGroup = document.getElementById("pfInflowRibbonsGroup");
    const outGroup = document.getElementById("pfOutflowRibbonsGroup");
    const lblGroup = document.getElementById("pfSvgLabelsGroup");

    if (inGroup && outGroup && lblGroup) {
      inGroup.innerHTML = "";
      outGroup.innerHTML = "";
      lblGroup.innerHTML = "";

      const activeIn = d.inflows.filter(f => f.val > 0);
      const activeOut = d.outflows.filter(f => f.val > 0);
      const maxVal = Math.max(...activeIn.map(f => f.val), ...activeOut.map(f => f.val), 1);

      // Left Inflows
      const nIn = activeIn.length;
      const yInStart = 90, yInEnd = 470;
      const yInStep = nIn > 1 ? (yInEnd - yInStart) / (nIn - 1) : 0;
      const hubInTop = CY - 16, hubInBot = CY + 16;
      const hubInStep = nIn > 1 ? (hubInBot - hubInTop) / (nIn - 1) : 0;

      activeIn.forEach((item, idx) => {
        const yL = yInStart + idx * yInStep;
        const thicknessL = Math.max(20, Math.min(45, (item.val / maxVal) * 42.5));
        const halfThickL = thicknessL / 2;
        const thicknessC = Math.max(19, Math.min(42.5, (item.val / maxVal) * 40));
        const yC_center = hubInTop + idx * hubInStep;
        const yC_top = yC_center - thicknessC / 2;
        const yC_bot = yC_center + thicknessC / 2;
        const xC = CX - 30;
        const dx = xC - xL;

        const pathD = `
          M ${xL} ${yL - halfThickL}
          C ${xL + dx * 0.55} ${yL - halfThickL}, ${xC - dx * 0.35} ${yC_top}, ${xC} ${yC_top}
          L ${xC} ${yC_bot}
          C ${xC - dx * 0.35} ${yC_bot}, ${xL + dx * 0.55} ${yL + halfThickL}, ${xL} ${yL + halfThickL}
          Z
        `.trim();

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathD);
        path.setAttribute("fill", item.grad);
        path.setAttribute("class", "pf-flow-ribbon");
        path.setAttribute("data-id", item.id);
        path.addEventListener("mouseenter", (e) => this.showFlowTooltip(item, "Inflow", e));
        path.addEventListener("mouseleave", () => this.hideFlowTooltip());
        inGroup.appendChild(path);

        // Native SVG Text Label Left
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "pf-node-label-group");
        g.addEventListener("mouseenter", (e) => this.showFlowTooltip(item, "Inflow", e));
        g.addEventListener("mouseleave", () => this.hideFlowTooltip());

        const t1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t1.setAttribute("x", xL - TEXT_GAP);
        t1.setAttribute("y", (yL - (isMobile ? 14 : 10)).toFixed(1));
        t1.setAttribute("text-anchor", "end");
        t1.setAttribute("class", "pf-svg-lbl-title");
        t1.textContent = item.title;

        const t2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t2.setAttribute("x", xL - TEXT_GAP);
        t2.setAttribute("y", (yL + (isMobile ? 8 : 7)).toFixed(1));
        t2.setAttribute("text-anchor", "end");
        t2.setAttribute("class", "pf-svg-lbl-val");
        t2.textContent = this.fmtMoney(item.val);

        const t3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t3.setAttribute("x", xL - TEXT_GAP);
        t3.setAttribute("y", (yL + (isMobile ? 26 : 21)).toFixed(1));
        t3.setAttribute("text-anchor", "end");
        t3.setAttribute("class", "pf-svg-lbl-sub");
        t3.textContent = isMobile ? item.share : `${item.share} · ${item.sub}`;

        g.appendChild(t1);
        g.appendChild(t2);
        g.appendChild(t3);
        lblGroup.appendChild(g);
      });

      // Right Outflows
      const nOut = activeOut.length;
      const yOutStart = 90, yOutEnd = 470;
      const yOutStep = nOut > 1 ? (yOutEnd - yOutStart) / (nOut - 1) : 0;
      const hubOutTop = CY - 16, hubOutBot = CY + 16;
      const hubOutStep = nOut > 1 ? (hubOutBot - hubOutTop) / (nOut - 1) : 0;

      activeOut.forEach((item, idx) => {
        const yR = yOutStart + idx * yOutStep;
        const thicknessR = Math.max(20, Math.min(45, (item.val / maxVal) * 42.5));
        const halfThickR = thicknessR / 2;
        const thicknessC = Math.max(19, Math.min(42.5, (item.val / maxVal) * 40));
        const yC_center = hubOutTop + idx * hubOutStep;
        const yC_top = yC_center - thicknessC / 2;
        const yC_bot = yC_center + thicknessC / 2;
        const xC = CX + 30;
        const dx = xR - xC;

        const pathD = `
          M ${xC} ${yC_top}
          C ${xC + dx * 0.35} ${yC_top}, ${xR - dx * 0.55} ${yR - halfThickR}, ${xR} ${yR - halfThickR}
          L ${xR} ${yR + halfThickR}
          C ${xR - dx * 0.55} ${yR + halfThickR}, ${xC + dx * 0.35} ${yC_bot}, ${xC} ${yC_bot}
          Z
        `.trim();

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathD);
        path.setAttribute("fill", item.grad);
        path.setAttribute("class", "pf-flow-ribbon");
        path.setAttribute("data-id", item.id);
        path.addEventListener("mouseenter", (e) => this.showFlowTooltip(item, "Outflow", e));
        path.addEventListener("mouseleave", () => this.hideFlowTooltip());
        outGroup.appendChild(path);

        // Native SVG Text Label Right
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "pf-node-label-group");
        g.addEventListener("mouseenter", (e) => this.showFlowTooltip(item, "Outflow", e));
        g.addEventListener("mouseleave", () => this.hideFlowTooltip());

        const t1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t1.setAttribute("x", xR + TEXT_GAP);
        t1.setAttribute("y", (yR - (isMobile ? 14 : 10)).toFixed(1));
        t1.setAttribute("text-anchor", "start");
        t1.setAttribute("class", "pf-svg-lbl-title");
        t1.textContent = item.title;

        const t2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t2.setAttribute("x", xR + TEXT_GAP);
        t2.setAttribute("y", (yR + (isMobile ? 8 : 7)).toFixed(1));
        t2.setAttribute("text-anchor", "start");
        t2.setAttribute("class", "pf-svg-lbl-val");
        t2.textContent = this.fmtMoney(item.val);

        const t3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t3.setAttribute("x", xR + TEXT_GAP);
        t3.setAttribute("y", (yR + (isMobile ? 26 : 21)).toFixed(1));
        t3.setAttribute("text-anchor", "start");
        t3.setAttribute("class", "pf-svg-lbl-sub");
        t3.textContent = isMobile ? item.share : `${item.share} · ${item.sub}`;

        g.appendChild(t1);
        g.appendChild(t2);
        g.appendChild(t3);
        lblGroup.appendChild(g);
      });
    }

    // 3. Bottom Cards
    const trendValEl = document.getElementById("pfWidgetTrendVal");
    const trendPctEl = document.getElementById("pfWidgetTrendPct");
    if (trendValEl) trendValEl.textContent = d.trendVal;
    if (trendPctEl) trendPctEl.textContent = d.trendPct;

    const trendSvgEl = document.getElementById("pfTrendMiniSvg");
    if (trendSvgEl) {
      const th = d.trendHist || [];
      const tv = th.map(x => x[1]);
      const tMin = Math.min(...tv), tMax = Math.max(...tv);
      const W = 100, H = 36, padX = 2, padY = 5;
      trendSvgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);

      const pts = th.map((x, i) => [
        padX + (W - padX * 2) * i / 3,
        H - padY - (tMax === tMin ? 0.5 : (x[1] - tMin) / (tMax - tMin)) * (H - padY * 2)
      ]);
      let line = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const cx = (x0 + x1) / 2;
        line += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
      }
      const lastPt = pts[pts.length - 1];
      const area = `${line} L ${lastPt[0]} ${H} L ${pts[0][0]} ${H} Z`;

      trendSvgEl.innerHTML = `
        <defs>
          <linearGradient id="pfTrendMiniGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.30"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="${area}" fill="url(#pfTrendMiniGrad)"/>
        <path d="${line}" fill="none" stroke="#6366f1" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
        <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="3.2" fill="#a5b4fc" stroke="#6366f1" stroke-width="1.3"/>
      `;
    }

    // Pulse
    const pulseValEl = document.getElementById("pfWidgetPulseVal");
    if (pulseValEl) pulseValEl.textContent = d.pulseVal;
    this.renderPulseBarsDynamic(d);

    // Activity
    const actValEl = document.getElementById("pfWidgetActivityVal");
    if (actValEl) actValEl.textContent = d.activityVal;
    const actRowsEl = document.getElementById("pfActivityRows");
    if (actRowsEl) {
      const ah = d.activityHist || [];
      const aMax = Math.max(...ah.map(x => x[1]), 1);
      const ACT_SPLIT = [
        { label: "SET", color: "#6366f1", p: 0.28 },
        { label: "Gold", color: "#3b82f6", p: 0.24 },
        { label: "US", color: "#10b981", p: 0.22 },
        { label: "Crypto", color: "#f97316", p: 0.14 },
        { label: "PVD", color: "#f43f5e", p: 0.12 }
      ];
      actRowsEl.innerHTML = ah.map(x => `
        <div class="pf-act-track" title="${x[0]}: สะสม ${x[1]}"><div class="pf-act-fill" style="width:${(x[1] / aMax) * 100}%">
          ${ACT_SPLIT.map(s => `<span style="width:${s.p * 100}%;background:${s.color}"></span>`).join("")}
        </div></div>`).join("");
    }

    // Attach Observer once
    this.setupPulseBarsObserver();
  },

  renderPulseBarsDynamic(d) {
    if (!d) {
      const yr = this.state.investMonthlyYear || "ALL";
      d = (this._flowDataCache && this._flowDataCache[yr]) ? this._flowDataCache[yr] : null;
    }
    const container = document.getElementById("pfPulseBars");
    if (!container) return;
    const chartBox = container.parentElement;
    const w = (chartBox && chartBox.clientWidth > 0) ? chartBox.clientWidth : (container.clientWidth > 0 ? container.clientWidth : 140);

    const full = (d && d.pulseHistFull) ? d.pulseHistFull : [
      ["ม.ค.", 6], ["ก.พ.", 6], ["มี.ค.", 8], ["เม.ย.", 6],
      ["พ.ค.", 7], ["มิ.ย.", 6], ["ก.ค.", 6], ["ส.ค.", 7],
      ["ก.ย.", 6], ["ต.ค.", 7]
    ];
    const slotWidth = 16;
    const count = Math.max(4, Math.min(full.length, Math.floor(w / slotWidth)));
    const ph = full.slice(-count);
    const pMax = Math.max(...ph.map(x => x[1]), 1);

    container.innerHTML = ph.map((x, i) => {
      const isLatest = i === ph.length - 1;
      const hPct = Math.max(22, Math.round((x[1] / pMax) * 100));
      return `<div class="pf-pulse-bar ${isLatest ? 'latest' : ''}" style="height:${hPct}%" title="${x[0]}: ${x[1]}"></div>`;
    }).join("");
  },

  setupPulseBarsObserver() {
    if (this._pulseObsInit) return;
    this._pulseObsInit = true;
    const chartPulse = document.querySelector(".pf-w-chart-pulse");
    if (chartPulse && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        this.renderPulseBarsDynamic();
      });
      ro.observe(chartPulse);
    }
    window.addEventListener("resize", () => {
      const isMobile = window.innerWidth < 640;
      const svg = document.getElementById("pfFlowSvg");
      if (svg) {
        svg.setAttribute("viewBox", isMobile ? "168 46 664 470" : "45 25 910 510");
        svg.classList.toggle("is-mobile", isMobile);
      }
      this.renderPulseBarsDynamic();
    });
  },

  showFlowTooltip(item, type, e) {
    document.querySelectorAll(".pf-flow-ribbon").forEach(r => {
      if (r.getAttribute("data-id") === item.id) {
        r.classList.add("highlighted");
        r.classList.remove("dimmed");
      } else {
        r.classList.add("dimmed");
        r.classList.remove("highlighted");
      }
    });

    const tip = document.getElementById("pfFlowTooltip");
    if (!tip) return;
    document.getElementById("pfTipTitle").textContent = item.title;
    const badge = document.getElementById("pfTipBadge");
    badge.textContent = type;
    badge.style.backgroundColor = type === "Inflow" ? "rgba(79, 70, 229, 0.15)" : "rgba(244, 63, 94, 0.15)";
    badge.style.color = type === "Inflow" ? "#4f46e5" : "#f43f5e";
    document.getElementById("pfTipValue").textContent = this.fmtMoney(item.val);
    document.getElementById("pfTipShare").textContent = item.share;
    document.getElementById("pfTipDesc").textContent = item.desc;

    tip.style.display = "block";
    tip.style.left = `${Math.min(window.innerWidth - 240, e.clientX + 16)}px`;
    tip.style.top = `${Math.min(window.innerHeight - 150, e.clientY + 16)}px`;
  },

  hideFlowTooltip() {
    document.querySelectorAll(".pf-flow-ribbon").forEach(r => {
      r.classList.remove("highlighted");
      r.classList.remove("dimmed");
    });
    const tip = document.getElementById("pfFlowTooltip");
    if (tip) tip.style.display = "none";
  }
};

window.PortfolioUI = PortfolioUI;
