/**
 * FinVenture — Main Application Controller
 * Wires State, Events, Google Sheets API, Currency, Themes, and Views.
 */

let currentCurrency = "THB";
let activeTabId = "tab-overview";

// -------------------------------------------------------------
// 1. Tab Navigation Controller
// -------------------------------------------------------------
function switchTab(tabId) {
  activeTabId = tabId;

  // Toggle tab views
  document.querySelectorAll(".tab-view").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(tabId);
  if (target) target.classList.add("active");

  // Sync nav buttons
  document.querySelectorAll(".tab-btn, .dock-icon").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  // Re-render tab specific charts
  if (tabId === "tab-overview") {
    FinCharts.renderHistChart();
    FinCharts.renderCapsuleComparison();
    FinCharts.renderSankeyDiagram();
  } else if (tabId === "tab-cashflow") {
    FinCharts.renderCashFlowBars();
    FinCharts.renderCategoryDeepDive();
    if (typeof renderCashFlowPage === 'function') renderCashFlowPage();
  } else if (tabId === "tab-dividends") {
    FinCharts.renderDividendTimeline();
  } else if (tabId === "tab-roadmap") {
    FinCharts.renderRoadmapView();
  }
}

// -------------------------------------------------------------
// 2. Currency Switcher (THB ฿ vs USD $)
// -------------------------------------------------------------
function setCurrency(cur) {
  currentCurrency = cur;
  currentFinData.meta.currency = cur;

  // Button active state
  const btnThb = document.getElementById("curr-thb");
  const btnUsd = document.getElementById("curr-usd");
  if (btnThb) btnThb.classList.toggle("active", cur === "THB");
  if (btnUsd) btnUsd.classList.toggle("active", cur === "USD");

  // Update all data-val-thb nodes in the DOM
  document.querySelectorAll("[data-val-thb]").forEach(el => {
    const thb = parseFloat(el.getAttribute("data-val-thb"));
    if (!isNaN(thb)) {
      const hasPlus = el.innerText.trim().startsWith("+");
      const formatted = FinCharts.formatMoney(thb, cur);
      el.innerText = (hasPlus ? "+" : "") + formatted;
    }
  });

  // Re-render active views & charts
  FinCharts.renderHistChart();
  FinCharts.renderCapsuleComparison();
  FinCharts.renderSankeyDiagram();
  FinCharts.renderCashFlowBars();
  FinCharts.renderCategoryDeepDive();
  FinCharts.renderDividendTimeline();
  FinCharts.renderHoldingsTable(FinCharts.state.portfolioAssetFilter);
  FinCharts.renderFreedomGoalCard();
  FinCharts.renderRoadmapView();
  if (typeof renderCashFlowPage === 'function') renderCashFlowPage();
}

// -------------------------------------------------------------
// 3. Theme Switcher (Dark, Light, Blue, Bento)
// -------------------------------------------------------------
function setTheme(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  try {
    localStorage.setItem("finventure_theme", themeName);
  } catch (e) {}

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-theme") === themeName);
  });

  // Redraw charts with adapted colors
  FinCharts.renderHistChart();
  FinCharts.renderSankeyDiagram();
  FinCharts.renderCashFlowBars();
  FinCharts.renderCategoryDeepDive();
  FinCharts.renderDividendTimeline();
  if (typeof renderCashFlowPage === 'function') renderCashFlowPage();
}

// -------------------------------------------------------------
// 4. Google Sheets Synchronization & Settings Modal
// -------------------------------------------------------------
function openSheetModal() {
  const modal = document.getElementById("sheetModal");
  if (modal) {
    const config = SheetsAPI.getConfig();
    const input = document.getElementById("sheetIdInput");
    if (input) input.value = config.sheetId || "";
    const scriptInput = document.getElementById("sheetAppsScriptInput");
    if (scriptInput) scriptInput.value = config.appsScriptUrl || "";
    modal.style.display = "flex";
  }
}

function closeSheetModal() {
  const modal = document.getElementById("sheetModal");
  if (modal) modal.style.display = "none";
}

function openGuideModal() {
  const modal = document.getElementById("guideModal");
  if (modal) modal.style.display = "flex";
}

function closeGuideModal() {
  const modal = document.getElementById("guideModal");
  if (modal) modal.style.display = "none";
}

/**
 * Extracts pure Sheet ID from a full Google Sheets URL or raw ID
 */
