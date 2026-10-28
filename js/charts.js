/**
 * FinVenture — Advanced SVG & Canvas Charting Engine
 * Implements high-performance visualizers matching the Apple Neo-Bento & Linear style.
 */

var FinCharts = {
  // Current chart filter states
  state: {
    histRange: "ALL",
    histCurve: "smooth",
    histAsset: "ALL",
    cashFlowYear: 2026,
    cashFlowPeriod: "ALL",
    selectedCategory: "all_eight",
    categoryMonth: "ALL",
    portfolioAssetFilter: "ALL"
  },

  formatMoney(amount, cur) {
    if (amount === null || amount === undefined || isNaN(amount)) return "฿ 0";
    const activeCur = cur || (typeof currentCurrency !== "undefined" ? currentCurrency : (window.currentCurrency || "THB"));
    if (activeCur === "USD") {
      const rate = (typeof currentFinData !== "undefined" && currentFinData.meta && currentFinData.meta.usdRate) ? currentFinData.meta.usdRate : 35.5;
      const usd = Math.round(amount / rate);
      return "$ " + usd.toLocaleString("en-US");
    } else {
      return "฿ " + Math.round(amount).toLocaleString("th-TH");
    }
  },

  formatShort(amount, cur) {
    if (amount === null || amount === undefined || isNaN(amount)) return "0";
    const activeCur = cur || (typeof currentCurrency !== "undefined" ? currentCurrency : (window.currentCurrency || "THB"));
    const rate = (typeof currentFinData !== "undefined" && currentFinData.meta && currentFinData.meta.usdRate) ? currentFinData.meta.usdRate : 35.5;
    const symbol = activeCur === "USD" ? "$" : "฿";
    const val = activeCur === "USD" ? amount / rate : amount;

    if (Math.abs(val) >= 1000000) {
      const numM = parseFloat((val / 1000000).toFixed(2));
      return `${symbol}${numM}M`;
    }
    if (Math.abs(val) >= 1000) {
      const numK = parseFloat((val / 1000).toFixed(1));
      return `${symbol}${numK}k`;
    }
    return `${symbol}${Math.round(val)}`;
  },

  /* =====================================================================
     1. HISTORICAL PORTFOLIO GROWTH & FORECAST (Tab 1 & Tab 3)
     ===================================================================== */
  calcAutoHistScale(dataMin, dataMax) {
    let span = dataMax - dataMin;
    if (span <= 0) span = 100000;

    const rawStep = span / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / mag;

    let stepVal;
    if (norm <= 1.25) stepVal = 1 * mag;
    else if (norm <= 2.75) stepVal = 2 * mag;
    else if (norm <= 6.5) stepVal = 5 * mag;
    else stepVal = 10 * mag;

    let minVal = Math.floor(dataMin / stepVal) * stepVal;
    let maxVal = Math.ceil(dataMax / stepVal) * stepVal;
    let stepCount = Math.round((maxVal - minVal) / stepVal);

    if (stepCount < 3) {
      stepVal = stepVal / 2;
      minVal = Math.floor(dataMin / stepVal) * stepVal;
      maxVal = Math.ceil(dataMax / stepVal) * stepVal;
      stepCount = Math.round((maxVal - minVal) / stepVal);
    } else if (stepCount > 6) {
      stepVal = stepVal * 2;
      minVal = Math.floor(dataMin / stepVal) * stepVal;
      maxVal = Math.ceil(dataMax / stepVal) * stepVal;
      stepCount = Math.round((maxVal - minVal) / stepVal);
    }

    return { minVal, maxVal, stepVal, stepCount };
  },
  getHistData() {
    const raw = currentFinData.portfolioHistory || [];
    let slice = raw;
    if (this.state.histRange === "1Y") slice = raw.slice(-12);
    else if (this.state.histRange === "3Y") slice = raw.slice(-36);

    const assetKey = this.state.histAsset || "ALL";
    if (assetKey === "ALL") {
      return slice;
    }

    return slice.map(pt => {
      const a = (pt.assets && pt.assets[assetKey]) ? pt.assets[assetKey] : { market: 0, cost: 0 };
      return {
        date: pt.date,
        label: pt.label,
        year: pt.year,
        month: pt.month,
        market: a.market || 0,
        cost: a.cost || 0,
        forecast: null
      };
    });
  },

  renderHistChart() {
    const svg = document.getElementById("histSvg");
    if (!svg) return;

    const data = this.getHistData();
    if (!data.length) return;

    // Height expanded after removing legend: Width 800 : Height 220
    const width = 800;
    const height = 220;
    const padTop = 16;
    const padBottom = 18;
    const padLeft = 58;
    const padRight = 20;

    const drawW = width - padLeft - padRight;
    const drawH = height - padTop - padBottom;
    const baselineY = padTop + drawH;

    // Determine scale dynamically based on selected slice and asset (Auto min, max, step)
    let rawMin = Math.min(...data.map(d => Math.min(d.cost, d.market, (d.forecast !== null && d.forecast !== undefined) ? d.forecast : Infinity)));
    let rawMax = Math.max(...data.map(d => Math.max(d.cost, d.market, d.forecast || 0)));
    if (rawMin === Infinity || isNaN(rawMin)) rawMin = 0;
    if (rawMax === -Infinity || isNaN(rawMax) || rawMax === 0) rawMax = 100000;

    const scale = this.calcAutoHistScale(rawMin, rawMax);
    const minVal = scale.minVal;
    const maxVal = scale.maxVal;
    const stepVal = scale.stepVal;
    const stepCount = scale.stepCount;

    function valToY(v) {
      return padTop + drawH - ((v - minVal) / (maxVal - minVal)) * drawH;
    }
    function idxToX(i) {
      return padLeft + (i / Math.max(1, data.length - 1)) * drawW;
    }

    // Grid lines & Y Axis labels (Font size 11.5 - clearly readable and proportionate)
    const gridG = document.getElementById("histGridLines");
    if (gridG) {
      gridG.innerHTML = "";

      for (let s = 0; s <= stepCount; s++) {
        const step = minVal + stepVal * s;
        const y = valToY(step);

        if (s > 0) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", padLeft);
          line.setAttribute("y1", y);
          line.setAttribute("x2", width - padRight);
          line.setAttribute("y2", y);
          line.setAttribute("stroke", "currentColor");
          line.setAttribute("stroke-opacity", "0.08");
          line.setAttribute("stroke-dasharray", "4,4");
          line.setAttribute("stroke-width", "0.8");
          gridG.appendChild(line);
        }

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", padLeft - 9);
        text.setAttribute("y", y + (s === 0 ? 3.5 : 4));
        text.setAttribute("fill", "currentColor");
        text.setAttribute("opacity", s === 0 ? "0.95" : "0.75");
        text.setAttribute("font-size", "11.5");
        text.setAttribute("font-family", "'Noto Sans Thai', sans-serif");
        text.setAttribute("text-anchor", "end");
        text.textContent = this.formatShort(step);
        gridG.appendChild(text);
      }
    }

    // Baseline Line
    const elBaseline = document.getElementById("histBaseline");
    if (elBaseline) {
      elBaseline.setAttribute("x1", padLeft);
      elBaseline.setAttribute("x2", width - padRight);
      elBaseline.setAttribute("y1", baselineY);
      elBaseline.setAttribute("y2", baselineY);
    }

    // X Axis: Q1 and Q3 for each year with guide lines (Font size 11.5)
    const quarterGuidesG = document.getElementById("histQuarterGuides");
    const xAxisTicksG = document.getElementById("histXAxisTicks");
    if (quarterGuidesG) quarterGuidesG.innerHTML = "";
    if (xAxisTicksG) xAxisTicksG.innerHTML = "";

    const quarterMap = { 1: "Q1", 2: "Q1", 3: "Q1", 4: "Q2", 5: "Q2", 6: "Q2", 7: "Q3", 8: "Q3", 9: "Q3", 10: "Q4", 11: "Q4", 12: "Q4" };
    const quarterTicks = [];
    const seenQuarters = new Set();

    data.forEach((pt, idx) => {
      const q = quarterMap[pt.month];
      // User requirement: Only show Q1 and Q3 of each year
      if (q === "Q1" || q === "Q3") {
        const yrShort = String(pt.year).slice(-2);
        const key = `${q} '${yrShort}`;
        if (!seenQuarters.has(key)) {
          seenQuarters.add(key);
          quarterTicks.push({
            idx: idx,
            x: idxToX(idx),
            label: key,
            quarter: q,
            year: pt.year,
            isQ1: (q === "Q1")
          });
        }
      }
    });

    quarterTicks.forEach(t => {
      // 1. Tick mark on baseline
      if (xAxisTicksG) {
        const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tickLine.setAttribute("x1", t.x);
        tickLine.setAttribute("y1", baselineY);
        tickLine.setAttribute("x2", t.x);
        tickLine.setAttribute("y2", baselineY + (t.isQ1 ? 6 : 4));
        tickLine.setAttribute("stroke", t.isQ1 ? "var(--mint-line)" : "currentColor");
        tickLine.setAttribute("stroke-opacity", t.isQ1 ? "0.95" : "0.45");
        tickLine.setAttribute("stroke-width", t.isQ1 ? "1.5" : "1.0");
        xAxisTicksG.appendChild(tickLine);

        // 2. Text label: e.g. "Q1 '23", "Q3 '23" (Font Size 11)
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", t.x);
        text.setAttribute("y", baselineY + 16);
        text.setAttribute("font-size", "11");
        text.setAttribute("font-family", "'Noto Sans Thai', sans-serif");
        text.setAttribute("fill", t.isQ1 ? "var(--mint-line)" : "currentColor");
        text.setAttribute("opacity", t.isQ1 ? "1" : "0.75");
        text.setAttribute("font-weight", t.isQ1 ? "700" : "500");
        text.setAttribute("text-anchor", "middle");
        text.textContent = t.label;
        xAxisTicksG.appendChild(text);
      }

      // 3. Vertical year separator guide line (at Q1)
      if (quarterGuidesG && t.isQ1) {
        const guide = document.createElementNS("http://www.w3.org/2000/svg", "line");
        guide.setAttribute("x1", t.x);
        guide.setAttribute("y1", padTop);
        guide.setAttribute("x2", t.x);
        guide.setAttribute("y2", baselineY);
        guide.setAttribute("stroke", "currentColor");
        guide.setAttribute("stroke-opacity", "0.08");
        guide.setAttribute("stroke-dasharray", "4,4");
        guide.setAttribute("stroke-width", "0.8");
        quarterGuidesG.appendChild(guide);
      }
    });

    // Paths
    let marketD = "";
    let costD = "";
    let forecastD = "";
    let areaD = "";

    data.forEach((pt, i) => {
      const x = idxToX(i);
      const yM = valToY(pt.market);
      const yC = valToY(pt.cost);

      if (i === 0) {
        marketD += `M ${x} ${yM}`;
        costD += `M ${x} ${yC}`;
        areaD += `M ${x} ${baselineY} L ${x} ${yM}`;
      } else {
        if (this.state.histCurve === "stepped") {
          marketD += ` L ${x} ${valToY(data[i - 1].market)} L ${x} ${yM}`;
          costD += ` L ${x} ${valToY(data[i - 1].cost)} L ${x} ${yC}`;
          areaD += ` L ${x} ${valToY(data[i - 1].market)} L ${x} ${yM}`;
        } else {
          const prevX = idxToX(i - 1);
          const prevYM = valToY(data[i - 1].market);
          const prevYC = valToY(data[i - 1].cost);
          const cpX = prevX + (x - prevX) / 2;
          marketD += ` C ${cpX} ${prevYM}, ${cpX} ${yM}, ${x} ${yM}`;
          costD += ` C ${cpX} ${prevYC}, ${cpX} ${yC}, ${x} ${yC}`;
          areaD += ` C ${cpX} ${prevYM}, ${cpX} ${yM}, ${x} ${yM}`;
        }
      }

      if (this.state.histAsset === "ALL" && pt.forecast !== null && pt.forecast !== undefined) {
        const yF = valToY(pt.forecast);
        if (forecastD === "") {
          forecastD += `M ${x} ${yF}`;
        } else {
          const prevX = idxToX(i - 1);
          const prevYF = valToY(data[i - 1].forecast || pt.forecast);
          const cpX = prevX + (x - prevX) / 2;
          forecastD += ` C ${cpX} ${prevYF}, ${cpX} ${yF}, ${x} ${yF}`;
        }
      }
    });

    const lastX = idxToX(data.length - 1);
    areaD += ` L ${lastX} ${baselineY} Z`;

    const elMarket = document.getElementById("histMarketLine");
    const elCost = document.getElementById("histCostLine");
    const elForecast = document.getElementById("histForecastLine");
    const elArea = document.getElementById("histAreaPath");

    if (elMarket) elMarket.setAttribute("d", marketD);
    if (elCost) elCost.setAttribute("d", costD);
    if (elForecast) elForecast.setAttribute("d", forecastD);
    if (elArea) elArea.setAttribute("d", areaD);

    // Update Mint Card KPI Elements based on selected asset and timeframe
    const latest = data[data.length - 1];
    const prev = data.length >= 2 ? data[data.length - 2] : latest;
    const gainVal = latest.market - latest.cost;
    const gainPct = latest.cost > 0 ? Math.round((gainVal / latest.cost) * 1000) / 10 : 0;
    const sign = gainVal >= 0 ? "+" : "";

    const netValEl = document.getElementById("chartNetWorthVal");
    if (netValEl) {
      netValEl.setAttribute("data-val-thb", latest.market);
      netValEl.innerText = this.formatMoney(latest.market);
    }

    const pill = document.getElementById("chartGainPill");
    if (pill) {
      pill.innerText = `${sign}${gainPct}% Gain`;
      pill.className = gainVal >= 0 ? "pill pill-lime-neon" : "pill pill-rose";
    }

    const costLegEl = document.getElementById("chartCostLegend");
    if (costLegEl) {
      costLegEl.innerHTML = `<strong style="color: #94a3b8;">┄</strong> เงินต้นทุนแท้จริง ${this.formatShort(latest.cost)} (จาก sheet Portfolio)`;
    }

    const assetNames = {
      ALL: "Portfolio value",
      PVD: "กองทุนสำรองเลี้ยงชีพ PVD (Approved market value)",
      SET: "หุ้นไทย SET (Approved market value)",
      INS: "ประกันชีวิตสะสมทรัพย์ (Approved market value)",
      GOLD: "ทองคำ AOM NOW (Approved market value)",
      CRYPTO: "สินทรัพย์ดิจิทัล Bitkub (Approved market value)",
      US: "หุ้นสหรัฐ Dime (Approved market value)",
      CASH: "เงินสด & Saving-ME (Approved market value)"
    };
    const scopeLbl = document.getElementById("chartScopeLabel");
    if (scopeLbl) {
      scopeLbl.innerText = assetNames[this.state.histAsset || "ALL"] || "Portfolio value";
    }

    // Update 4 Weekly & Period Recap Cards
    const rawAll = currentFinData.portfolioHistory || [];
    const lenAll = rawAll.length;
    let momDiff = latest.market - prev.market;
    let momPct = prev.market > 0 ? Math.round((momDiff / prev.market) * 1000) / 10 : 0;

    let yoyDiff = 0, yoyPct = 0, threeYDiff = 0, threeYPct = 0, allDiff = 0, allPct = 0;

    if (this.state.histAsset === "ALL" && currentFinData.historicalRecap) {
      const rc = currentFinData.historicalRecap;
      momDiff = rc.momDiff;
      momPct = rc.momPercent;
      yoyDiff = rc.yoyDiff;
      yoyPct = rc.yoyPercent;
      threeYDiff = rc.threeYearDiff;
      threeYPct = rc.threeYearPercent;
      allDiff = rc.allTimeDiff;
      allPct = rc.allTimePercent;
    } else {
      const oneYearAgo = lenAll >= 13 ? rawAll[lenAll - 13] : rawAll[0];
      const threeYearsAgo = lenAll >= 37 ? rawAll[lenAll - 37] : rawAll[0];
      const initial = rawAll[0];

      const curM = latest.market;
      const getAstMkt = (row) => (row.assets?.[this.state.histAsset]?.market || 0);

      const y1M = getAstMkt(oneYearAgo);
      yoyDiff = curM - y1M;
      yoyPct = y1M > 0 ? Math.round((yoyDiff / y1M) * 1000) / 10 : 0;

      const y3M = getAstMkt(threeYearsAgo);
      threeYDiff = curM - y3M;
      threeYPct = y3M > 0 ? Math.round((threeYDiff / y3M) * 1000) / 10 : 0;

      const initM = getAstMkt(initial);
      allDiff = curM - initM;
      allPct = initM > 0 ? Math.round((allDiff / initM) * 1000) / 10 : 0;
    }

    const fmtStat = (diff, pct) => {
      const s = diff >= 0 ? "+" : "";
      return `${s}${this.formatMoney(diff)} (${s}${pct}%)`;
    };

    const momEl = document.getElementById("recapMoMVal");
    if (momEl) momEl.innerText = fmtStat(momDiff, momPct);

    const yoyEl = document.getElementById("recap1YVal");
    if (yoyEl) yoyEl.innerText = fmtStat(yoyDiff, yoyPct);

    const threeYEl = document.getElementById("recap3YVal");
    if (threeYEl) threeYEl.innerText = fmtStat(threeYDiff, threeYPct);

    const allTimeEl = document.getElementById("recapAllTimeVal");
    if (allTimeEl) allTimeEl.innerText = fmtStat(allDiff, allPct);
  },

  setupHistInteractions() {
    const histSvg = document.getElementById("histSvg");
    const histTooltip = document.getElementById("histTooltip");
    const histCursorLine = document.getElementById("histCursorLine");
    const histMarketDot = document.getElementById("histMarketDot");

    if (!histSvg || !histTooltip) return;

    const quarterMap = { 1: "Q1", 2: "Q1", 3: "Q1", 4: "Q2", 5: "Q2", 6: "Q2", 7: "Q3", 8: "Q3", 9: "Q3", 10: "Q4", 11: "Q4", 12: "Q4" };

    histSvg.addEventListener("mousemove", (e) => {
      const rect = histSvg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const data = this.getHistData();
      if (!data.length) return;

      const assetKey = this.state.histAsset || "ALL";

      const width = 800;
      const height = 220;
      const padTop = 16;
      const padBottom = 18;
      const padLeft = 58;
      const padRight = 20;
      const drawW = width - padLeft - padRight;
      const drawH = height - padTop - padBottom;
      const baselineY = padTop + drawH;

      const usableW = rect.width * (drawW / width);
      const relX = mouseX - (rect.width * (padLeft / width));

      let idx = Math.round((relX / usableW) * (data.length - 1));
      if (idx < 0) idx = 0;
      if (idx >= data.length) idx = data.length - 1;

      const pt = data[idx];
      const ptX = padLeft + (idx / Math.max(1, data.length - 1)) * drawW;

      let rawMin = Math.min(...data.map(d => Math.min(d.cost, d.market, (d.forecast !== null && d.forecast !== undefined) ? d.forecast : Infinity)));
      let rawMax = Math.max(...data.map(d => Math.max(d.cost, d.market, d.forecast || 0)));
      if (rawMin === Infinity || isNaN(rawMin)) rawMin = 0;
      if (rawMax === -Infinity || isNaN(rawMax) || rawMax === 0) rawMax = 100000;

      const scale = this.calcAutoHistScale(rawMin, rawMax);
      const minVal = scale.minVal;
      const maxVal = scale.maxVal;

      const ptY = padTop + drawH - ((pt.market - minVal) / (maxVal - minVal)) * drawH;

      if (histCursorLine) {
        histCursorLine.setAttribute("x1", ptX);
        histCursorLine.setAttribute("x2", ptX);
        histCursorLine.setAttribute("y1", padTop);
        histCursorLine.setAttribute("y2", baselineY);
        histCursorLine.style.display = "block";
      }

      if (histMarketDot) {
        histMarketDot.setAttribute("cx", ptX);
        histMarketDot.setAttribute("cy", ptY);
        histMarketDot.style.display = "block";
      }

      histTooltip.style.display = "block";
      const lblEl = document.getElementById("histTtLabel");
      const valEl = document.getElementById("histTtVal");
      const costEl = document.getElementById("histTtCost");

      const q = quarterMap[pt.month] || "";
      const yrShort = String(pt.year).slice(-2);
      const qStr = q ? ` (${q} '${yrShort})` : "";

      if (lblEl) lblEl.innerText = pt.label.replace(" (ปัจจุบัน)", "") + qStr;
      if (valEl) valEl.innerText = this.formatMoney(pt.market);
      if (costEl) {
        const diff = pt.market - pt.cost;
        const sign = diff >= 0 ? "+" : "";
        const pct = pt.cost > 0 ? (diff / pt.cost * 100).toFixed(1) : 0;
        let costHtml = `(ทุน ${this.formatShort(pt.cost)} | ${sign}${pct}%)`;
        if (pt.forecast && assetKey === "ALL") {
          const fDiff = pt.market - pt.forecast;
          const fSign = fDiff >= 0 ? "+" : "";
          const fPct = ((fDiff / pt.forecast) * 100).toFixed(1);
          costHtml += ` • <span style="color:#c7d2fe; font-weight:600;">เป้าหมาย ${this.formatShort(pt.forecast)} (${fSign}${fPct}%)</span>`;
        }
        costEl.innerHTML = costHtml;
      }

      const ttLeft = (ptX / width) * rect.width;
      const ttTop = (ptY / height) * rect.height;
      histTooltip.style.left = ttLeft + "px";

      // Popup positioned directly above the hovered point (with boundary check)
      if (ttTop < 36) {
        histTooltip.style.top = (ttTop + 14) + "px";
        if (idx > data.length - 4) {
          histTooltip.style.transform = "translate(-85%, 0)";
        } else if (idx < 3) {
          histTooltip.style.transform = "translate(-15%, 0)";
        } else {
          histTooltip.style.transform = "translate(-50%, 0)";
        }
      } else {
        histTooltip.style.top = (ttTop - 10) + "px";
        if (idx > data.length - 4) {
          histTooltip.style.transform = "translate(-85%, -100%)";
        } else if (idx < 3) {
          histTooltip.style.transform = "translate(-15%, -100%)";
        } else {
          histTooltip.style.transform = "translate(-50%, -100%)";
        }
      }
    });

    histSvg.addEventListener("mouseleave", () => {
      if (histCursorLine) histCursorLine.style.display = "none";
      if (histMarketDot) histMarketDot.style.display = "none";
      if (histTooltip) histTooltip.style.display = "none";
    });
  },

  /* =====================================================================
     2. SANKEY MONEY FLOW DIAGRAM (Tab 1 Overview)
     Visualizes Inflow -> Buffer/Pockets -> Assets & Living Expenses
     ===================================================================== */
  renderSankeyDiagram() {
    const container = document.getElementById("sankeyContainer");
    if (!container) return;

    const width = 860;
    const height = 240;

    const o = currentFinData.overview;
    const salary = o.latestIncome || 137906;
    const dividends = o.avgMonthlyDividend || 32138;
    const living = o.latestNetExpense || 67604;
    const invest = 53377;
    const pvd = 7494;
    const buffer = Math.max(0, salary - living - invest);

    const livingPct = Math.round((living / salary) * 100);
    const investPct = Math.round((invest / salary) * 100);

    let svgHtml = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="font-family: inherit;">
        <defs>
          <linearGradient id="flow-sal-exp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.55"/>
          </linearGradient>
          <linearGradient id="flow-sal-inv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0.55"/>
          </linearGradient>
          <linearGradient id="flow-div-reinv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.6"/>
          </linearGradient>
          <linearGradient id="flow-sal-pvd" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.55"/>
          </linearGradient>
        </defs>

        <!-- Left Column Nodes (Sources) -->
        <g transform="translate(30, 20)">
          <!-- Salary -->
          <rect x="0" y="10" width="130" height="48" rx="8" fill="var(--surface-sec)" stroke="var(--border)" stroke-width="1.5"/>
          <text x="14" y="32" font-size="12" font-weight="700" fill="var(--fg)">👔 Salary & Income</text>
          <text x="14" y="48" font-size="11" font-family="'Noto Sans Thai', sans-serif" fill="#3b82f6" font-weight="700">${this.formatMoney(salary)}</text>

          <!-- Dividends -->
          <rect x="0" y="80" width="130" height="48" rx="8" fill="var(--surface-sec)" stroke="var(--border)" stroke-width="1.5"/>
          <text x="14" y="102" font-size="12" font-weight="700" fill="var(--fg)">💰 Dividends (Div)</text>
          <text x="14" y="118" font-size="11" font-family="'Noto Sans Thai', sans-serif" fill="#10b981" font-weight="700">${this.formatMoney(dividends)}</text>

          <!-- Bonus / Tax Refund -->
          <rect x="0" y="150" width="130" height="48" rx="8" fill="var(--surface-sec)" stroke="var(--border)" stroke-width="1.5"/>
          <text x="14" y="172" font-size="12" font-weight="700" fill="var(--fg)">🎁 Bonus & Tax</text>
          <text x="14" y="188" font-size="11" font-family="'Noto Sans Thai', sans-serif" fill="#f59e0b" font-weight="700">${this.formatMoney(13750)}</text>
        </g>

        <!-- Sankey Flow Curves -->
        <path d="M 160 40 C 350 40, 480 35, 660 35" fill="none" stroke="url(#flow-sal-exp)" stroke-width="32" stroke-linecap="round"/>
        <path d="M 160 52 C 350 52, 480 90, 660 90" fill="none" stroke="url(#flow-sal-inv)" stroke-width="22" stroke-linecap="round"/>
        <path d="M 160 110 C 350 110, 480 100, 660 100" fill="none" stroke="url(#flow-div-reinv)" stroke-width="20" stroke-linecap="round"/>
        <path d="M 160 62 C 350 62, 480 150, 660 150" fill="none" stroke="url(#flow-sal-pvd)" stroke-width="10" stroke-linecap="round"/>
        <path d="M 160 178 C 350 178, 480 205, 660 205" fill="none" stroke="rgba(56, 189, 248, 0.45)" stroke-width="12" stroke-linecap="round"/>

        <!-- Right Column Nodes (Sinks / Destinations) -->
        <g transform="translate(660, 15)">
          <!-- Expenses -->
          <rect x="0" y="5" width="170" height="42" rx="8" fill="var(--surface-sec)" stroke="#f43f5e" stroke-width="1.5"/>
          <text x="12" y="24" font-size="11.5" font-weight="700" fill="var(--fg)">🛒 Net Expenses</text>
          <text x="12" y="38" font-size="10.5" font-family="'Noto Sans Thai', sans-serif" fill="#f43f5e" font-weight="700">${this.formatMoney(living)} (${livingPct}%)</text>

          <!-- Total Invest -->
          <rect x="0" y="65" width="170" height="42" rx="8" fill="var(--surface-sec)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="12" y="84" font-size="11.5" font-weight="700" fill="var(--fg)">📈 Investment & Re-invest</text>
          <text x="12" y="98" font-size="10.5" font-family="'Noto Sans Thai', sans-serif" fill="#6366f1" font-weight="700">${this.formatMoney(invest)} (${investPct}%)</text>

          <!-- PVD -->
          <rect x="0" y="125" width="170" height="38" rx="8" fill="var(--surface-sec)" stroke="#0284c7" stroke-width="1.5"/>
          <text x="12" y="143" font-size="11.5" font-weight="700" fill="var(--fg)">🏢 PVD Provident Fund</text>
          <text x="12" y="156" font-size="10.5" font-family="'Noto Sans Thai', sans-serif" fill="#0284c7" font-weight="700">${this.formatMoney(pvd)}</text>

          <!-- Liquidity / Cash Buffer -->
          <rect x="0" y="180" width="170" height="38" rx="8" fill="var(--surface-sec)" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="198" font-size="11.5" font-weight="700" fill="var(--fg)">💵 Cash & Saving-ME</text>
          <text x="12" y="211" font-size="10.5" font-family="'Noto Sans Thai', sans-serif" fill="#38bdf8" font-weight="700">+${this.formatMoney(buffer)} Buffer</text>
        </g>
      </svg>
    `;

    container.innerHTML = svgHtml;
  },

  /* =====================================================================
     3. CASH FLOW MULTI-BAR CHART (Tab 2 Cash Flow)
     3 Bars: Income (Green) vs Net Expense (Red) vs Total Invest (Purple)
     ===================================================================== */
  renderCashFlowBars() {
    const container = document.getElementById("cashFlowBarSvgWrap");
    if (!container) return;

    let records = currentFinData.monthlyCashFlow || [];

    // Filter by year
    if (this.state.cashFlowYear !== "ALL") {
      records = records.filter(r => r.year === parseInt(this.state.cashFlowYear));
    }

    // Filter by period
    if (this.state.cashFlowPeriod === "6M") {
      records = records.slice(-6);
    } else if (this.state.cashFlowPeriod === "H1") {
      records = records.filter(r => {
        const m = parseInt(r.month.split("-")[1]);
        return m >= 1 && m <= 6;
      });
    } else if (this.state.cashFlowPeriod === "H2") {
      records = records.filter(r => {
        const m = parseInt(r.month.split("-")[1]);
        return m >= 7 && m <= 12;
      });
    } else if (this.state.cashFlowPeriod.startsWith("Q")) {
      const q = parseInt(this.state.cashFlowPeriod.charAt(1));
      const startM = (q - 1) * 3 + 1;
      const endM = q * 3;
      records = records.filter(r => {
        const m = parseInt(r.month.split("-")[1]);
        return m >= startM && m <= endM;
      });
    }

    if (records.length === 0) records = currentFinData.monthlyCashFlow.slice(-6);

    // Calculate period summary cards
    const totalIncome = records.reduce((s, r) => s + r.income, 0);
    const totalExpense = records.reduce((s, r) => s + r.netExpense, 0);
    const totalInvest = records.reduce((s, r) => s + r.invest, 0);
    const netCashFlow = totalIncome - totalExpense;
    const avgIncome = records.length > 0 ? Math.round(totalIncome / records.length) : 0;
    const avgExpense = records.length > 0 ? Math.round(totalExpense / records.length) : 0;
    const investRate = totalIncome > 0 ? Math.round((totalInvest / totalIncome) * 1000) / 10 : 0;
    const expenseRate = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 1000) / 10 : 0;

    // Update 4 Period Summary Cards
    const elTotInc = document.getElementById("cfPeriodTotalIncome");
    const elAvgInc = document.getElementById("cfPeriodAvgIncome");
    const elTotExp = document.getElementById("cfPeriodTotalExpense");
    const elExpRate = document.getElementById("cfPeriodExpenseRate");
    const elTotInv = document.getElementById("cfPeriodTotalInvest");
    const elInvRate = document.getElementById("cfPeriodInvestRate");
    const elNetCf = document.getElementById("cfPeriodNetCashFlow");

    if (elTotInc) elTotInc.innerText = this.formatMoney(totalIncome);
    if (elAvgInc) elAvgInc.innerText = `${this.formatMoney(avgIncome)} / เดือน`;
    if (elTotExp) elTotExp.innerText = this.formatMoney(totalExpense);
    if (elExpRate) elExpRate.innerText = `${expenseRate}% เทียบรายรับ (เฉลี่ย ${this.formatMoney(avgExpense)}/ด.)`;
    if (elTotInv) elTotInv.innerText = this.formatMoney(totalInvest);
    if (elInvRate) elInvRate.innerText = `อัตราลงทุน ${investRate}%`;
    if (elNetCf) elNetCf.innerText = (netCashFlow >= 0 ? "+" : "") + this.formatMoney(netCashFlow);

    // Render SVG Multi-Bar
    const width = 880;
    const height = 240;
    const padTop = 20;
    const padBottom = 35;
    const padLeft = 45;
    const padRight = 20;

    const drawW = width - padLeft - padRight;
    const drawH = height - padTop - padBottom;

    const maxVal = Math.max(...records.map(r => Math.max(r.income, r.netExpense, r.invest))) * 1.15;
    const count = records.length;
    const slotW = drawW / count;
    const barW = Math.max(8, Math.min(22, (slotW - 20) / 3));

    let barsSvg = "";
    records.forEach((r, i) => {
      const groupX = padLeft + i * slotW + (slotW - barW * 3 - 8) / 2;
      
      const hInc = (r.income / maxVal) * drawH;
      const yInc = padTop + drawH - hInc;

      const hExp = (r.netExpense / maxVal) * drawH;
      const yExp = padTop + drawH - hExp;

      const hInv = (r.invest / maxVal) * drawH;
      const yInv = padTop + drawH - hInv;

      barsSvg += `
        <g class="cf-bar-group" data-idx="${i}" style="cursor: pointer;">
          <!-- Hover highlight rect -->
          <rect x="${groupX - 6}" y="${padTop}" width="${barW * 3 + 20}" height="${drawH}" fill="transparent" class="bar-hover-zone"/>

          <!-- 1. Green: Income -->
          <rect x="${groupX}" y="${yInc}" width="${barW}" height="${hInc}" rx="5" fill="#10b981">
            <title>${r.label} รายรับ: ${this.formatMoney(r.income)}</title>
          </rect>

          <!-- 2. Red: Net Expense -->
          <rect x="${groupX + barW + 4}" y="${yExp}" width="${barW}" height="${hExp}" rx="5" fill="#f43f5e">
            <title>${r.label} รายจ่ายสุทธิ: ${this.formatMoney(r.netExpense)}</title>
          </rect>

          <!-- 3. Purple: Total Invest -->
          <rect x="${groupX + (barW + 4) * 2}" y="${yInv}" width="${barW}" height="${hInv}" rx="5" fill="#818cf8">
            <title>${r.label} ลงทุน: ${this.formatMoney(r.invest)}</title>
          </rect>

          <!-- Month Label -->
          <text x="${groupX + barW * 1.5 + 4}" y="${height - 12}" fill="var(--fg-sec)" font-size="11.5" font-weight="${r.label.includes('สด') ? '700' : '500'}" text-anchor="middle">
            ${r.label}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <!-- Horizontal Guide Lines -->
        <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="3,3"/>
        <line x1="${padLeft}" y1="${padTop + drawH / 2}" x2="${width - padRight}" y2="${padTop + drawH / 2}" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="3,3"/>
        <line x1="${padLeft}" y1="${padTop + drawH}" x2="${width - padRight}" y2="${padTop + drawH}" stroke="currentColor" stroke-opacity="0.15"/>

        <!-- Y Axis Labels -->
        <text x="${padLeft - 6}" y="${padTop + 4}" fill="currentColor" opacity="0.6" font-size="10" font-family="'Noto Sans Thai', sans-serif" text-anchor="end">${this.formatShort(maxVal)}</text>
        <text x="${padLeft - 6}" y="${padTop + drawH / 2 + 4}" fill="currentColor" opacity="0.6" font-size="10" font-family="'Noto Sans Thai', sans-serif" text-anchor="end">${this.formatShort(maxVal / 2)}</text>
        <text x="${padLeft - 6}" y="${padTop + drawH}" fill="currentColor" opacity="0.6" font-size="10" font-family="'Noto Sans Thai', sans-serif" text-anchor="end">0</text>

        ${barsSvg}
      </svg>
    `;
  },

  /* =====================================================================
     4. CATEGORY DEEP DIVE & TREND ANALYZER (Tab 2 Cash Flow)
     Adaptive: Line Chart for Multi-Month vs Bar Chart for Single Month
     ===================================================================== */
  renderCategoryDeepDive() {
    const cat = currentFinData.expenseCategories.find(c => c.id === this.state.selectedCategory) || currentFinData.expenseCategories[0];
    
    // Update 4 Summary Cards
    const elSumPeriod = document.getElementById("catSumPeriod");
    const elSumAvg = document.getElementById("catSumAvg");
    const elSumShare = document.getElementById("catSumShare");
    const elSumPeak = document.getElementById("catSumPeak");

    if (elSumPeriod) elSumPeriod.innerText = this.formatMoney(cat.latestAmount);
    if (elSumAvg) elSumAvg.innerText = `${this.formatMoney(cat.yearlyAvg)}/ด.`;
    if (elSumShare) elSumShare.innerText = `${cat.sharePercent}%`;
    if (elSumPeak) elSumPeak.innerText = cat.peakMonth;

    // Render Subcategory Chips
    const chipsContainer = document.getElementById("subcatChips");
    if (chipsContainer) {
      chipsContainer.innerHTML = cat.subcategories.map(s => `
        <div class="sub-tile white-bg" style="padding: 12px; min-height: 80px;">
          <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--fg-sec);">
            <span style="font-weight: 600;">${s.name}</span>
            <span class="pill pill-lav">${s.percent}%</span>
          </div>
          <div class="num font-bold" style="font-size: 18px; margin: 4px 0;">${this.formatMoney(s.amount)}</div>
          <div style="font-size: 10.5px; color: var(--fg-muted);">เฉลี่ย ${this.formatMoney(s.avgMonthly)}/ด.</div>
        </div>
      `).join("");
    }

    // Adaptive Visualizer: Historical Line Chart vs Single Month Bar Breakdown
    const chartContainer = document.getElementById("catChartContainer");
    if (!chartContainer) return;

    if (this.state.categoryMonth === "ALL") {
      // Historical Line Chart with smooth curve & subcategory breakdowns
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];
      const dataPts = cat.monthlyHistory || [10000, 11000, 10500, 12000, 11500, 10800, 11200, 11900, cat.latestAmount];
      
      const width = 800;
      const height = 180;
      const padTop = 15;
      const padBottom = 25;
      const padLeft = 45;
      const padRight = 20;

      const drawW = width - padLeft - padRight;
      const drawH = height - padTop - padBottom;

      const maxVal = Math.max(...dataPts) * 1.25;
      const minVal = Math.min(...dataPts) * 0.75;

      let pathD = "";
      let areaD = "";

      dataPts.forEach((v, i) => {
        const x = padLeft + (i / (dataPts.length - 1)) * drawW;
        const y = padTop + drawH - ((v - minVal) / (maxVal - minVal)) * drawH;

        if (i === 0) {
          pathD += `M ${x} ${y}`;
          areaD += `M ${x} ${height - padBottom} L ${x} ${y}`;
        } else {
          const prevX = padLeft + ((i - 1) / (dataPts.length - 1)) * drawW;
          const prevY = padTop + drawH - ((dataPts[i - 1] - minVal) / (maxVal - minVal)) * drawH;
          const cpX = prevX + (x - prevX) / 2;
          pathD += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
          areaD += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
        }
      });
      areaD += ` L ${padLeft + drawW} ${height - padBottom} Z`;

      let circles = dataPts.map((v, i) => {
        const x = padLeft + (i / (dataPts.length - 1)) * drawW;
        const y = padTop + drawH - ((v - minVal) / (maxVal - minVal)) * drawH;
        return `
          <circle cx="${x}" cy="${y}" r="4" fill="#f43f5e" stroke="var(--surface)" stroke-width="2"/>
          <text x="${x}" y="${height - 8}" font-size="11" fill="var(--fg-sec)" text-anchor="middle">${months[i]}</text>
        `;
      }).join("");

      chartContainer.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <path d="${areaD}" fill="url(#catGrad)"/>
          <path d="${pathD}" fill="none" stroke="#f43f5e" stroke-width="2.5"/>
          ${circles}
        </svg>
      `;
    } else {
      // Single Month Bar Breakdown
      chartContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 10px 0;">
          ${cat.subcategories.map(s => `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
                <span>${s.name}</span>
                <span class="num font-bold">${this.formatMoney(s.amount)} (${s.percent}%)</span>
              </div>
              <div style="height: 10px; background: var(--surface-sec); border-radius: var(--r-pill); overflow: hidden;">
                <div style="width: ${s.percent}%; height: 100%; background: #f43f5e; border-radius: var(--r-pill);"></div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  },

  /* =====================================================================
     5. MODERN DIVIDEND DASHBOARD (Tab 3 Dividends — Reference Style)
     ===================================================================== */
  renderDividendTimeline() {
    this.renderDividendDashboard();
  },

  renderDividendDashboard() {
    const chartContainer = document.getElementById("divChartContainer");
    if (!chartContainer) return;

    const dData = currentFinData.dividendAnalytics || (DEFAULT_FIN_DATA && DEFAULT_FIN_DATA.dividendAnalytics) || {};
    const m26 = dData.monthly2026 || [45, 36, 6664, 65135, 18097, 2614, 2160, 2425, 28483, 3024, 5184, 0];
    const m25 = dData.monthly2025 || [2592, 0, 1653, 15352, 13455, 800, 2592, 12000, 20762, 3476, 4465, 665];
    const streams = dData.streams || [];

    // 1. Update Growth Badge
    const growthEl = document.getElementById("divGrowthVal");
    const growthDiffEl = document.getElementById("divGrowthDiff");
    const growthBadge = document.getElementById("divGrowthBadge");
    if (growthEl && dData.yearlyGrowth != null) {
      const isPos = dData.yearlyGrowth >= 0;
      growthEl.textContent = `${isPos ? '+' : ''}${dData.yearlyGrowth}%`;
      
      const diffVal = (dData.totalThisYear || dData.total2026 || 0) - (dData.totalPrevYear || dData.total2025 || 0);
      if (growthDiffEl) {
        growthDiffEl.textContent = `(${diffVal >= 0 ? '+฿' : '-฿'}${Math.abs(diffVal).toLocaleString()})`;
        growthDiffEl.style.color = isPos ? '#10b981' : '#f43f5e';
      }

      if (growthBadge) {
        growthBadge.style.color = isPos ? '#10b981' : '#f43f5e';
      }
    }

    // 2. Render Dual Smooth Line Chart
    const toggleEl = document.getElementById("divComparePrevToggle");
    const showPrev = toggleEl ? toggleEl.checked : true;

    const W = 460, H = 220;
    const PADl = 44, PADr = 16, PADt = 22, PADb = 26;
    const iW = W - PADl - PADr;
    const iH = H - PADt - PADb;

    const maxVal = Math.max(...m26, ...(showPrev ? m25 : [0]), 1);

    // Compute coordinate points (12 months)
    const pts26 = m26.map((val, i) => {
      const x = PADl + (i / 11) * iW;
      const y = PADt + (1 - val / maxVal) * iH;
      return { x, y, val, monthIdx: i };
    });

    const pts25 = m25.map((val, i) => {
      const x = PADl + (i / 11) * iW;
      const y = PADt + (1 - val / maxVal) * iH;
      return { x, y, val, monthIdx: i };
    });

    const getSpline = (pts) => {
      if (pts.length < 2) return { line: "", curvePart: "" };
      let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
      let curvePart = "";
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        const segment = ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
        d += segment;
        curvePart += segment;
      }
      return { line: d, curvePart };
    };

    const spline26 = getSpline(pts26);
    const spline25 = getSpline(pts25);

    const area26 = `M ${pts26[0].x.toFixed(1)},${PADt + iH} L ${pts26[0].x.toFixed(1)},${pts26[0].y.toFixed(1)}${spline26.curvePart} L ${pts26[11].x.toFixed(1)},${PADt + iH} Z`;

    const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    // Horizontal Y Grid (4 levels)
    const yGridLevels = [0.25, 0.5, 0.75, 1.0];
    const yGridSvg = yGridLevels.map(lvl => {
      const v = Math.round(lvl * maxVal);
      const y = PADt + (1 - lvl) * iH;
      const lbl = v >= 1000 ? `฿${Math.round(v / 1000)}k` : `฿${v}`;
      return `
        <line x1="${PADl}" y1="${y.toFixed(1)}" x2="${PADl + iW}" y2="${y.toFixed(1)}" stroke="rgba(148, 163, 184, 0.15)" stroke-dasharray="3,3" stroke-width="1"/>
        <text x="${PADl - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" font-size="8.5" font-weight="600" fill="var(--fg-muted)">${lbl}</text>
      `;
    }).join("");

    // Baseline
    const baselineSvg = `
      <line x1="${PADl}" y1="${PADt + iH}" x2="${PADl + iW}" y2="${PADt + iH}" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1"/>
      <text x="${PADl - 6}" y="${PADt + iH + 3.5}" text-anchor="end" font-size="8.5" font-weight="600" fill="var(--fg-muted)">฿0</text>
    `;

    // X Axis Month Labels
    const xLabelsSvg = pts26.map((pt, i) => {
      return `<text x="${pt.x.toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="9" font-weight="600" fill="var(--fg-muted)">${MONTHS_TH[i]}</text>`;
    }).join("");

    // Previous year line (Faded smooth continuous line - NOT dashed!)
    const prevLineSvg = showPrev ? `
      <path d="${spline25.line}" fill="none" stroke="#93c5fd" stroke-width="1.8" opacity="0.65" stroke-linecap="round" stroke-linejoin="round"/>
    ` : "";

    chartContainer.innerHTML = `
      <svg id="divDualChartSvg" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;overflow:visible;cursor:crosshair;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="divGrad26" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
          </linearGradient>
          <filter id="divGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(37, 99, 235, 0.35)"/>
          </filter>
        </defs>

        ${yGridSvg}
        ${baselineSvg}

        <!-- Hover Highlight Column -->
        <rect id="divHoverCol" x="0" y="${PADt - 6}" width="28" height="${iH + 12}" rx="6" fill="rgba(37, 99, 235, 0.08)" style="display:none; pointer-events:none; transition: x 0.1s ease;"/>

        <!-- Area Fill 2026 -->
        <path d="${area26}" fill="url(#divGrad26)"/>

        <!-- Previous Year 2025 Line (Smooth & Faded) -->
        ${prevLineSvg}

        <!-- Current Year 2026 Line (Solid Blue) -->
        <path d="${spline26.line}" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#divGlow)"/>

        ${xLabelsSvg}

        <!-- Interactive Dots -->
        <circle id="divDot25" cx="0" cy="0" r="3.2" fill="#93c5fd" stroke="#ffffff" stroke-width="1.4" style="display:none; pointer-events:none; transition: transform 0.12s ease;"/>
        <circle id="divDot26" cx="0" cy="0" r="3.8" fill="#2563eb" stroke="#ffffff" stroke-width="1.8" style="display:none; pointer-events:none; transition: transform 0.12s ease;"/>

        <!-- Dark Pill Tooltip -->
        <g id="divTooltipGroup" style="display:none; pointer-events:none; transition: transform 0.12s ease;">
          <rect id="divTooltipBg" x="-56" y="-56" width="112" height="48" rx="8" fill="#0f172a" opacity="0.95" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.3))"/>
          <text id="divTooltipMonth" x="0" y="-40" text-anchor="middle" font-size="9.5" font-weight="700" fill="#94a3b8">15 ก.ย.</text>
          <text id="divTooltipVal26" x="0" y="-27" text-anchor="middle" font-size="10.5" font-weight="800" font-family="'JetBrains Mono', monospace" fill="#ffffff">2026: ฿ 28,483</text>
          <text id="divTooltipVal25" x="0" y="-14" text-anchor="middle" font-size="9.5" font-weight="700" font-family="'JetBrains Mono', monospace" fill="#93c5fd">2025: ฿ 20,762</text>
        </g>
      </svg>
    `;

    // Setup Hover Handler
    const svg = document.getElementById("divDualChartSvg");
    const hoverCol = document.getElementById("divHoverCol");
    const dot26 = document.getElementById("divDot26");
    const dot25 = document.getElementById("divDot25");
    const tooltipGroup = document.getElementById("divTooltipGroup");
    const ttMonth = document.getElementById("divTooltipMonth");
    const ttVal26 = document.getElementById("divTooltipVal26");
    const ttVal25 = document.getElementById("divTooltipVal25");

    const showHoverIndex = (idx) => {
      const p26 = pts26[idx];
      const p25 = pts25[idx];
      if (!p26) return;

      if (hoverCol) {
        hoverCol.style.display = "";
        hoverCol.setAttribute("x", (p26.x - 14).toFixed(1));
      }

      if (dot26) {
        dot26.style.display = "";
        dot26.setAttribute("transform", `translate(${p26.x.toFixed(1)}, ${p26.y.toFixed(1)})`);
      }

      if (dot25 && showPrev && p25) {
        dot25.style.display = "";
        dot25.setAttribute("transform", `translate(${p25.x.toFixed(1)}, ${p25.y.toFixed(1)})`);
      } else if (dot25) {
        dot25.style.display = "none";
      }

      if (tooltipGroup) {
        tooltipGroup.style.display = "";
        let ttX = p26.x;
        if (ttX < PADl + 56) ttX = PADl + 56;
        if (ttX > W - PADr - 56) ttX = W - PADr - 56;
        let ttY = Math.min(p26.y, showPrev && p25 ? p25.y : p26.y);
        if (ttY < 60) ttY = Math.max(p26.y, p25 ? p25.y : p26.y) + 60;
        tooltipGroup.setAttribute("transform", `translate(${ttX.toFixed(1)}, ${ttY.toFixed(1)})`);
      }

      if (ttMonth) ttMonth.textContent = `เดือน ${MONTHS_TH[idx]}`;
      if (ttVal26) ttVal26.textContent = `2026: ฿ ${p26.val.toLocaleString()}`;
      if (ttVal25) {
        ttVal25.style.display = showPrev ? "" : "none";
        ttVal25.textContent = `2025: ฿ ${p25 ? p25.val.toLocaleString() : '0'}`;
      }
    };

    const hideHover = () => {
      showHoverIndex(8); // Default to Sep
    };

    hideHover();

    if (svg) {
      svg.onmousemove = (e) => {
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * W;
        let bestIdx = 0;
        let bestDist = Math.abs(pts26[0].x - svgX);
        for (let i = 1; i < pts26.length; i++) {
          const dist = Math.abs(pts26[i].x - svgX);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
        showHoverIndex(bestIdx);
      };
      svg.onmouseleave = hideHover;
    }

    // 3. Render Dividend Streams List (Dynamic toggle based on Compare Prev checkbox)
    const activeStreams = showPrev ? (dData.streamsPrevYear && dData.streamsPrevYear.length ? dData.streamsPrevYear : streams) : streams;
    const currentYear = new Date().getFullYear();
    const activeYear = showPrev ? (currentYear - 1) : currentYear;

    const streamsYearLbl = document.getElementById("divContributorsYearLbl");
    if (streamsYearLbl) {
      streamsYearLbl.textContent = showPrev ? `ปีก่อน (${activeYear})` : `ปีล่าสุด (${activeYear})`;
    }

    const streamsEl = document.getElementById("divStreamsList");
    if (streamsEl) {
      streamsEl.innerHTML = activeStreams.map(s => `
        <div class="div-stream-row">
          <div class="div-stream-top">
            <span class="div-stream-name">${s.name}</span>
            <span class="div-stream-amount">฿ ${s.amount.toLocaleString()}</span>
            <span class="div-stream-pct">${s.percent}%</span>
          </div>
          <div class="div-stream-track">
            <div class="div-stream-fill" style="width: ${s.percent}%;"></div>
          </div>
        </div>
      `).join("");
    }

    // 4. Render Passive Income Target (Card 2)
    const cmpEl = document.getElementById("divComparePeriodVal");
    const cmpIcon = document.getElementById("divComparePeriodIcon");
    const regGrowth = dData.regularDivGrowth != null ? dData.regularDivGrowth : 12.1;
    const isRegPos = regGrowth >= 0;
    if (cmpEl) {
      cmpEl.textContent = `${isRegPos ? '+' : ''}${regGrowth}% compare to expected regular dividend`;
      if (cmpEl.parentElement) cmpEl.parentElement.style.color = isRegPos ? '#10b981' : '#f43f5e';
    }
    if (cmpIcon) {
      cmpIcon.innerHTML = isRegPos
        ? '<path d="M7 17l10-10M7 7h10v10"/>'
        : '<path d="M7 7l10 10M17 7v10H7"/>';
    }

    // Gauge 1: Expense Coverage
    const covPct = dData.expenseCoveragePct || 21.3;
    const covPctEl = document.getElementById("divCoveragePct");
    const covRing = document.getElementById("divCoverageRing");
    const covSub = document.getElementById("divCoverageSub");
    if (covPctEl) covPctEl.textContent = `${covPct}%`;
    if (covSub) covSub.textContent = `฿${(dData.monthlyAvgDiv || 11156).toLocaleString()} / ฿${(dData.monthlyExpense || 52366).toLocaleString()} ต่อเดือน`;
    if (covRing) {
      const circ = 2 * Math.PI * 18; // ~113.097
      const offset = circ - (Math.min(100, covPct) / 100) * circ;
      covRing.style.strokeDashoffset = offset.toFixed(1);
    }

    // Gauge 2: Total Cost / Profit
    const profPct = dData.divReturnPct || 37.49;
    const profPctEl = document.getElementById("divProfitPct");
    const profRing = document.getElementById("divProfitRing");
    const profSub = document.getElementById("divProfitSub");
    if (profPctEl) profPctEl.textContent = `+${profPct}%`;
    if (profSub) profSub.textContent = `ต้นทุน ฿${(dData.divCost || 1647800).toLocaleString()} · ตลาด ฿${(dData.divMkt || 2265560).toLocaleString()}`;
    if (profRing) {
      const circ = 2 * Math.PI * 18;
      const offset = circ - (Math.min(100, profPct) / 100) * circ;
      profRing.style.strokeDashoffset = offset.toFixed(1);
    }

    // 5. Render Yield on Cost (Card 3)
    const yocVal = dData.yocVal || 8.12;
    const mktYield = dData.mktYieldVal || 5.91;
    const spread = dData.yocSpread || (Math.round((yocVal - mktYield) * 100) / 100);
    const yocEl = document.getElementById("divYocVal");
    const diffBadge = document.getElementById("divYocDiffBadge");
    const diffVal = document.getElementById("divYocDiffVal");
    const diffIcon = document.getElementById("divYocDiffIcon");
    const yocSub = document.getElementById("divYocSub");

    if (yocEl) yocEl.textContent = `${yocVal}%`;
    if (diffVal) diffVal.textContent = `${spread >= 0 ? '+' : ''}${spread}% vs Mkt`;
    if (diffBadge) diffBadge.style.color = spread >= 0 ? '#10b981' : '#f43f5e';
    if (diffIcon) {
      diffIcon.innerHTML = spread >= 0
        ? '<path d="M7 17l10-10M7 7h10v10"/>'
        : '<path d="M7 7l10 10M17 7v10H7"/>';
    }
    if (yocSub) yocSub.textContent = `Dividend Yield on Cost (${yocVal}%) vs Market Yield (${mktYield}%)`;

    // Render historical payment records table (preserving current filter selection if any)
    const ySel = document.getElementById("divFilterYearSelect");
    const pSel = document.getElementById("divFilterPortSelect");
    const aSel = document.getElementById("divFilterAssetSelect");
    this.renderDividendPaymentHistory(
      ySel ? ySel.value : null,
      pSel ? pSel.value : null,
      aSel ? aSel.value : null
    );
  },

  /**
   * Filter change handler for Dividend Payment History table (Tab 4)
   */
  onDividendHistoryFilterChange() {
    const yearSelect = document.getElementById("divFilterYearSelect");
    const portSelect = document.getElementById("divFilterPortSelect");
    const assetSelect = document.getElementById("divFilterAssetSelect");
    const year = yearSelect ? yearSelect.value : "ALL";
    const port = portSelect ? portSelect.value : "ALL";
    const asset = assetSelect ? assetSelect.value : "ALL";
    this.renderDividendPaymentHistory(year, port, asset);
  },

  /**
   * Render Historical Dividend Payment History table (Tab 4)
   */
  renderDividendPaymentHistory(filterYear = null, filterPort = null, filterAsset = null) {
    const tbody = document.getElementById("divPaymentHistoryBody");
    if (!tbody) return;

    const payments = (currentFinData && currentFinData.dividendPayments && currentFinData.dividendPayments.length > 0)
      ? currentFinData.dividendPayments
      : ((DEFAULT_FIN_DATA && DEFAULT_FIN_DATA.dividendPayments) || []);

    const yearSelect = document.getElementById("divFilterYearSelect");
    const portSelect = document.getElementById("divFilterPortSelect");
    const assetSelect = document.getElementById("divFilterAssetSelect");

    // Populate Year dropdown dynamically from available records
    if (yearSelect && (!yearSelect.dataset.populated || yearSelect.options.length <= 1)) {
      const currentVal = filterYear !== null ? filterYear : (yearSelect.value || "2026");
      const yearSet = new Set();
      payments.forEach(p => {
        if (p.payDate && p.payDate.length >= 4) yearSet.add(p.payDate.slice(0, 4));
        else if (p.xdDate && p.xdDate.length >= 4) yearSet.add(p.xdDate.slice(0, 4));
      });
      ["2026", "2025", "2024", "2023", "2022"].forEach(y => yearSet.add(y));
      const years = Array.from(yearSet).sort((a, b) => b.localeCompare(a));
      yearSelect.innerHTML = `<option value="ALL">ทุกปี (All Years)</option>` +
        years.map(y => `<option value="${y}" ${y === "2026" ? "selected" : ""}>${y}</option>`).join("");
      yearSelect.value = (currentVal && (currentVal === "ALL" || years.includes(currentVal))) ? currentVal : (years.includes("2026") ? "2026" : "ALL");
      yearSelect.dataset.populated = "true";
    }

    // Populate Port dropdown dynamically if needed
    if (portSelect && (!portSelect.dataset.populated || portSelect.options.length <= 1)) {
      const currentVal = filterPort !== null ? filterPort : (portSelect.value || "ALL");
      portSelect.innerHTML = `
        <option value="ALL">ทุกพอร์ต (All Ports)</option>
        <option value="SET">SET (หุ้นไทย)</option>
        <option value="US">US (หุ้นสหรัฐฯ)</option>
        <option value="Insurance">Insurance (ประกันชีวิต)</option>
        <option value="LTF">LTF (กองทุนรวม)</option>
        <option value="ICO">ICO (โทเคน)</option>
      `;
      portSelect.value = currentVal || "ALL";
      portSelect.dataset.populated = "true";
    }

    // Populate Asset dropdown based on selected Port
    const selPortEarly = (filterPort !== null) ? filterPort : (portSelect ? portSelect.value : "ALL");
    if (assetSelect) {
      const currentVal = filterAsset !== null ? filterAsset : (assetSelect.value || "ALL");
      const assetSet = new Set();
      payments.forEach(p => {
        if (!p.ticker) return;
        if (selPortEarly !== "ALL") {
          const m = (p.port || p.market || "").toUpperCase();
          const sp = selPortEarly.toUpperCase();
          const matchPort = (sp === "SET" && m === "SET") ||
            (sp === "US" && m === "US") ||
            ((sp === "INSURANCE" || sp.includes("INS")) && m.includes("INS")) ||
            (sp === "LTF" && m.includes("LTF")) ||
            ((sp === "ICO" || sp === "TOKEN") && (m.includes("ICO") || m.includes("TOKEN"))) ||
            (m === sp);
          if (matchPort) assetSet.add(p.ticker);
        } else {
          assetSet.add(p.ticker);
        }
      });
      const assets = Array.from(assetSet).sort();
      assetSelect.innerHTML = `<option value="ALL">ทุกสินทรัพย์ (All Assets)</option>` +
        assets.map(a => `<option value="${a}">${a}</option>`).join("");
      assetSelect.value = (currentVal && (currentVal === "ALL" || assets.includes(currentVal))) ? currentVal : "ALL";
    }

    const selYear = (filterYear !== null) ? filterYear : (yearSelect ? yearSelect.value : "ALL");
    const selPort = (filterPort !== null) ? filterPort : (portSelect ? portSelect.value : "ALL");
    const selAsset = (filterAsset !== null) ? filterAsset : (assetSelect ? assetSelect.value : "ALL");

    // Apply filtering (Year, Port, Asset)
    let filtered = payments;
    if (selYear !== "ALL") {
      filtered = filtered.filter(p => {
        const pYear = (p.payDate && p.payDate.length >= 4) ? p.payDate.slice(0, 4) : ((p.xdDate && p.xdDate.length >= 4) ? p.xdDate.slice(0, 4) : "");
        return pYear === selYear;
      });
    }

    if (selPort !== "ALL") {
      filtered = filtered.filter(p => {
        const m = (p.port || p.market || "").toUpperCase();
        const sp = selPort.toUpperCase();
        if (sp === "SET") return m === "SET";
        if (sp === "US") return m === "US";
        if (sp === "INSURANCE" || sp.includes("INS")) return m.includes("INS");
        if (sp === "LTF") return m.includes("LTF");
        if (sp === "ICO" || sp === "TOKEN") return m.includes("ICO") || m.includes("TOKEN");
        return m === sp;
      });
    }

    if (selAsset !== "ALL") {
      filtered = filtered.filter(p => p.ticker === selAsset);
    }

    // Calculate totals for filtered items
    let totalGross = 0;
    let totalWht = 0;
    let totalNet = 0;

    filtered.forEach(item => {
      totalGross += Number(item.grossAmount) || 0;
      totalWht += Number(item.wht) || 0;
      totalNet += Number(item.netReceived) || 0;
    });

    // Update Footer Totals
    const footCount = document.getElementById("divFootCount");
    const footAsset = document.getElementById("divFootAssetFilter");
    const footWht = document.getElementById("divFootTotalWht");
    const footNet = document.getElementById("divFootTotalNet");

    if (footCount) footCount.textContent = `${filtered.length} รายการ`;
    if (footAsset) {
      const yearLabel = selYear === "ALL" ? "ทุกปี" : `ปี ${selYear}`;
      const portLabel = selPort === "ALL" ? "ทุกพอร์ต" : selPort;
      const assetLabel = selAsset === "ALL" ? "ทุกสินทรัพย์" : selAsset;
      footAsset.textContent = `${yearLabel} • ${portLabel} • ${assetLabel}`;
    }
    if (footWht) {
      footWht.textContent = `฿ ${totalWht.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (footNet) {
      footNet.textContent = `฿ ${totalNet.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--fg-muted); padding: 32px 16px;">
        <div style="font-size: 24px; margin-bottom: 6px;">🔍</div>
        <div style="font-size: 13px; font-weight: 700; color: var(--fg);">ไม่พบรายการปันผลตามเงื่อนไขที่เลือก</div>
        <div style="font-size: 11.5px; color: var(--fg-muted); margin-top: 4px;">ปี: ${selYear} | พอร์ต: ${selPort} | สินทรัพย์: ${selAsset}</div>
      </td></tr>`;
      return;
    }

    const compNameMap = {
      "ADVANC": "แอดวานซ์ อินโฟร์ เซอร์วิส",
      "BTS": "บีทีเอส กรุ๊ป โฮลดิ้งส์",
      "3BBIF": "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF",
      "INTUCH/GULF": "กัลฟ์ / อินทัช โฮลดิ้งส์",
      "CPF": "เจริญโภคภัณฑ์อาหาร",
      "KTB": "ธนาคารกรุงไทย",
      "MC": "แม็คกรุ๊ป",
      "SCB": "เอสซีบี เอกซ์",
      "TISCO": "ทิสโก้ไฟแนนเชียลกรุ๊ป",
      "JEPQ": "JPMorgan Nasdaq Equity Premium Income ETF",
      "QQQI": "NEOS Nasdaq-100 High Income ETF",
      "GOOGL": "Alphabet Inc.",
      "NVDA": "NVIDIA Corporation",
      "ULTY": "YieldMax Ultra Option Income Strategy ETF",
      "CHUBB Life": "ชับบ์ ไลฟ์ แอสชัวรันซ์",
      "KFLTFDIV": "กองทุนเปิดกรุงศรีหุ้นระยะยาวปันผล",
      "SiriHub-A": "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A",
      "SiriHub-Al": "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A",
      "SiriHub-B": "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B"
    };

    const html = filtered.map(item => {
      const compName = item.companyName || compNameMap[item.ticker] || "";
      const compSpan = compName ? `<span style="font-size: 11.5px; color: var(--fg-muted); font-weight: normal;"> (${compName})</span>` : "";

      // Market badge style
      let pillClass = "pill-em";
      let mktText = item.market || "SET";
      const mktUpper = mktText.toUpperCase();
      if (mktUpper.includes("US")) {
        pillClass = "pill-lav";
        mktText = "US";
      } else if (mktUpper.includes("LTF")) {
        pillClass = "pill-sky";
        mktText = "LTF";
      } else if (mktUpper.includes("INSUR") || mktUpper.includes("INS")) {
        pillClass = "pill-cr";
        mktText = "INSURANCE";
      } else if (mktUpper.includes("TOKEN") || mktUpper.includes("ICO")) {
        pillClass = "pill-amber";
        mktText = "TOKEN";
      } else if (mktUpper.includes("INTEREST")) {
        pillClass = "pill-sky";
        mktText = "INTEREST";
      }

      // Format DPS
      let dpsStr = "-";
      if (item.dps != null && item.dps !== "" && !isNaN(Number(item.dps)) && Number(item.dps) > 0) {
        const dpsNum = Number(item.dps);
        dpsStr = `฿${dpsNum.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
      } else if (typeof item.dps === "string" && item.dps.trim()) {
        dpsStr = item.dps;
      }

      // Format WHT
      const whtNum = Number(item.wht) || 0;
      const whtStr = whtNum > 0
        ? `฿${whtNum.toLocaleString('th-TH', { minimumFractionDigits: whtNum % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`
        : "฿0";

      // Format Net Received
      const netNum = Number(item.netReceived) || 0;
      const netStr = `฿ ${netNum.toLocaleString('th-TH', { minimumFractionDigits: netNum % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`;

      return `
        <tr>
          <td class="num" style="text-align: center;">${item.xdDate || "-"}</td>
          <td class="num" style="text-align: center;">${item.payDate || "-"}</td>
          <td><strong>${item.ticker}</strong>${compSpan}</td>
          <td><span class="pill ${pillClass}">${mktText}</span></td>
          <td class="num" style="text-align: right;">${dpsStr}</td>
          <td class="num" style="text-align: right; color: #f43f5e;">${whtStr}</td>
          <td class="num font-bold" style="color: #10b981; text-align: right;">${netStr}</td>
        </tr>
      `;
    }).join("");

    tbody.innerHTML = html;
  },

  /* =====================================================================
     6. HOLDINGS TABLE (Tab 3 Multi-Asset Portfolio)
     ===================================================================== */
  renderHoldingsTable(filterAsset = "ALL", searchQuery = "") {
    const tbody = document.getElementById("holdingsTbody");
    if (!tbody) return;

    let list = currentFinData.holdings || [];

    if (filterAsset !== "ALL") {
      list = list.filter(h => h.assetClass === filterAsset);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(h => h.ticker.toLowerCase().includes(q) || h.name.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--fg-muted);">ไม่พบรายการสินทรัพย์ที่ตรงกับเงื่อนไข</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(h => {
      const isPositive = h.unrealizedGainTHB >= 0;
      const gainColor = isPositive ? "#10b981" : "#f43f5e";
      const gainSign = isPositive ? "+" : "";

      let badgeClass = "pill-em";
      if (h.assetClass === "US") badgeClass = "pill-lav";
      else if (h.assetClass === "CRYPTO") badgeClass = "pill-sky";
      else if (h.assetClass === "GOLD") badgeClass = "pill-amber";
      else if (h.assetClass === "PVD") badgeClass = "pill-sky";

      return `
        <tr>
          <td>
            <strong>${h.ticker}</strong>
            <div style="font-size: 11px; color: var(--fg-muted);">${h.name}</div>
          </td>
          <td><span class="pill ${badgeClass}">${h.assetClass}</span></td>
          <td class="num">${h.units.toLocaleString()}</td>
          <td class="num">${h.currency === 'USD' ? '$' : '฿'}${h.avgCost.toLocaleString()}</td>
          <td class="num font-bold">${h.currency === 'USD' ? '$' : '฿'}${h.curPrice.toLocaleString()}</td>
          <td class="num font-bold" data-val-thb="${h.marketValueTHB}">${this.formatMoney(h.marketValueTHB)}</td>
          <td class="num" style="color: ${gainColor};">
            ${gainSign}${this.formatMoney(h.unrealizedGainTHB)} (${gainSign}${h.gainPercent}%)
          </td>
          <td class="num font-bold">${h.weight}%</td>
        </tr>
      `;
    }).join("");
  },

  /* =====================================================================
     7. ASSET ALLOCATION 7 GROUPS (Tab 1 Overview)
     ===================================================================== */
  renderAssetAllocation() {
    const container = document.getElementById("assetAllocationList");
    if (!container) return;

    const list = currentFinData.assetAllocation || [];
    container.innerHTML = list.map(a => `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
          <span>${a.icon || "📌"} ${a.name}</span>
          <span class="num font-bold">${a.percent}% (${this.formatMoney(a.value)})</span>
        </div>
        <div style="height: 7px; background: var(--surface-sec); border-radius: 9999px; overflow: hidden;">
          <div style="width: ${Math.min(100, a.percent)}%; height: 100%; background: ${a.color || 'var(--accent)'}; border-radius: 9999px;"></div>
        </div>
      </div>
    `).join("");
  },

  /* =====================================================================
     8. TAB 3 PORTFOLIO STATS (SET vs US structure from sheet Portfolio)
     ===================================================================== */
  renderPortfolioStats() {
    const rawAll = currentFinData.portfolioHistory || [];
    if (!rawAll.length) return;
    const latest = rawAll[rawAll.length - 1];
    if (!latest.assets) return;

    const setMkt = latest.assets.SET?.market || 0;
    const setCost = latest.assets.SET?.cost || 0;
    const usMkt = latest.assets.US?.market || 0;
    const usCost = latest.assets.US?.cost || 0;
    const totalEngines = setMkt + usMkt;

    if (totalEngines > 0) {
      const setPct = Math.round((setMkt / totalEngines) * 1000) / 10;
      const usPct = Math.round((usMkt / totalEngines) * 1000) / 10;

      const barSet = document.getElementById("ratioBarSet");
      if (barSet) {
        barSet.style.width = `${setPct}%`;
        barSet.innerText = `SET ${setPct}% (${this.formatShort(setMkt)})`;
      }
      const barUs = document.getElementById("ratioBarUs");
      if (barUs) {
        barUs.style.width = `${usPct}%`;
        barUs.innerText = `US ${usPct}% (${this.formatShort(usMkt)})`;
      }

      const totalEl = document.getElementById("tab3CoreTotal");
      if (totalEl) {
        totalEl.innerText = `Core Wealth Growth Engines (มูลค่ารวม ${this.formatMoney(totalEngines)} จาก sheet Portfolio)`;
      }

      const usGain = usMkt - usCost;
      const usGainPct = usCost > 0 ? Math.round((usGain / usCost) * 1000) / 10 : 0;
      const setGain = setMkt - setCost;
      const setGainPct = setCost > 0 ? Math.round((setGain / setCost) * 1000) / 10 : 0;

      const elUsGain = document.getElementById("tab3UsGainVal");
      if (elUsGain) {
        const sign = usGain >= 0 ? "+" : "";
        elUsGain.innerText = `${sign}${this.formatMoney(usGain)}`;
        elUsGain.style.color = usGain >= 0 ? "#10b981" : "#f43f5e";
      }
      const elUsPct = document.getElementById("tab3UsGainPct");
      if (elUsPct) {
        const sign = usGainPct >= 0 ? "+" : "";
        elUsPct.innerText = `${sign}${usGainPct}% Return`;
        elUsPct.style.color = usGainPct >= 0 ? "#10b981" : "#f43f5e";
      }

      const elSetGain = document.getElementById("tab3SetGainVal");
      if (elSetGain) {
        const sign = setGain >= 0 ? "+" : "";
        elSetGain.innerText = `${sign}${this.formatMoney(setGain)}`;
        elSetGain.style.color = setGain >= 0 ? "#10b981" : "#f43f5e";
      }
      const elSetPct = document.getElementById("tab3SetGainPct");
      if (elSetPct) {
        const sign = setGainPct >= 0 ? "+" : "";
        elSetPct.innerText = `${sign}${setGainPct}% Return`;
        elSetPct.style.color = setGainPct >= 0 ? "#10b981" : "#f43f5e";
      }
    }
  },

  /* =====================================================================
     6. FREEDOM GOAL & ROADMAP (Forecast SET70_US30-V2: Forecast Total Assess)
     ===================================================================== */
  renderFreedomGoalCard() {
    const netWorth = (currentFinData.historicalRecap?.latestNetWorth) || currentFinData.overview?.netWorth || 7105257;
    const forecastByYear = currentFinData.forecastByYear || {};

    const target2026 = forecastByYear[2026] || 6692381;
    const target2027 = forecastByYear[2027] || 7441418;
    const target2030 = forecastByYear[2030] || 10776867;

    const pct2026 = target2026 > 0 ? (netWorth / target2026) * 100 : 100;
    const pct2026Formatted = pct2026.toFixed(1);

    const goalValEl = document.getElementById("goalTargetVal");
    if (goalValEl) {
      goalValEl.setAttribute("data-val-thb", target2026);
      goalValEl.innerText = this.formatMoney(target2026);
    }

    const diff2026 = netWorth - target2026;
    const diffSign = diff2026 >= 0 ? "+" : "";
    const goalSubEl = document.getElementById("goalSubDesc");
    if (goalSubEl) {
      if (diff2026 >= 0) {
        goalSubEl.innerHTML = `<div>🚀 ปัจจุบัน <strong>${this.formatMoney(netWorth)}</strong> ทะลุเป้าหมายปี 2026 แล้ว</div><div style="margin-top: 3px; font-weight: 700; opacity: 0.9;">(${diffSign}${this.formatMoney(diff2026)} / KPI Pass ✅)</div>`;
      } else {
        goalSubEl.innerHTML = `<div>⏳ ปัจจุบัน <strong>${this.formatMoney(netWorth)}</strong></div><div style="margin-top: 3px; font-weight: 700; opacity: 0.9;">ขาดอีก ${this.formatMoney(Math.abs(diff2026))} สู่เป้าหมายปี 2026</div>`;
      }
    }

    const gaugeBar = document.getElementById("goalGaugeBar");
    const gaugeNum = document.getElementById("goalGaugeNum");
    if (gaugeNum) gaugeNum.innerText = `${pct2026Formatted}%`;
    if (gaugeBar) {
      const circumference = 282.74; // 2 * PI * 45
      const progress = Math.min(100, pct2026);
      const offset = circumference - (progress / 100) * circumference;
      gaugeBar.style.strokeDasharray = `${circumference} ${circumference}`;
      gaugeBar.style.strokeDashoffset = offset;
    }

    const nextValEl = document.getElementById("goalNextMilestoneVal");
    if (nextValEl) {
      nextValEl.setAttribute("data-val-thb", target2027);
      nextValEl.innerText = this.formatShort(target2027);
    }

    const freedomValEl = document.getElementById("goalFreedomVal");
    if (freedomValEl) {
      freedomValEl.setAttribute("data-val-thb", target2030);
      freedomValEl.innerText = this.formatShort(target2030);
    }
  },

  renderRoadmapView() {
    const containerCards = document.getElementById("roadmapMilestoneCards");
    const containerTable = document.getElementById("forecastTableContainer");
    const netWorth = (currentFinData.historicalRecap?.latestNetWorth) || currentFinData.overview?.netWorth || 7105257;
    const roadmap = currentFinData.forecastRoadmap || [];
    const milestones = currentFinData.milestones || [];

    if (containerCards && milestones.length > 0) {
      containerCards.innerHTML = milestones.map(m => {
        const isAchieved = (m.actual && m.actual >= m.target) || (m.year <= 2026 && netWorth >= m.target);
        const borderCol = isAchieved ? "#10b981" : (m.status === "freedom" ? "#a855f7" : (m.status === "ultimate" ? "#f59e0b" : "#6366f1"));
        const pillClass = isAchieved ? "pill pill-em" : (m.status === "freedom" ? "pill pill-indigo" : (m.status === "ultimate" ? "pill pill-amber" : "pill pill-lime-neon"));
        const pct = m.target > 0 ? ((netWorth / m.target) * 100).toFixed(1) : 0;
        const statusBadge = isAchieved ? "Achieved ✅" : `${pct}% ⏳`;

        return `
          <div class="sub-tile ${isAchieved ? 'white-bg' : 'mint-bg'}" style="border-color: ${borderCol}; padding: 14px; position: relative;">
            <div class="tile-hdr" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:700; font-size:12px;">🚩 ${m.title}</span>
              <span class="${pillClass}" style="font-size:10.5px;">${statusBadge}</span>
            </div>
            <div class="tile-val num font-bold" style="font-size:22px; margin-bottom:4px;" data-val-thb="${m.target}">
              ${this.formatMoney(m.target)}
            </div>
            <div style="font-size:11px; color:var(--fg-muted); margin-bottom:6px;">
              ${m.note}
            </div>
            <div style="font-size:10.5px; color:${isAchieved ? '#10b981' : 'var(--fg-sec)'}; font-weight:600;">
              ${isAchieved ? '🎉 บรรลุเป้าหมายตามแผน' : `ต้องการเพิ่มอีก ${this.formatMoney(Math.max(0, m.target - netWorth))}`}
            </div>
          </div>
        `;
      }).join("");
    }

    if (containerTable && roadmap.length > 0) {
      containerTable.innerHTML = `
        <table class="fin-table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); text-align: left; color: var(--fg-muted);">
              <th style="padding: 10px 8px;">ปี (Year)</th>
              <th style="padding: 10px 8px;">อายุ (Age)</th>
              <th style="padding: 10px 8px; text-align: right;">Forecast Total Assess</th>
              <th style="padding: 10px 8px; text-align: right;">Actual Total Assess</th>
              <th style="padding: 10px 8px; text-align: right;">ส่วนต่าง (Gain/Diff)</th>
              <th style="padding: 10px 8px; text-align: center;">KPI Result</th>
              <th style="padding: 10px 8px; text-align: right;">ออม/ลงทุนต่อเดือน</th>
              <th style="padding: 10px 8px; text-align: right;">ปันผล/รายรับเกษียณ</th>
            </tr>
          </thead>
          <tbody>
            ${roadmap.map(r => {
              const isCurrent = r.year === 2026;
              const hasActual = r.actualTotalAssess !== null && r.actualTotalAssess !== undefined;
              const diff = hasActual ? (r.actualTotalAssess - r.forecastTotalAssess) : (isCurrent ? (netWorth - r.forecastTotalAssess) : null);
              const sign = diff !== null && diff >= 0 ? "+" : "";
              const diffClass = diff !== null && diff >= 0 ? "style=\"color:#10b981; font-weight:700;\"" : "style=\"color:#f43f5e; font-weight:700;\"";
              const kpiPill = (r.kpiResult === "Pass" || (isCurrent && diff >= 0)) ? "<span class=\"pill pill-em\">Pass ✅</span>" : (r.kpiResult === "Fail" ? "<span class=\"pill pill-rose\">Fail ⚠️</span>" : "<span class=\"pill pill-muted\">Upcoming ⏳</span>");
              const rowBg = isCurrent ? "background: rgba(226, 246, 121, 0.12); font-weight: 600;" : "";

              return `
                <tr style="border-bottom: 1px solid var(--border); ${rowBg}">
                  <td style="padding: 9px 8px;">
                    <strong>${r.year}</strong> ${isCurrent ? '<span class=\"pill pill-lime-neon\" style=\"margin-left:4px; font-size:9.5px;\">ปีปัจจุบัน</span>' : ''}
                  </td>
                  <td style="padding: 9px 8px;">${r.age} ปี</td>
                  <td class="num font-bold" style="padding: 9px 8px; text-align: right;" data-val-thb="${r.forecastTotalAssess}">
                    ${this.formatMoney(r.forecastTotalAssess)}
                  </td>
                  <td class="num font-bold" style="padding: 9px 8px; text-align: right;" data-val-thb="${hasActual ? r.actualTotalAssess : (isCurrent ? netWorth : 0)}">
                    ${hasActual ? this.formatMoney(r.actualTotalAssess) : (isCurrent ? `${this.formatMoney(netWorth)} (จริง)` : '-')}
                  </td>
                  <td class="num" style="padding: 9px 8px; text-align: right;" ${diffClass}>
                    ${diff !== null ? `${sign}${this.formatMoney(diff)}` : '-'}
                  </td>
                  <td style="padding: 9px 8px; text-align: center;">
                    ${kpiPill}
                  </td>
                  <td class="num" style="padding: 9px 8px; text-align: right;" data-val-thb="${r.monthlySaving}">
                    ${r.monthlySaving > 0 ? this.formatMoney(r.monthlySaving) + '/ด.' : '-'}
                  </td>
                  <td class="num" style="padding: 9px 8px; text-align: right; color:#818cf8; font-weight:600;">
                    ${r.retiredEarnPerMonth > 0 ? this.formatMoney(r.retiredEarnPerMonth) + '/ด.' : (r.retiredDivPerYear > 0 ? this.formatMoney(r.retiredDivPerYear) + '/ปี' : '-')}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }
  },

  /* =====================================================================
     9. CAPSULE BAR COMPARISON: Cash Flow vs Net Expenses (Latest 6 Months)
     Matches finbase-wealth-dashboard-7.html layout using Expenses-Monthly
     ===================================================================== */
  renderCapsuleComparison() {
    const container = document.getElementById("capsuleChart");
    if (!container) return;

    // Get monthly cash flow records (Expenses-Monthly)
    const cfList = currentFinData.monthlyCashFlow || [];
    if (!cfList.length) return;

    // Filter valid months with income or netExpense > 0
    const validMonths = cfList.filter(c => (c.income > 0 || c.netExpense > 0));
    const latest6 = validMonths.slice(-6);
    if (!latest6.length) return;

    // Update period badge
    const badge = document.getElementById("capsulePeriodBadge");
    if (badge && latest6.length > 0) {
      const firstM = latest6[0].label || "";
      const lastM = latest6[latest6.length - 1].label || "";
      badge.innerText = `${firstM.replace(" (สด)", "")} - ${lastM.replace(" (สด)", "")}`;
    }

    // Maximum outer capsule height = 135px (scaled with 175px container)
    const maxBarHeight = 135;
    const maxIncome = Math.max(...latest6.map(c => Math.max(c.income, c.outcome || c.netExpense, 100000)));

    const monthNamesEn = {
      1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
      7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
    };

    container.innerHTML = latest6.map((m, idx) => {
      const isLatest = (idx === latest6.length - 1);
      const inc = m.income || 0;
      // Use raw Outcome (from Expenses-Monthly "Outcome" column), fallback to netExpense. If Outcome is NaN, treat as null.
      const exp = (m.outcome != null && !Number.isNaN(m.outcome)) ? m.outcome : (m.netExpense || 0);

      // Outer capsule height represents Income (Total Inflow)
      const outerH = Math.max(48, Math.min(maxBarHeight, Math.round((inc / maxIncome) * maxBarHeight)));
      // Inner fill height represents Net Living Expenses (Outcome)
      const fillH = inc > 0 ? Math.max(12, Math.min(outerH, Math.round((exp / inc) * outerH))) : Math.max(12, Math.min(outerH, Math.round((exp / maxIncome) * maxBarHeight)));

      // Parse month abbreviation
      let mLabel = "M" + (idx + 1);
      if (m.month) {
        const parts = m.month.split("-");
        const mNum = parseInt(parts[1], 10);
        if (monthNamesEn[mNum]) mLabel = monthNamesEn[mNum];
      } else if (m.label) {
        mLabel = m.label.split(" ")[0];
      }

      const activeClass = isLatest ? " active-capsule" : "";
      const tipText = `${m.label.replace(" (สด)", "")}: รับ ${this.formatShort(inc)} / จ่าย ${this.formatShort(exp)}`;
      const staticTipVal = this.formatShort(inc);

      return `
        <div class="capsule-col${activeClass}" onmouseenter="FinCharts.showCapsuleTip(this, '${tipText}')" onmouseleave="FinCharts.hideCapsuleTip(this)">
          ${isLatest ? `<div class="floating-pill-tooltip" id="capsuleStaticTip" style="display:block; bottom:${outerH + 8}px; left:50%;">${staticTipVal}</div>` : ''}
          <div class="capsule-bar-outer" style="height: ${outerH}px;">
            <div class="capsule-bar-fill" style="height: ${fillH}px;"></div>
          </div>
          <span class="capsule-month-label" style="${isLatest ? 'font-weight:700; color:var(--fg);' : ''}">${mLabel}</span>
        </div>
      `;
    }).join("");

    this.renderTrafficBar();
  },

  showCapsuleTip(col, text) {
    // If hovering on active capsule, hide static tip temporarily
    const staticTip = col.querySelector("#capsuleStaticTip");
    if (staticTip) staticTip.style.display = "none";

    let tip = col.querySelector(".hover-capsule-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "floating-pill-tooltip hover-capsule-tip";
      tip.style.display = "block";
      tip.style.bottom = (col.querySelector(".capsule-bar-outer").offsetHeight + 8) + "px";
      tip.style.left = "50%";
      col.appendChild(tip);
    }
    tip.innerText = text;
  },

  hideCapsuleTip(col) {
    const tip = col.querySelector(".hover-capsule-tip");
    if (tip) tip.remove();

    const staticTip = col.querySelector("#capsuleStaticTip");
    if (staticTip) staticTip.style.display = "block";
  },

  renderTrafficBar() {
    const rawAll = currentFinData.portfolioHistory || [];
    if (!rawAll.length) return;
    const latest = rawAll[rawAll.length - 1];
    const total = latest.market || 7105257;

    const setMkt = latest.assets?.SET?.market || 0;
    const usMkt = latest.assets?.US?.market || 0;
    const cashMkt = latest.assets?.CASH?.market || 0;
    const pvdMkt = latest.assets?.PVD?.market || 0;
    const goldMkt = latest.assets?.GOLD?.market || 0;
    const cryptoMkt = latest.assets?.CRYPTO?.market || 0;
    const insMkt = latest.assets?.INS?.market || 0;
    const otherMkt = pvdMkt + goldMkt + cryptoMkt + insMkt;

    const setPct = Math.round((setMkt / total) * 100);
    const usPct = Math.round((usMkt / total) * 100);
    const cashPct = Math.round((cashMkt / total) * 100);
    const otherPct = Math.max(0, 100 - setPct - usPct - cashPct);

    const seg1 = document.getElementById("trafficSeg1");
    const seg2 = document.getElementById("trafficSeg2");
    const seg3 = document.getElementById("trafficSeg3");
    const seg4 = document.getElementById("trafficSeg4");

    if (seg1) { seg1.style.width = `${setPct}%`; seg1.title = `หุ้นไทย (SET): ${setPct}% (${this.formatShort(setMkt)})`; }
    if (seg2) { seg2.style.width = `${usPct}%`; seg2.title = `หุ้นสหรัฐ (US): ${usPct}% (${this.formatShort(usMkt)})`; }
    if (seg3) { seg3.style.width = `${cashPct}%`; seg3.title = `เงินสด & สภาพคล่อง: ${cashPct}% (${this.formatShort(cashMkt)})`; }
    if (seg4) { seg4.style.width = `${otherPct}%`; seg4.title = `สินทรัพย์อื่นๆ (PVD, Gold, Crypto, Ins): ${otherPct}% (${this.formatShort(otherMkt)})`; }

    const legSet = document.getElementById("trafficLegSet");
    const legUs = document.getElementById("trafficLegUs");
    const legCash = document.getElementById("trafficLegCash");
    const legOther = document.getElementById("trafficLegOther");

    if (legSet) legSet.innerText = `● หุ้นไทย ${setPct}%`;
    if (legUs) legUs.innerText = `● หุ้นสหรัฐ ${usPct}%`;
    if (legCash) legCash.innerText = `● สภาพคล่อง ${cashPct}%`;
    if (legOther) legOther.innerText = `● อื่นๆ ${otherPct}%`;
  }
};

window.onDivToggleComparePrev = function(checked) {
  if (typeof FinCharts !== "undefined" && FinCharts.renderDividendDashboard) {
    FinCharts.renderDividendDashboard();
  }
};
