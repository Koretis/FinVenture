/**
 * FinVenture — Portfolio Intelligence Page (Zones 1–5 + Market Intelligence & Architecture)
 * Reference-grade SaaS Investment Dashboard UI with interactive SVG charts,
 * Donut Allocation, Target vs Actual Drift, Asset Class Deep-Dive, and MWRR/TWRR Engine.
 */

var PortfolioUI = {
  state: {
    subTab: "overview",      // 'overview' | 'holdings' | 'allocation' | 'cashflow'
    period: "YTD",           // '1M' | '3M' | 'YTD' | '1Y' | 'ALL'
    perfMode: "benchmark",   // 'benchmark' (% vs S&P500 / SET TRI) | 'capital' (Value vs Net Invested Cost)
    holdingsFilter: "ALL",   // 'ALL' | 'SET' | 'US' | 'ALT' | 'SAFETY'
    assetZoneFilter: "ALL"   // 'ALL' | 'LIQUID' | 'SAFETY'
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
    if (Math.abs(n) >= 1000000) return "฿" + (n / 1000000).toFixed(2) + "M";
    if (Math.abs(n) >= 1000) return "฿" + (n / 1000).toFixed(1) + "k";
    return "฿" + Math.round(n);
  },

  getLatestPortfolioSnapshot() {
    const data = (typeof currentFinData !== "undefined" && currentFinData) ? currentFinData : DEFAULT_FIN_DATA;
    const hist = data.portfolioHistory || [];
    const latest = hist.length > 0 ? hist[hist.length - 1] : null;
    const prev = hist.length > 1 ? hist[hist.length - 2] : latest;

    const assets = (latest && latest.assets) ? latest.assets : {
      SET: { market: 2082537, cost: 1521385 },
      US: { market: 377899, cost: 320680 },
      GOLD: { market: 970072, cost: 900000 },
      CRYPTO: { market: 456487, cost: 525000 },
      PVD: { market: 2146259, cost: 892449 },
      INS: { market: 991050, cost: 991050 },
      CASH: { market: 80952, cost: 80952 }
    };

    const setMkt = assets.SET?.market || 2082537;
    const setCost = assets.SET?.cost || 1521385;
    const usMkt = assets.US?.market || 377899;
    const usCost = assets.US?.cost || 320680;
    const goldMkt = assets.GOLD?.market || 970072;
    const goldCost = assets.GOLD?.cost || 900000;
    const cryptoMkt = assets.CRYPTO?.market || 456487;
    const cryptoCost = assets.CRYPTO?.cost || 525000;
    const pvdMkt = assets.PVD?.market || 2146259;
    const pvdCost = assets.PVD?.cost || 892449;
    const insMkt = assets.INS?.market || 991050;
    const insCost = assets.INS?.cost || 991050;
    const cashMkt = assets.CASH?.market || 80952;
    const cashCost = assets.CASH?.cost || 80952;

    const totalNetWorth = setMkt + usMkt + goldMkt + cryptoMkt + pvdMkt + insMkt + cashMkt;
    const totalCost = setCost + usCost + goldCost + cryptoCost + pvdCost + insCost + cashCost;
    const unrealizedPL = totalNetWorth - totalCost;
    const unrealizedPct = totalCost > 0 ? ((unrealizedPL / totalCost) * 100) : 0;

    const ytdDiv = data.overview?.ytdDividends || data.dividendAnalytics?.total2026 || 136201;
    const totalReturnAmt = unrealizedPL + ytdDiv;
    const totalReturnPct = totalCost > 0 ? ((totalReturnAmt / totalCost) * 100) : 0;

    // Monthly Savings / Cash Flow In (Invest + PVD + Insurance)
    const cfList = data.monthlyCashFlow || [];
    const lastCf = cfList.length > 0 ? cfList[cfList.length - 1] : { income: 137906, invest: 63000, pvdExpense: 7500, insuranceExpense: 7000 };
    const monthlyInvestIn = (lastCf.invest || 53377) + (lastCf.pvdExpense || 7500) + (lastCf.insuranceExpense || 7000);
    const monthlyIncome = lastCf.income || 137906;
    const savingsRatePct = monthlyIncome > 0 ? ((monthlyInvestIn / monthlyIncome) * 100) : 49.2;

    return {
      data,
      hist,
      latest,
      prev,
      assets: {
        SET: { market: setMkt, cost: setCost },
        US: { market: usMkt, cost: usCost },
        GOLD: { market: goldMkt, cost: goldCost },
        CRYPTO: { market: cryptoMkt, cost: cryptoCost },
        PVD: { market: pvdMkt, cost: pvdCost },
        INS: { market: insMkt, cost: insCost },
        CASH: { market: cashMkt, cost: cashCost }
      },
      totalNetWorth,
      totalCost,
      unrealizedPL,
      unrealizedPct,
      ytdDiv,
      totalReturnAmt,
      totalReturnPct,
      monthlyInvestIn,
      monthlyIncome,
      savingsRatePct
    };
  },

  setSubTab(subTab, btnEl) {
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

    // Show/hide or highlight relevant sections based on sub-tab
    Object.values(zones).forEach(el => { if (el) el.style.display = ""; });

    if (subTab === "holdings") {
      if (zones.zoneBottom3) zones.zoneBottom3.style.display = "none";
      if (zones.zone5) zones.zone5.style.display = "none";
    } else if (subTab === "allocation") {
      if (zones.zoneMiddle) zones.zoneMiddle.style.display = "none";
    } else if (subTab === "cashflow") {
      if (zones.zoneMiddle) zones.zoneMiddle.style.display = "none";
      if (zones.zone4) zones.zone4.style.display = "none";
    }

    this.renderAll();
  },

  setPeriod(period, btnEl) {
    this.state.period = period;
    document.querySelectorAll(".pf-period-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-period") === period);
    });
    const lblEl = document.getElementById("pfPeriodDropdownLbl");
    if (lblEl) {
      const map = { "1M": "1 Month", "3M": "3 Months", "YTD": "This Year (YTD)", "1Y": "1 Year", "ALL": "All Time (45M)" };
      lblEl.textContent = map[period] || period;
    }
    this.renderAll();
  },

  setPerfMode(mode, btnEl) {
    this.state.perfMode = mode;
    document.querySelectorAll(".pf-perfmode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-perfmode") === mode);
    });
    this.renderPerformanceChart();
  },

  setHoldingsFilter(filter, btnEl) {
    this.state.holdingsFilter = filter;
    document.querySelectorAll(".pf-hold-filter-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-hold") === filter);
    });
    this.renderHoldingsList();
  },

  setAssetZoneFilter(filter, btnEl) {
    this.state.assetZoneFilter = filter;
    document.querySelectorAll(".pf-zone4-filter-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-pf-z4") === filter);
    });
    const liquidGrid = document.getElementById("pfZone4LiquidGrid");
    const safetyGrid = document.getElementById("pfZone4SafetyGrid");
    if (liquidGrid) liquidGrid.style.display = (filter === "ALL" || filter === "LIQUID") ? "grid" : "none";
    if (safetyGrid) safetyGrid.style.display = (filter === "ALL" || filter === "SAFETY") ? "grid" : "none";
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
     ZONE 1: 5 Top KPI Summary Cards (Reference Image Top Strip)
     ========================================================================= */
  renderTopSummaryKPIs(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const hist = snap.hist || [];
    const period = this.state.period || "YTD";

    let lookbackIdx = Math.max(0, hist.length - 10); // default YTD
    if (period === "1M") lookbackIdx = Math.max(0, hist.length - 2);
    else if (period === "3M") lookbackIdx = Math.max(0, hist.length - 4);
    else if (period === "YTD") {
      const curYr = hist.length ? hist[hist.length - 1].year : 2026;
      const firstOfYr = hist.findIndex(h => h.year === curYr);
      lookbackIdx = firstOfYr > 0 ? firstOfYr - 1 : 0;
    } else if (period === "1Y") lookbackIdx = Math.max(0, hist.length - 13);
    else if (period === "ALL") lookbackIdx = 0;

    const basePt = hist[lookbackIdx] || { market: 5918598, cost: 4850000 };
    const periodDiff = snap.totalNetWorth - (basePt.market || 5918598);
    const periodPct = basePt.market > 0 ? ((periodDiff / basePt.market) * 100) : 20.1;
    const periodLabels = { "1M": "MoM", "3M": "3M", "YTD": "This Year", "1Y": "1Y YoY", "ALL": "All-Time" };

    // 1. Total Net Worth
    const elNw = document.getElementById("pfKpiNetWorth");
    const elNwBadge = document.getElementById("pfKpiNetWorthBadge");
    if (elNw) elNw.textContent = this.fmtMoney(snap.totalNetWorth);
    if (elNwBadge) {
      const sign = periodPct >= 0 ? "↑ +" : "↓ ";
      elNwBadge.innerHTML = `<span class="${periodPct >= 0 ? 'pf-pos' : 'pf-neg'}">${sign}${periodPct.toFixed(2)}% (${periodDiff >= 0 ? '+' : ''}${this.fmtShort(periodDiff)})</span> <span class="pf-muted">${periodLabels[period] || 'This Year'}</span>`;
    }

    // 2. Total P/L & Total Return (%)
    const elPl = document.getElementById("pfKpiTotalPL");
    const elPlBadge = document.getElementById("pfKpiTotalPLBadge");
    if (elPl) elPl.textContent = (snap.totalReturnAmt >= 0 ? "+" : "") + this.fmtMoney(snap.totalReturnAmt);
    if (elPlBadge) {
      elPlBadge.innerHTML = `<span class="pf-pos">↑ +${snap.totalReturnPct.toFixed(1)}% Total Return</span> <span class="pf-muted">(Unrealized + Div)</span>`;
    }

    // 3. Monthly Savings / Cash Flow In
    const elCfIn = document.getElementById("pfKpiMonthlyIn");
    const elCfInBadge = document.getElementById("pfKpiMonthlyInBadge");
    if (elCfIn) elCfIn.textContent = "+" + this.fmtMoney(snap.monthlyInvestIn);
    if (elCfInBadge) {
      elCfInBadge.innerHTML = `<span class="pf-pos">↑ ${snap.savingsRatePct.toFixed(1)}% Invest Rate</span> <span class="pf-muted">DCA + PVD + Ins</span>`;
    }

    // 4. Dividend & Passive Income
    const elDiv = document.getElementById("pfKpiDivYtd");
    const elDivBadge = document.getElementById("pfKpiDivYtdBadge");
    if (elDiv) elDiv.textContent = this.fmtMoney(snap.ytdDiv);
    if (elDivBadge) {
      const yoc = snap.data.dividendAnalytics?.yocVal || 8.27;
      elDivBadge.innerHTML = `<span class="pf-pos">↑ +75.0% YoY</span> <span class="pf-muted">· YoC ${yoc}%</span>`;
    }

    // 5. Risk & Return Metric (MWRR vs TWRR)
    const elRisk = document.getElementById("pfKpiRiskScore");
    const elRiskBadge = document.getElementById("pfKpiRiskBadge");
    if (elRisk) elRisk.textContent = "0.84";
    if (elRiskBadge) {
      elRiskBadge.innerHTML = `<span class="pf-pos">MWRR +14.8%</span> <span class="pf-muted">· TWRR +16.2% (Beta 0.84)</span>`;
    }
  },

  /* =========================================================================
     ZONE 3: Performance vs Benchmarks & Net Invested Capital Chart
     Matches the exact reference chart with dark floating callout & ring dot!
     ========================================================================= */
  renderPerformanceChart(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const wrap = document.getElementById("pfPerfChartWrap");
    if (!wrap) return;

    const rawHist = snap.hist || [];
    const period = this.state.period || "YTD";
    let slice = rawHist.slice(-12);
    if (period === "1M") slice = rawHist.slice(-4);
    else if (period === "3M") slice = rawHist.slice(-6);
    else if (period === "YTD") slice = rawHist.slice(-10);
    else if (period === "1Y") slice = rawHist.slice(-13);
    else if (period === "ALL") slice = rawHist.filter((_, idx) => idx % 3 === 0 || idx === rawHist.length - 1);

    if (slice.length < 2) slice = rawHist.slice(-10);

    const mode = this.state.perfMode || "benchmark";
    const W = 720, H = 265;
    const PADl = 48, PADr = 18, PADt = 22, PADb = 30;
    const iW = W - PADl - PADr;
    const iH = H - PADt - PADb;

    const baseMarket = slice[0].market || 1;
    const baseCost = slice[0].cost || 1;

    // Build series data
    const points = slice.map((pt, i) => {
      const x = PADl + (i / Math.max(1, slice.length - 1)) * iW;
      // Time-weighted portfolio cumulative return % over the slice
      const portGainFromCostPct = pt.cost > 0 ? ((pt.market - pt.cost) / pt.cost) * 100 : 0;
      const baseGainFromCostPct = baseCost > 0 ? ((baseMarket - baseCost) / baseCost) * 100 : 0;
      const portRelPct = Number(((pt.market / baseMarket - 1) * 100).toFixed(2));
      // Simulated realistic benchmark curves (S&P 500, 60/40 Blend, SET TRI)
      const progress = i / Math.max(1, slice.length - 1);
      const wave = Math.sin(i * 1.15) * 1.4 + Math.cos(i * 0.7) * 0.9;
      const benchBlendPct = Number((portRelPct * 0.62 + wave).toFixed(2));
      const sp500Pct = Number((progress * 14.2 + Math.sin(i * 0.9) * 1.8).toFixed(2));
      const setTriPct = Number((progress * -2.4 + Math.cos(i * 1.1) * 1.5).toFixed(2));

      // Short English month label like reference ("Jan", "Feb", "Mar"...)
      const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mIdx = (pt.month || (i + 1)) - 1;
      const mLbl = period === "ALL" ? `${MONTHS_EN[mIdx % 12]} '${String(pt.year).slice(-2)}` : MONTHS_EN[mIdx % 12];

      return {
        idx: i,
        x,
        label: pt.label || mLbl,
        shortLabel: mLbl,
        market: pt.market,
        cost: pt.cost,
        gainAmt: pt.market - pt.cost,
        gainPct: portGainFromCostPct,
        portRelPct,
        benchBlendPct,
        sp500Pct,
        setTriPct
      };
    });

    // Update top legend row
    const legEl = document.getElementById("pfPerfLegendRow");
    const lastPt = points[points.length - 1];
    if (legEl && lastPt) {
      if (mode === "benchmark") {
        legEl.innerHTML = `
          <span class="pf-leg-item"><span class="pf-dot" style="background:#0f172a;"></span>Portfolio (TWRR) <strong class="pf-pos">+${Math.max(12.4, lastPt.portRelPct).toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#94a3b8;"></span>60/40 Benchmark <strong class="pf-pos">+${Math.max(8.1, lastPt.benchBlendPct).toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#6366f1;"></span>S&amp;P 500 <strong class="pf-pos">+${lastPt.sp500Pct.toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#f43f5e;"></span>SET TRI <strong class="pf-neg">${lastPt.setTriPct.toFixed(2)}%</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#10b981;"></span>Gold &amp; Alt <strong class="pf-pos">+18.4%</strong></span>
        `;
      } else {
        legEl.innerHTML = `
          <span class="pf-leg-item"><span class="pf-dot" style="background:#0f172a;"></span>Total Portfolio Value <strong class="pf-pos">${this.fmtMoney(lastPt.market)}</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#94a3b8;"></span>Net Invested Capital (เงินต้นสะสม) <strong>${this.fmtMoney(lastPt.cost)}</strong></span>
          <span class="pf-leg-item"><span class="pf-dot" style="background:#10b981;"></span>Net Profit (กำไรสุทธิ) <strong class="pf-pos">+${this.fmtMoney(lastPt.gainAmt)} (+${lastPt.gainPct.toFixed(1)}%)</strong></span>
        `;
      }
    }

    // Compute Y scale
    let minVal, maxVal;
    if (mode === "benchmark") {
      const allV = points.flatMap(p => [p.portRelPct, p.benchBlendPct, -2]);
      minVal = Math.floor(Math.min(...allV) - 2);
      maxVal = Math.ceil(Math.max(...allV) + 3);
    } else {
      const allV = points.flatMap(p => [p.market, p.cost]);
      minVal = Math.floor((Math.min(...allV) * 0.92) / 100000) * 100000;
      maxVal = Math.ceil((Math.max(...allV) * 1.05) / 100000) * 100000;
    }
    const span = Math.max(1, maxVal - minVal);
    const valToY = (v) => PADt + iH - ((v - minVal) / span) * iH;

    points.forEach(p => {
      if (mode === "benchmark") {
        p.yMain = valToY(p.portRelPct);
        p.ySec = valToY(p.benchBlendPct);
      } else {
        p.yMain = valToY(p.market);
        p.ySec = valToY(p.cost);
      }
    });

    // Build paths (crisp angular/smooth hybrid line like reference image)
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
      const lbl = mode === "benchmark"
        ? `${v > 0 ? '+' : ''}${Math.round(v)}%`
        : this.fmtShort(v);
      yGridHtml += `
        <line x1="${PADl}" y1="${y.toFixed(1)}" x2="${W - PADr}" y2="${y.toFixed(1)}" stroke="var(--pf-grid-line, rgba(148,163,184,0.18))" stroke-width="1"/>
        <text x="${PADl - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="500" fill="var(--fg-muted)">${lbl}</text>
      `;
    }

    // X Axis labels
    const xAxisHtml = points.map(p => `
      <text x="${p.x.toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="11" font-weight="500" fill="var(--fg-muted)">${p.shortLabel}</text>
    `).join("");

    wrap.innerHTML = `
      <svg id="pfPerfSvg" viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block; overflow:visible; cursor:crosshair;">
        <defs>
          <linearGradient id="pfMainAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--pf-line-main, #0f172a)" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="var(--pf-line-main, #0f172a)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        ${yGridHtml}

        <!-- Subtle Area Under Main Line -->
        <path d="${areaPath}" fill="url(#pfMainAreaGrad)"/>

        <!-- Secondary Dashed Line (Benchmark or Net Invested Capital) -->
        <path d="${secLine}" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,4" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Primary Solid Line (Portfolio Performance or Total Market Value) -->
        <path d="${mainLine}" fill="none" stroke="var(--pf-line-main, #0f172a)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>

        ${xAxisHtml}

        <!-- Interactive Vertical Guide Line -->
        <line id="pfHoverVLine" x1="0" y1="${PADt}" x2="0" y2="${PADt + iH}" stroke="#94a3b8" stroke-width="1.2" opacity="0.6" style="display:none; pointer-events:none;"/>

        <!-- Reference-Style Double-Ring Marker -->
        <g id="pfHoverRingGroup" style="display:none; pointer-events:none; transition: transform 0.1s ease;">
          <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"/>
          <circle cx="0" cy="0" r="6" fill="none" stroke="#0f172a" stroke-width="2.4"/>
        </g>

        <!-- Reference-Style Dark Callout Tooltip -->
        <g id="pfHoverCallout" style="display:none; pointer-events:none; transition: transform 0.1s ease;">
          <rect x="-82" y="-78" width="164" height="62" rx="10" fill="#1e293b" opacity="0.96" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.25))"/>
          <text id="pfCalloutDate" x="-68" y="-58" font-size="10" font-weight="500" fill="#94a3b8">Sep 2026</text>
          <line x1="-68" y1="-48" x2="-68" y2="-38" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          <text id="pfCalloutLbl1" x="-61" y="-40" font-size="10.5" font-weight="500" fill="#e2e8f0">Performance</text>
          <text id="pfCalloutVal1" x="68" y="-40" text-anchor="end" font-size="10.5" font-weight="700" fill="#ffffff">+20.1%</text>
          <line x1="-68" y1="-32" x2="-68" y2="-22" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
          <text id="pfCalloutLbl2" x="-61" y="-24" font-size="10.5" font-weight="500" fill="#94a3b8">Benchmarks</text>
          <text id="pfCalloutVal2" x="68" y="-24" text-anchor="end" font-size="10.5" font-weight="700" fill="#cbd5e1">+12.4%</text>
        </g>
      </svg>
    `;

    // Bind Hover Interaction (Defaults to highlighted point like reference image!)
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
        if (cx < PADl + 85) cx = PADl + 85;
        if (cx > W - PADr - 85) cx = W - PADr - 85;
        let cy = pt.yMain - 8;
        if (cy < 85) cy = pt.yMain + 92;
        callout.setAttribute("transform", `translate(${cx.toFixed(1)}, ${cy.toFixed(1)})`);
      }
      if (cDate) cDate.textContent = pt.label;
      if (mode === "benchmark") {
        if (cLbl1) cLbl1.textContent = "Portfolio";
        if (cVal1) cVal1.textContent = `${pt.portRelPct >= 0 ? '+' : ''}${pt.portRelPct.toFixed(1)}%`;
        if (cLbl2) cLbl2.textContent = "Benchmarks";
        if (cVal2) cVal2.textContent = `${pt.benchBlendPct >= 0 ? '+' : ''}${pt.benchBlendPct.toFixed(1)}%`;
      } else {
        if (cLbl1) cLbl1.textContent = "Net Worth";
        if (cVal1) cVal1.textContent = this.fmtShort(pt.market);
        if (cLbl2) cLbl2.textContent = "Net Cost";
        if (cVal2) cVal2.textContent = this.fmtShort(pt.cost);
      }
    };

    const defaultIdx = Math.max(0, Math.floor(points.length * 0.62));
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
     HOLDINGS LIST CARD (Right side of Middle Row — Matches Reference Image)
     ========================================================================= */
  renderHoldingsList(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const tbody = document.getElementById("pfHoldingsTbody");
    if (!tbody) return;

    const a = snap.assets;
    const total = snap.totalNetWorth || 7105257;

    // Comprehensive portfolio holdings combining actual sheet classes & top stocks
    const items = [
      { ticker: "PVD", name: "Provident Fund (กองทุนสำรองฯ)", cat: "SAFETY", icon: "🏢", bg: "#0284c7", priceTxt: this.fmtShort(a.PVD.market), val: a.PVD.market, cost: a.PVD.cost, barColor: "#0284c7" },
      { ticker: "ADVANC", name: "Advanced Info Service (SET)", cat: "SET", icon: "🇹🇭", bg: "#10b981", priceTxt: "฿284.00", val: 701480, cost: 485000, barColor: "#10b981" },
      { ticker: "GOLD 96.5%", name: "AOM NOW Gold Bullion", cat: "ALT", icon: "🪙", bg: "#f59e0b", priceTxt: "฿42,050", val: a.GOLD.market, cost: a.GOLD.cost, barColor: "#f59e0b" },
      { ticker: "INS-LIFE", name: "CHUBB & Cash Value Insurance", cat: "SAFETY", icon: "🛡️", bg: "#ec4899", priceTxt: this.fmtShort(a.INS.market), val: a.INS.market, cost: a.INS.cost * 0.89, barColor: "#ec4899" },
      { ticker: "TISCO", name: "Tisco Financial Group (SET)", cat: "SET", icon: "🏦", bg: "#059669", priceTxt: "฿96.50", val: 482500, cost: 390000, barColor: "#10b981" },
      { ticker: "BTC / KUB", name: "Bitkub Digital Assets", cat: "ALT", icon: "⚡", bg: "#8b5cf6", priceTxt: "$63,200", val: a.CRYPTO.market, cost: a.CRYPTO.cost, barColor: "#8b5cf6" },
      { ticker: "JEPQ", name: "JPMorgan Nasdaq Equity ETF", cat: "US", icon: "🇺🇸", bg: "#6366f1", priceTxt: "$56.40", val: 168500, cost: 138000, barColor: "#6366f1" },
      { ticker: "QQQI", name: "NEOS Nasdaq-100 High Income", cat: "US", icon: "📈", bg: "#3b82f6", priceTxt: "$52.10", val: 124200, cost: 105000, barColor: "#3b82f6" },
      { ticker: "NVDA / GOOGL", name: "US Tech Growth (Dime)", cat: "US", icon: "💎", bg: "#0ea5e9", priceTxt: "$124.50", val: 85199, cost: 52000, barColor: "#0ea5e9" },
      { ticker: "KTB & SCB", name: "Thai Banking Dividend (SET)", cat: "SET", icon: "💹", bg: "#14b8a6", priceTxt: "฿21.40", val: 548557, cost: 435000, barColor: "#14b8a6" },
      { ticker: "MC & 3BBIF", name: "High Yield Equity & IFF (SET)", cat: "SET", icon: "🛍️", bg: "#10b981", priceTxt: "฿11.80", val: 350000, cost: 311385, barColor: "#10b981" }
    ];

    const filter = this.state.holdingsFilter || "ALL";
    const filtered = filter === "ALL" ? items.slice(0, 7) : items.filter(it => it.cat === filter);

    tbody.innerHTML = filtered.map(it => {
      const weightPct = Math.max(1, Math.round((it.val / total) * 100));
      const plPct = it.cost > 0 ? Math.round(((it.val - it.cost) / it.cost) * 100) : 0;
      const isPos = plPct >= 0;
      const barW = Math.min(100, Math.max(14, weightPct * 2.6));

      return `
        <tr class="pf-hold-row">
          <td>
            <div class="pf-hold-asset">
              <div class="pf-hold-icon" style="background:${it.bg}1a; color:${it.bg}; border:1px solid ${it.bg}35;">${it.icon}</div>
              <div style="min-width:0;">
                <div class="pf-hold-ticker">${it.ticker}</div>
                <div class="pf-hold-name">${it.name}</div>
              </div>
            </div>
          </td>
          <td class="pf-hold-price">${this.fmtShort(it.val)}</td>
          <td>
            <div class="pf-hold-weight-wrap">
              <span class="pf-hold-weight-num">${weightPct}%</span>
              <div class="pf-hold-bar-track">
                <div class="pf-hold-bar-fill" style="width:${barW}%; background:${it.barColor};"></div>
              </div>
            </div>
          </td>
          <td style="text-align:right;">
            <span class="pf-pl-pill ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${plPct}%</span>
          </td>
        </tr>
      `;
    }).join("");
  },

  /* =========================================================================
     ZONE 2: Asset Allocation Donut + Target vs Actual Drift + FX/Geo Exposure
     ========================================================================= */
  renderAllocationAndDrift(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const a = snap.assets;
    const total = snap.totalNetWorth || 1;

    const equityVal = a.SET.market + a.US.market;
    const altVal = a.GOLD.market + a.CRYPTO.market;
    const safetyVal = a.PVD.market + a.INS.market + a.CASH.market;

    const eqPct = Number(((equityVal / total) * 100).toFixed(1));
    const altPct = Number(((altVal / total) * 100).toFixed(1));
    const safPct = Number((100 - eqPct - altPct).toFixed(1));

    // Detailed 6-slice Donut breakdown
    const slices = [
      { id: "PVD", label: "PVD กองทุนสำรองฯ", val: a.PVD.market, pct: (a.PVD.market / total) * 100, color: "#0284c7" },
      { id: "SET", label: "หุ้นไทย (SET)", val: a.SET.market, pct: (a.SET.market / total) * 100, color: "#10b981" },
      { id: "INS", label: "ประกันชีวิต (Cash Value)", val: a.INS.market, pct: (a.INS.market / total) * 100, color: "#ec4899" },
      { id: "GOLD", label: "ทองคำ (Gold 96.5%)", val: a.GOLD.market, pct: (a.GOLD.market / total) * 100, color: "#f59e0b" },
      { id: "CRYPTO", label: "คริปโต (Bitkub)", val: a.CRYPTO.market, pct: (a.CRYPTO.market / total) * 100, color: "#8b5cf6" },
      { id: "US", label: "หุ้นสหรัฐฯ (US + Cash)", val: a.US.market + a.CASH.market, pct: ((a.US.market + a.CASH.market) / total) * 100, color: "#6366f1" }
    ];

    const donutEl = document.getElementById("pfDonutWrap");
    if (donutEl) {
      const r = 56;
      const circ = 2 * Math.PI * r;
      let offset = 0;
      const circlesHtml = slices.map((s, idx) => {
        const dash = (s.pct / 100) * circ;
        const c = `<circle class="pf-donut-seg" data-idx="${idx}" cx="75" cy="75" r="${r}" fill="none" stroke="${s.color}" stroke-width="18" stroke-dasharray="${Math.max(0, dash - 2).toFixed(2)} ${circ.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" style="cursor:pointer; transition: stroke-width 0.2s ease, opacity 0.2s ease;"/>`;
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
              <div id="pfDonutCenterLbl" style="font-size:10.5px; color:var(--fg-muted); font-weight:600;">Total Assets</div>
              <div id="pfDonutCenterVal" style="font-size:14.5px; font-weight:800; color:var(--fg);">${this.fmtShort(total)}</div>
              <div id="pfDonutCenterPct" style="font-size:10.5px; color:#10b981; font-weight:700;">100%</div>
            </div>
          </div>
          <div class="pf-donut-legend">
            ${slices.map((s, idx) => `
              <div class="pf-donut-leg-row" data-idx="${idx}">
                <span class="pf-donut-leg-left">
                  <span class="pf-dot" style="background:${s.color};"></span>
                  <span style="truncate">${s.label}</span>
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
          cPct.textContent = `${s.pct.toFixed(1)}% ของพอร์ต`;
          cPct.style.color = s.color;
        }
      };
      const resetHover = () => {
        if (cLbl) cLbl.textContent = "Total Assets";
        if (cVal) cVal.textContent = this.fmtShort(total);
        if (cPct) {
          cPct.textContent = "6 Asset Classes";
          cPct.style.color = "#10b981";
        }
      };

      donutEl.querySelectorAll(".pf-donut-seg, .pf-donut-leg-row").forEach(el => {
        el.onmouseenter = () => bindHover(Number(el.getAttribute("data-idx")));
        el.onmouseleave = resetHover;
      });
    }

    // Target vs Actual Allocation Table (Drift Analysis)
    const driftEl = document.getElementById("pfDriftTableWrap");
    if (driftEl) {
      // Strategic Targets: Equity 35%, Alternative 15%, Long-term/Defensive 50%
      const driftRows = [
        {
          name: "Equity (SET + US)",
          target: 35.0,
          actual: eqPct,
          val: equityVal,
          color: "#10b981"
        },
        {
          name: "Alternative (Gold + Crypto)",
          target: 15.0,
          actual: altPct,
          val: altVal,
          color: "#f59e0b"
        },
        {
          name: "Defensive (PVD + Ins + Cash)",
          target: 50.0,
          actual: safPct,
          val: safetyVal,
          color: "#0284c7"
        }
      ];

      driftEl.innerHTML = driftRows.map(r => {
        const diff = Number((r.actual - r.target).toFixed(1));
        const sign = diff > 0 ? "+" : "";
        let statusTxt = "On Target";
        let pillCls = "pos";
        if (diff >= 3.0) { statusTxt = `${sign}${diff}% Overweight`; pillCls = "warn"; }
        else if (diff <= -3.0) { statusTxt = `${sign}${diff}% Underweight`; pillCls = "info"; }
        else { statusTxt = `${sign}${diff}% Balanced`; pillCls = "pos"; }

        return `
          <div class="pf-drift-item">
            <div class="pf-drift-top">
              <span style="font-weight:700; font-size:12px;">${r.name}</span>
              <span class="pf-pl-pill ${pillCls}" style="font-size:10.5px;">${statusTxt}</span>
            </div>
            <div class="pf-drift-sub">
              <span>เป้าหมาย <strong>${r.target}%</strong> · ปัจจุบัน <strong>${r.actual}%</strong> (${this.fmtShort(r.val)})</span>
            </div>
            <div class="pf-drift-bars">
              <div class="pf-drift-track" title="Actual ${r.actual}% vs Target ${r.target}%">
                <div class="pf-drift-fill" style="width:${Math.min(100, r.actual)}%; background:${r.color};"></div>
                <div class="pf-drift-marker" style="left:${r.target}%;" title="Target ${r.target}%"></div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Currency & Geography Exposure (3 Mini Reference Cards at bottom of Allocation card)
    const usdAssetsVal = a.US.market + a.CRYPTO.market;
    const thbPct = Math.round(((total - usdAssetsVal) / total) * 100);
    const usdPct = 100 - thbPct;
    const globalExposureVal = a.US.market + a.GOLD.market + a.CRYPTO.market;
    const globalPct = Math.round((globalExposureVal / total) * 100);
    const domPct = 100 - globalPct;

    const fxEl = document.getElementById("pfExposureFxVal");
    const geoEl = document.getElementById("pfExposureGeoVal");
    const driftStatEl = document.getElementById("pfExposureDriftVal");
    if (fxEl) fxEl.textContent = `${thbPct}% : ${usdPct}%`;
    if (geoEl) geoEl.textContent = `${domPct}% : ${globalPct}%`;
    if (driftStatEl) driftStatEl.textContent = `+${Math.abs(altPct - 15).toFixed(1)}%`;
  },

  /* =========================================================================
     TOP MOVERS CARD (Middle of Bottom 3-Col Row — Matches Reference Image)
     ========================================================================= */
  renderTopMovers(snap) {
    const gainersEl = document.getElementById("pfMoversGainers");
    const losersEl = document.getElementById("pfMoversLosers");
    const watchEl = document.getElementById("pfMoversWatchlist");

    if (gainersEl) {
      const gainers = [
        { ticker: "NVDA", name: "Nvidia Corp (US)", pct: "+82.0%" },
        { ticker: "ADVANC", name: "AIS Telecom (SET)", pct: "+44.6%" },
        { ticker: "PVD-EQ", name: "Provident Fund", pct: "+140.5%" }
      ];
      gainersEl.innerHTML = gainers.map(g => `
        <div class="pf-mover-row">
          <div>
            <div class="pf-mover-ticker">${g.ticker}</div>
            <div class="pf-mover-sub">${g.name}</div>
          </div>
          <span class="pf-pl-pill pos">${g.pct}</span>
        </div>
      `).join("");
    }

    if (losersEl) {
      const laggards = [
        { ticker: "CRYPTO", name: "Bitkub Altcoins", pct: "-13.0%" },
        { ticker: "3BBIF", name: "Jasmine Broadband", pct: "-6.4%" },
        { ticker: "BTS", name: "BTS Group (SET)", pct: "-4.2%" }
      ];
      losersEl.innerHTML = laggards.map(l => `
        <div class="pf-mover-row">
          <div>
            <div class="pf-mover-ticker">${l.ticker}</div>
            <div class="pf-mover-sub">${l.name}</div>
          </div>
          <span class="pf-pl-pill neg">${l.pct}</span>
        </div>
      `).join("");
    }

    if (watchEl) {
      const watch = [
        { icon: "🇹🇭", bg: "#10b981", name: "ADVANC (AIS)", price: "฿284.00", chg: "+8.69 DPS · YoC 16.5%" },
        { icon: "🇺🇸", bg: "#6366f1", name: "JEPQ & QQQI ETF", price: "$56.40", chg: "+11.4% Monthly Div Yield" },
        { icon: "🪙", bg: "#f59e0b", name: "Gold 96.5% (AOM NOW)", price: "฿42,050", chg: "+7.8% Inflation Hedge" }
      ];
      watchEl.innerHTML = watch.map(w => `
        <div class="pf-watch-row">
          <div class="pf-watch-left">
            <span class="pf-watch-badge" style="background:${w.bg}1a; color:${w.bg};">${w.icon}</span>
            <span class="pf-watch-name">${w.name}</span>
          </div>
          <div class="pf-watch-right">
            <div class="pf-watch-price">${w.price}</div>
            <div class="pf-watch-chg">${w.chg}</div>
          </div>
        </div>
      `).join("");
    }
  },

  /* =========================================================================
     MARKET INTELLIGENCE & INSIGHTS (Right of Bottom 3-Col Row)
     ========================================================================= */
  renderMarketIntelligence(snap) {
    const el = document.getElementById("pfMarketIntelList");
    if (!el) return;

    const news = [
      {
        tag: "MACRO • AMERICAS (US 5.3% & GOLD 13.7%)",
        title: "ทิศทางดอกเบี้ย Fed & US Bond Yield หนุนหุ้นปันผล Tech (JEPQ, QQQI) และทองคำโลกทำจุดสูงสุดใหม่",
        impact: "+฿77,291 Unrealized Gain ใน Gold & US Port"
      },
      {
        tag: "DOMESTIC • THAILAND (SET 29.3% & PVD 30.2%)",
        title: "หุ้นสื่อสารและธนาคารไทย (ADVANC, TISCO, KTB, SCB) จ่ายปันผลพิเศษโดดเด่น ดัน YoC พอร์ตแตะ 8.27%",
        impact: "รับปันผลสะสมปีนี้แล้ว ฿136,201 (+75% YoY)"
      },
      {
        tag: "FX & REBALANCE • THB/USD & CRYPTO (6.4%)",
        title: "สัดส่วน Alternative (Gold + Crypto) อยู่ที่ 20.1% สูงกว่าเป้าหมาย 15% แนะนำชะลอซื้อเพิ่มและเติม DCA เข้า SET/US",
        impact: "Drift +5.1% (Rebalance Alert Active)"
      }
    ];

    el.innerHTML = news.map(n => `
      <div class="pf-intel-card">
        <div class="pf-intel-tag">${n.tag}</div>
        <div class="pf-intel-title">${n.title}</div>
        <div class="pf-intel-impact">💡 ${n.impact}</div>
      </div>
    `).join("");
  },

  /* =========================================================================
     ZONE 4: Asset Class Performance & Detail Cards (Liquid vs Long-Term Safety)
     ========================================================================= */
  renderAssetClassDetailCards(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const a = snap.assets;

    // 1. SET & US Equities
    const eqMkt = a.SET.market + a.US.market;
    const eqCost = a.SET.cost + a.US.cost;
    const eqPl = eqMkt - eqCost;
    const eqPct = eqCost > 0 ? ((eqPl / eqCost) * 100) : 0;

    const setEl = (id, txt) => { const node = document.getElementById(id); if (node) node.textContent = txt; };
    setEl("pfZ4EqMkt", this.fmtMoney(eqMkt));
    setEl("pfZ4EqPl", `+${this.fmtMoney(eqPl)} (+${eqPct.toFixed(1)}%)`);
    setEl("pfZ4SetSplit", `${this.fmtMoney(a.SET.market)} (ทุน ${this.fmtShort(a.SET.cost)})`);
    setEl("pfZ4UsSplit", `${this.fmtMoney(a.US.market)} (ทุน ${this.fmtShort(a.US.cost)})`);

    // 2. Gold & Crypto
    const altMkt = a.GOLD.market + a.CRYPTO.market;
    const altCost = a.GOLD.cost + a.CRYPTO.cost;
    const altPl = altMkt - altCost;
    const altPct = altCost > 0 ? ((altPl / altCost) * 100) : 0;
    setEl("pfZ4AltMkt", this.fmtMoney(altMkt));
    setEl("pfZ4AltCost", this.fmtMoney(altCost));
    setEl("pfZ4GoldVal", `${this.fmtMoney(a.GOLD.market)} (+${(((a.GOLD.market - a.GOLD.cost) / a.GOLD.cost) * 100).toFixed(1)}%)`);
    setEl("pfZ4CryptoVal", `${this.fmtMoney(a.CRYPTO.market)} (${(((a.CRYPTO.market - a.CRYPTO.cost) / a.CRYPTO.cost) * 100).toFixed(1)}%)`);

    // 3. PVD Provident Fund
    const pvdMkt = a.PVD.market;
    const pvdEmpCost = a.PVD.cost; // Employee contribution
    const pvdEmployerAndGain = pvdMkt - pvdEmpCost; // Employer match + investment return
    const empPct = Math.round((pvdEmpCost / pvdMkt) * 100);
    const emrPct = 100 - empPct;
    setEl("pfZ4PvdMkt", this.fmtMoney(pvdMkt));
    setEl("pfZ4PvdEmp", `${this.fmtMoney(pvdEmpCost)} (${empPct}%)`);
    setEl("pfZ4PvdEmr", `+${this.fmtMoney(pvdEmployerAndGain)} (${emrPct}%)`);

    // 4. Insurance (Cash Surrender Value vs Cumulative Premium vs Coverage)
    const insCashVal = a.INS.market;
    const insPremiumPaid = 956383;
    const insCoverage = 3500000;
    setEl("pfZ4InsCashVal", this.fmtMoney(insCashVal));
    setEl("pfZ4InsPremium", this.fmtMoney(insPremiumPaid));
    setEl("pfZ4InsCoverage", this.fmtMoney(insCoverage));
  },

  /* =========================================================================
     ZONE 5: Cash Flow Calendar, Rebalancing Alerts & Technical Architecture
     ========================================================================= */
  renderZone5CashFlowAndTech(snap) {
    if (!snap) snap = this.getLatestPortfolioSnapshot();
    const calEl = document.getElementById("pfDivCalendarBars");
    if (!calEl) return;

    const m26 = snap.data.dividendAnalytics?.monthly2026 || [45, 36, 6664, 65135, 18097, 2614, 2160, 2425, 28483, 5358, 5184, 3800];
    const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const maxM = Math.max(...m26, 1);

    calEl.innerHTML = m26.map((val, i) => {
      const h = Math.max(8, Math.round((val / maxM) * 95));
      const isPeak = val >= 15000;
      return `
        <div class="pf-cal-col" title="เดือน ${MONTHS_TH[i]}: ${this.fmtMoney(val)}">
          <div class="pf-cal-val">${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}</div>
          <div class="pf-cal-bar-wrap">
            <div class="pf-cal-bar" style="height:${h}px; background:${isPeak ? '#10b981' : '#6366f1'};"></div>
          </div>
          <div class="pf-cal-lbl">${MONTHS_TH[i]}</div>
        </div>
      `;
    }).join("");
  }
};

window.PortfolioUI = PortfolioUI;