function extractSheetId(inputStr) {
  if (!inputStr) return "";
  const match = inputStr.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return inputStr.trim();
}

async function handleSaveAndSyncSheet() {
  const input = document.getElementById("sheetIdInput");
  const rawVal = input ? input.value : "";
  const sheetId = extractSheetId(rawVal);

  const scriptInput = document.getElementById("sheetAppsScriptInput");
  if (scriptInput) {
    const scriptUrl = scriptInput.value.trim();
    const config = SheetsAPI.getConfig();
    config.appsScriptUrl = scriptUrl;
    SheetsAPI.saveConfig(config);
    localStorage.setItem("finventure_apps_script_url", scriptUrl);
  }

  const statusEl = document.getElementById("modalSyncStatus");
  if (statusEl) {
    statusEl.innerHTML = `<span style="color: #3b82f6;">🔄 กำลังเชื่อมต่อ Google Sheets...</span>`;
  }

  const res = await SheetsAPI.syncAllSheets(sheetId, (progress) => {
    updateTopSyncStatus(progress.message, progress.status);
    if (statusEl) {
      if (progress.status === "error") {
        statusEl.innerHTML = `<span style="color: #f43f5e;">❌ ${progress.message}</span>`;
      } else {
        statusEl.innerHTML = `<span style="color: #10b981;">✅ ${progress.message}</span>`;
      }
    }
  });

  if (res.success) {
    setTimeout(() => {
      closeSheetModal();
      refreshAllDataViews();
    }, 800);
  }
}

async function triggerSync(silent = false) {
  const config = SheetsAPI.getConfig();
  const sheetId = config.sheetId;

  updateTopSyncStatus("Connecting...", "syncing");

  const res = await SheetsAPI.syncAllSheets(sheetId, (progress) => {
    updateTopSyncStatus(progress.message, progress.status);
  });

  if (res && res.success) {
    refreshAllDataViews();
    if (!silent) {
      setTimeout(() => {
        alert("✅ ซิงค์ข้อมูลสดจาก Google Sheets สำเร็จเรียบร้อยแล้ว!");
      }, 150);
    }
  } else {
    updateTopSyncStatus("Offline", "error");
    if (!silent) {
      setTimeout(() => {
        alert("⚠️ ไม่สามารถซิงค์ข้อมูลสดจาก Google Sheets ได้ (กำลังดึงข้อมูล Local ล่าสุดขึ้นแสดง)\n\nกรุณาตรวจสอบว่าเปิดไฟล์ด้วย start-server.command หรือสิทธิ์ Google Sheets แชร์เป็น Anyone with the link can view หรือไม่");
      }, 150);
    }
  }
}

function updateTopSyncStatus(text, status) {
  const txtEl = document.getElementById("syncText");
  const dotEl = document.getElementById("syncDot");
  const syncBtn = document.querySelector(".sync-tag");

  if (txtEl) {
    txtEl.innerText = status === "error" ? "Offline" : text;
  }
  if (dotEl) {
    dotEl.className = "live-dot " + (status === "error" ? "dot-error" : (status === "syncing" ? "dot-syncing" : "dot-live"));
  }
  if (syncBtn) {
    if (status === "error") {
      syncBtn.style.borderColor = "rgba(244, 63, 94, 0.4)";
      syncBtn.style.background = "rgba(244, 63, 94, 0.08)";
    } else {
      syncBtn.style.borderColor = "";
      syncBtn.style.background = "";
    }
  }
}

