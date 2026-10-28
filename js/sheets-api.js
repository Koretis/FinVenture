/**
 * FinVenture — Google Sheets GVIZ API Integration Engine
 * Handles client-side real-time synchronization with Google Sheets without any backend server.
 * Connects directly to multi-tab spreadsheet via Google Visualization (GVIZ) API.
 */

const DEFAULT_SHEET_ID = "1pAypdXR1g5vZ2FVs4XHpVghKXpsuRUiA4zxMseMrnfM";

// Ensure local storage only contains config, not mock test expenses
try {
  localStorage.removeItem("finventure_local_expenses");
} catch(e) {}

var SheetsAPI = {
  storageKey: "finventure_sheet_config",

  getConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.sheetId) parsed.sheetId = DEFAULT_SHEET_ID;
        if (parsed.appsScriptUrl === undefined) {
          parsed.appsScriptUrl = localStorage.getItem("finventure_apps_script_url") || "";
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read local storage for sheet config", e);
    }
    return {
      sheetId: DEFAULT_SHEET_ID,
      appsScriptUrl: localStorage.getItem("finventure_apps_script_url") || "",
      autoSync: true,
      lastSyncTime: null,
      syncIntervalMin: 15
    };
  },

  saveConfig(config) {
    try {
      if (config && config.appsScriptUrl !== undefined) {
        localStorage.setItem("finventure_apps_script_url", config.appsScriptUrl);
      }
      localStorage.setItem(this.storageKey, JSON.stringify(config));
    } catch (e) {
      console.warn("Could not save sheet config to local storage", e);
    }
  },

  /**
   * Helper to clean and parse float numbers from formatted sheet strings
   */
  parseNum(val, defaultVal = 0) {
    if (val === null || val === undefined || val === "") return defaultVal;
    if (typeof val === "number") return isNaN(val) ? defaultVal : val;
    let s = val.toString().trim().replace(/,/g, "").replace(/[$฿]/g, "").replace(/%/g, "");
    if (s.startsWith("(") && s.endsWith(")")) {
      s = "-" + s.slice(1, -1);
    }
    const num = parseFloat(s);
    return isNaN(num) ? defaultVal : num;
  },

  /**
   * Helper to parse Google Visualization Date representation or string date
   */
  parseGvizDate(v, f) {
    let year = 2026;
    let month = 9;
    let day = 1;

    if (v) {
      const gvizMatch = v.toString().match(/Date\((\d+),(\d+),(\d+)\)/);
      if (gvizMatch) {
        year = parseInt(gvizMatch[1], 10);
        month = parseInt(gvizMatch[2], 10) + 1; // Google visualization is 0-indexed month
        day = parseInt(gvizMatch[3], 10);
        const ym = `${year}-${month < 10 ? '0' : ''}${month}`;
        return { year, month, day, ym };
      }
    }

    const str = (f || v || "").toString().trim();
    const monthsMap = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    // Match 30-Sep-2026 or 30 Sep 2026 or 30/Sep/2026
    const dmyWordMatch = str.match(/^(\d{1,2})[-/ ]+([a-zA-Z]{3})[-/ ]+(\d{4})/i);
    if (dmyWordMatch) {
      day = parseInt(dmyWordMatch[1], 10);
      const mStr = dmyWordMatch[2].toLowerCase();
      month = monthsMap[mStr] || 9;
      year = parseInt(dmyWordMatch[3], 10);
      const ym = `${year}-${month < 10 ? '0' : ''}${month}`;
      return { year, month, day, ym };
    }

    // Match 30/09/2026 or 30-09-2026
    const dmyNumMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyNumMatch) {
      day = parseInt(dmyNumMatch[1], 10);
      month = parseInt(dmyNumMatch[2], 10);
      year = parseInt(dmyNumMatch[3], 10);
      const ym = `${year}-${month < 10 ? '0' : ''}${month}`;
      return { year, month, day, ym };
    }

    const textMatch = str.match(/([a-zA-Z]{3})[- ]*(\d{4})/i) || str.match(/(\d{4})[- ]*([a-zA-Z]{3})/i);
    if (textMatch) {
      const mStr = (monthsMap[textMatch[1].toLowerCase()] ? textMatch[1] : textMatch[2]).toLowerCase();
      const yStr = textMatch[1].length === 4 ? textMatch[1] : textMatch[2];
      year = parseInt(yStr, 10);
      month = monthsMap[mStr] || 9;
      const ym = `${year}-${month < 10 ? '0' : ''}${month}`;
      return { year, month, day: 1, ym };
    }

    const isoMatch = str.match(/(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10);
      day = isoMatch[3] ? parseInt(isoMatch[3], 10) : 1;
      const ym = `${year}-${month < 10 ? '0' : ''}${month}`;
      return { year, month, day, ym };
    }

    return { year, month, day, ym: `${year}-09` };
  },

  getThaiMonthShort(monthNum) {
    const th = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return th[(monthNum - 1) % 12] || "";
  },

  /**
   * Builds the GVIZ endpoint URL for a given sheet tab.
   * Note: The Google Sheet must have "Anyone with the link can view" enabled.
   */
  buildGvizUrl(sheetId, sheetName) {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&_=${Date.now()}`;
  },

  /**
   * Fetches and parses a single sheet tab using Google Visualization (GVIZ) API.
   */
  async fetchSheet(sheetId, sheetName) {
    const url = this.buildGvizUrl(sheetId, sheetName);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching sheet "${sheetName}"`);
    }

    const text = await response.text();
    // Parse Google's JSONP response: /*O_o*/ google.visualization.Query.setResponse({...});
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!match || !match[1]) {
      throw new Error(`Invalid GVIZ JSONP format received for sheet "${sheetName}"`);
    }

    const data = JSON.parse(match[1]);
    if (data.status === "error") {
      throw new Error(data.errors?.[0]?.message || `Error reading sheet "${sheetName}"`);
    }

    return this.normalizeGvizTable(data.table);
  },

  /**
   * Converts Google Visualization Table object into clean JS Array of Objects.
   */
  normalizeGvizTable(table) {
    if (!table || !table.cols || !table.rows) return [];

    const headers = table.cols.map((col, idx) => (col.label && col.label.trim()) || `col_${idx}`);
    
    return table.rows.map(row => {
      const rowObj = {};
      if (!row.c) return rowObj;

      row.c.forEach((cell, idx) => {
        const key = headers[idx] || `col_${idx}`;
        if (cell && cell.v !== null && cell.v !== undefined) {
          rowObj[key] = cell.v;
          if (cell.f) rowObj[key + "_formatted"] = cell.f;
        } else {
          rowObj[key] = null;
        }
      });
      return rowObj;
    });
  },

  /**
   * Syncs all connected sheets and updates currentFinData in real time.
   */
  async syncAllSheets(sheetId, updateStatusCallback) {
    const targetSheetId = sheetId || DEFAULT_SHEET_ID;

    if (updateStatusCallback) {
      updateStatusCallback({ status: "syncing", message: "Connecting to Google Sheets..." });
    }

    const tabsToFetch = [
      "Portfolio-Lastest",
      "Portfolio",
      "Forecast SET70_US30-V2",
      "Expenses-Monthly",
      "Invest Monthly",
      "Settrade-HIS",
      "USD-Stock",
      "Dividen-Fund",
      "SET DIV",
      "Expense"
    ];


    try {
      const results = {};
      let successCount = 0;
      await Promise.all(
        tabsToFetch.map(async (name) => {
          try {
            const data = await this.fetchSheet(targetSheetId, name);
            results[name] = data;
            if (data && data.length > 0) successCount++;
          } catch (sheetErr) {
            console.warn(`Tab "${name}" could not be loaded:`, sheetErr.message);
            results[name] = [];
          }
        })
      );

      // If key sheets failed to load any data, treat as sync failure (e.g. CORS or offline)
      if (successCount === 0 || (!results["Expenses-Monthly"]?.length && !results["Portfolio"]?.length)) {
        throw new Error("ไม่สามารถเชื่อมต่อ Google Sheets หรือโครงสร้างไฟล์ไม่ถูกต้อง");
      }

      // Merge and update currentFinData
      this.applySyncedData(results);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      currentFinData.meta.lastSyncTime = timeStr;
      currentFinData.meta.isConnected = true;
      currentFinData.meta.sheetId = targetSheetId;

      const config = this.getConfig();
      config.sheetId = targetSheetId;
      config.lastSyncTime = timeStr;
      this.saveConfig(config);

      if (updateStatusCallback) {
        updateStatusCallback({
          status: "success",
          message: `Synced ${timeStr}`,
          timestamp: timeStr
        });
      }

      return { success: true, isDemo: false, timestamp: timeStr };
    } catch (err) {
      console.error("Sync error:", err);
      if (updateStatusCallback) {
        updateStatusCallback({
          status: "error",
          message: "Sync failed (Check sheet sharing)",
          error: err.message
        });
      }
      return { success: false, error: err.message };
    }
  },

  /**
   * Maps parsed Google Sheets table rows into FinVenture state models.
   */
  applySyncedData(sheetResults) {
    // -------------------------------------------------------------------------
    // 0. Forecast SET70_US30-V2: Multi-Year Targets (Forecast Total Assess)
    // -------------------------------------------------------------------------
    const forecastRows = sheetResults["Forecast SET70_US30-V2"] || [];
    const forecastByYear = { ...(currentFinData.forecastByYear || {}) };
    const forecastRoadmap = [];

    forecastRows.forEach(r => {
      const yr = this.parseNum(r["Year"] || r["col_1"]);
      if (yr && yr >= 2020 && yr <= 2050) {
        const ft = this.parseNum(r["Forecast Total Assess"] || r["col_24"]);
        const act = this.parseNum(r["Actual Total Assess"] || r["col_28"]);
        const kpi = r["KPI-result"] || r["col_25"] || (act >= ft ? "Pass" : (act > 0 ? "Fail" : null));
        const age = this.parseNum(r["Age"] || r["col_0"]);
        
        if (ft > 0) {
          forecastByYear[yr] = Math.round(ft);
        }
        forecastRoadmap.push({
          year: yr,
          age: age || (yr - 1979),
          forecastTotalAssess: Math.round(ft),
          actualTotalAssess: act > 0 ? Math.round(act) : null,
          kpiResult: kpi,
          monthlySaving: this.parseNum(r["Saving & Invest"] || r["col_2"]),
          investExcPvd: this.parseNum(r["Invest (exc .pvd)"] || r["col_17"]),
          mktSet: this.parseNum(r["Mkt SET port"] || r["col_8"]),
          usPort: this.parseNum(r["US port"] || r["col_10"]),
          pvdTotal: this.parseNum(r["PVD "] || r["col_22"]),
          divSet: this.parseNum(r["DIV SET"] || r["col_11"]),
          divUs: this.parseNum(r["DIV US"] || r["col_12"]),
          retiredDivPerYear: this.parseNum(r["Retired DIV per Year"] || r["col_13"]),
          retiredEarnPerMonth: this.parseNum(r["Retired Earn per Month"] || r["col_16"])
        });
      }
    });

    if (forecastRoadmap.length > 0) {
      currentFinData.forecastRoadmap = forecastRoadmap;
      currentFinData.forecastByYear = forecastByYear;
    }

    // -------------------------------------------------------------------------
    // 1. Portfolio-Lastest: Executive Net Worth KPI & Asset Allocation (7 Groups)
    // -------------------------------------------------------------------------
    const latestRows = sheetResults["Portfolio-Lastest"] || [];
    if (latestRows.length > 0) {
      let totalMarket = 0;
      let totalCost = 0;
      let totalDividends = 0;
      let cashVal = 0;
      let savingMeVal = 0;

      const assetMap = {
        PVD: { id: "pvd", name: "กองทุนสำรองเลี้ยงชีพ (PVD)", code: "PVD", value: 0, color: "#0284c7", icon: "🏢" },
        SET: { id: "set", name: "หุ้นไทย (SET)", code: "SET", value: 0, color: "#10b981", icon: "🇹🇭" },
        INS: { id: "insurance", name: "ประกันชีวิตสะสมทรัพย์ (Insurance)", code: "INS", value: 0, color: "#ec4899", icon: "🛡️" },
        GOLD: { id: "gold", name: "ทองคำ (Gold - AOM NOW)", code: "GOLD", value: 0, color: "#f59e0b", icon: "🪙" },
        CRYPTO: { id: "crypto", name: "สินทรัพย์ดิจิทัล (Crypto - Bitkub)", code: "CRYPTO", value: 0, color: "#a855f7", icon: "⚡" },
        US: { id: "us", name: "หุ้นสหรัฐ (US - Dime)", code: "US", value: 0, color: "#6366f1", icon: "🇺🇸" },
        CASH: { id: "cash", name: "เงินสด & ฝาก Saving-ME", code: "CASH", value: 0, color: "#38bdf8", icon: "💵" }
      };

      latestRows.forEach(r => {
        const assessType = (r["Assess Type"] || r["col_2"] || "").toString().toLowerCase();
        const name = (r["Name"] || r["col_3"] || "").toString().toLowerCase();
        const val = this.parseNum(r["Value"] || r["col_4"]);
        const cost = this.parseNum(r["Cost (THB)"] || r["col_5"]);
        const div = this.parseNum(r["Dividen (THB)"] || r["col_6"]);

        totalMarket += val;
        totalCost += cost;
        totalDividends += div;

        if (assessType.includes("provident") || name.includes("pvd")) {
          assetMap.PVD.value += val;
        } else if (assessType === "set" || name === "set") {
          assetMap.SET.value += val;
        } else if (assessType.includes("insurance") || name.includes("insurance")) {
          assetMap.INS.value += val;
        } else if (assessType.includes("gold") || name.includes("aom")) {
          assetMap.GOLD.value += val;
        } else if (assessType.includes("crypto") || name.includes("bitkub")) {
          assetMap.CRYPTO.value += val;
        } else if (assessType.includes("us") || name.includes("dime")) {
          assetMap.US.value += val;
        } else if (assessType.includes("cash") || assessType.includes("bank") || name.includes("saving") || name.includes("cash")) {
          assetMap.CASH.value += val;
          if (name.includes("saving") || assessType.includes("bank")) {
            savingMeVal += val;
          } else {
            cashVal += val;
          }
        }
      });

      if (totalMarket > 0) {
        currentFinData.overview.netWorth = Math.round(totalMarket);
        currentFinData.overview.totalCost = Math.round(totalCost);
        const gain = Math.round(totalMarket - totalCost);
        currentFinData.overview.capitalGain = gain;
        currentFinData.overview.capitalGainPercent = totalCost > 0 ? Math.round((gain / totalCost) * 1000) / 10 : 0;
        currentFinData.overview.ytdDividends = Math.round(totalDividends);
        currentFinData.overview.cashAmount = Math.round(cashVal);
        currentFinData.overview.savingMeAmount = Math.round(savingMeVal);
        currentFinData.overview.emergencyFund = Math.round(cashVal + savingMeVal);
        currentFinData.overview.totalCash = Math.round(cashVal);

        // Update Asset Allocation array
        const newAlloc = Object.values(assetMap).map(a => {
          a.value = Math.round(a.value);
          a.percent = Math.round((a.value / totalMarket) * 1000) / 10;
          return a;
        }).sort((a, b) => b.value - a.value);

        currentFinData.assetAllocation = newAlloc;
      }
    }

    // -------------------------------------------------------------------------
    // 2. Portfolio: 45+ Months Historical Growth & True Cost Curve (By Assess Type)
    // -------------------------------------------------------------------------
    const historyRows = sheetResults["Portfolio"] || [];
    if (historyRows.length > 0) {
      const byYm = {};

      historyRows.forEach(r => {
        const dRaw = r["Date"] || r["col_0"];
        const dFmt = r["Date_formatted"] || r["col_0_formatted"];
        const dateObj = this.parseGvizDate(dRaw, dFmt);
        if (!dateObj || !dateObj.ym) return;

        const val = this.parseNum(r["Value"] || r["col_4"] || r["col_5"]);
        const cost = this.parseNum(r["Cost"] || r["Cost (THB)"] || r["col_7"] || r["col_9"]);

        const at = (r["Assess Type"] || r["col_2"] || "").toString().trim().toLowerCase();
        const nm = (r["Name"] || r["col_3"] || "").toString().trim().toLowerCase();

        let cat = "OTHER";
        if (at.includes("provident") || nm.includes("pvd")) cat = "PVD";
        else if (at === "set" || nm === "set") cat = "SET";
        else if (at.includes("insurance") || nm.includes("insurance")) cat = "INS";
        else if (at.includes("gold") || nm.includes("aom")) cat = "GOLD";
        else if (at.includes("crypto") || nm.includes("bitkub") || at.includes("ico")) cat = "CRYPTO";
        else if (at.includes("usd") || nm.includes("dime") || at.includes("etf")) cat = "US";
        else if (at.includes("cash") || at.includes("bank") || nm.includes("saving") || nm.includes("cash")) cat = "CASH";
        else if (at.includes("ltf") || nm.includes("uobsd") || nm.includes("jitta")) cat = "SET";

        if (!byYm[dateObj.ym]) {
          byYm[dateObj.ym] = {
            date: dateObj.ym,
            year: dateObj.year,
            month: dateObj.month,
            label: `${this.getThaiMonthShort(dateObj.month)} ${dateObj.year}`,
            market: 0,
            cost: 0,
            forecast: null,
            assets: {
              PVD: { market: 0, cost: 0 },
              SET: { market: 0, cost: 0 },
              INS: { market: 0, cost: 0 },
              GOLD: { market: 0, cost: 0 },
              CRYPTO: { market: 0, cost: 0 },
              US: { market: 0, cost: 0 },
              CASH: { market: 0, cost: 0 }
            }
          };
        }
        byYm[dateObj.ym].market += val;
        byYm[dateObj.ym].cost += cost;
        if (byYm[dateObj.ym].assets[cat]) {
          byYm[dateObj.ym].assets[cat].market += val;
          byYm[dateObj.ym].assets[cat].cost += cost;
        }
      });

      const sortedYm = Object.keys(byYm).sort();
      if (sortedYm.length > 0) {
        const historyList = sortedYm.map((ym, idx) => {
          const item = byYm[ym];
          item.market = Math.round(item.market);
          item.cost = Math.round(item.cost);
          Object.keys(item.assets).forEach(c => {
            item.assets[c].market = Math.round(item.assets[c].market);
            item.assets[c].cost = Math.round(item.assets[c].cost);
          });
          const yr = item.year;
          const m = item.month;
          const prevYrVal = forecastByYear[yr - 1] || forecastByYear[yr];
          const currYrVal = forecastByYear[yr];
          if (prevYrVal && currYrVal) {
            item.forecast = Math.round(prevYrVal + (m / 12) * (currYrVal - prevYrVal));
          } else {
            item.forecast = Math.round(currYrVal || 0);
          }

          if (idx === sortedYm.length - 1) {
            item.label += " (ปัจจุบัน)";
          }
          return item;
        });

        currentFinData.portfolioHistory = historyList;

        // Calculate Executive Recap Statistics from real Portfolio history
        const len = historyList.length;
        const latest = historyList[len - 1];
        const prev = len >= 2 ? historyList[len - 2] : latest;
        const oneYearAgo = len >= 13 ? historyList[len - 13] : historyList[0];
        const threeYearsAgo = len >= 37 ? historyList[len - 37] : historyList[0];
        const initial = historyList[0];

        const momDiff = latest.market - prev.market;
        const momPercent = prev.market > 0 ? Math.round((momDiff / prev.market) * 1000) / 10 : 0;

        const yoyDiff = latest.market - oneYearAgo.market;
        const yoyPercent = oneYearAgo.market > 0 ? Math.round((yoyDiff / oneYearAgo.market) * 1000) / 10 : 0;

        const threeYearDiff = latest.market - threeYearsAgo.market;
        const threeYearPercent = threeYearsAgo.market > 0 ? Math.round((threeYearDiff / threeYearsAgo.market) * 1000) / 10 : 0;

        const allTimeDiff = latest.market - initial.market;
        const allTimePercent = initial.market > 0 ? Math.round((allTimeDiff / initial.market) * 1000) / 10 : 0;

        const gainAmount = latest.market - latest.cost;
        const gainPercent = latest.cost > 0 ? Math.round((gainAmount / latest.cost) * 1000) / 10 : 0;

        currentFinData.historicalRecap = {
          latestNetWorth: latest.market,
          latestCost: latest.cost,
          latestGain: gainAmount,
          latestGainPercent: gainPercent,
          momDiff: momDiff,
          momPercent: momPercent,
          yoyDiff: yoyDiff,
          yoyPercent: yoyPercent,
          threeYearDiff: threeYearDiff,
          threeYearPercent: threeYearPercent,
          allTimeDiff: allTimeDiff,
          allTimePercent: allTimePercent
        };

        currentFinData.overview.netWorthMoMAmount = momDiff;
        currentFinData.overview.netWorthMoMPercent = momPercent;
      }
    }

    // -------------------------------------------------------------------------
    // 3. Expenses-Monthly & Invest Monthly: 3-Bar Cash Flow & Category Deep Dive
    // -------------------------------------------------------------------------
    const expRows = sheetResults["Expenses-Monthly"] || [];
    const invRows = sheetResults["Invest Monthly"] || [];

    // Build Invest Monthly dictionary keyed by ym
    const invByYm = {};
    invRows.forEach(r => {
      const dRaw = r["Date "] || r["Date"] || r["col_0"];
      const dFmt = r["Date _formatted"] || r["Date_formatted"] || r["col_0_formatted"];
      const d = this.parseGvizDate(dRaw, dFmt);
      if (d && d.ym) {
        invByYm[d.ym] = {
          total: this.parseNum(r["Total invest "] || r["Total invest"] || r["col_14"]),
          salary: this.parseNum(r["Invest from Saraly "] || r["Invest from Saraly"] || r["col_19"]),
          bonus: this.parseNum(r["Invest from Bonus "] || r["col_16"]),
          divReinvest: this.parseNum(r["Invest from DIV/Reinvest "] || r["col_15"])
        };
      }
    });

    if (expRows.length > 0) {
      const cfList = [];
      let latestExpRow = null;

      expRows.forEach(r => {
        const dRaw = r["date"] || r["Date"] || r["col_0"];
        const dFmt = r["date_formatted"] || r["Date_formatted"] || r["col_0_formatted"];
        const d = this.parseGvizDate(dRaw, dFmt);
        if (!d || !d.ym) return;

        const incSalary = this.parseNum(r["Income Salary"] || r["col_4"]);
        const incOther = this.parseNum(r["Others income (Divide)"] || r["col_5"]);
        const income = this.parseNum(r["Income"] || r["col_46"]) || (incSalary + incOther);
        const outcome = this.parseNum(r["Outcome"] || r["Expense"] || r["Expenses"] || r["Net Outcome"] || r["Net Expense"] || r["Outcome (Net)"] || r["col_47"]);
        const pvd = this.parseNum(r["Provident fund6"] || r["col_8"]);
        const ins = this.parseNum(r["Life insurance"] || r["col_42"]);
        const saving = this.parseNum(r["Saving"] || r["col_45"]);
        const fixedCosts = this.parseNum(r["Fixed costs"] || r["col_6"]);
        const varCosts = this.parseNum(r["Variable costs"] || r["col_15"]);

        // Non-retirement expenses (expenses that cease after retirement)
        const tax40 = this.parseNum(r["Tax 40(1)"] || r["Tax 40"] || r["Tax"] || r["col_7"]);
        const welfare = this.parseNum(r["Welfare"] || r["col_9"]);
        const mommy = this.parseNum(r["Mommy"] || r["Mom"] || r["col_10"]);
        const condoLoan = this.parseNum(r["Condo Loan"] || r["Condo"] || r["Loan"] || r["col_11"]);

        if (income <= 0 && outcome <= 0) return; // Skip empty future placeholder months

        // Net Living Expense = raw outcome (since PVD/Insurance are already excluded in the sheet)
        const livingExpense = Math.max(0, outcome);
        // Retirement Living Expense = Outcome without non-retirement commitments (Tax 40, Welfare, Mommy, Condo Loan)
        const retirementLivingExpense = Math.max(0, outcome - tax40 - welfare - mommy - condoLoan);

        const invInfo = invByYm[d.ym];
        const investAmount = invInfo ? invInfo.total : Math.max(0, income - livingExpense);

        cfList.push({
          year: d.year,
          month: d.ym,
          label: `${this.getThaiMonthShort(d.month)} ${d.year.toString().slice(2)}`,
          income: Math.round(income),
          outcome: Math.round(outcome),        // Raw Outcome column value
          netExpense: Math.round(livingExpense),
          retirementExpense: Math.round(retirementLivingExpense),
          invest: Math.round(investAmount),
          pvdExpense: Math.round(pvd),
          insuranceExpense: Math.round(ins),
          rawRow: r
        });

        latestExpRow = r;
      });

      if (cfList.length > 0) {
        currentFinData.monthlyCashFlow = cfList;
        const lastCf = cfList[cfList.length - 1];

        currentFinData.overview.latestIncome = lastCf.income;
        currentFinData.overview.monthlyInflow = lastCf.income;
        currentFinData.overview.latestNetExpense = lastCf.netExpense;
        currentFinData.overview.fixedExpense = Math.round(this.parseNum(latestExpRow["Fixed costs"] || 0) - this.parseNum(latestExpRow["Provident fund6"] || 0));
        currentFinData.overview.variableExpense = Math.round(this.parseNum(latestExpRow["Variable costs"] || 0));

        const investSum = cfList.reduce((acc, c) => acc + c.invest, 0);
        currentFinData.overview.totalInvestYTD = investSum;
        currentFinData.overview.investmentRate = lastCf.income > 0 ? Math.round((lastCf.invest / lastCf.income) * 1000) / 10 : 50;

        // Populate Category Deep Dive from the latest expense breakdown + all rows for yearly avg
        this.updateExpenseCategories(latestExpRow, expRows);
      }
    }

    // -------------------------------------------------------------------------
    // 3b. Expense sheet: Latest individual transactions (for cf-latest list)
    // -------------------------------------------------------------------------
    const expenseRows = sheetResults["Expense"] || [];
    if (expenseRows.length > 0) {
      // Expect columns: Date, Category, Subcategory, Description, Amount, Payment Method, Remark
      const txns = expenseRows
        .map((r, rowIdx) => {
          const dRaw = r["Date"] || r["date"] || r["col_0"];
          const dFmt = r["Date_formatted"] || r["date_formatted"] || r["col_0_formatted"];
          const parsedD = this.parseGvizDate(dRaw, dFmt);
          
          let timestamp = 0;
          if (parsedD) {
            timestamp = new Date(parsedD.year, parsedD.month - 1, parsedD.day || 1).getTime();
          }

          const mainCat = (r["Category"] || r["col_1"] || "").toString().trim();
          const subCat = (r["Subcategory"] || r["col_2"] || "").toString().trim();
          const desc = (r["Description"] || r["Item"] || r["รายการ"] || r["col_3"] || "").toString().trim();
          const amt = this.parseNum(r["Amount"] || r["Expense"] || r["cost"] || r["Cost"] || r["ยอด"] || r["col_4"] || 0);

          const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          let displayDate = dFmt && !dFmt.includes("Date(")
            ? dFmt.trim()
            : (parsedD ? `${parsedD.day < 10 ? '0' : ''}${parsedD.day}-${enMonths[parsedD.month - 1]}-${parsedD.year}` : "");

          return {
            rowIdx,
            timestamp,
            date: displayDate || "",
            category: subCat || mainCat,
            mainCategory: mainCat,
            description: desc || subCat || mainCat || "รายการ",
            amount: amt
          };
        })
        .filter(t => t.amount > 0 && t.timestamp > 0)
        .sort((a, b) => {
          // Sort by date descending (latest first). If dates are identical, latest row in sheet first
          if (b.timestamp !== a.timestamp) {
            return b.timestamp - a.timestamp;
          }
          return b.rowIdx - a.rowIdx;
        });

      // Always use strictly rows from Google Sheet Expense tab
      currentFinData.expenseTransactions = txns;
    } else {
      currentFinData.expenseTransactions = currentFinData.expenseTransactions || [];
    }

    // -------------------------------------------------------------------------
    const settradeRows = sheetResults["Settrade-HIS"] || [];
    const usdRows = sheetResults["USD-Stock"] || [];
    const combinedHoldings = [];

    // Parse latest month SET stocks from Settrade-HIS
    if (settradeRows.length > 0) {
      const latestSetMonth = settradeRows[0]["Month_formatted"] || settradeRows[0]["Month"];
      const latestSetItems = settradeRows.filter(r => 
        (r["Month_formatted"] || r["Month"]) === latestSetMonth &&
        r["Stock"] && r["Stock"] !== "Cash" && !r["Stock"].toString().toLowerCase().includes("total")
      );

      latestSetItems.forEach(r => {
        const ticker = (r["Stock"] || "").toString();
        const units = this.parseNum(r["Volume"]);
        const curPrice = this.parseNum(r["Price"]);
        const mktVal = this.parseNum(r["Mkt Value"]) || (units * curPrice);
        const costVal = this.parseNum(r["Cost"]) || mktVal;
        const gain = mktVal - costVal;
        const gainPct = costVal > 0 ? Math.round((gain / costVal) * 1000) / 10 : 0;

        combinedHoldings.push({
          ticker: ticker,
          name: ticker === "ADVANC" ? "Advanced Info Service" : (ticker === "TISCO" ? "Tisco Financial Group" : (ticker === "KTB" ? "Krung Thai Bank" : (ticker === "MC" ? "MC Group" : (ticker === "SCB" ? "SCB X Public Co." : (ticker.includes("INTUCH") ? "Gulf Energy / Intuch" : ticker))))),
          assetClass: "SET",
          units: units,
          avgCost: units > 0 ? Math.round((costVal / units) * 100) / 100 : curPrice,
          curPrice: curPrice,
          currency: "THB",
          marketValueTHB: Math.round(mktVal),
          unrealizedGainTHB: Math.round(gain),
          gainPercent: gainPct,
          weight: 0,
          divYield: ticker === "TISCO" ? 7.8 : (ticker === "ADVANC" ? 3.6 : (ticker === "KTB" ? 5.8 : (ticker === "MC" ? 7.5 : 4.5)))
        });
      });
    }

    // Parse latest month US stocks from USD-Stock
    if (usdRows.length > 0) {
      const validUsdRows = usdRows.filter(r => r["Month"] && r["Stock"] && r["Stock"] !== "Cash");
      if (validUsdRows.length > 0) {
        // Find latest month with valid data
        let latestUsdMonth = "Aug-2026";
        const hasAug = validUsdRows.some(r => (r["Month_formatted"] || r["Month"]) === "Aug-2026");
        if (!hasAug) {
          const latestMonthRow = validUsdRows[validUsdRows.length - 1];
          latestUsdMonth = latestMonthRow["Month_formatted"] || latestMonthRow["Month"];
        }
        const latestUsItems = validUsdRows.filter(r => (r["Month_formatted"] || r["Month"]) === latestUsdMonth);

        latestUsItems.forEach(r => {
          const ticker = (r["Stock"] || "").toString();
          const units = this.parseNum(r["Volume"]);
          const curPrice = this.parseNum(r["Price (USD)"]);
          const mktUsd = this.parseNum(r["Mkt Value (USD)"]) || (units * curPrice);
          const mktThb = Math.round(mktUsd * currentFinData.meta.usdRate);
          const estCostThb = Math.round(mktThb * 0.85); // Estimated cost based on +17.8% US gain
          const gainThb = mktThb - estCostThb;

          combinedHoldings.push({
            ticker: ticker,
            name: ticker === "QQQI" ? "NEOS Nasdaq-100 High Income" : (ticker === "JEPQ" ? "JPMorgan Nasdaq Equity Premium" : (ticker === "NVDA" ? "NVIDIA Corp." : (ticker === "SMH" ? "VanEck Semiconductor ETF" : (ticker === "QQQM" ? "Invesco NASDAQ 100 ETF" : (ticker === "GOOGL" ? "Alphabet Inc." : (ticker === "TSLA" ? "Tesla Inc." : ticker)))))),
            assetClass: "US",
            units: Math.round(units * 1000) / 1000,
            avgCost: Math.round((curPrice * 0.85) * 100) / 100,
            curPrice: curPrice,
            currency: "USD",
            marketValueTHB: mktThb,
            unrealizedGainTHB: gainThb,
            gainPercent: 17.8,
            weight: 0,
            divYield: (ticker === "QQQI" || ticker === "JEPQ") ? 11.5 : (ticker === "NVDA" ? 0.1 : 0.0)
          });
        });
      }
    }

    // Include Macro Assets (PVD, Gold, Bitkub, Insurance, Saving-ME) from Portfolio-Lastest
    latestRows.forEach(r => {
      const name = (r["Name"] || "").toString();
      const val = this.parseNum(r["Value"]);
      const cost = this.parseNum(r["Cost (THB)"]);
      const gain = val - cost;
      const gainPct = cost > 0 ? Math.round((gain / cost) * 1000) / 10 : 0;

      if (name.includes("PVD")) {
        combinedHoldings.push({
          ticker: "PVD-FUND",
          name: "กองทุนสำรองเลี้ยงชีพ (Provident Fund)",
          assetClass: "PVD",
          units: 1,
          avgCost: Math.round(cost),
          curPrice: Math.round(val),
          currency: "THB",
          marketValueTHB: Math.round(val),
          unrealizedGainTHB: Math.round(gain),
          gainPercent: gainPct,
          weight: 0,
          divYield: 0.0
        });
      } else if (name.includes("AOM") || name.toLowerCase().includes("gold")) {
        combinedHoldings.push({
          ticker: "GOLD-AOM",
          name: "ทองคำแท่ง AOM NOW",
          assetClass: "GOLD",
          units: 1,
          avgCost: Math.round(cost),
          curPrice: Math.round(val),
          currency: "THB",
          marketValueTHB: Math.round(val),
          unrealizedGainTHB: Math.round(gain),
          gainPercent: gainPct,
          weight: 0,
          divYield: 0.0
        });
      } else if (name.includes("Bitkub") || name.toLowerCase().includes("crypto")) {
        combinedHoldings.push({
          ticker: "CRYPTO-BITKUB",
          name: "พอร์ตสินทรัพย์ดิจิทัล Bitkub",
          assetClass: "CRYPTO",
          units: 1,
          avgCost: Math.round(cost),
          curPrice: Math.round(val),
          currency: "THB",
          marketValueTHB: Math.round(val),
          unrealizedGainTHB: Math.round(gain),
          gainPercent: gainPct,
          weight: 0,
          divYield: 0.0
        });
      } else if (name.includes("Insurance")) {
        combinedHoldings.push({
          ticker: "INSURANCE-LIFE",
          name: "ประกันชีวิตสะสมทรัพย์และบำนาญ",
          assetClass: "INS",
          units: 1,
          avgCost: Math.round(cost),
          curPrice: Math.round(val),
          currency: "THB",
          marketValueTHB: Math.round(val),
          unrealizedGainTHB: Math.round(gain),
          gainPercent: gainPct,
          weight: 0,
          divYield: 2.8
        });
      } else if (name.includes("Saving") || name.includes("ME")) {
        combinedHoldings.push({
          ticker: "SAVING-ME",
          name: "เงินฝากดอกเบี้ยสูง ME by TMB",
          assetClass: "CASH",
          units: 1,
          avgCost: Math.round(cost),
          curPrice: Math.round(val),
          currency: "THB",
          marketValueTHB: Math.round(val),
          unrealizedGainTHB: 0,
          gainPercent: 0.0,
          weight: 0,
          divYield: 2.2
        });
      }
    });

    if (combinedHoldings.length > 0) {
      const totalHoldingsVal = combinedHoldings.reduce((sum, h) => sum + h.marketValueTHB, 0);
      combinedHoldings.forEach(h => {
        h.weight = totalHoldingsVal > 0 ? Math.round((h.marketValueTHB / totalHoldingsVal) * 1000) / 10 : 0;
      });
      // Sort by Market Value descending
      combinedHoldings.sort((a, b) => b.marketValueTHB - a.marketValueTHB);
      currentFinData.holdings = combinedHoldings;
    }

    // -------------------------------------------------------------------------
    // 5. Dividen-Fund: Real Historical Dividend Payouts (Tab 4)
    // -------------------------------------------------------------------------
    const divRows = sheetResults["Dividen-Fund"] || [];
    if (divRows.length > 0) {
      const divMatrix = {};
      for (let m = 1; m <= 12; m++) {
        divMatrix[m] = { year2024: 0, year2025: 0, year2026: 0 };
      }

      divRows.forEach(r => {
        const dRaw = r["Dividen fund date"] || r["col_3"];
        const dFmt = r["Dividen fund date_formatted"] || r["col_3_formatted"];
        const d = this.parseGvizDate(dRaw, dFmt);
        if (!d || !d.month) return;

        const yrCell = r["Year"] || r["col_2"];
        const yr = yrCell ? Math.round(this.parseNum(yrCell)) : d.year;
        if (!yr) return;

        const netDiv = this.parseNum(r["Dividen fund net (Baht)"] || r["col_8"]);
        if (divMatrix[d.month]) {
          if (yr === 2024) divMatrix[d.month].year2024 += netDiv;
          else if (yr === 2025) divMatrix[d.month].year2025 += netDiv;
          else if (yr === 2026) divMatrix[d.month].year2026 += netDiv;
        }
      });

      const timeline = [];
      const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      for (let m = 1; m <= 12; m++) {
        timeline.push({
          month: thaiMonths[m - 1],
          year2024: Math.round(divMatrix[m].year2024),
          year2025: Math.round(divMatrix[m].year2025),
          year2026: Math.round(divMatrix[m].year2026)
        });
      }

      currentFinData.dividendMonthlyTimeline = timeline;

      // Build comprehensive dividendAnalytics for reference dashboard dynamically
      const currentYear = new Date().getFullYear();
      const prevYear = currentYear - 1;

      const monthlyThisYear = Array(12).fill(0);
      const monthlyPrevYear = Array(12).fill(0);
      const assetsThisYear = {};
      const assetsPrevYear = {};
      let totalThisYear = 0;
      let totalPrevYear = 0;

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

      const formatIsoDate = (dateObj) => {
        if (!dateObj || !dateObj.year || !dateObj.month) return "";
        const m = String(dateObj.month).padStart(2, '0');
        const d = String(dateObj.day || 1).padStart(2, '0');
        return `${dateObj.year}-${m}-${d}`;
      };

      const parsedPayments = [];

      divRows.forEach((r, rowIdx) => {
        const dRaw = r["Dividen fund date"] || r["col_3"];
        const dFmt = r["Dividen fund date_formatted"] || r["col_3_formatted"];
        const d = this.parseGvizDate(dRaw, dFmt);
        if (!d || !d.month) return;

        const yrCell = r["Year"] || r["col_2"];
        const yr = yrCell ? Math.round(this.parseNum(yrCell)) : d.year;
        if (!yr) return;

        const xdRaw = r["XD date"] || r["col_4"];
        const xdFmt = r["XD date_formatted"] || r["col_4_formatted"];
        const xd = (xdRaw || xdFmt) ? this.parseGvizDate(xdRaw, xdFmt) : d;

        const grossDiv = this.parseNum(r["Dividen fund (Baht)"] || r["col_7"]);
        const netDiv = this.parseNum(r["Dividen fund net (Baht)"] || r["col_8"]);
        const dpsVal = this.parseNum(r["Dividen per unit"] || r["col_6"]);
        const stockName = (r["Stock"] || r["col_1"] || "").toString().trim();
        const assessRaw = (r["Assess Type"] || r["col_0"] || "").toString().trim();

        let portVal = "SET";
        const aLower = assessRaw.toLowerCase();
        if (aLower.includes("us")) portVal = "US";
        else if (aLower.includes("insur")) portVal = "Insurance";
        else if (aLower.includes("ltf")) portVal = "LTF";
        else if (aLower.includes("ico") || aLower.includes("token")) portVal = "ICO";
        else if (assessRaw) portVal = assessRaw;

        if (stockName && (netDiv > 0 || grossDiv > 0)) {
          const payDateStr = formatIsoDate(d);
          const xdDateStr = formatIsoDate(xd) || payDateStr;
          const whtVal = Math.max(0, Math.round((grossDiv - netDiv) * 100) / 100);

          parsedPayments.push({
            xdDate: xdDateStr,
            payDate: payDateStr,
            ticker: stockName,
            companyName: compNameMap[stockName] || "",
            market: portVal,
            port: portVal,
            dps: Math.round(dpsVal * 10000) / 10000,
            grossAmount: Math.round(grossDiv * 100) / 100,
            wht: whtVal,
            netReceived: Math.round(netDiv * 100) / 100,
            _rowIdx: rowIdx
          });
        }

        if (yr === currentYear) {
          monthlyThisYear[d.month - 1] += netDiv;
          totalThisYear += netDiv;
          if (stockName) {
            assetsThisYear[stockName] = (assetsThisYear[stockName] || 0) + netDiv;
          }
        } else if (yr === prevYear) {
          monthlyPrevYear[d.month - 1] += netDiv;
          totalPrevYear += netDiv;
          if (stockName) {
            assetsPrevYear[stockName] = (assetsPrevYear[stockName] || 0) + netDiv;
          }
        }
      });

      if (parsedPayments.length > 0) {
        parsedPayments.sort((a, b) => {
          const da = a.payDate || a.xdDate || "";
          const db = b.payDate || b.xdDate || "";
          if (db !== da) return db.localeCompare(da);
          return b._rowIdx - a._rowIdx;
        });
        currentFinData.dividendPayments = parsedPayments;
      }

      const yearlyGrowth = totalPrevYear > 0 ? ((totalThisYear - totalPrevYear) / totalPrevYear) * 100 : 72.0;

      const streams = Object.keys(assetsThisYear).map(name => {
        const amount = Math.round(assetsThisYear[name]);
        const percent = totalThisYear > 0 ? Math.round((amount / totalThisYear) * 1000) / 10 : 0;
        return { name, amount, percent };
      }).sort((a, b) => b.amount - a.amount);

      const streamsPrevYear = Object.keys(assetsPrevYear).map(name => {
        const amount = Math.round(assetsPrevYear[name]);
        const percent = totalPrevYear > 0 ? Math.round((amount / totalPrevYear) * 1000) / 10 : 0;
        return { name, amount, percent };
      }).sort((a, b) => b.amount - a.amount);

      // SET DIV regular dividend
      const setDivRows = sheetResults["SET DIV"] || [];
      let regularDivTotal = 0;
      setDivRows.forEach(sr => {
        const curDiv = this.parseNum(sr["Current Net DIV"] || sr["col_10"]);
        if (sr["Stock"]) regularDivTotal += curDiv;
      });
      if (regularDivTotal <= 0) regularDivTotal = 119401.23;

      const regularDivGrowth = regularDivTotal > 0 ? Math.round(((totalThisYear - regularDivTotal) / regularDivTotal) * 1000) / 10 : 12.1;

      const monthlyAvgDiv = Math.round(totalThisYear / 12);

      // Compute dynamic average monthly expense for retirement coverage (excluding non-retirement commitments)
      let dynamicMonthlyExpense = 52366;
      if (currentFinData.monthlyCashFlow && currentFinData.monthlyCashFlow.length > 0) {
        // Average across current year's completed months (e.g. 2026), or fallback to latest 12 months
        const thisYearFlows = currentFinData.monthlyCashFlow.filter(cf => cf.year === currentYear && (cf.retirementExpense || cf.netExpense) > 0);
        const validFlows = thisYearFlows.length >= 3 
          ? thisYearFlows 
          : currentFinData.monthlyCashFlow.slice(-12).filter(cf => (cf.retirementExpense || cf.netExpense) > 0);

        if (validFlows.length > 0) {
          const sumRetirementExp = validFlows.reduce((acc, cf) => acc + (cf.retirementExpense != null ? cf.retirementExpense : cf.netExpense), 0);
          dynamicMonthlyExpense = Math.round(sumRetirementExp / validFlows.length);
        }
      }

      const monthlyExpense = dynamicMonthlyExpense;
      const expenseCoveragePct = monthlyExpense > 0 ? Math.round((monthlyAvgDiv / monthlyExpense) * 1000) / 10 : 21.3;

      const divCost = 1647800;
      const divMkt = 2265560;
      const divReturnPct = 37.49;

      const yocVal = divCost > 0 ? Math.round((totalThisYear / divCost) * 10000) / 100 : 8.12;
      const mktYieldVal = divMkt > 0 ? Math.round((totalThisYear / divMkt) * 10000) / 100 : 5.91;
      const yocSpread = Math.round((yocVal - mktYieldVal) * 100) / 100;

      currentFinData.dividendAnalytics = {
        totalThisYear: Math.round(totalThisYear),
        totalPrevYear: Math.round(totalPrevYear),
        total2026: Math.round(totalThisYear), // Backward compatibility alias
        total2025: Math.round(totalPrevYear), // Backward compatibility alias
        yearlyGrowth: Math.round(yearlyGrowth * 10) / 10,
        monthlyThisYear: monthlyThisYear.map(v => Math.round(v)),
        monthlyPrevYear: monthlyPrevYear.map(v => Math.round(v)),
        monthly2026: monthlyThisYear.map(v => Math.round(v)), // Alias
        monthly2025: monthlyPrevYear.map(v => Math.round(v)), // Alias
        streams: streams.length ? streams : (currentFinData.dividendAnalytics ? currentFinData.dividendAnalytics.streams : []),
        streamsPrevYear: streamsPrevYear,
        regularDivTotal: Math.round(regularDivTotal),
        regularDivGrowth: regularDivGrowth,
        monthlyAvgDiv: monthlyAvgDiv,
        monthlyExpense: monthlyExpense,
        expenseCoveragePct: expenseCoveragePct,
        divCost: divCost,
        divMkt: divMkt,
        divReturnPct: divReturnPct,
        yocVal: yocVal,
        mktYieldVal: mktYieldVal,
        yocSpread: yocSpread
      };
    }
  },

  /**
   * Helper to map raw expense row columns into category deep-dive models.
   * @param {Object} r        - Latest expense row (for current-month values)
   * @param {Array}  allRows  - All Expenses-Monthly rows (for yearly avg calculation)
   */
  updateExpenseCategories(r, allRows) {
    if (!r) return;

    const p = (row, ...cols) => {
      if (!row) return 0;
      for (const col of cols) {
        if (row[col] !== undefined && row[col] !== null) {
          const num = this.parseNum(row[col], null);
          if (num !== null) return num;
        }
      }
      return 0;
    };
    const pL = (...cols) => p(r, ...cols); // latest row shorthand

    // ── Determine current year from latest row date ──────────────────────────
    const dRaw = r["date"] || r["Date"] || r["col_0"];
    const dFmt = r["date_formatted"] || r["Date_formatted"] || r["col_0_formatted"];
    const latestDate = this.parseGvizDate(dRaw, dFmt);
    const currentYear = latestDate ? latestDate.year : new Date().getFullYear();

    // ── Filter rows that belong to the current year and have data ────────────
    const yearRows = (allRows || []).filter(row => {
      const rd = this.parseGvizDate(
        row["date"] || row["Date"] || row["col_0"],
        row["date_formatted"] || row["Date_formatted"] || row["col_0_formatted"]
      );
      if (!rd || rd.year !== currentYear) return false;
      // Skip future/empty months (both income and outcome are 0)
      const inc  = p(row, "Income", "col_46");
      const out  = p(row, "Outcome", "col_47");
      return inc > 0 || out > 0;
    });
    const monthCount = yearRows.length || 1;

    // ── Helper: sum a set of columns across all year rows, then get monthly avg ─
    const avgCols = (...cols) => {
      const total = yearRows.reduce((sum, row) => {
        return sum + p(row, ...cols);
      }, 0);
      return Math.round(total / monthCount);
    };

    // ── Helper: find peak month label + amount for given columns ─────────────
    const peakOf = (...cols) => {
      if (!yearRows.length) return "-";
      let best = null;
      yearRows.forEach(row => {
        const rd = this.parseGvizDate(
          row["date"] || row["Date"] || row["col_0"],
          row["date_formatted"] || row["Date_formatted"] || row["col_0_formatted"]
        );
        const val = p(row, ...cols);
        if (!best || val > best.val) {
          best = { val, monthLabel: rd ? this.getThaiMonthShort(rd.month) : "?" };
        }
      });
      if (!best) return "-";
      const formatted = best.val >= 1000
        ? `฿${(best.val / 1000).toFixed(1).replace(/\.0$/, "")}k`
        : `฿${best.val}`;
      return `${best.monthLabel} (${formatted})`;
    };

    // ── Current-month values (from latest row) ───────────────────────────────
    const foodVal    = pL("Food", "col_28") + pL("Convenience store", "col_29");
    const houseVal   = pL("Condo Loan", "col_11") + pL("Decorate Condo", "col_16") + pL("Condo services", "col_17") + pL("MEA", "col_13") + pL("MWA", "col_14") + pL("Internet/Mobile", "col_12");
    const transVal   = pL("Car", "col_33") + pL("Gasoline", "col_23") + pL("Easy Pass", "col_22") + pL("Parking", "col_24") + pL("Taxi", "col_25") + pL("Motorcycle & Bus", "col_26") + pL("Train", "col_27") + pL("Car Insurance", "col_39");
    const gadgetVal  = pL("Computer/Notebook/Tablet", "col_34") + pL("Electronic device", "col_35") + pL("Phone", "col_36") + pL("Camera", "col_37");
    const momVal     = pL("Mommy", "col_10");
    const travelVal  = pL("Travel", "col_31") + pL("Entertainment", "col_30");
    const healthVal  = pL("Health", "col_21") + pL("Sport & Shoe", "col_20");
    const taxVal     = pL("Tax 40(1)", "col_7");

    // ── Yearly averages per category (calculated from real sheet data) ────────
    const foodAvg    = avgCols("Food", "col_28", "Convenience store", "col_29");
    const houseAvg   = avgCols("Condo Loan", "col_11", "Decorate Condo", "col_16", "Condo services", "col_17", "MEA", "col_13", "MWA", "col_14", "Internet/Mobile", "col_12");
    const transAvg   = avgCols("Car", "col_33", "Gasoline", "col_23", "Easy Pass", "col_22", "Parking", "col_24", "Taxi", "col_25", "Motorcycle & Bus", "col_26", "Train", "col_27", "Car Insurance", "col_39");
    const gadgetAvg  = avgCols("Computer/Notebook/Tablet", "col_34", "Electronic device", "col_35", "Phone", "col_36", "Camera", "col_37");
    const momAvg     = avgCols("Mommy", "col_10");
    const travelAvg  = avgCols("Travel", "col_31", "Entertainment", "col_30");
    const healthAvg  = avgCols("Health", "col_21", "Sport & Shoe", "col_20");
    const taxAvg     = avgCols("Tax 40(1)", "col_7");

    const totalTracked = foodVal + houseVal + transVal + gadgetVal + momVal + travelVal + healthVal + taxVal || 1;

    // ── Filter rows that belong to the previous year (currentYear - 1) ───────
    const prevYear = currentYear - 1;
    const prevYearRows = (allRows || []).filter(row => {
      const rd = this.parseGvizDate(
        row["date"] || row["Date"] || row["col_0"],
        row["date_formatted"] || row["Date_formatted"] || row["col_0_formatted"]
      );
      if (!rd || rd.year !== prevYear) return false;
      const inc  = this.parseNum(row["Income"]  || row["col_46"]);
      const out  = this.parseNum(row["Outcome"] || row["col_47"]);
      return inc > 0 || out > 0;
    });

    // ── Monthly history (last N months from yearRows for sparkline) ───────────
    const histOf = (...cols) => yearRows.map(row => cols.reduce((s, col) => s + p(row, col), 0));
    const prevHistOf = (...cols) => prevYearRows.map(row => cols.reduce((s, col) => s + p(row, col), 0));

    currentFinData.expenseCategories = [
      {
        id: "housing",
        name: "1. 🏠 ผ่อนคอนโดและที่พักอาศัย (Housing & Condo)",
        shortName: "ผ่อนคอนโดและที่พักอาศัย",
        latestAmount: Math.round(houseVal),
        yearlyAvg: houseAvg,
        peakMonth: peakOf("Condo Loan", "Decorate Condo", "Condo services", "MEA", "MWA", "Internet/Mobile"),
        sharePercent: Math.round((houseVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "ผ่อนคอนโด",             amount: Math.round(pL("Condo Loan")),      percent: houseVal > 0 ? Math.round((pL("Condo Loan")      / houseVal) * 100) : 80, avgMonthly: avgCols("Condo Loan") },
          { name: "ค่าไฟ (MEA)",            amount: Math.round(pL("MEA")),             percent: houseVal > 0 ? Math.round((pL("MEA")              / houseVal) * 100) : 6,  avgMonthly: avgCols("MEA") },
          { name: "ค่าน้ำ (MWA)",           amount: Math.round(pL("MWA")),             percent: houseVal > 0 ? Math.round((pL("MWA")              / houseVal) * 100) : 2,  avgMonthly: avgCols("MWA") },
          { name: "อินเทอร์เน็ต / มือถือ", amount: Math.round(pL("Internet/Mobile")), percent: houseVal > 0 ? Math.round((pL("Internet/Mobile")  / houseVal) * 100) : 5,  avgMonthly: avgCols("Internet/Mobile") },
          { name: "ตกแต่ง / บริการคอนโด",  amount: Math.round(pL("Decorate Condo") + pL("Condo services")), percent: houseVal > 0 ? Math.round(((pL("Decorate Condo") + pL("Condo services")) / houseVal) * 100) : 7, avgMonthly: avgCols("Decorate Condo", "Condo services") }
        ],
        monthlyHistory: histOf("Condo Loan", "Decorate Condo", "Condo services", "MEA", "MWA", "Internet/Mobile"),
        prevMonthlyHistory: prevHistOf("Condo Loan", "Decorate Condo", "Condo services", "MEA", "MWA", "Internet/Mobile")
      },
      {
        id: "tax",
        name: "2. 📑 ภาษีเงินได้หัก ณ ที่จ่าย (Tax 40(1))",
        shortName: "ภาษีเงินได้",
        latestAmount: Math.round(taxVal),
        yearlyAvg: taxAvg,
        peakMonth: peakOf("Tax 40(1)"),
        sharePercent: Math.round((taxVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "ภาษีเงินได้ ภ.ง.ด. 91", amount: Math.round(taxVal), percent: 100, avgMonthly: taxAvg }
        ],
        monthlyHistory: histOf("Tax 40(1)"),
        prevMonthlyHistory: prevHistOf("Tax 40(1)")
      },
      {
        id: "food",
        name: "3. 🍔 อาหารและของกิน (Food & Convenience)",
        shortName: "อาหารและของกิน",
        latestAmount: Math.round(foodVal),
        yearlyAvg: foodAvg,
        peakMonth: peakOf("Food", "Convenience store"),
        sharePercent: Math.round((foodVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "อาหารประจำวัน",            amount: Math.round(pL("Food")),              percent: foodVal > 0 ? Math.round((pL("Food")              / foodVal) * 100) : 70, avgMonthly: avgCols("Food") },
          { name: "7-Eleven & ร้านสะดวกซื้อ", amount: Math.round(pL("Convenience store")), percent: foodVal > 0 ? Math.round((pL("Convenience store") / foodVal) * 100) : 30, avgMonthly: avgCols("Convenience store") }
        ],
        monthlyHistory: histOf("Food", "Convenience store"),
        prevMonthlyHistory: prevHistOf("Food", "Convenience store")
      },
      {
        id: "travel",
        name: "4. ✈️ ท่องเที่ยวและสันทนาการ (Travel & Leisure)",
        shortName: "ท่องเที่ยวและสันทนาการ",
        latestAmount: Math.round(travelVal),
        yearlyAvg: travelAvg,
        peakMonth: peakOf("Travel", "Entertainment"),
        sharePercent: Math.round((travelVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "ท่องเที่ยวและเดินทางพักผ่อน", amount: Math.round(pL("Travel")),        percent: travelVal > 0 ? Math.round((pL("Travel")        / travelVal) * 100) : 90, avgMonthly: avgCols("Travel") },
          { name: "ความบันเทิงและดูหนัง",        amount: Math.round(pL("Entertainment")), percent: travelVal > 0 ? Math.round((pL("Entertainment")  / travelVal) * 100) : 10, avgMonthly: avgCols("Entertainment") }
        ],
        monthlyHistory: histOf("Travel", "Entertainment"),
        prevMonthlyHistory: prevHistOf("Travel", "Entertainment")
      },
      {
        id: "gadgets",
        name: "5. 💻 อุปกรณ์ไอทีและเทคโนโลยี (Tech & Gadgets)",
        shortName: "อุปกรณ์ไอทีและเทคโนโลยี",
        latestAmount: Math.round(gadgetVal),
        yearlyAvg: gadgetAvg,
        peakMonth: peakOf("Computer/Notebook/Tablet", "Electronic device", "Phone", "Camera"),
        sharePercent: Math.round((gadgetVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "คอมพิวเตอร์ / โน้ตบุ๊ก",           amount: Math.round(pL("Computer/Notebook/Tablet")),           percent: gadgetVal > 0 ? Math.round((pL("Computer/Notebook/Tablet")             / gadgetVal) * 100) : 60, avgMonthly: avgCols("Computer/Notebook/Tablet") },
          { name: "อุปกรณ์อิเล็กทรอนิกส์ / โทรศัพท์", amount: Math.round(pL("Electronic device") + pL("Phone")),   percent: gadgetVal > 0 ? Math.round(((pL("Electronic device") + pL("Phone"))     / gadgetVal) * 100) : 25, avgMonthly: avgCols("Electronic device", "Phone") },
          { name: "กล้องและอุปกรณ์ถ่ายภาพ",            amount: Math.round(pL("Camera")),                            percent: gadgetVal > 0 ? Math.round((pL("Camera")                               / gadgetVal) * 100) : 15, avgMonthly: avgCols("Camera") }
        ],
        monthlyHistory: histOf("Computer/Notebook/Tablet", "Electronic device", "Phone", "Camera"),
        prevMonthlyHistory: prevHistOf("Computer/Notebook/Tablet", "Electronic device", "Phone", "Camera")
      },
      {
        id: "family",
        name: "6. 👨‍👩‍👦 ให้ครอบครัว (Family Support)",
        shortName: "ให้ครอบครัว",
        latestAmount: Math.round(momVal),
        yearlyAvg: momAvg,
        peakMonth: peakOf("Mommy"),
        sharePercent: Math.round((momVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "เงินดูแลคุณแม่", amount: Math.round(momVal), percent: 100, avgMonthly: momAvg }
        ],
        monthlyHistory: histOf("Mommy"),
        prevMonthlyHistory: prevHistOf("Mommy")
      },
      {
        id: "transport",
        name: "7. 🚗 ค่าเดินทางและรถยนต์ (Transport & Car)",
        shortName: "ค่าเดินทางและรถยนต์",
        latestAmount: Math.round(transVal),
        yearlyAvg: transAvg,
        peakMonth: peakOf("Car", "Gasoline", "Easy Pass", "Parking", "Taxi", "Motorcycle & Bus", "Train", "Car Insurance"),
        sharePercent: Math.round((transVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "ค่าใช้จ่ายรถยนต์และน้ำมัน",   amount: Math.round(pL("Car") + pL("Gasoline")),                        percent: transVal > 0 ? Math.round(((pL("Car") + pL("Gasoline"))                        / transVal) * 100) : 55, avgMonthly: avgCols("Car", "Gasoline") },
          { name: "ประกันภัยรถยนต์",               amount: Math.round(pL("Car Insurance")),                               percent: transVal > 0 ? Math.round((pL("Car Insurance")                               / transVal) * 100) : 15, avgMonthly: avgCols("Car Insurance") },
          { name: "ทางด่วน / ที่จอดรถ",            amount: Math.round(pL("Easy Pass") + pL("Parking")),                   percent: transVal > 0 ? Math.round(((pL("Easy Pass") + pL("Parking"))                   / transVal) * 100) : 10, avgMonthly: avgCols("Easy Pass", "Parking") },
          { name: "รถไฟฟ้าและขนส่งสาธารณะ",        amount: Math.round(pL("Train") + pL("Taxi") + pL("Motorcycle & Bus")), percent: transVal > 0 ? Math.round(((pL("Train") + pL("Taxi") + pL("Motorcycle & Bus")) / transVal) * 100) : 20, avgMonthly: avgCols("Train", "Taxi", "Motorcycle & Bus") }
        ],
        monthlyHistory: histOf("Car", "Gasoline", "Easy Pass", "Parking", "Taxi", "Motorcycle & Bus", "Train", "Car Insurance"),
        prevMonthlyHistory: prevHistOf("Car", "Gasoline", "Easy Pass", "Parking", "Taxi", "Motorcycle & Bus", "Train", "Car Insurance")
      },
      {
        id: "health",
        name: "8. 🏃 สุขภาพและกีฬา (Health & Sports)",
        shortName: "สุขภาพและกีฬา",
        latestAmount: Math.round(healthVal),
        yearlyAvg: healthAvg,
        peakMonth: peakOf("Health", "Sport & Shoe"),
        sharePercent: Math.round((healthVal / totalTracked) * 1000) / 10,
        subcategories: [
          { name: "ดูแลสุขภาพและยา",      amount: Math.round(pL("Health")),        percent: healthVal > 0 ? Math.round((pL("Health")        / healthVal) * 100) : 55, avgMonthly: avgCols("Health") },
          { name: "รองเท้าและอุปกรณ์กีฬา", amount: Math.round(pL("Sport & Shoe")), percent: healthVal > 0 ? Math.round((pL("Sport & Shoe") / healthVal) * 100) : 45, avgMonthly: avgCols("Sport & Shoe") }
        ],
        monthlyHistory: histOf("Health", "Sport & Shoe"),
        prevMonthlyHistory: prevHistOf("Health", "Sport & Shoe")
      }
    ];
  },

  /**
   * Save a single transaction to Google Sheet "Expense" (via Apps Script Web App)
   * and persist to local cache.
   */
  /**
   * Save a single transaction to Google Sheet "Expense" (via Apps Script Web App)
   * All displayed records are fetched directly from Google Sheet (Single Source of Truth).
   */
  async saveExpenseRecord(record) {
    // Clean up any stale local expenses
    try {
      localStorage.removeItem('finventure_local_expenses');
    } catch (e) {}

    const config = this.getConfig();
    const appsScriptUrl = config.appsScriptUrl || localStorage.getItem('finventure_apps_script_url');

    if (!appsScriptUrl || !appsScriptUrl.trim().startsWith('http')) {
      return {
        success: false,
        synced: false,
        needConfig: true,
        message: 'กรุณาตั้งค่า Google Apps Script Web App URL ก่อน เพื่อบันทึกข้อมูลเข้า Google Sheet จริง'
      };
    }

    try {
      await fetch(appsScriptUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          sheet: 'Expense',
          date: record.date,
          category: record.category || record.mainCategory || '',
          subcategory: record.subcategory || '',
          description: record.description,
          amount: record.amount,
          paymentMethod: record.paymentMethod || 'Cash',
          remark: record.remark || ''
        })
      });

      // Wait 1.2s then re-sync strictly from Google Sheets to ensure 100% data consistency
      setTimeout(() => {
        if (typeof triggerSync === 'function') {
          triggerSync(true);
        }
      }, 1200);

      return { success: true, synced: true };
    } catch (err) {
      console.warn('Apps Script POST failed:', err);
      return { success: false, synced: false, error: err.message };
    }
  }
};
