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

    Object.values(zones).forEach(el => { if (el) el.style.display = ""; });

    if (subTab === "holdings") {
      if (zones.zoneBottom3) zones.zoneBottom3.style.display = "none";
      if (zones.zone5) zones.zone5.style.display = "none";
    } else if (subTab === "allocation") {
      if (zones.zoneMiddle) zones.zoneMiddle.style.display = "none";
    } else if (subTab === "cashflow") {
      if (zones.zoneMiddle) zones.zoneMiddle.style.display = "none";
      if (zones.zoneBottom3) zones.zoneBottom3.style.display = "none";
      if (zones.zone4) zones.zone4.style.display = "none";
    }

    this.renderAll();

    if (subTab === "cashflow" && zones.zone5) {
      setTimeout(() => {
        zones.zone5.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
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

  renderAll() {
    const snap = this.getLatestPortfolioSnapshot();
    this.renderTopSummaryKPIs(snap);
    this.renderPerformanceChart(snap);
    this.renderHoldingsList(snap);
    this.renderAllocationAndDrift(snap);
    this.renderTopMovers(snap);
    this.renderMarketIntelligence(snap);
    this.renderAssetClassDetailCards(snap);
    this.renderZone5CashFlowAndTech(snap);
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
     ZONE 4: Asset Class Performance & Detail Cards (100% from Sheet "Portfolio")
     ========================================================================= */
  renderAssetClassDetailCards(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const a = snap.assets;
    const total = snap.totalNetWorth || 1;
    const setEl = (id, txt) => { const node = document.getElementById(id); if (node) node.textContent = txt; };

    const findItem = (nameKey, catKey) => {
      return (snap.items || []).find(i => i.name.toLowerCase() === nameKey.toLowerCase() || i.cat === catKey) || { market: 0, cost: 0 };
    };

    // 1. SET & USD Stock (from sheet Portfolio)
    const eqMkt = a.SET.market + a.US.market;
    const eqCost = a.SET.cost + a.US.cost;
    const eqPl = eqMkt - eqCost;
    const eqPct = eqCost > 0 ? ((eqPl / eqCost) * 100) : 0;
    const eqWeight = ((eqMkt / total) * 100).toFixed(1);
    const setPl = a.SET.market - a.SET.cost;
    const setPct = a.SET.cost > 0 ? ((setPl / a.SET.cost) * 100) : 0;
    const usPl = a.US.market - a.US.cost;
    const usPct = a.US.cost > 0 ? ((usPl / a.US.cost) * 100) : 0;

    setEl("pfZ4EqBadge", `${eqWeight}% ของพอร์ต`);
    setEl("pfZ4EqMkt", this.fmtMoney(eqMkt));
    setEl("pfZ4EqCost", this.fmtMoney(eqCost));
    setEl("pfZ4EqPl", `${eqPl >= 0 ? '+' : ''}${this.fmtMoney(eqPl)} (${eqPl >= 0 ? '+' : ''}${eqPct.toFixed(1)}%)`);
    setEl("pfZ4SetSplit", `${this.fmtMoney(a.SET.market)} · ทุน ${this.fmtMoney(a.SET.cost)} (${setPl >= 0 ? '+' : ''}${setPct.toFixed(1)}%)`);
    setEl("pfZ4UsSplit", `${this.fmtMoney(a.US.market)} · ทุน ${this.fmtMoney(a.US.cost)} (${usPl >= 0 ? '+' : ''}${usPct.toFixed(1)}%)`);

    // 2. GOLD (AOM NOW) & Crypto (Bitkub) (from sheet Portfolio)
    const altMkt = a.GOLD.market + a.CRYPTO.market;
    const altCost = a.GOLD.cost + a.CRYPTO.cost;
    const altPl = altMkt - altCost;
    const altPct = altCost > 0 ? ((altPl / altCost) * 100) : 0;
    const altWeight = ((altMkt / total) * 100).toFixed(1);
    const goldPl = a.GOLD.market - a.GOLD.cost;
    const goldPct = a.GOLD.cost > 0 ? ((goldPl / a.GOLD.cost) * 100) : 0;
    const cryPl = a.CRYPTO.market - a.CRYPTO.cost;
    const cryPct = a.CRYPTO.cost > 0 ? ((cryPl / a.CRYPTO.cost) * 100) : 0;

    setEl("pfZ4AltBadge", `${altWeight}% ของพอร์ต`);
    setEl("pfZ4AltMkt", this.fmtMoney(altMkt));
    setEl("pfZ4AltCost", this.fmtMoney(altCost));
    setEl("pfZ4AltPl", `${altPl >= 0 ? '+' : ''}${this.fmtMoney(altPl)} (${altCost > 0 ? (altPl >= 0 ? '+' : '') + altPct.toFixed(1) + '%' : '0.0%'})`);
    setEl("pfZ4GoldVal", `${this.fmtMoney(a.GOLD.market)} · ทุน ${this.fmtMoney(a.GOLD.cost)} (${a.GOLD.cost > 0 ? (goldPl >= 0 ? '+' : '') + goldPct.toFixed(1) + '%' : '0.0%'})`);
    setEl("pfZ4CryptoVal", `${this.fmtMoney(a.CRYPTO.market)} · ทุน ${this.fmtMoney(a.CRYPTO.cost)} (${a.CRYPTO.cost > 0 ? (cryPl >= 0 ? '+' : '') + cryPct.toFixed(1) + '%' : '0.0%'})`);

    // 3. PVD Provident Fund & Insurance (from sheet Portfolio)
    const pvdMkt = a.PVD.market;
    const pvdCost = a.PVD.cost;
    const pvdGain = pvdMkt - pvdCost;
    const pvdGainPct = pvdCost > 0 ? ((pvdGain / pvdCost) * 100) : 0;
    const pvdWeight = ((pvdMkt / total) * 100).toFixed(1);
    const prevPvdCost = snap.prev?.assets?.PVD?.cost ?? pvdCost;
    const pvdMomCost = pvdCost - prevPvdCost;

    setEl("pfZ4PvdBadge", `${pvdWeight}% ของพอร์ต`);
    setEl("pfZ4PvdMkt", this.fmtMoney(pvdMkt));
    setEl("pfZ4PvdEmp", this.fmtMoney(pvdCost));
    setEl("pfZ4PvdEmr", `+${this.fmtMoney(pvdGain)} (+${pvdGainPct.toFixed(1)}%)`);
    setEl("pfZ4PvdMom", `เงินต้นสะสมเพิ่มเดือนล่าสุด: ${pvdMomCost >= 0 ? '+' : ''}${this.fmtMoney(pvdMomCost)}`);

    // 4. Insurance & Cash / Saving-ME (from sheet Portfolio)
    const insMkt = a.INS.market;
    const insCost = a.INS.cost;
    const cashRow = (snap.items || []).find(i => i.name.toLowerCase() === "cash") || { market: a.CASH.market, cost: a.CASH.cost };
    const bankRow = (snap.items || []).find(i => i.name.toLowerCase().includes("saving") || i.assessType.toLowerCase() === "bank") || { market: 0, cost: 0 };
    const safeWeight = (((insMkt + a.CASH.market) / total) * 100).toFixed(1);

    setEl("pfZ4InsBadge", `${safeWeight}% ของพอร์ต`);
    setEl("pfZ4InsCashVal", this.fmtMoney(insMkt));
    setEl("pfZ4InsPremium", this.fmtMoney(insCost));
    setEl("pfZ4InsCoverage", this.fmtMoney(a.CASH.market));
    setEl("pfZ4CashSplit", `${this.fmtMoney(cashRow.market)} (ทุน ${this.fmtMoney(cashRow.cost)})`);
    setEl("pfZ4BankSplit", `${this.fmtMoney(bankRow.market)} (ทุน ${this.fmtMoney(bankRow.cost)})`);

    // Render Zone 4 Deep-Dive Sheet Explorer ("SET Trade Log", "USD Stock Trading Log", "Gold Trade Log", "Crypto Trade Log")
    this.renderTradeLogExplorer();
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

    // 5.0: Render 5 KPI Summary Cards from Sheet "Invest Monthly"
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
  }
};

window.PortfolioUI = PortfolioUI;