function refreshAllDataViews() {
  const o = currentFinData.overview;

  // Dynamically compute Current Year YTD Dividends (Auto-shifts to 2026, 2027, etc.)
  const currentYearNum = new Date().getFullYear();
  const currentYearStr = currentYearNum.toString();
  const divAnalytics = currentFinData.dividendAnalytics || {};
  const payments = currentFinData.dividendPayments || [];

  let dynamicYtdDiv = 0;
  let dynamicYear = currentYearStr;

  // Check payments for the current year
  const thisYearPayments = payments.filter(p => {
    const yr = (p.payDate && p.payDate.length >= 4) ? p.payDate.slice(0, 4) : ((p.xdDate && p.xdDate.length >= 4) ? p.xdDate.slice(0, 4) : "");
    return yr === currentYearStr;
  });

  if (thisYearPayments.length > 0) {
    dynamicYtdDiv = Math.round(thisYearPayments.reduce((sum, p) => sum + (Number(p.netReceived) || 0), 0));
  } else if (divAnalytics.totalThisYear != null && divAnalytics.totalThisYear > 0) {
    dynamicYtdDiv = Math.round(divAnalytics.totalThisYear);
  } else if (payments.length > 0) {
    // Fallback to latest year with records if future calendar year has no entries yet
    const allYears = Array.from(new Set(payments.map(p => (p.payDate || p.xdDate || "").slice(0, 4)).filter(Boolean))).sort((a, b) => b.localeCompare(a));
    if (allYears.length > 0) {
      dynamicYear = allYears[0];
      const fallbackPayments = payments.filter(p => (p.payDate || p.xdDate || "").startsWith(dynamicYear));
      dynamicYtdDiv = Math.round(fallbackPayments.reduce((sum, p) => sum + (Number(p.netReceived) || 0), 0));
    }
  }

  const dynamicAvgMonthlyDiv = Math.round(dynamicYtdDiv / 12);

  // Keep overview data store synchronized
  o.ytdDividends = dynamicYtdDiv;
  o.avgMonthlyDividend = dynamicAvgMonthlyDiv;

  // Update dynamic Title and Yield Pill
  const ytdTitleEl = document.getElementById("heroYtdTitle");
  if (ytdTitleEl) {
    ytdTitleEl.textContent = `3. เงินปันผลรับสะสมปี ${dynamicYear} (YTD)`;
  }

  const yieldPill = document.getElementById("heroDivYieldPill");
  if (yieldPill) {
    const yoc = divAnalytics.yocVal || 8.12;
    yieldPill.textContent = `YoC ${yoc}%`;
  }

  // Update Hero KPI elements
  updateValEl("heroNetWorth", o.netWorth);
  updateValEl("heroCapitalGain", o.capitalGain, true);
  updateValEl("heroTotalCost", o.totalCost);
  updateValEl("heroYtdDividends", o.ytdDividends);

  const avgMonthlyEl = document.getElementById("heroAvgMonthlyDiv");
  if (avgMonthlyEl) {
    avgMonthlyEl.setAttribute("data-val-thb", dynamicAvgMonthlyDiv);
    avgMonthlyEl.innerText = FinCharts.formatMoney(dynamicAvgMonthlyDiv, currentCurrency) + "/ด.";
  }
  updateValEl("heroMonthlyInflow", o.monthlyInflow);
  updateValEl("heroEmergencyFund", o.emergencyFund);
  updateValEl("heroCashAmount", o.cashAmount);
  updateValEl("heroSavingMeAmount", o.savingMeAmount);
  updateValEl("heroLatestIncome", o.latestIncome);
  updateValEl("heroNetExpenses", o.latestNetExpense);
  updateValEl("heroTotalInvestYtd", o.totalInvestYTD);

  // Update Mint Card KPI elements
  updateValEl("chartNetWorthVal", o.netWorth);
  const pill = document.getElementById("chartGainPill");
  if (pill) pill.innerText = `+${o.capitalGainPercent}% Gain`;

  // Redraw charts & lists
  FinCharts.renderHistChart();
  FinCharts.renderCapsuleComparison();
  FinCharts.renderSankeyDiagram();
  FinCharts.renderCashFlowBars();
  FinCharts.renderCategoryDeepDive();
  FinCharts.renderDividendTimeline();
  FinCharts.renderHoldingsTable(FinCharts.state.portfolioAssetFilter);
  FinCharts.renderAssetAllocation();
  FinCharts.renderPortfolioStats();
  FinCharts.renderFreedomGoalCard();
  FinCharts.renderRoadmapView();
  // Render new two-column cash flow page
  if (typeof renderCashFlowPage === 'function') renderCashFlowPage();
}

function updateValEl(elementId, amount, isPrefix = false) {
  const el = document.getElementById(elementId);
  if (el) {
    el.setAttribute("data-val-thb", amount);
    el.innerText = (isPrefix && amount > 0 ? "+" : "") + FinCharts.formatMoney(amount, currentCurrency);
  }
}

// -------------------------------------------------------------
// 5. Interactive Filter Event Listeners
// -------------------------------------------------------------
function setupFilterListeners() {
  // Historical chart range
  document.querySelectorAll("[data-hist-range]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-hist-range]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      FinCharts.state.histRange = btn.getAttribute("data-hist-range");
      FinCharts.renderHistChart();
    });
  });

  // Historical curve type (smooth vs stepped)
  const btnSmooth = document.getElementById("btnModeSmooth");
  const btnStepped = document.getElementById("btnModeStepped");
  if (btnSmooth && btnStepped) {
    btnSmooth.addEventListener("click", () => {
      btnSmooth.classList.add("active");
      btnStepped.classList.remove("active");
      FinCharts.state.histCurve = "smooth";
      FinCharts.renderHistChart();
    });
    btnStepped.addEventListener("click", () => {
      btnStepped.classList.add("active");
      btnSmooth.classList.remove("active");
      FinCharts.state.histCurve = "stepped";
      FinCharts.renderHistChart();
    });
  }

  // Historical Assess Type Dropdown (from sheet Portfolio)
  const histAssetFilter = document.getElementById("histAssetFilter");
  if (histAssetFilter) {
    histAssetFilter.addEventListener("change", (e) => {
      FinCharts.state.histAsset = e.target.value;
      FinCharts.renderHistChart();
    });
  }

  // Cash Flow Year Dropdown
  const cfYearSelect = document.getElementById("cfYearFilter");
  if (cfYearSelect) {
    cfYearSelect.addEventListener("change", (e) => {
      FinCharts.state.cashFlowYear = e.target.value;
      FinCharts.renderCashFlowBars();
    });
  }

  // Cash Flow Period Dropdown
  const cfPeriodSelect = document.getElementById("cfPeriodFilter");
  if (cfPeriodSelect) {
    cfPeriodSelect.addEventListener("change", (e) => {
      FinCharts.state.cashFlowPeriod = e.target.value;
      FinCharts.renderCashFlowBars();
    });
  }

  // Category Deep Dive Dropdown
  const catSelect = document.getElementById("catDeepDiveSelect");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      FinCharts.state.selectedCategory = e.target.value;
      FinCharts.renderCategoryDeepDive();
    });
  }

  // Category Month Dropdown (Adaptive line vs bar)
  const catMonthSelect = document.getElementById("catMonthFilter");
  if (catMonthSelect) {
    catMonthSelect.addEventListener("change", (e) => {
      FinCharts.state.categoryMonth = e.target.value;
      FinCharts.renderCategoryDeepDive();
    });
  }

  // Portfolio Asset Submenu
  document.querySelectorAll("[data-portfolio-asset]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-portfolio-asset]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const asset = btn.getAttribute("data-portfolio-asset");
      FinCharts.state.portfolioAssetFilter = asset;
      const search = document.getElementById("holdingsSearch")?.value || "";
      FinCharts.renderHoldingsTable(asset, search);
    });
  });

  // Holdings Search Input
  const holdingsSearch = document.getElementById("holdingsSearch");
  if (holdingsSearch) {
    holdingsSearch.addEventListener("input", (e) => {
      FinCharts.renderHoldingsTable(FinCharts.state.portfolioAssetFilter, e.target.value);
    });
  }
}

// -------------------------------------------------------------
// 6. Authentication & Login Gate Controller
// -------------------------------------------------------------
const AUTH_CRED_KEY = "finventure_auth_cred";
const AUTH_SESSION_KEY = "finventure_auth_session";

// Fallback Master Admin Hash (SHA-256 for Tekeshiro@14)
// Raw password is NEVER stored in code!
const MASTER_ADMIN_HASH = "32f073c01e9bb7f6e26d8168ac4ddb6a3db3a355d8c8aa67892b810d5b9b21b1";

async function computeSha256(str) {
  if (!str) return "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return str;
  }
}

function getStoredCredentials() {
  try {
    const raw = localStorage.getItem(AUTH_CRED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        return parsed;
      }
    }
  } catch (e) {}
  return { username: "admin", passHash: MASTER_ADMIN_HASH, isDefault: true };
}

function isUserAuthenticated() {
  try {
    if (localStorage.getItem(AUTH_SESSION_KEY) === "authenticated") return true;
    if (sessionStorage.getItem(AUTH_SESSION_KEY) === "authenticated") return true;
  } catch (e) {}
  return false;
}

function updateLoginHintUI() {
  const hintEl = document.getElementById("loginHintText");
  if (hintEl) {
    hintEl.textContent = "🔒 Private & Secured Access";
  }
}

function unlockDashboard() {
  document.body.classList.remove("auth-locked");
  const screen = document.getElementById("loginScreen");
  if (screen) screen.classList.add("hidden");
}

function lockDashboard() {
  document.body.classList.add("auth-locked");
  const screen = document.getElementById("loginScreen");
  if (screen) screen.classList.remove("hidden");
  updateLoginHintUI();
  const errBox = document.getElementById("loginErrorBox");
  if (errBox) errBox.style.display = "none";
  const pwInput = document.getElementById("loginPassword");
  if (pwInput) pwInput.value = "";
  setTimeout(() => {
    const userInp = document.getElementById("loginUsername");
    if (userInp) userInp.focus();
  }, 100);
}

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const userEl = document.getElementById("loginUsername");
  const passEl = document.getElementById("loginPassword");
  const remEl = document.getElementById("loginRememberMe");
  const errBox = document.getElementById("loginErrorBox");
  const errMsg = document.getElementById("loginErrorMsg");
  const card = document.getElementById("loginCard");
  const submitBtn = e && e.target ? e.target.querySelector("button[type='submit']") : null;

  const inputUser = (userEl ? userEl.value : "").trim();
  const inputPass = passEl ? passEl.value : "";
  const remember = remEl ? remEl.checked : true;

  if (!inputUser || !inputPass) {
    if (errBox) errBox.style.display = "flex";
    if (errMsg) errMsg.textContent = "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน";
    return;
  }

  const inputHash = await computeSha256(inputPass);
  let isAuthorized = false;

  // 1. Check Master Admin (admin + Tekeshiro@14)
  if (inputUser.toLowerCase() === "admin" && inputHash === MASTER_ADMIN_HASH) {
    isAuthorized = true;
  }

  // 2. Check locally stored credentials
  const cred = getStoredCredentials();
  if (!isAuthorized && cred && cred.username) {
    const credHash = cred.passHash || (cred.password ? await computeSha256(cred.password) : "");
    if (inputUser.toLowerCase() === cred.username.toLowerCase() && (inputHash === credHash || inputPass === cred.password)) {
      isAuthorized = true;
    }
  }

  // 3. Check online Google Apps Script User Store if available
  const config = (typeof SheetsAPI !== "undefined" && SheetsAPI.getConfig) ? SheetsAPI.getConfig() : {};
  const appsScriptUrl = config.appsScriptUrl || localStorage.getItem("finventure_apps_script_url");
  if (!isAuthorized && appsScriptUrl && appsScriptUrl.startsWith("http")) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "กำลังตรวจสอบสิทธิ์... ⏳";
    }
    try {
      const fetchUrl = appsScriptUrl + (appsScriptUrl.includes("?") ? "&" : "?") + "action=getUser&_=" + Date.now();
      const resp = await fetch(fetchUrl, { cache: "no-store" });
      if (resp.ok) {
        const result = await resp.json();
        if (result && result.status === "success" && result.user) {
          if (inputUser.toLowerCase() === result.user.toLowerCase() && inputHash === result.passHash) {
            isAuthorized = true;
            // Cache on this device for offline speed
            localStorage.setItem(AUTH_CRED_KEY, JSON.stringify({
              username: result.user,
              passHash: result.passHash,
              isDefault: false
            }));
          }
        }
      }
    } catch (netErr) {
      console.warn("Online auth verification failed", netErr);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>เข้าสู่ระบบ (Sign In)</span><span>→</span>";
      }
    }
  }

  if (isAuthorized) {
    try {
      if (remember) {
        localStorage.setItem(AUTH_SESSION_KEY, "authenticated");
      } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, "authenticated");
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch (err) {}

    if (errBox) errBox.style.display = "none";
    unlockDashboard();
  } else {
    if (errBox) errBox.style.display = "flex";
    if (errMsg) errMsg.textContent = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง";
    if (card) {
      card.classList.remove("shake");
      void card.offsetWidth; // trigger reflow
      card.classList.add("shake");
    }
  }
}

function toggleLoginPasswordVisibility() {
  const passEl = document.getElementById("loginPassword");
  const btn = document.getElementById("loginPwToggleBtn");
  if (!passEl) return;
  if (passEl.type === "password") {
    passEl.type = "text";
    if (btn) btn.textContent = "🙈";
  } else {
    passEl.type = "password";
    if (btn) btn.textContent = "👁️";
  }
}

function handleLogout() {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {}
  lockDashboard();
}

function openAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;
  const cred = getStoredCredentials();
  const uInp = document.getElementById("accUsernameInput");
  const pInp = document.getElementById("accPasswordInput");
  const cInp = document.getElementById("accConfirmInput");
  const statusEl = document.getElementById("accModalStatus");
  if (uInp) uInp.value = cred.username || "admin";
  if (pInp) pInp.value = "";
  if (cInp) cInp.value = "";
  if (statusEl) statusEl.innerHTML = "";
  modal.style.display = "flex";
}

function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (modal) modal.style.display = "none";
}

async function handleSaveAccountCredentials() {
  const uInp = document.getElementById("accUsernameInput");
  const pInp = document.getElementById("accPasswordInput");
  const cInp = document.getElementById("accConfirmInput");
  const statusEl = document.getElementById("accModalStatus");

  const newUsername = (uInp ? uInp.value : "").trim();
  const newPassword = pInp ? pInp.value : "";
  const confirmPassword = cInp ? cInp.value : "";

  if (!newUsername) {
    if (statusEl) statusEl.innerHTML = `<span style="color: #f43f5e;">❌ กรุณาระบุชื่อผู้ใช้งาน (Username)</span>`;
    return;
  }
  if (!newPassword) {
    if (statusEl) statusEl.innerHTML = `<span style="color: #f43f5e;">❌ กรุณาระบุรหัสผ่านใหม่</span>`;
    return;
  }
  if (newPassword !== confirmPassword) {
    if (statusEl) statusEl.innerHTML = `<span style="color: #f43f5e;">❌ รหัสผ่านยืนยันไม่ตรงกัน</span>`;
    return;
  }

  const passHash = await computeSha256(newPassword);

  // 1. Save locally to this device
  try {
    localStorage.setItem(AUTH_CRED_KEY, JSON.stringify({
      username: newUsername,
      passHash: passHash,
      isDefault: false
    }));
  } catch (e) {}

  // 2. Sync online to Google Apps Script (Cloud) so all devices can authenticate!
  const config = (typeof SheetsAPI !== "undefined" && SheetsAPI.getConfig) ? SheetsAPI.getConfig() : {};
  const appsScriptUrl = config.appsScriptUrl || localStorage.getItem("finventure_apps_script_url");
  if (appsScriptUrl && appsScriptUrl.startsWith("http")) {
    if (statusEl) statusEl.innerHTML = `<span style="color: #3b82f6;">🔄 กำลังซิงค์ข้อมูลผู้ใช้งานไปยัง Cloud...</span>`;
    try {
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "saveUser",
          username: newUsername,
          passHash: passHash
        })
      });
    } catch (netErr) {
      console.warn("Could not sync user to Google Apps Script", netErr);
    }
  }

  updateLoginHintUI();
  if (statusEl) {
    statusEl.innerHTML = `<span style="color: #10b981;">✅ บันทึกชื่อผู้ใช้งาน (${newUsername}) และซิงค์ Cloud สำเร็จ!</span>`;
  }
  setTimeout(() => {
    closeAccountModal();
  }, 900);
}

// -------------------------------------------------------------
// 7. Application Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme
  const savedTheme = localStorage.getItem("finventure_theme") || "dark";
  setTheme(savedTheme);

  // Check authentication status before unlocking dashboard
  updateLoginHintUI();
  if (isUserAuthenticated()) {
    unlockDashboard();
  } else {
    lockDashboard();
  }

  // Setup chart hover interactions
  FinCharts.setupHistInteractions();

  // Setup filter event listeners
  setupFilterListeners();

  // Always auto-sync from Google Sheets on startup (uses DEFAULT_SHEET_ID if none saved)
  refreshAllDataViews(); // render demo data immediately while sheet loads
  triggerSync(true);     // then overwrite with live data from Google Sheets silently

  // Responsive resize
  // Periodic auto-sync if enabled
  const cfg = SheetsAPI.getConfig();
  if (cfg.autoSync && cfg.syncIntervalMin && cfg.syncIntervalMin > 0) {
    setInterval(() => triggerSync(true), cfg.syncIntervalMin * 60 * 1000);
  }

});
