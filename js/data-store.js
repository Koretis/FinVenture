/**
 * FinVenture — Financial Intelligence Data Store & Schema
 * Default production dataset matching all feature specifications.
 */

const DEFAULT_FIN_DATA = {
  meta: {
    appName: "FinVenture",
    lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    currency: "THB",
    usdRate: 35.5,
    sheetId: "1pAypdXR1g5vZ2FVs4XHpVghKXpsuRUiA4zxMseMrnfM",
    isConnected: true
  },

  // 1. Portfolio Summary (From sheet Portfolio - Oct 2026)
  overview: {
    netWorth: 6961271,
    netWorthMoMAmount: -37797,
    netWorthMoMPercent: -0.5,
    totalCost: 5270554,
    capitalGain: 1690717,
    capitalGainPercent: 32.1,
    ytdDividends: 136201,
    avgMonthlyDividend: 11350,
    projectedAnnualDividend: 450000,
    yieldOnCost: 8.12,
    monthlyInflow: 137906,
    latestIncome: 137906,
    latestNetExpense: 67604,
    fixedExpense: 33114,
    variableExpense: 34489,
    totalInvestYTD: 423500,
    investmentRate: 51.0,
    emergencyFund: 944497,
    emergencyMonths: 14.0,
    cashAmount: 934039,
    savingMeAmount: 10458,
    totalCash: 934039
  },

  // Asset Distribution (7 Groups - From sheet Portfolio Oct 2026)
  assetAllocation: [
    { id: "pvd", name: "กองทุนสำรองเลี้ยงชีพ (PVD)", code: "PVD", value: 2158345, percent: 31.0, color: "#0284c7", icon: "🏢" },
    { id: "set", name: "หุ้นไทย (SET)", code: "SET", value: 2039760, percent: 29.3, color: "#10b981", icon: "🇹🇭" },
    { id: "insurance", name: "ประกันชีวิตสะสมทรัพย์ (Insurance)", code: "INS", value: 991050, percent: 14.2, color: "#ec4899", icon: "🛡️" },
    { id: "cash", name: "เงินสด & ฝาก Saving-ME", code: "CASH", value: 944497, percent: 13.6, color: "#38bdf8", icon: "💵" },
    { id: "us", name: "หุ้นสหรัฐ (US - Dime)", code: "US", value: 420741, percent: 6.0, color: "#6366f1", icon: "🇺🇸" },
    { id: "crypto", name: "สินทรัพย์ดิจิทัล (Crypto - Bitkub)", code: "CRYPTO", value: 406878, percent: 5.8, color: "#a855f7", icon: "⚡" },
    { id: "gold", name: "ทองคำ (Gold - AOM NOW)", code: "GOLD", value: 0, percent: 0.0, color: "#f59e0b", icon: "🪙" }
  ],

  // Historical Weekly/Period Recap Metrics (From sheet Portfolio)
  historicalRecap: {
    latestNetWorth: 6961271,
    latestCost: 5270554,
    latestGain: 1690717,
    latestGainPercent: 32.1,
    momDiff: -37797,
    momPercent: -0.5,
    yoyDiff: 1042673,
    yoyPercent: 17.6,
    threeYearDiff: 2445615,
    threeYearPercent: 54.2,
    allTimeDiff: 2746527,
    allTimePercent: 65.2
  },

  // Portfolio Historical Growth & True Cost (45 Months from sheet Portfolio 2023 - 2026)
  portfolioHistory: [
    {
        "date": "2023-01",
        "label": "ม.ค. 2023",
        "year": 2023,
        "month": 1,
        "cost": 3521087,
        "market": 4214744,
        "forecast": 4068272,
        "assets": {
            "CASH": {
                "market": 268819,
                "cost": 268819
            },
            "PVD": {
                "market": 1338254,
                "cost": 582749
            },
            "CRYPTO": {
                "market": 335033,
                "cost": 490000
            },
            "SET": {
                "market": 1313879,
                "cost": 1328817
            },
            "US": {
                "market": 128061,
                "cost": 20003
            },
            "INS": {
                "market": 830698,
                "cost": 830698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 268819,
                "cost": 268819
            },
            "Mid": {
                "market": 2367968,
                "cost": 1609547
            },
            "High": {
                "market": 1577957,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 94577.16,
                "cost": 94577.16
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 174242.03,
                "cost": 174242.03
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1338253.88,
                "cost": 582749.2
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 232603.02,
                "cost": 240000.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1114862.5,
                "cost": 1132717.45
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 128061.23,
                "cost": 20002.88
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 830698.0,
                "cost": 830698.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 32651.75,
                "cost": 46000.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 80254.16,
                "cost": 80000.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 103.94,
                "cost": 100.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 86006.26,
                "cost": 70000.0
            },
            {
                "ym": "2023-01",
                "date": "Jan-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 102429.77,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-02",
        "label": "ก.พ. 2023",
        "year": 2023,
        "month": 2,
        "cost": 3870197,
        "market": 4566040,
        "forecast": 4116603,
        "assets": {
            "CASH": {
                "market": 604711,
                "cost": 604711
            },
            "PVD": {
                "market": 1352015,
                "cost": 595968
            },
            "CRYPTO": {
                "market": 342395,
                "cost": 490000
            },
            "SET": {
                "market": 1304403,
                "cost": 1328817
            },
            "US": {
                "market": 131818,
                "cost": 20003
            },
            "INS": {
                "market": 830698,
                "cost": 830698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 604711,
                "cost": 604711
            },
            "Mid": {
                "market": 2375317,
                "cost": 1622766
            },
            "High": {
                "market": 1586012,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 400286.48,
                "cost": 400286.48
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 204424.03,
                "cost": 204424.03
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1352014.97,
                "cost": 595968.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 233163.02,
                "cost": 240000.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1111798.75,
                "cost": 1132717.45
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 131817.99,
                "cost": 20002.88
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 830698.0,
                "cost": 830698.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 31850.15,
                "cost": 46000.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 77715.65,
                "cost": 80000.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.01,
                "cost": 100.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 82934.61,
                "cost": 70000.0
            },
            {
                "ym": "2023-02",
                "date": "Feb-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 109232.01,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-03",
        "label": "มี.ค. 2023",
        "year": 2023,
        "month": 3,
        "cost": 3816534,
        "market": 4525902,
        "forecast": 4164935,
        "assets": {
            "CASH": {
                "market": 544300,
                "cost": 544300
            },
            "PVD": {
                "market": 1364991,
                "cost": 602715
            },
            "CRYPTO": {
                "market": 373220,
                "cost": 490000
            },
            "SET": {
                "market": 1283740,
                "cost": 1328817
            },
            "US": {
                "market": 128953,
                "cost": 20003
            },
            "INS": {
                "market": 830698,
                "cost": 830698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 544300,
                "cost": 544300
            },
            "Mid": {
                "market": 2387559,
                "cost": 1629513
            },
            "High": {
                "market": 1594042,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 219876.35,
                "cost": 219876.35
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 324424.03,
                "cost": 324424.03
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1364991.08,
                "cost": 602714.88
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 251683.02,
                "cost": 240000.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1091870.0,
                "cost": 1132717.45
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 128952.59,
                "cost": 20002.88
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 830698.0,
                "cost": 830698.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 31437.56,
                "cost": 46000.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 78074.15,
                "cost": 80000.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.1,
                "cost": 100.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 82254.31,
                "cost": 70000.0
            },
            {
                "ym": "2023-03",
                "date": "Mar-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 121536.78,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-04",
        "label": "เม.ย. 2023",
        "year": 2023,
        "month": 4,
        "cost": 3792112,
        "market": 4510759,
        "forecast": 4213267,
        "assets": {
            "CASH": {
                "market": 513132,
                "cost": 513132
            },
            "PVD": {
                "market": 1367686,
                "cost": 609462
            },
            "CRYPTO": {
                "market": 370035,
                "cost": 490000
            },
            "SET": {
                "market": 1301911,
                "cost": 1328817
            },
            "US": {
                "market": 127297,
                "cost": 20003
            },
            "INS": {
                "market": 830698,
                "cost": 830698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 513132,
                "cost": 513132
            },
            "Mid": {
                "market": 2384190,
                "cost": 1636260
            },
            "High": {
                "market": 1613437,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 163707.78,
                "cost": 163707.78
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 349424.03,
                "cost": 349424.03
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1367685.83,
                "cost": 609461.76
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 243955.35,
                "cost": 240000.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1116105.0,
                "cost": 1132717.45
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 127297.42,
                "cost": 20002.88
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 830698.0,
                "cost": 830698.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 30918.88,
                "cost": 46000.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 76074.62,
                "cost": 80000.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.18,
                "cost": 100.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 78708.51,
                "cost": 70000.0
            },
            {
                "ym": "2023-04",
                "date": "Apr-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 126079.45,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-05",
        "label": "พ.ค. 2023",
        "year": 2023,
        "month": 5,
        "cost": 3915342,
        "market": 4608992,
        "forecast": 4261598,
        "assets": {
            "CASH": {
                "market": 578615,
                "cost": 578615
            },
            "PVD": {
                "market": 1379978,
                "cost": 616209
            },
            "CRYPTO": {
                "market": 364840,
                "cost": 490000
            },
            "SET": {
                "market": 1272237,
                "cost": 1328817
            },
            "US": {
                "market": 131624,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 578615,
                "cost": 578615
            },
            "Mid": {
                "market": 2449004,
                "cost": 1694007
            },
            "High": {
                "market": 1581373,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 199191.41,
                "cost": 199191.41
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 379424.03,
                "cost": 379424.03
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1379977.99,
                "cost": 616208.64
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 243035.35,
                "cost": 240000.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1084908.75,
                "cost": 1132717.45
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 131623.96,
                "cost": 20002.88
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 30494.5,
                "cost": 46000.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 77010.33,
                "cost": 80000.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.3,
                "cost": 100.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 79718.65,
                "cost": 70000.0
            },
            {
                "ym": "2023-05",
                "date": "May-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 121805.01,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-06",
        "label": "มิ.ย. 2023",
        "year": 2023,
        "month": 6,
        "cost": 3936767,
        "market": 4670923,
        "forecast": 4309930,
        "assets": {
            "CASH": {
                "market": 593293,
                "cost": 593293
            },
            "PVD": {
                "market": 1389813,
                "cost": 622956
            },
            "CRYPTO": {
                "market": 376142,
                "cost": 490000
            },
            "SET": {
                "market": 1287580,
                "cost": 1328817
            },
            "US": {
                "market": 142397,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 593293,
                "cost": 593293
            },
            "Mid": {
                "market": 2454481,
                "cost": 1700754
            },
            "High": {
                "market": 1623149,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 211456.49,
                "cost": 211456.49
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 381836.68,
                "cost": 381836.68
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1389813.45,
                "cost": 622955.52
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 252475.35,
                "cost": 240000.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1104610.0,
                "cost": 1132717.45
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 142396.99,
                "cost": 20002.88
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 29760.26,
                "cost": 46000.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 75750.1,
                "cost": 80000.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.42,
                "cost": 100.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 77354.79,
                "cost": 70000.0
            },
            {
                "ym": "2023-06",
                "date": "Jun-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 123666.38,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-07",
        "label": "ก.ค. 2023",
        "year": 2023,
        "month": 7,
        "cost": 3879728,
        "market": 4667861,
        "forecast": 4358262,
        "assets": {
            "CASH": {
                "market": 529507,
                "cost": 529507
            },
            "PVD": {
                "market": 1414795,
                "cost": 629702
            },
            "CRYPTO": {
                "market": 349276,
                "cost": 490000
            },
            "SET": {
                "market": 1346277,
                "cost": 1328817
            },
            "US": {
                "market": 146307,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 529507,
                "cost": 529507
            },
            "Mid": {
                "market": 2483285,
                "cost": 1707500
            },
            "High": {
                "market": 1655068,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 122670.64,
                "cost": 122670.64
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 406836.68,
                "cost": 406836.68
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1414795.29,
                "cost": 629702.4
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 237547.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1159485.0,
                "cost": 1132717.45
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 146307.11,
                "cost": 20002.88
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 30381.67,
                "cost": 46000.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 78724.26,
                "cost": 80000.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.56,
                "cost": 100.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 77581.55,
                "cost": 70000.0
            },
            {
                "ym": "2023-07",
                "date": "Jul-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 111728.57,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-08",
        "label": "ส.ค. 2023",
        "year": 2023,
        "month": 8,
        "cost": 3746398,
        "market": 4499905,
        "forecast": 4406593,
        "assets": {
            "CASH": {
                "market": 389431,
                "cost": 389431
            },
            "PVD": {
                "market": 1437211,
                "cost": 636449
            },
            "CRYPTO": {
                "market": 349454,
                "cost": 490000
            },
            "SET": {
                "market": 1301034,
                "cost": 1328817
            },
            "US": {
                "market": 141078,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 389431,
                "cost": 389431
            },
            "Mid": {
                "market": 2512124,
                "cost": 1714247
            },
            "High": {
                "market": 1598351,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 85594.12,
                "cost": 85594.12
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 303836.68,
                "cost": 303836.68
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1437210.71,
                "cost": 636449.28
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 242827.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1107818.75,
                "cost": 1132717.45
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 141078.29,
                "cost": 20002.88
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 30875.09,
                "cost": 46000.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 79543.18,
                "cost": 80000.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.69,
                "cost": 100.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 82692.04,
                "cost": 70000.0
            },
            {
                "ym": "2023-08",
                "date": "Aug-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 106626.13,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-09",
        "label": "ก.ย. 2023",
        "year": 2023,
        "month": 9,
        "cost": 3777509,
        "market": 4558960,
        "forecast": 4454925,
        "assets": {
            "CASH": {
                "market": 413795,
                "cost": 413795
            },
            "PVD": {
                "market": 1428702,
                "cost": 643196
            },
            "CRYPTO": {
                "market": 365267,
                "cost": 490000
            },
            "SET": {
                "market": 1330084,
                "cost": 1328817
            },
            "US": {
                "market": 139414,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 413795,
                "cost": 413795
            },
            "Mid": {
                "market": 2495465,
                "cost": 1720994
            },
            "High": {
                "market": 1649701,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 64958.18,
                "cost": 64958.18
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 348836.68,
                "cost": 348836.68
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1428702.32,
                "cost": 643196.16
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 253427.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1145019.75,
                "cost": 1132717.45
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 139414.03,
                "cost": 20002.88
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 29206.04,
                "cost": 46000.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 76308.9,
                "cost": 80000.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 104.83,
                "cost": 100.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 79444.47,
                "cost": 70000.0
            },
            {
                "ym": "2023-09",
                "date": "Sep-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 111839.49,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-10",
        "label": "ต.ค. 2023",
        "year": 2023,
        "month": 10,
        "cost": 3799484,
        "market": 4515656,
        "forecast": 4503257,
        "assets": {
            "CASH": {
                "market": 429023,
                "cost": 429023
            },
            "PVD": {
                "market": 1424747,
                "cost": 649943
            },
            "CRYPTO": {
                "market": 365108,
                "cost": 490000
            },
            "SET": {
                "market": 1285176,
                "cost": 1328817
            },
            "US": {
                "market": 129903,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 429023,
                "cost": 429023
            },
            "Mid": {
                "market": 2479126,
                "cost": 1727741
            },
            "High": {
                "market": 1607506,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 65186.42,
                "cost": 65186.42
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 363836.68,
                "cost": 363836.68
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1424747.16,
                "cost": 649943.04
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 238947.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1112495.0,
                "cost": 1132717.45
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 129902.98,
                "cost": 20002.88
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27708.6,
                "cost": 46000.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 70870.91,
                "cost": 80000.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.0,
                "cost": 100.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 73996.58,
                "cost": 70000.0
            },
            {
                "ym": "2023-10",
                "date": "Oct-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 126160.63,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-11",
        "label": "พ.ย. 2023",
        "year": 2023,
        "month": 11,
        "cost": 4018105,
        "market": 4755937,
        "forecast": 4551588,
        "assets": {
            "CASH": {
                "market": 640896,
                "cost": 640896
            },
            "PVD": {
                "market": 1442830,
                "cost": 656690
            },
            "CRYPTO": {
                "market": 376171,
                "cost": 490000
            },
            "SET": {
                "market": 1277010,
                "cost": 1328817
            },
            "US": {
                "market": 137331,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 640896,
                "cost": 640896
            },
            "Mid": {
                "market": 2497815,
                "cost": 1734488
            },
            "High": {
                "market": 1617226,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 316059.57,
                "cost": 316059.57
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 324836.68,
                "cost": 324836.68
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1442830.18,
                "cost": 656689.92
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 237867.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1103723.75,
                "cost": 1132717.45
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 137330.7,
                "cost": 20002.88
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27035.66,
                "cost": 46000.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 71742.2,
                "cost": 80000.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.16,
                "cost": 100.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 74403.39,
                "cost": 70000.0
            },
            {
                "ym": "2023-11",
                "date": "Nov-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 138303.61,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2023-12",
        "label": "ธ.ค. 2023",
        "year": 2023,
        "month": 12,
        "cost": 3875896,
        "market": 4533077,
        "forecast": 4599920,
        "assets": {
            "CASH": {
                "market": 491941,
                "cost": 491941
            },
            "PVD": {
                "market": 1470218,
                "cost": 663437
            },
            "CRYPTO": {
                "market": 411641,
                "cost": 490000
            },
            "SET": {
                "market": 1277579,
                "cost": 1328817
            },
            "US": {
                "market": 0,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 491941,
                "cost": 491941
            },
            "Mid": {
                "market": 2529787,
                "cost": 1741235
            },
            "High": {
                "market": 1511349,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 99885.52,
                "cost": 99885.52
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 392055.36,
                "cost": 392055.36
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1470217.52,
                "cost": 663436.8
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 252827.68,
                "cost": 240000.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1099707.5,
                "cost": 1132717.45
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 0.0,
                "cost": 20002.88
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27757.27,
                "cost": 46000.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 73279.54,
                "cost": 80000.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.32,
                "cost": 100.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 76729.46,
                "cost": 70000.0
            },
            {
                "ym": "2023-12",
                "date": "Dec-2023",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 158813.53,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-01",
        "label": "ม.ค. 2024",
        "year": 2024,
        "month": 1,
        "cost": 3867462,
        "market": 4440810,
        "forecast": 4658951,
        "assets": {
            "CASH": {
                "market": 476760,
                "cost": 476760
            },
            "PVD": {
                "market": 1468462,
                "cost": 670184
            },
            "CRYPTO": {
                "market": 388682,
                "cost": 490000
            },
            "SET": {
                "market": 1225209,
                "cost": 1328817
            },
            "US": {
                "market": 0,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 476760,
                "cost": 476760
            },
            "Mid": {
                "market": 2521895,
                "cost": 1747982
            },
            "High": {
                "market": 1442155,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 84704.53,
                "cost": 84704.53
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 392055.36,
                "cost": 392055.36
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1468461.76,
                "cost": 670183.68
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 240307.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1053473.75,
                "cost": 1132717.45
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 0.0,
                "cost": 20002.88
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26660.63,
                "cost": 46000.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 69890.96,
                "cost": 80000.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.51,
                "cost": 100.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 75078.19,
                "cost": 70000.0
            },
            {
                "ym": "2024-01",
                "date": "Jan-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 148373.92,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-02",
        "label": "ก.พ. 2024",
        "year": 2024,
        "month": 2,
        "cost": 3920387,
        "market": 4519327,
        "forecast": 4717982,
        "assets": {
            "CASH": {
                "market": 522722,
                "cost": 522722
            },
            "PVD": {
                "market": 1491490,
                "cost": 677146
            },
            "CRYPTO": {
                "market": 472704,
                "cost": 490000
            },
            "SET": {
                "market": 1150713,
                "cost": 1328817
            },
            "US": {
                "market": 0,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 522722,
                "cost": 522722
            },
            "Mid": {
                "market": 2547508,
                "cost": 1754944
            },
            "High": {
                "market": 1449097,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 130667.05,
                "cost": 130667.05
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 392055.36,
                "cost": 392055.36
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1491490.15,
                "cost": 677145.88
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 239507.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 976393.75,
                "cost": 1132717.45
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 0.0,
                "cost": 20002.88
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27338.28,
                "cost": 46000.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 71450.94,
                "cost": 80000.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.68,
                "cost": 100.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 75424.52,
                "cost": 70000.0
            },
            {
                "ym": "2024-02",
                "date": "Feb-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 233195.94,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-03",
        "label": "มี.ค. 2024",
        "year": 2024,
        "month": 3,
        "cost": 4019680,
        "market": 4704933,
        "forecast": 4777012,
        "assets": {
            "CASH": {
                "market": 615053,
                "cost": 615053
            },
            "PVD": {
                "market": 1510410,
                "cost": 684108
            },
            "CRYPTO": {
                "market": 519136,
                "cost": 490000
            },
            "SET": {
                "market": 1178635,
                "cost": 1328817
            },
            "US": {
                "market": 0,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 615053,
                "cost": 615053
            },
            "Mid": {
                "market": 2568188,
                "cost": 1761906
            },
            "High": {
                "market": 1521691,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 114797.93,
                "cost": 114797.93
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 500255.36,
                "cost": 500255.36
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1510410.35,
                "cost": 684108.08
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 251827.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1002555.0,
                "cost": 1132717.45
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 0.0,
                "cost": 20002.88
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27674.08,
                "cost": 46000.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 72346.31,
                "cost": 80000.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 105.84,
                "cost": 100.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 75953.64,
                "cost": 70000.0
            },
            {
                "ym": "2024-03",
                "date": "Mar-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 267308.74,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-04",
        "label": "เม.ย. 2024",
        "year": 2024,
        "month": 4,
        "cost": 4113410,
        "market": 4929242,
        "forecast": 4836043,
        "assets": {
            "CASH": {
                "market": 701821,
                "cost": 701821
            },
            "PVD": {
                "market": 1524395,
                "cost": 691070
            },
            "CRYPTO": {
                "market": 468682,
                "cost": 490000
            },
            "SET": {
                "market": 1197445,
                "cost": 1328817
            },
            "US": {
                "market": 155201,
                "cost": 20003
            },
            "INS": {
                "market": 881698,
                "cost": 881698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 701821,
                "cost": 701821
            },
            "Mid": {
                "market": 2581938,
                "cost": 1768868
            },
            "High": {
                "market": 1645483,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 154254.24,
                "cost": 154254.24
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 547566.84,
                "cost": 547566.84
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1524395.42,
                "cost": 691070.28
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 239587.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1021600.0,
                "cost": 1132717.45
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 155201.49,
                "cost": 20002.88
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 881698.0,
                "cost": 881698.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27635.01,
                "cost": 46000.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 72384.17,
                "cost": 80000.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.01,
                "cost": 100.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 75719.32,
                "cost": 70000.0
            },
            {
                "ym": "2024-04",
                "date": "Apr-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 229094.1,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-05",
        "label": "พ.ค. 2024",
        "year": 2024,
        "month": 5,
        "cost": 4172219,
        "market": 4984623,
        "forecast": 4895074,
        "assets": {
            "CASH": {
                "market": 702668,
                "cost": 702668
            },
            "PVD": {
                "market": 1535119,
                "cost": 698032
            },
            "CRYPTO": {
                "market": 500208,
                "cost": 490000
            },
            "SET": {
                "market": 1158959,
                "cost": 1328817
            },
            "US": {
                "market": 154971,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 702668,
                "cost": 702668
            },
            "Mid": {
                "market": 2642724,
                "cost": 1826830
            },
            "High": {
                "market": 1639230,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 155101.31,
                "cost": 155101.31
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 547566.84,
                "cost": 547566.84
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1535118.51,
                "cost": 698032.48
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 239587.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 984051.25,
                "cost": 1132717.45
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 154971.27,
                "cost": 20002.88
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27414.4,
                "cost": 46000.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 71001.49,
                "cost": 80000.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.14,
                "cost": 100.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 76385.88,
                "cost": 70000.0
            },
            {
                "ym": "2024-05",
                "date": "May-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 260620.16,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-06",
        "label": "มิ.ย. 2024",
        "year": 2024,
        "month": 6,
        "cost": 4142275,
        "market": 4943163,
        "forecast": 4954105,
        "assets": {
            "CASH": {
                "market": 665762,
                "cost": 665762
            },
            "PVD": {
                "market": 1541627,
                "cost": 704995
            },
            "CRYPTO": {
                "market": 492526,
                "cost": 490000
            },
            "SET": {
                "market": 1153674,
                "cost": 1328817
            },
            "US": {
                "market": 156876,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 665762,
                "cost": 665762
            },
            "Mid": {
                "market": 2640952,
                "cost": 1833793
            },
            "High": {
                "market": 1636449,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 95053.93,
                "cost": 95053.93
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 570707.96,
                "cost": 570707.96
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1541627.28,
                "cost": 704994.68
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 252427.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 987047.5,
                "cost": 1132717.45
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 156876.17,
                "cost": 20002.88
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26200.21,
                "cost": 46000.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 69039.48,
                "cost": 80000.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.35,
                "cost": 100.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 71280.2,
                "cost": 70000.0
            },
            {
                "ym": "2024-06",
                "date": "Jun-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 240097.85,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-07",
        "label": "ก.ค. 2024",
        "year": 2024,
        "month": 7,
        "cost": 4175931,
        "market": 5043818,
        "forecast": 5013136,
        "assets": {
            "CASH": {
                "market": 692455,
                "cost": 692455
            },
            "PVD": {
                "market": 1570123,
                "cost": 711957
            },
            "CRYPTO": {
                "market": 478670,
                "cost": 490000
            },
            "SET": {
                "market": 1214609,
                "cost": 1328817
            },
            "US": {
                "market": 155262,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 692455,
                "cost": 692455
            },
            "Mid": {
                "market": 2669314,
                "cost": 1840755
            },
            "High": {
                "market": 1682048,
                "cost": 1642720
            }
        },
        "items": [
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 99155.02,
                "cost": 99155.02
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 593300.29,
                "cost": 593300.29
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1570123.38,
                "cost": 711956.88
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 248507.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1048116.25,
                "cost": 1132717.45
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 155261.8,
                "cost": 20002.88
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26267.57,
                "cost": 46000.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 70886.48,
                "cost": 80000.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.57,
                "cost": 100.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 69232.43,
                "cost": 70000.0
            },
            {
                "ym": "2024-07",
                "date": "Jul-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 230162.35,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-08",
        "label": "ส.ค. 2024",
        "year": 2024,
        "month": 8,
        "cost": 4186384,
        "market": 5037391,
        "forecast": 5072167,
        "assets": {
            "CASH": {
                "market": 699898,
                "cost": 699898
            },
            "PVD": {
                "market": 1597486,
                "cost": 718919
            },
            "CRYPTO": {
                "market": 412648,
                "cost": 490000
            },
            "SET": {
                "market": 1244256,
                "cost": 1324865
            },
            "US": {
                "market": 150404,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 699898,
                "cost": 699898
            },
            "Mid": {
                "market": 2697343,
                "cost": 1847717
            },
            "High": {
                "market": 1640149,
                "cost": 1638768
            }
        },
        "items": [
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 306598.2,
                "cost": 306598.2
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 393300.29,
                "cost": 393300.29
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1597486.21,
                "cost": 718919.08
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 225667.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1077096.7,
                "cost": 1128765.45
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 150404.36,
                "cost": 20002.88
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26865.4,
                "cost": 46000.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 72211.83,
                "cost": 80000.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.78,
                "cost": 100.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 67974.91,
                "cost": 70000.0
            },
            {
                "ym": "2024-08",
                "date": "Aug-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 186980.18,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-09",
        "label": "ก.ย. 2024",
        "year": 2024,
        "month": 9,
        "cost": 4194188,
        "market": 5186526,
        "forecast": 5131198,
        "assets": {
            "CASH": {
                "market": 444953,
                "cost": 444953
            },
            "PVD": {
                "market": 1646310,
                "cost": 725881
            },
            "CRYPTO": {
                "market": 449208,
                "cost": 490000
            },
            "SET": {
                "market": 1564148,
                "cost": 1580654
            },
            "US": {
                "market": 149210,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 444953,
                "cost": 444953
            },
            "Mid": {
                "market": 2758808,
                "cost": 1854679
            },
            "High": {
                "market": 1982766,
                "cost": 1894556
            }
        },
        "items": [
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 165791.33,
                "cost": 165791.33
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 279161.29,
                "cost": 279161.29
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1646309.84,
                "cost": 725881.28
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 261067.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1384348.61,
                "cost": 1384553.56
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 149209.9,
                "cost": 20002.88
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 28955.29,
                "cost": 46000.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 76949.1,
                "cost": 80000.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 106.97,
                "cost": 100.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 73788.37,
                "cost": 70000.0
            },
            {
                "ym": "2024-09",
                "date": "Sep-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 188139.92,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-10",
        "label": "ต.ค. 2024",
        "year": 2024,
        "month": 10,
        "cost": 4182957,
        "market": 5207011,
        "forecast": 5190228,
        "assets": {
            "CASH": {
                "market": 426759,
                "cost": 426759
            },
            "PVD": {
                "market": 1666084,
                "cost": 732843
            },
            "CRYPTO": {
                "market": 419921,
                "cost": 490000
            },
            "SET": {
                "market": 1606138,
                "cost": 1580654
            },
            "US": {
                "market": 155411,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 426759,
                "cost": 426759
            },
            "Mid": {
                "market": 2779679,
                "cost": 1861641
            },
            "High": {
                "market": 2000573,
                "cost": 1894556
            }
        },
        "items": [
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 84744.46,
                "cost": 84744.46
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 342014.62,
                "cost": 342014.62
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1666084.31,
                "cost": 732843.48
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 215147.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1425241.11,
                "cost": 1384553.56
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 155411.22,
                "cost": 20002.88
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 28992.34,
                "cost": 46000.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 78009.03,
                "cost": 80000.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.15,
                "cost": 100.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 73788.37,
                "cost": 70000.0
            },
            {
                "ym": "2024-10",
                "date": "Oct-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 204773.2,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-11",
        "label": "พ.ย. 2024",
        "year": 2024,
        "month": 11,
        "cost": 4173910,
        "market": 5374773,
        "forecast": 5249259,
        "assets": {
            "CASH": {
                "market": 410750,
                "cost": 410750
            },
            "PVD": {
                "market": 1670969,
                "cost": 739806
            },
            "CRYPTO": {
                "market": 534176,
                "cost": 490000
            },
            "SET": {
                "market": 1656272,
                "cost": 1580654
            },
            "US": {
                "market": 169908,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 410750,
                "cost": 410750
            },
            "Mid": {
                "market": 2778178,
                "cost": 1868604
            },
            "High": {
                "market": 2185845,
                "cost": 1894556
            }
        },
        "items": [
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 68735.29,
                "cost": 68735.29
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 342014.62,
                "cost": 342014.62
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1670969.32,
                "cost": 739805.68
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 235867.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1481761.11,
                "cost": 1384553.56
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 169908.28,
                "cost": 20002.88
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27572.7,
                "cost": 46000.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 76258.29,
                "cost": 80000.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.32,
                "cost": 100.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 70572.41,
                "cost": 70000.0
            },
            {
                "ym": "2024-11",
                "date": "Nov-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 298308.25,
                "cost": 250000.0
            }
        ]
    },
    {
        "date": "2024-12",
        "label": "ธ.ค. 2024",
        "year": 2024,
        "month": 12,
        "cost": 4198296,
        "market": 5401237,
        "forecast": 5308290,
        "assets": {
            "CASH": {
                "market": 378174,
                "cost": 378174
            },
            "PVD": {
                "market": 1674984,
                "cost": 746768
            },
            "CRYPTO": {
                "market": 575596,
                "cost": 540000
            },
            "SET": {
                "market": 1676866,
                "cost": 1580654
            },
            "US": {
                "market": 162920,
                "cost": 20003
            },
            "INS": {
                "market": 932698,
                "cost": 932698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 378174,
                "cost": 378174
            },
            "Mid": {
                "market": 2778956,
                "cost": 1875566
            },
            "High": {
                "market": 2244107,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 183603.06,
                "cost": 183603.06
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 194570.46,
                "cost": 194570.46
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1674983.63,
                "cost": 746767.88
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 252227.68,
                "cost": 240000.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1505591.11,
                "cost": 1384553.56
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 162919.8,
                "cost": 20002.88
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 932698.0,
                "cost": 932698.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26951.29,
                "cost": 46000.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 74522.78,
                "cost": 80000.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.49,
                "cost": 100.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 69692.83,
                "cost": 70000.0
            },
            {
                "ym": "2024-12",
                "date": "Dec-2024",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 323368.75,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-01",
        "label": "ม.ค. 2025",
        "year": 2025,
        "month": 1,
        "cost": 4196586,
        "market": 5362302,
        "forecast": 5366273,
        "assets": {
            "CASH": {
                "market": 317501,
                "cost": 317501
            },
            "PVD": {
                "market": 1667220,
                "cost": 753730
            },
            "CRYPTO": {
                "market": 571545,
                "cost": 540000
            },
            "SET": {
                "market": 1656754,
                "cost": 1580654
            },
            "US": {
                "market": 164585,
                "cost": 20003
            },
            "INS": {
                "market": 984698,
                "cost": 984698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 317501,
                "cost": 317501
            },
            "Mid": {
                "market": 2809204,
                "cost": 1934528
            },
            "High": {
                "market": 2235597,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 122930.53,
                "cost": 122930.53
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 194570.46,
                "cost": 194570.46
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1667219.82,
                "cost": 753730.08
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 235347.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1499467.36,
                "cost": 1384553.56
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 164584.54,
                "cost": 20002.88
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 984698.0,
                "cost": 984698.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 25261.7,
                "cost": 46000.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 69700.56,
                "cost": 80000.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.65,
                "cost": 100.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 62216.42,
                "cost": 70000.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 0.0,
                "cost": 0.0
            },
            {
                "ym": "2025-01",
                "date": "Jan-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 336197.43,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-02",
        "label": "ก.พ. 2025",
        "year": 2025,
        "month": 2,
        "cost": 4494387,
        "market": 5520589,
        "forecast": 5424257,
        "assets": {
            "CASH": {
                "market": 556114,
                "cost": 556114
            },
            "PVD": {
                "market": 1662474,
                "cost": 760919
            },
            "CRYPTO": {
                "market": 483435,
                "cost": 540000
            },
            "SET": {
                "market": 1620867,
                "cost": 1580654
            },
            "US": {
                "market": 161000,
                "cost": 20003
            },
            "INS": {
                "market": 1036698,
                "cost": 1036698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 556114,
                "cost": 556114
            },
            "Mid": {
                "market": 2849717,
                "cost": 1993717
            },
            "High": {
                "market": 2114757,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 361543.93,
                "cost": 361543.93
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 194570.46,
                "cost": 194570.46
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1662474.13,
                "cost": 760918.52
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 222907.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1470322.36,
                "cost": 1384553.56
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 161000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1036698.0,
                "cost": 1036698.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 23965.5,
                "cost": 46000.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 65485.29,
                "cost": 80000.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.8,
                "cost": 100.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 60986.38,
                "cost": 70000.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 0.0,
                "cost": 0.0
            },
            {
                "ym": "2025-02",
                "date": "Feb-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 260527.42,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-03",
        "label": "มี.ค. 2025",
        "year": 2025,
        "month": 3,
        "cost": 4399904,
        "market": 5399108,
        "forecast": 5482240,
        "assets": {
            "CASH": {
                "market": 402442,
                "cost": 402442
            },
            "PVD": {
                "market": 1666120,
                "cost": 768107
            },
            "CRYPTO": {
                "market": 502412,
                "cost": 540000
            },
            "SET": {
                "market": 1585758,
                "cost": 1580654
            },
            "US": {
                "market": 153677,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 402442,
                "cost": 402442
            },
            "Mid": {
                "market": 2896023,
                "cost": 2052905
            },
            "High": {
                "market": 2100643,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 207871.95,
                "cost": 207871.95
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 194570.46,
                "cost": 194570.46
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1666120.39,
                "cost": 768106.96
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 257027.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1444553.61,
                "cost": 1384553.56
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 153677.18,
                "cost": 20002.88
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 23096.53,
                "cost": 46000.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 62730.54,
                "cost": 80000.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 107.96,
                "cost": 100.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 55269.12,
                "cost": 70000.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 0.0,
                "cost": 0.0
            },
            {
                "ym": "2025-03",
                "date": "Mar-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 245384.44,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-04",
        "label": "เม.ย. 2025",
        "year": 2025,
        "month": 4,
        "cost": 4475330,
        "market": 5568551,
        "forecast": 5540223,
        "assets": {
            "CASH": {
                "market": 295680,
                "cost": 295680
            },
            "PVD": {
                "market": 1700048,
                "cost": 775295
            },
            "CRYPTO": {
                "market": 513788,
                "cost": 540000
            },
            "SET": {
                "market": 1639077,
                "cost": 1580654
            },
            "US": {
                "market": 153258,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 178002,
                "cost": 175000
            }
        },
        "risks": {
            "Low": {
                "market": 295680,
                "cost": 295680
            },
            "Mid": {
                "market": 3112383,
                "cost": 2235093
            },
            "High": {
                "market": 2160488,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 151109.35,
                "cost": 151109.35
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 144570.46,
                "cost": 144570.46
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1700048.0,
                "cost": 775295.4
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 253267.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1493442.87,
                "cost": 1384553.56
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 153257.61,
                "cost": 20002.88
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 23451.87,
                "cost": 46000.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 65183.76,
                "cost": 80000.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.11,
                "cost": 100.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 56890.85,
                "cost": 70000.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 178002.27,
                "cost": 175000.0
            },
            {
                "ym": "2025-04",
                "date": "Apr-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 260519.94,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-05",
        "label": "พ.ค. 2025",
        "year": 2025,
        "month": 5,
        "cost": 4546176,
        "market": 5611463,
        "forecast": 5598207,
        "assets": {
            "CASH": {
                "market": 258438,
                "cost": 258438
            },
            "PVD": {
                "market": 1702170,
                "cost": 782484
            },
            "CRYPTO": {
                "market": 539482,
                "cost": 540000
            },
            "SET": {
                "market": 1589034,
                "cost": 1580654
            },
            "US": {
                "market": 157000,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 276640,
                "cost": 275900
            }
        },
        "risks": {
            "Low": {
                "market": 258438,
                "cost": 258438
            },
            "Mid": {
                "market": 3205485,
                "cost": 2343182
            },
            "High": {
                "market": 2147540,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 148867.44,
                "cost": 148867.44
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 109570.46,
                "cost": 109570.46
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1702170.47,
                "cost": 782483.84
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 240467.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1451057.87,
                "cost": 1384553.56
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 157000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 22694.05,
                "cost": 46000.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 62942.17,
                "cost": 80000.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.25,
                "cost": 100.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 52231.83,
                "cost": 70000.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 276640.35,
                "cost": 275900.0
            },
            {
                "ym": "2025-05",
                "date": "May-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 299014.07,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-06",
        "label": "มิ.ย. 2025",
        "year": 2025,
        "month": 6,
        "cost": 4457758,
        "market": 5456433,
        "forecast": 5656190,
        "assets": {
            "CASH": {
                "market": 162831,
                "cost": 162831
            },
            "PVD": {
                "market": 1704537,
                "cost": 789672
            },
            "CRYPTO": {
                "market": 541174,
                "cost": 540000
            },
            "SET": {
                "market": 1520528,
                "cost": 1580654
            },
            "US": {
                "market": 165000,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 273666,
                "cost": 275900
            }
        },
        "risks": {
            "Low": {
                "market": 162831,
                "cost": 162831
            },
            "Mid": {
                "market": 3196962,
                "cost": 2350370
            },
            "High": {
                "market": 2096640,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 52649.38,
                "cost": 52649.38
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 110181.83,
                "cost": 110181.83
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1704536.51,
                "cost": 789672.28
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 247427.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1390466.62,
                "cost": 1384553.56
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 165000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 21537.12,
                "cost": 46000.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 59922.36,
                "cost": 80000.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.37,
                "cost": 100.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 48493.62,
                "cost": 70000.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 273665.72,
                "cost": 275900.0
            },
            {
                "ym": "2025-06",
                "date": "Jun-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 293746.05,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-07",
        "label": "ก.ค. 2025",
        "year": 2025,
        "month": 7,
        "cost": 4571435,
        "market": 5758274,
        "forecast": 5714173,
        "assets": {
            "CASH": {
                "market": 269320,
                "cost": 269320
            },
            "PVD": {
                "market": 1778589,
                "cost": 796861
            },
            "CRYPTO": {
                "market": 601340,
                "cost": 540000
            },
            "SET": {
                "market": 1576688,
                "cost": 1580654
            },
            "US": {
                "market": 167000,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 276640,
                "cost": 275900
            }
        },
        "risks": {
            "Low": {
                "market": 269320,
                "cost": 269320
            },
            "Mid": {
                "market": 3287573,
                "cost": 2357559
            },
            "High": {
                "market": 2201381,
                "cost": 1944556
            }
        },
        "items": [
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 159137.86,
                "cost": 159137.86
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 110181.83,
                "cost": 110181.83
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1778588.74,
                "cost": 796860.72
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 243947.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1433041.37,
                "cost": 1384553.56
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 167000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 24149.06,
                "cost": 46000.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 67665.3,
                "cost": 80000.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.49,
                "cost": 100.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 51723.33,
                "cost": 70000.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 276640.35,
                "cost": 275900.0
            },
            {
                "ym": "2025-07",
                "date": "Jul-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 357392.4,
                "cost": 300000.0
            }
        ]
    },
    {
        "date": "2025-08",
        "label": "ส.ค. 2025",
        "year": 2025,
        "month": 8,
        "cost": 4576756,
        "market": 5786416,
        "forecast": 5772157,
        "assets": {
            "CASH": {
                "market": 217453,
                "cost": 217453
            },
            "PVD": {
                "market": 1801414,
                "cost": 804049
            },
            "CRYPTO": {
                "market": 657648,
                "cost": 590000
            },
            "SET": {
                "market": 1569854,
                "cost": 1580654
            },
            "US": {
                "market": 167407,
                "cost": 20003
            },
            "INS": {
                "market": 1088698,
                "cost": 1088698
            },
            "GOLD": {
                "market": 283942,
                "cost": 275900
            }
        },
        "risks": {
            "Low": {
                "market": 217453,
                "cost": 217453
            },
            "Mid": {
                "market": 3316645,
                "cost": 2364747
            },
            "High": {
                "market": 2252318,
                "cost": 1994556
            }
        },
        "items": [
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 112270.9,
                "cost": 112270.9
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 105181.83,
                "cost": 105181.83
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1801413.79,
                "cost": 804049.16
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 243947.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1427262.87,
                "cost": 1384553.56
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 167407.17,
                "cost": 20002.88
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1088698.0,
                "cost": 1088698.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 24061.49,
                "cost": 46000.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 67123.83,
                "cost": 80000.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.6,
                "cost": 100.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 51297.28,
                "cost": 70000.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 283941.71,
                "cost": 275900.0
            },
            {
                "ym": "2025-08",
                "date": "Aug-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 413700.51,
                "cost": 350000.0
            }
        ]
    },
    {
        "date": "2025-09",
        "label": "ก.ย. 2025",
        "year": 2025,
        "month": 9,
        "cost": 4415962,
        "market": 5918598,
        "forecast": 5830140,
        "assets": {
            "CASH": {
                "market": 217399,
                "cost": 217399
            },
            "PVD": {
                "market": 1824830,
                "cost": 811238
            },
            "CRYPTO": {
                "market": 741762,
                "cost": 650000
            },
            "SET": {
                "market": 1471300,
                "cost": 1266045
            },
            "US": {
                "market": 211899,
                "cost": 59683
            },
            "INS": {
                "market": 1115698,
                "cost": 1115698
            },
            "GOLD": {
                "market": 335710,
                "cost": 295900
            }
        },
        "risks": {
            "Low": {
                "market": 217399,
                "cost": 217399
            },
            "Mid": {
                "market": 3422639,
                "cost": 2418936
            },
            "High": {
                "market": 2278561,
                "cost": 1779627
            }
        },
        "items": [
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 111205.13,
                "cost": 111205.13
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 106193.83,
                "cost": 106193.83
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1824830.46,
                "cost": 811237.6
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "High",
                "assessType": "ICO",
                "name": "SiriHUB",
                "cat": "CRYPTO",
                "market": 257867.68,
                "cost": 240000.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1324899.87,
                "cost": 1069944.59
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 172340.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1115698.0,
                "cost": 1115698.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 24858.03,
                "cost": 46000.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 69085.14,
                "cost": 80000.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.72,
                "cost": 100.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 52348.65,
                "cost": 70000.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 335709.52,
                "cost": 295900.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 483893.85,
                "cost": 410000.0
            },
            {
                "ym": "2025-09",
                "date": "Sep-2025",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 39559.1,
                "cost": 39680.0
            }
        ]
    },
    {
        "date": "2025-10",
        "label": "ต.ค. 2025",
        "year": 2025,
        "month": 10,
        "cost": 4571907,
        "market": 5972182,
        "forecast": 5888123,
        "assets": {
            "CASH": {
                "market": 275158,
                "cost": 275158
            },
            "PVD": {
                "market": 1842681,
                "cost": 818426
            },
            "CRYPTO": {
                "market": 486721,
                "cost": 440000
            },
            "SET": {
                "market": 1391918,
                "cost": 1266045
            },
            "US": {
                "market": 286039,
                "cost": 124683
            },
            "INS": {
                "market": 1141695,
                "cost": 1141695
            },
            "GOLD": {
                "market": 547969,
                "cost": 505900
            }
        },
        "risks": {
            "Low": {
                "market": 275158,
                "cost": 275158
            },
            "Mid": {
                "market": 3679614,
                "cost": 2662121
            },
            "High": {
                "market": 2017409,
                "cost": 1634627
            }
        },
        "items": [
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 198683.53,
                "cost": 198683.53
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 76474.83,
                "cost": 76474.83
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1842681.41,
                "cost": 818426.04
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1244648.99,
                "cost": 1069944.59
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 179000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1141695.0,
                "cost": 1141695.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 24932.13,
                "cost": 46000.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 71315.4,
                "cost": 80000.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.83,
                "cost": 100.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 50912.46,
                "cost": 70000.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 547968.74,
                "cost": 505900.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 486721.4,
                "cost": 440000.0
            },
            {
                "ym": "2025-10",
                "date": "Oct-2025",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 107039.02,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2025-11",
        "label": "พ.ย. 2025",
        "year": 2025,
        "month": 11,
        "cost": 4631731,
        "market": 5919076,
        "forecast": 5946107,
        "assets": {
            "CASH": {
                "market": 327794,
                "cost": 327794
            },
            "PVD": {
                "market": 1840812,
                "cost": 825614
            },
            "CRYPTO": {
                "market": 377694,
                "cost": 440000
            },
            "SET": {
                "market": 1385643,
                "cost": 1266045
            },
            "US": {
                "market": 274227,
                "cost": 124683
            },
            "INS": {
                "market": 1141695,
                "cost": 1141695
            },
            "GOLD": {
                "market": 571210,
                "cost": 505900
            }
        },
        "risks": {
            "Low": {
                "market": 327794,
                "cost": 327794
            },
            "Mid": {
                "market": 3694923,
                "cost": 2669309
            },
            "High": {
                "market": 1896359,
                "cost": 1634627
            }
        },
        "items": [
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 251319.49,
                "cost": 251319.49
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 76474.83,
                "cost": 76474.83
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1840812.26,
                "cost": 825614.48
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1244437.99,
                "cost": 1069944.59
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 174817.24,
                "cost": 20002.88
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 1141695.0,
                "cost": 1141695.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 23704.47,
                "cost": 46000.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 68087.14,
                "cost": 80000.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 108.92,
                "cost": 100.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 49304.48,
                "cost": 70000.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 571210.48,
                "cost": 505900.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 377693.85,
                "cost": 440000.0
            },
            {
                "ym": "2025-11",
                "date": "Nov-2025",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 99410.2,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2025-12",
        "label": "ธ.ค. 2025",
        "year": 2025,
        "month": 12,
        "cost": 4606304,
        "market": 5939144,
        "forecast": 6004090,
        "assets": {
            "CASH": {
                "market": 549823,
                "cost": 549823
            },
            "PVD": {
                "market": 1865417,
                "cost": 832803
            },
            "CRYPTO": {
                "market": 367175,
                "cost": 440000
            },
            "SET": {
                "market": 1420100,
                "cost": 1266045
            },
            "US": {
                "market": 269876,
                "cost": 124683
            },
            "INS": {
                "market": 887050,
                "cost": 887050
            },
            "GOLD": {
                "market": 579703,
                "cost": 505900
            }
        },
        "risks": {
            "Low": {
                "market": 549823,
                "cost": 549823
            },
            "Mid": {
                "market": 3474316,
                "cost": 2421853
            },
            "High": {
                "market": 1915004,
                "cost": 1634627
            }
        },
        "items": [
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 472854.83,
                "cost": 472854.83
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 76968.41,
                "cost": 76968.41
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1865417.4,
                "cost": 832802.92
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1277953.99,
                "cost": 1069944.59
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 175000.0,
                "cost": 20002.88
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 887050.0,
                "cost": 887050.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 24026.12,
                "cost": 46000.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 68239.32,
                "cost": 80000.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 109.02,
                "cost": 100.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 49771.76,
                "cost": 70000.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 579702.66,
                "cost": 505900.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 367174.87,
                "cost": 440000.0
            },
            {
                "ym": "2025-12",
                "date": "Dec-2025",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 94875.63,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2026-01",
        "label": "ม.ค. 2026",
        "year": 2026,
        "month": 1,
        "cost": 4618142,
        "market": 6121076,
        "forecast": 6061448,
        "assets": {
            "CASH": {
                "market": 188473,
                "cost": 188473
            },
            "PVD": {
                "market": 1901713,
                "cost": 839991
            },
            "CRYPTO": {
                "market": 322087,
                "cost": 440000
            },
            "SET": {
                "market": 1526492,
                "cost": 1266045
            },
            "US": {
                "market": 268998,
                "cost": 124683
            },
            "INS": {
                "market": 913050,
                "cost": 913050
            },
            "GOLD": {
                "market": 1000262,
                "cost": 845900
            }
        },
        "risks": {
            "Low": {
                "market": 188473,
                "cost": 188473
            },
            "Mid": {
                "market": 3963864,
                "cost": 2795041
            },
            "High": {
                "market": 1968740,
                "cost": 1634627
            }
        },
        "items": [
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 111504.4,
                "cost": 111504.4
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 76968.41,
                "cost": 76968.41
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1901713.24,
                "cost": 839991.36
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1377653.99,
                "cost": 1069944.59
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 171361.8,
                "cost": 20002.88
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 913050.0,
                "cost": 913050.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 25063.49,
                "cost": 46000.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 71976.84,
                "cost": 80000.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 109.11,
                "cost": 100.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 51688.97,
                "cost": 70000.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 1000261.95,
                "cost": 845900.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 322087.28,
                "cost": 440000.0
            },
            {
                "ym": "2026-01",
                "date": "Jan-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 97636.68,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2026-02",
        "label": "ก.พ. 2026",
        "year": 2026,
        "month": 2,
        "cost": 4948881,
        "market": 6629195,
        "forecast": 6118805,
        "assets": {
            "CASH": {
                "market": 511718,
                "cost": 511718
            },
            "PVD": {
                "market": 2009650,
                "cost": 847485
            },
            "CRYPTO": {
                "market": 262109,
                "cost": 440000
            },
            "SET": {
                "market": 1637416,
                "cost": 1266045
            },
            "US": {
                "market": 253257,
                "cost": 124683
            },
            "INS": {
                "market": 913050,
                "cost": 913050
            },
            "GOLD": {
                "market": 1041996,
                "cost": 845900
            }
        },
        "risks": {
            "Low": {
                "market": 511718,
                "cost": 511718
            },
            "Mid": {
                "market": 4134086,
                "cost": 2802535
            },
            "High": {
                "market": 1983391,
                "cost": 1634627
            }
        },
        "items": [
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 434749.53,
                "cost": 434749.53
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 76968.41,
                "cost": 76968.41
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2009649.89,
                "cost": 847485.28
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1468025.49,
                "cost": 1069944.59
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "High",
                "assessType": "ETF",
                "name": "Jitta",
                "cat": "US",
                "market": 167746.34,
                "cost": 20002.88
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 913050.0,
                "cost": 913050.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 28441.66,
                "cost": 46000.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 84060.33,
                "cost": 80000.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 109.2,
                "cost": 100.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 56779.53,
                "cost": 70000.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 1041995.62,
                "cost": 845900.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 262108.87,
                "cost": 440000.0
            },
            {
                "ym": "2026-02",
                "date": "Feb-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 85510.62,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2026-03",
        "label": "มี.ค. 2026",
        "year": 2026,
        "month": 3,
        "cost": 5073998,
        "market": 6477857,
        "forecast": 6176163,
        "assets": {
            "CASH": {
                "market": 159719,
                "cost": 159719
            },
            "PVD": {
                "market": 1989959,
                "cost": 854979
            },
            "CRYPTO": {
                "market": 333804,
                "cost": 490000
            },
            "SET": {
                "market": 2016541,
                "cost": 1679670
            },
            "US": {
                "market": 82948,
                "cost": 104680
            },
            "INS": {
                "market": 939050,
                "cost": 939050
            },
            "GOLD": {
                "market": 955836,
                "cost": 845900
            }
        },
        "risks": {
            "Low": {
                "market": 159719,
                "cost": 159719
            },
            "Mid": {
                "market": 4042726,
                "cost": 2836029
            },
            "High": {
                "market": 2275413,
                "cost": 2078250
            }
        },
        "items": [
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 72961.11,
                "cost": 72961.11
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 86757.85,
                "cost": 86757.85
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 1989959.12,
                "cost": 854979.2
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1858660.32,
                "cost": 1483569.59
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 939050.0,
                "cost": 939050.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 26956.34,
                "cost": 46000.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "CIMB-PRINCIPAL LTF-T",
                "cat": "SET",
                "market": 79999.0,
                "cost": 80000.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 109.28,
                "cost": 100.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UTHAISME-LN",
                "cat": "SET",
                "market": 50816.26,
                "cost": 70000.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 955835.78,
                "cost": 845900.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 333804.3,
                "cost": 490000.0
            },
            {
                "ym": "2026-03",
                "date": "Mar-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 82948.03,
                "cost": 104680.0
            }
        ]
    },
    {
        "date": "2026-04",
        "label": "เม.ย. 2026",
        "year": 2026,
        "month": 4,
        "cost": 5140882,
        "market": 6635180,
        "forecast": 6233520,
        "assets": {
            "CASH": {
                "market": 146195,
                "cost": 146195
            },
            "PVD": {
                "market": 2029366,
                "cost": 862473
            },
            "CRYPTO": {
                "market": 363383,
                "cost": 490000
            },
            "SET": {
                "market": 1889502,
                "cost": 1547485
            },
            "US": {
                "market": 284236,
                "cost": 285680
            },
            "INS": {
                "market": 939050,
                "cost": 939050
            },
            "GOLD": {
                "market": 983448,
                "cost": 870000
            }
        },
        "risks": {
            "Low": {
                "market": 146195,
                "cost": 146195
            },
            "Mid": {
                "market": 3979116,
                "cost": 2717623
            },
            "High": {
                "market": 2509870,
                "cost": 2277065
            }
        },
        "items": [
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 82044.8,
                "cost": 82044.8
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 64149.85,
                "cost": 64149.85
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2029366.11,
                "cost": 862473.12
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1862250.58,
                "cost": 1501384.59
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 939050.0,
                "cost": 939050.0
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "Krungsri-KFLTFDIV",
                "cat": "SET",
                "market": 27142.6,
                "cost": 46000.0
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Mid",
                "assessType": "LTF",
                "name": "UOBSD",
                "cat": "SET",
                "market": 109.27,
                "cost": 100.0
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 983447.78,
                "cost": 870000.0
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 363383.18,
                "cost": 490000.0
            },
            {
                "ym": "2026-04",
                "date": "Apr-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 284236.02,
                "cost": 285680.0
            }
        ]
    },
    {
        "date": "2026-05",
        "label": "พ.ค. 2026",
        "year": 2026,
        "month": 5,
        "cost": 5136555,
        "market": 6743383,
        "forecast": 6290878,
        "assets": {
            "CASH": {
                "market": 140473,
                "cost": 140473
            },
            "PVD": {
                "market": 2074909,
                "cost": 869967
            },
            "CRYPTO": {
                "market": 343584,
                "cost": 490000
            },
            "SET": {
                "market": 1944951,
                "cost": 1521385
            },
            "US": {
                "market": 336983,
                "cost": 305680
            },
            "INS": {
                "market": 939050,
                "cost": 939050
            },
            "GOLD": {
                "market": 963434,
                "cost": 870000
            }
        },
        "risks": {
            "Low": {
                "market": 140473,
                "cost": 140473
            },
            "Mid": {
                "market": 3977392,
                "cost": 2679017
            },
            "High": {
                "market": 2625518,
                "cost": 2317065
            }
        },
        "items": [
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 80960.25,
                "cost": 80960.25
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 59512.85,
                "cost": 59512.85
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2074908.66,
                "cost": 869967.04
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 1944951.09,
                "cost": 1521384.59
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 939050.0,
                "cost": 939050.0
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 963433.75,
                "cost": 870000.0
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 343584.11,
                "cost": 490000.0
            },
            {
                "ym": "2026-05",
                "date": "May-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 336982.56,
                "cost": 305680.0
            }
        ]
    },
    {
        "date": "2026-06",
        "label": "มิ.ย. 2026",
        "year": 2026,
        "month": 6,
        "cost": 5163477,
        "market": 6733358,
        "forecast": 6348236,
        "assets": {
            "CASH": {
                "market": 107569,
                "cost": 107569
            },
            "PVD": {
                "market": 2106178,
                "cost": 877461
            },
            "CRYPTO": {
                "market": 280746,
                "cost": 500000
            },
            "SET": {
                "market": 2036536,
                "cost": 1521385
            },
            "US": {
                "market": 355129,
                "cost": 310680
            },
            "INS": {
                "market": 956383,
                "cost": 956383
            },
            "GOLD": {
                "market": 890817,
                "cost": 890000
            }
        },
        "risks": {
            "Low": {
                "market": 107569,
                "cost": 107569
            },
            "Mid": {
                "market": 3953378,
                "cost": 2723844
            },
            "High": {
                "market": 2672412,
                "cost": 2332065
            }
        },
        "items": [
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 97777.62,
                "cost": 97777.62
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 9790.92,
                "cost": 9790.92
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2106178.05,
                "cost": 877460.96
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 2036535.91,
                "cost": 1521384.59
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 956383.16,
                "cost": 956383.16
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 890816.64,
                "cost": 890000.0
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 280746.5,
                "cost": 500000.0
            },
            {
                "ym": "2026-06",
                "date": "Jun-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 355129.29,
                "cost": 310680.0
            }
        ]
    },
    {
        "date": "2026-07",
        "label": "ก.ค. 2026",
        "year": 2026,
        "month": 7,
        "cost": 5238100,
        "market": 6923413,
        "forecast": 6405593,
        "assets": {
            "CASH": {
                "market": 147362,
                "cost": 147362
            },
            "PVD": {
                "market": 2138306,
                "cost": 884955
            },
            "CRYPTO": {
                "market": 315796,
                "cost": 500000
            },
            "SET": {
                "market": 2098487,
                "cost": 1521385
            },
            "US": {
                "market": 346927,
                "cost": 320680
            },
            "INS": {
                "market": 973718,
                "cost": 973718
            },
            "GOLD": {
                "market": 902817,
                "cost": 890000
            }
        },
        "risks": {
            "Low": {
                "market": 147362,
                "cost": 147362
            },
            "Mid": {
                "market": 4014841,
                "cost": 2748673
            },
            "High": {
                "market": 2761211,
                "cost": 2342065
            }
        },
        "items": [
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 119571.17,
                "cost": 119571.17
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 27790.92,
                "cost": 27790.92
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2138305.59,
                "cost": 884954.88
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 2098487.41,
                "cost": 1521384.59
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 973718.4,
                "cost": 973718.4
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 902816.55,
                "cost": 890000.0
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 315795.77,
                "cost": 500000.0
            },
            {
                "ym": "2026-07",
                "date": "Jul-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 346927.39,
                "cost": 320680.0
            }
        ]
    },
    {
        "date": "2026-08",
        "label": "ส.ค. 2026",
        "year": 2026,
        "month": 8,
        "cost": 5200648,
        "market": 7033782,
        "forecast": 6462951,
        "assets": {
            "CASH": {
                "market": 65085,
                "cost": 65085
            },
            "PVD": {
                "market": 2149084,
                "cost": 892449
            },
            "CRYPTO": {
                "market": 412644,
                "cost": 515000
            },
            "SET": {
                "market": 2068525,
                "cost": 1521385
            },
            "US": {
                "market": 362787,
                "cost": 320680
            },
            "INS": {
                "market": 991050,
                "cost": 991050
            },
            "GOLD": {
                "market": 984608,
                "cost": 895000
            }
        },
        "risks": {
            "Low": {
                "market": 65085,
                "cost": 65085
            },
            "Mid": {
                "market": 4124742,
                "cost": 2778499
            },
            "High": {
                "market": 2843956,
                "cost": 2357065
            }
        },
        "items": [
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 54626.78,
                "cost": 54626.78
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 10457.92,
                "cost": 10457.92
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2149083.58,
                "cost": 892448.8
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 2068524.96,
                "cost": 1521384.59
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 991050.0,
                "cost": 991050.0
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 984608.42,
                "cost": 895000.0
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 412643.6,
                "cost": 515000.0
            },
            {
                "ym": "2026-08",
                "date": "Aug-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 362787.06,
                "cost": 320680.0
            }
        ]
    },
    {
        "date": "2026-09",
        "label": "ก.ย. 2026",
        "year": 2026,
        "month": 9,
        "cost": 5215443,
        "market": 6999068,
        "forecast": 6520308,
        "assets": {
            "CASH": {
                "market": 79880,
                "cost": 79880
            },
            "PVD": {
                "market": 2149485,
                "cost": 892449
            },
            "CRYPTO": {
                "market": 452067,
                "cost": 515000
            },
            "SET": {
                "market": 2005878,
                "cost": 1521385
            },
            "US": {
                "market": 374543,
                "cost": 320680
            },
            "INS": {
                "market": 991050,
                "cost": 991050
            },
            "GOLD": {
                "market": 946166,
                "cost": 895000
            }
        },
        "risks": {
            "Low": {
                "market": 79880,
                "cost": 79880
            },
            "Mid": {
                "market": 4086701,
                "cost": 2778499
            },
            "High": {
                "market": 2832488,
                "cost": 2357065
            }
        },
        "items": [
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 69421.72,
                "cost": 69421.72
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 10457.92,
                "cost": 10457.92
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2149484.84,
                "cost": 892448.8
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 2005877.56,
                "cost": 1521384.59
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 991050.0,
                "cost": 991050.0
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 946165.89,
                "cost": 895000.0
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 452067.28,
                "cost": 515000.0
            },
            {
                "ym": "2026-09",
                "date": "Sep-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 374543.0,
                "cost": 320680.0
            }
        ]
    },
    {
        "date": "2026-10",
        "label": "ต.ค. 2026 (ปัจจุบัน)",
        "year": 2026,
        "month": 10,
        "cost": 5270554,
        "market": 6961271,
        "forecast": 6577666,
        "assets": {
            "CASH": {
                "market": 944497,
                "cost": 944497
            },
            "PVD": {
                "market": 2158345,
                "cost": 899943
            },
            "CRYPTO": {
                "market": 406878,
                "cost": 525000
            },
            "SET": {
                "market": 2039760,
                "cost": 1521385
            },
            "US": {
                "market": 420741,
                "cost": 388680
            },
            "INS": {
                "market": 991050,
                "cost": 991050
            },
            "GOLD": {
                "market": 0,
                "cost": 0
            }
        },
        "risks": {
            "Low": {
                "market": 944497,
                "cost": 944497
            },
            "Mid": {
                "market": 3149395,
                "cost": 1890993
            },
            "High": {
                "market": 2867379,
                "cost": 2435065
            }
        },
        "items": [
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "Low",
                "assessType": "Cash",
                "name": "Cash",
                "cat": "CASH",
                "market": 934039.02,
                "cost": 934039.02
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "Low",
                "assessType": "Bank",
                "name": "Saving-ME",
                "cat": "CASH",
                "market": 10457.92,
                "cost": 10457.92
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "Mid",
                "assessType": "Provident Fund",
                "name": "PVD",
                "cat": "PVD",
                "market": 2158344.64,
                "cost": 899942.72
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "High",
                "assessType": "SET",
                "name": "SET",
                "cat": "SET",
                "market": 2039759.89,
                "cost": 1521384.59
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "Mid",
                "assessType": "Insurance",
                "name": "Insurance",
                "cat": "INS",
                "market": 991050.0,
                "cost": 991050.0
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "Mid",
                "assessType": "GOLD",
                "name": "AOM NOW",
                "cat": "GOLD",
                "market": 0.0,
                "cost": 0.0
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "High",
                "assessType": "Crypto",
                "name": "Bitkub",
                "cat": "CRYPTO",
                "market": 406877.87,
                "cost": 525000.0
            },
            {
                "ym": "2026-10",
                "date": "Oct-2026",
                "risk": "High",
                "assessType": "USD Stock",
                "name": "Dime",
                "cat": "US",
                "market": 420741.17,
                "cost": 388680.0
            }
        ]
    }
],

  // Top Individual Holdings (From sheet Portfolio)
  holdings: [
    {
        "ticker": "PVD",
        "name": "Provident Fund (Mid Risk)",
        "assetClass": "PVD",
        "risk": "Mid",
        "assessType": "Provident Fund",
        "units": 1,
        "avgCost": 899943,
        "curPrice": 2158345,
        "currency": "THB",
        "marketValueTHB": 2158345,
        "unrealizedGainTHB": 1258402,
        "gainPercent": 139.8,
        "weight": 31.0,
        "divYield": 0.0
    },
    {
        "ticker": "SET",
        "name": "SET (High Risk)",
        "assetClass": "SET",
        "risk": "High",
        "assessType": "SET",
        "units": 1,
        "avgCost": 1521385,
        "curPrice": 2039760,
        "currency": "THB",
        "marketValueTHB": 2039760,
        "unrealizedGainTHB": 518375,
        "gainPercent": 34.1,
        "weight": 29.3,
        "divYield": 0.0
    },
    {
        "ticker": "Insurance",
        "name": "Insurance (Mid Risk)",
        "assetClass": "INS",
        "risk": "Mid",
        "assessType": "Insurance",
        "units": 1,
        "avgCost": 991050,
        "curPrice": 991050,
        "currency": "THB",
        "marketValueTHB": 991050,
        "unrealizedGainTHB": 0,
        "gainPercent": 0.0,
        "weight": 14.2,
        "divYield": 0.0
    },
    {
        "ticker": "Cash",
        "name": "Cash (Low Risk)",
        "assetClass": "CASH",
        "risk": "Low",
        "assessType": "Cash",
        "units": 1,
        "avgCost": 934039,
        "curPrice": 934039,
        "currency": "THB",
        "marketValueTHB": 934039,
        "unrealizedGainTHB": 0,
        "gainPercent": 0.0,
        "weight": 13.4,
        "divYield": 0.0
    },
    {
        "ticker": "Dime",
        "name": "USD Stock (High Risk)",
        "assetClass": "US",
        "risk": "High",
        "assessType": "USD Stock",
        "units": 1,
        "avgCost": 388680,
        "curPrice": 420741,
        "currency": "THB",
        "marketValueTHB": 420741,
        "unrealizedGainTHB": 32061,
        "gainPercent": 8.2,
        "weight": 6.0,
        "divYield": 0.0
    },
    {
        "ticker": "Bitkub",
        "name": "Crypto (High Risk)",
        "assetClass": "CRYPTO",
        "risk": "High",
        "assessType": "Crypto",
        "units": 1,
        "avgCost": 525000,
        "curPrice": 406878,
        "currency": "THB",
        "marketValueTHB": 406878,
        "unrealizedGainTHB": -118122,
        "gainPercent": -22.5,
        "weight": 5.8,
        "divYield": 0.0
    },
    {
        "ticker": "Saving-ME",
        "name": "Bank (Low Risk)",
        "assetClass": "CASH",
        "risk": "Low",
        "assessType": "Bank",
        "units": 1,
        "avgCost": 10458,
        "curPrice": 10458,
        "currency": "THB",
        "marketValueTHB": 10458,
        "unrealizedGainTHB": 0,
        "gainPercent": 0.0,
        "weight": 0.2,
        "divYield": 0.0
    },
    {
        "ticker": "AOM NOW",
        "name": "GOLD (Mid Risk)",
        "assetClass": "GOLD",
        "risk": "Mid",
        "assessType": "GOLD",
        "units": 1,
        "avgCost": 0,
        "curPrice": 0,
        "currency": "THB",
        "marketValueTHB": 0,
        "unrealizedGainTHB": 0,
        "gainPercent": 0.0,
        "weight": 0.0,
        "divYield": 0.0
    }
],

  // Monthly Cash Flow records (2024 to 2026)
  monthlyCashFlow: [
    { year: 2024, month: "2024-01", label: "ม.ค. 24", income: 98500,  outcome: 50700,  netExpense: 41200, invest: 45000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-02", label: "ก.พ. 24", income: 104000, outcome: 49300,  netExpense: 39800, invest: 50000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-03", label: "มี.ค. 24", income: 125000, outcome: 54000,  netExpense: 44500, invest: 65000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-04", label: "เม.ย. 24", income: 148000, outcome: 55700,  netExpense: 46200, invest: 85000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-05", label: "พ.ค. 24", income: 101000, outcome: 51600,  netExpense: 42100, invest: 45000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-06", label: "มิ.ย. 24", income: 99800,  outcome: 50000,  netExpense: 40500, invest: 46000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-07", label: "ก.ค. 24", income: 103200, outcome: 51300,  netExpense: 41800, invest: 48000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-08", label: "ส.ค. 24", income: 112000, outcome: 52700,  netExpense: 43200, invest: 55000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-09", label: "ก.ย. 24", income: 154000, outcome: 54500,  netExpense: 45000, invest: 92000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-10", label: "ต.ค. 24", income: 102500, outcome: 50500,  netExpense: 41000, invest: 48000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-11", label: "พ.ย. 24", income: 105000, outcome: 51900,  netExpense: 42400, invest: 50000,  pvdExpense: 6500, insuranceExpense: 3000 },
    { year: 2024, month: "2024-12", label: "ธ.ค. 24", income: 185000, outcome: 59000,  netExpense: 49500, invest: 120000, pvdExpense: 6500, insuranceExpense: 3000 },

    { year: 2025, month: "2025-01", label: "ม.ค. 25", income: 102000, outcome: 51500,  netExpense: 41500, invest: 47000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-02", label: "ก.พ. 25", income: 106000, outcome: 50200,  netExpense: 40200, invest: 51000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-03", label: "มี.ค. 25", income: 132000, outcome: 53800,  netExpense: 43800, invest: 72000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-04", label: "เม.ย. 25", income: 156000, outcome: 55500,  netExpense: 45500, invest: 95000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-05", label: "พ.ค. 25", income: 104500, outcome: 51900,  netExpense: 41900, invest: 48000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-06", label: "มิ.ย. 25", income: 103000, outcome: 51100,  netExpense: 41100, invest: 48500,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-07", label: "ก.ค. 25", income: 106800, outcome: 52200,  netExpense: 42200, invest: 51000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-08", label: "ส.ค. 25", income: 118000, outcome: 53600,  netExpense: 43600, invest: 60000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-09", label: "ก.ย. 25", income: 162000, outcome: 55200,  netExpense: 45200, invest: 102000, pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-10", label: "ต.ค. 25", income: 105400, outcome: 51800,  netExpense: 41800, invest: 50000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-11", label: "พ.ย. 25", income: 108200, outcome: 52900,  netExpense: 42900, invest: 52000,  pvdExpense: 7000, insuranceExpense: 3000 },
    { year: 2025, month: "2025-12", label: "ธ.ค. 25", income: 198000, outcome: 61200,  netExpense: 51200, invest: 130000, pvdExpense: 7000, insuranceExpense: 3000 },

    { year: 2026, month: "2026-01", label: "ม.ค. 26", income: 105000, outcome: 53100,  netExpense: 42100, invest: 50000,  pvdExpense: 7500, insuranceExpense: 3000 },
    { year: 2026, month: "2026-02", label: "ก.พ. 26", income: 109500, outcome: 51700,  netExpense: 41200, invest: 54000,  pvdExpense: 7500, insuranceExpense: 3000 },
    { year: 2026, month: "2026-03", label: "มี.ค. 26", income: 138000, outcome: 54700,  netExpense: 44200, invest: 78000,  pvdExpense: 7500, insuranceExpense: 3000 },
    { year: 2026, month: "2026-04", label: "เม.ย. 26", income: 203406, outcome: 67697,  netExpense: 53197, invest: 128000, pvdExpense: 7500, insuranceExpense: 7000 },
    { year: 2026, month: "2026-05", label: "พ.ค. 26", income: 125136, outcome: 114003, netExpense: 99503, invest: 10000,  pvdExpense: 7500, insuranceExpense: 7000 },
    { year: 2026, month: "2026-06", label: "มิ.ย. 26", income: 110679, outcome: 83444,  netExpense: 68944, invest: 25000,  pvdExpense: 7500, insuranceExpense: 7000 },
    { year: 2026, month: "2026-07", label: "ก.ค. 26", income: 109257, outcome: 77299,  netExpense: 62799, invest: 30000,  pvdExpense: 7500, insuranceExpense: 7000 },
    { year: 2026, month: "2026-08", label: "ส.ค. 26", income: 109484, outcome: 85632,  netExpense: 71132, invest: 24000,  pvdExpense: 7500, insuranceExpense: 7000 },
    { year: 2026, month: "2026-09", label: "ก.ย. 26 (สด)", income: 137906, outcome: 67701,  netExpense: 53201, invest: 63000,  pvdExpense: 7500, insuranceExpense: 7000 }
  ],

  // 10 Main Categories & Subcategories (Synced with 2026 Google Sheet Data)
  expenseCategories: [
    {
      id: "housing",
      name: "1. 🏢 ที่พักอาศัย & คอนโด (Housing & Condo)",
      shortName: "ที่พักอาศัย & คอนโด",
      latestAmount: 17850,
      yearlyAvg: 30316,
      sharePercent: 25.5,
      peakMonth: "มี.ค. (฿95.7k)",
      subcategories: [
        { name: "ผ่อนคอนโด (Condo Loan)", amount: 15800, percent: 88.5, avgMonthly: 25777 },
        { name: "ค่าไฟ (MEA) & ค่าน้ำ", amount: 1094, percent: 6.1, avgMonthly: 1108 },
        { name: "เน็ตบ้าน & โทรศัพท์", amount: 266, percent: 1.5, avgMonthly: 326 },
        { name: "ส่วนกลาง & ตกแต่งคอนโด", amount: 690, percent: 3.9, avgMonthly: 3105 }
      ],
      monthlyHistory: [23688, 33035, 95720, 17146, 17170, 17179, 19523, 31535, 17850],
      prevMonthlyHistory: [16600, 23932, 31757, 47441, 42874, 18470, 18083, 25444, 25192]
    },
    {
      id: "food",
      name: "2. 🍔 อาหารและของกิน (Food & 7-Eleven)",
      shortName: "อาหารและของกิน",
      latestAmount: 9441,
      yearlyAvg: 10957,
      sharePercent: 13.5,
      peakMonth: "ก.พ. (฿13.4k)",
      subcategories: [
        { name: "อาหารประจำวัน", amount: 6547, percent: 69.3, avgMonthly: 8408 },
        { name: "7-Eleven & ร้านสะดวกซื้อ", amount: 2894, percent: 30.7, avgMonthly: 2549 }
      ],
      monthlyHistory: [11788, 13414, 10117, 12500, 12580, 7353, 9720, 11703, 9441],
      prevMonthlyHistory: [10667, 9804, 14238, 5300, 10495, 8867, 10921, 14632, 9487]
    },
    {
      id: "it",
      name: "3. 💻 อุปกรณ์ไอที & อิเล็กทรอนิกส์ (IT & Gadgets)",
      shortName: "อุปกรณ์ไอที",
      latestAmount: 8769,
      yearlyAvg: 12548,
      sharePercent: 12.5,
      peakMonth: "ก.พ. (฿15.6k)",
      subcategories: [
        { name: "Computer/Notebook/Tablet", amount: 6969, percent: 79.5, avgMonthly: 8415 },
        { name: "Camera & Devices", amount: 1800, percent: 20.5, avgMonthly: 4133 }
      ],
      monthlyHistory: [15535, 15565, 13226, 13226, 13676, 11946, 12889, 8098, 8769],
      prevMonthlyHistory: [10950, 14083, 19666, 17481, 13601, 12192, 11572, 7722, 4261]
    },
    {
      id: "travel",
      name: "4. ✈️ ท่องเที่ยว & บันเทิง (Travel & Entertainment)",
      shortName: "ท่องเที่ยว & บันเทิง",
      latestAmount: 9106,
      yearlyAvg: 13884,
      sharePercent: 13.0,
      peakMonth: "ม.ค. (฿38.4k)",
      subcategories: [
        { name: "ท่องเที่ยวต่างจังหวัด/ตปท.", amount: 8330, percent: 91.5, avgMonthly: 12975 },
        { name: "ดูหนัง สังสรรค์ & บันเทิง", amount: 776, percent: 8.5, avgMonthly: 909 }
      ],
      monthlyHistory: [38422, 3839, 349, 3133, 34577, 32476, 349, 2703, 9106],
      prevMonthlyHistory: [3349, 12835, 349, 36090, 39636, 5447, 7742, 2529, 9642]
    },
    {
      id: "family",
      name: "5. 👨‍👩‍👧 ครอบครัว & ภาระผูกพัน (Family)",
      shortName: "ครอบครัว & ภาระผูกพัน",
      latestAmount: 5000,
      yearlyAvg: 4222,
      sharePercent: 7.1,
      peakMonth: "ก.ค. (฿8.0k)",
      subcategories: [
        { name: "ให้คุณแม่ (Mommy)", amount: 5000, percent: 100.0, avgMonthly: 4222 }
      ],
      monthlyHistory: [5000, 0, 5000, 5000, 5000, 0, 8000, 5000, 5000],
      prevMonthlyHistory: [5000, 5000, 5000, 5500, 5000, 5000, 5000, 5000, 5000]
    },
    {
      id: "health",
      name: "6. 🏥 สุขภาพ & กีฬา (Health & Sport)",
      shortName: "สุขภาพ & กีฬา",
      latestAmount: 5108,
      yearlyAvg: 2187,
      sharePercent: 7.3,
      peakMonth: "ส.ค. (฿8.1k)",
      subcategories: [
        { name: "อุปกรณ์กีฬา (Sport & Shoe)", amount: 3218, percent: 63.0, avgMonthly: 358 },
        { name: "สุขภาพ & การรักษา", amount: 1890, percent: 37.0, avgMonthly: 1829 }
      ],
      monthlyHistory: [3591, 593, 2312, 17, 0, 0, 0, 8060, 5108],
      prevMonthlyHistory: [0, 1289, 6675, 0, 3723, 0, 0, 949, 0]
    },
    {
      id: "transport",
      name: "7. 🚗 การเดินทาง (Transport & Car)",
      shortName: "การเดินทาง",
      latestAmount: 3562,
      yearlyAvg: 3883,
      sharePercent: 5.1,
      peakMonth: "มี.ค. (฿5.2k)",
      subcategories: [
        { name: "ค่ายานพาหนะ & ประกันรถ", amount: 2685, percent: 75.4, avgMonthly: 2715 },
        { name: "รถไฟฟ้า (Train & BTS)", amount: 552, percent: 15.5, avgMonthly: 694 },
        { name: "Taxi & มอเตอร์ไซค์", amount: 225, percent: 6.3, avgMonthly: 383 },
        { name: "ทางด่วน & ที่จอดรถ", amount: 100, percent: 2.8, avgMonthly: 91 }
      ],
      monthlyHistory: [4640, 2923, 5158, 3981, 3633, 3536, 4620, 2895, 3562],
      prevMonthlyHistory: [40168, 5667, 3097, 3776, 4256, 4201, 4607, 18495, 4556]
    },
    {
      id: "tax",
      name: "8. 📑 ภาษีเงินได้ (Tax 40)",
      shortName: "ภาษีเงินได้",
      latestAmount: 10079,
      yearlyAvg: 22533,
      sharePercent: 14.4,
      peakMonth: "ก.พ. (฿123.0k)",
      subcategories: [
        { name: "ภาษีเงินได้ 40(1)", amount: 10079, percent: 100.0, avgMonthly: 22533 }
      ],
      monthlyHistory: [9201, 123040, 10079, 10079, 10079, 10079, 10079, 10079, 10079],
      prevMonthlyHistory: [9201, 9201, 9201, 9201, 9201, 9201, 9201, 9201, 9201]
    }
  ],

  // Dividend Analytics (Frosted Glass Layout Models)
  dividendAnalytics: {
    total2026: 136201,
    total2025: 77813,
    yearlyGrowth: 75.0,
    monthly2026: [45, 36, 6664, 65135, 18097, 2614, 2160, 2425, 28483, 5358, 5184, 0],
    monthly2025: [2592, 0, 1653, 15352, 13455, 800, 2592, 12000, 20762, 3476, 4465, 665],
    streams: [
      { name: "ADVANC", amount: 80228, percent: 58.9 },
      { name: "TISCO", amount: 20925, percent: 15.4 },
      { name: "MC", amount: 10800, percent: 7.9 },
      { name: "QQQI", amount: 8091, percent: 5.9 },
      { name: "KTB", amount: 6451, percent: 4.7 },
      { name: "JEPQ", amount: 5928, percent: 4.4 },
      { name: "3BBIF", amount: 2339, percent: 1.7 },
      { name: "SCB", amount: 720, percent: 0.5 },
      { name: "GULF", amount: 720, percent: 0.5 }
    ],
    streamsPrevYear: [
      { name: "ADVANC", amount: 42150, percent: 54.2 },
      { name: "TISCO", amount: 18500, percent: 23.8 },
      { name: "MC", amount: 8200, percent: 10.5 },
      { name: "KTB", amount: 5100, percent: 6.6 },
      { name: "3BBIF", amount: 3863, percent: 4.9 }
    ],
    regularDivTotal: 119401,
    regularDivGrowth: 14.1,
    monthlyAvgDiv: 11350,
    monthlyExpense: 52366,
    expenseCoveragePct: 21.7,
    divCost: 1647800,
    divMkt: 2265560,
    divReturnPct: 37.49,
    yocVal: 8.27,
    mktYieldVal: 6.01,
    yocSpread: 2.26
  },

  // Dividend Payment History (All 109 Historical Records from sheet Dividen-Fund 2022-2026)
  dividendPayments: [
    { xdDate: "2026-11-04", payDate: "2026-11-25", ticker: "MC", companyName: "แม็คกรุ๊ป", market: "SET", port: "SET", dps: 0.36, grossAmount: 5760.0, wht: 576.0, netReceived: 5184.0 },
    { xdDate: "2026-10-21", payDate: "2026-10-23", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 21.4203, grossAmount: 1656.49, wht: 248.47, netReceived: 1408.01 },
    { xdDate: "2026-09-22", payDate: "2026-10-08", ticker: "KTB", companyName: "ธนาคารกรุงไทย", market: "SET", port: "SET", dps: 0.48, grossAmount: 3360.0, wht: 336.0, netReceived: 3024.0 },
    { xdDate: "2026-10-01", payDate: "2026-10-05", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 19.1035, grossAmount: 1088.99, wht: 163.35, netReceived: 925.64 },
    { xdDate: "2026-09-09", payDate: "2026-09-25", ticker: "SCB", companyName: "เอสซีบี เอกซ์", market: "SET", port: "SET", dps: 2.0, grossAmount: 800.0, wht: 80.0, netReceived: 720.0 },
    { xdDate: "2026-09-07", payDate: "2026-09-21", ticker: "TISCO", companyName: "ทิสโก้ไฟแนนเชียลกรุ๊ป", market: "SET", port: "SET", dps: 2.0, grossAmount: 6000.0, wht: 600.0, netReceived: 5400.0 },
    { xdDate: "2026-09-16", payDate: "2026-09-18", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 20.8553, grossAmount: 1561.23, wht: 234.19, netReceived: 1327.05 },
    { xdDate: "2026-08-18", payDate: "2026-09-03", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 8.69, grossAmount: 21464.3, wht: 2146.43, netReceived: 19317.87 },
    { xdDate: "2026-09-01", payDate: "2026-09-03", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 22.4559, grossAmount: 1280.09, wht: 192.01, netReceived: 1088.07 },
    { xdDate: "2026-08-19", payDate: "2026-09-02", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.14, grossAmount: 700.0, wht: 70.0, netReceived: 630.0 },
    { xdDate: "2026-08-19", payDate: "2026-08-21", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 21.4442, grossAmount: 1530.28, wht: 229.54, netReceived: 1300.74 },
    { xdDate: "2026-08-02", payDate: "2026-08-04", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 23.1945, grossAmount: 1322.19, wht: 198.33, netReceived: 1123.86 },
    { xdDate: "2026-07-22", payDate: "2026-07-24", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 20.8783, grossAmount: 1431.67, wht: 214.75, netReceived: 1216.92 },
    { xdDate: "2026-07-01", payDate: "2026-07-06", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 20.9573, grossAmount: 1109.93, wht: 166.49, netReceived: 943.44 },
    { xdDate: "2026-06-16", payDate: "2026-06-19", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 21.6153, grossAmount: 1369.34, wht: 205.4, netReceived: 1163.94 },
    { xdDate: "2026-05-21", payDate: "2026-06-04", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.14, grossAmount: 700.0, wht: 0.0, netReceived: 700.0 },
    { xdDate: "2026-06-02", payDate: "2026-06-04", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 18.5556, grossAmount: 882.61, wht: 132.39, netReceived: 750.22 },
    { xdDate: "2026-05-20", payDate: "2026-05-23", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 21.6811, grossAmount: 1254.95, wht: 188.24, netReceived: 1066.71 },
    { xdDate: "2026-04-30", payDate: "2026-05-19", ticker: "TISCO", companyName: "ทิสโก้ไฟแนนเชียลกรุ๊ป", market: "SET", port: "SET", dps: 5.75, grossAmount: 17250.0, wht: 1725.0, netReceived: 15525.0 },
    { xdDate: "2026-03-04", payDate: "2026-05-07", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 3.25, grossAmount: 799.5, wht: 79.95, netReceived: 719.55 },
    { xdDate: "2026-05-01", payDate: "2026-05-05", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 19.4439, grossAmount: 924.87, wht: 138.73, netReceived: 786.14 },
    { xdDate: "2026-03-03", payDate: "2026-04-30", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 27.4, grossAmount: 67678.0, wht: 6767.8, netReceived: 60910.2 },
    { xdDate: "2026-04-10", payDate: "2026-04-30", ticker: "KTB", companyName: "ธนาคารกรุงไทย", market: "SET", port: "SET", dps: 2.24, grossAmount: 3808.0, wht: 380.8, netReceived: 3427.2 },
    { xdDate: "2026-04-22", payDate: "2026-04-24", ticker: "QQQI", companyName: "NEOS Nasdaq-100 High Income ETF", market: "US", port: "US", dps: 20.727, grossAmount: 714.82, wht: 107.22, netReceived: 607.6 },
    { xdDate: "2026-04-04", payDate: "2026-04-06", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 18.3911, grossAmount: 222.98, wht: 33.45, netReceived: 189.54 },
    { xdDate: "2026-02-27", payDate: "2026-03-12", ticker: "MC", companyName: "แม็คกรุ๊ป", market: "SET", port: "SET", dps: 0.52, grossAmount: 6240.0, wht: 624.0, netReceived: 5616.0 },
    { xdDate: "2026-02-17", payDate: "2026-03-04", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.2241, grossAmount: 1120.6, wht: 112.06, netReceived: 1008.54 },
    { xdDate: "2026-03-02", payDate: "2026-03-04", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 16.7461, grossAmount: 46.67, wht: 7.0, netReceived: 39.67 },
    { xdDate: "2026-02-02", payDate: "2026-02-04", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 15.3314, grossAmount: 42.73, wht: 6.41, netReceived: 36.32 },
    { xdDate: "2025-12-31", payDate: "2026-01-05", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 18.9504, grossAmount: 52.81, wht: 7.92, netReceived: 44.89 },
    { xdDate: "2025-12-04", payDate: "2025-12-26", ticker: "NVDA", companyName: "NVIDIA Corporation", market: "US", port: "US", dps: 0.329, grossAmount: 0.78, wht: 0.12, netReceived: 0.66 },
    { xdDate: "2025-11-18", payDate: "2025-12-22", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.1372, grossAmount: 686.12, wht: 68.61, netReceived: 617.51 },
    { xdDate: "2025-12-08", payDate: "2025-12-15", ticker: "GOOGL", companyName: "Alphabet Inc.", market: "US", port: "US", dps: 6.909, grossAmount: 4.3, wht: 0.64, netReceived: 3.65 },
    { xdDate: "2025-12-01", payDate: "2025-12-03", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 18.1937, grossAmount: 50.7, wht: 7.61, netReceived: 43.1 },
    { xdDate: "2025-11-05", payDate: "2025-11-25", ticker: "MC", companyName: "แม็คกรุ๊ป", market: "SET", port: "SET", dps: 0.41, grossAmount: 4920.0, wht: 492.0, netReceived: 4428.0 },
    { xdDate: "2025-11-03", payDate: "2025-11-05", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 15.6604, grossAmount: 43.64, wht: 6.55, netReceived: 37.1 },
    { xdDate: "2025-10-10", payDate: "2025-10-10", ticker: "ULTY", companyName: "YieldMax Ultra Option Income Strategy ETF", market: "US", port: "US", dps: 2.9742, grossAmount: 502.72, wht: 79.17, netReceived: 423.54 },
    { xdDate: "2025-10-03", payDate: "2025-10-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2025-10-03", payDate: "2025-10-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2025-10-03", payDate: "2025-10-03", ticker: "ULTY", companyName: "YieldMax Ultra Option Income Strategy ETF", market: "US", port: "US", dps: 3.0038, grossAmount: 500.04, wht: 75.01, netReceived: 425.04 },
    { xdDate: "2025-10-03", payDate: "2025-10-03", ticker: "JEPQ", companyName: "JPMorgan Nasdaq Equity Premium Income ETF", market: "US", port: "US", dps: 14.657, grossAmount: 40.85, wht: 6.13, netReceived: 34.72 },
    { xdDate: "2025-10-02", payDate: "2025-10-02", ticker: "NVDA", companyName: "NVIDIA Corporation", market: "US", port: "US", dps: 0.329, grossAmount: 0.78, wht: 0.12, netReceived: 0.66 },
    { xdDate: "2025-09-26", payDate: "2025-09-26", ticker: "ULTY", companyName: "YieldMax Ultra Option Income Strategy ETF", market: "US", port: "US", dps: 3.0268, grossAmount: 12.3, wht: 0.0, netReceived: 69.7 },
    { xdDate: "2025-09-10", payDate: "2025-09-25", ticker: "TISCO", companyName: "ทิสโก้ไฟแนนเชียลกรุ๊ป", market: "SET", port: "SET", dps: 2.0, grossAmount: 5200.0, wht: 520.0, netReceived: 4680.0 },
    { xdDate: "2025-08-20", payDate: "2025-09-03", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.1545, grossAmount: 772.75, wht: 77.27, netReceived: 695.48 },
    { xdDate: "2025-08-20", payDate: "2025-09-03", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 6.89, grossAmount: 17018.3, wht: 1701.83, netReceived: 15316.47 },
    { xdDate: "2025-08-07", payDate: "2025-08-07", ticker: "CHUBB Life", companyName: "ชับบ์ ไลฟ์ แอสชัวรันซ์", market: "Insurance", port: "Insurance", dps: 1.0, grossAmount: 12000.0, wht: 0.0, netReceived: 12000.0 },
    { xdDate: "2025-07-03", payDate: "2025-07-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2025-07-03", payDate: "2025-07-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2025-05-20", payDate: "2025-06-05", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.16, grossAmount: 800.0, wht: 0.0, netReceived: 800.0 },
    { xdDate: "2025-04-28", payDate: "2025-05-16", ticker: "TISCO", companyName: "ทิสโก้ไฟแนนเชียลกรุ๊ป", market: "SET", port: "SET", dps: 5.75, grossAmount: 14950.0, wht: 1495.0, netReceived: 13455.0 },
    { xdDate: "2025-02-20", payDate: "2025-04-10", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 5.74, grossAmount: 14177.8, wht: 1417.78, netReceived: 12760.02 },
    { xdDate: "2025-04-03", payDate: "2025-04-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2025-04-03", payDate: "2025-04-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2025-02-20", payDate: "2025-03-06", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.16, grossAmount: 800.0, wht: 0.0, netReceived: 800.0 },
    { xdDate: "2025-02-19", payDate: "2025-03-04", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 6.54, grossAmount: 948.3, wht: 94.83, netReceived: 853.47 },
    { xdDate: "2025-01-06", payDate: "2025-01-06", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2025-01-06", payDate: "2025-01-06", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2024-11-08", payDate: "2024-11-19", ticker: "KFLTFDIV", companyName: "กองทุนเปิดกรุงศรีหุ้นระยะยาวปันผล", market: "LTF", port: "LTF", dps: 0.25, grossAmount: 421.01, wht: 42.1, netReceived: 378.91 },
    { xdDate: "2024-10-03", payDate: "2024-10-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2024-10-03", payDate: "2024-10-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2024-09-11", payDate: "2024-09-27", ticker: "TISCO", companyName: "ทิสโก้ไฟแนนเชียลกรุ๊ป", market: "SET", port: "SET", dps: 2.0, grossAmount: 3800.0, wht: 380.0, netReceived: 3420.0 },
    { xdDate: "2024-08-20", payDate: "2024-09-23", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.19, grossAmount: 950.0, wht: 0.0, netReceived: 950.0 },
    { xdDate: "2024-08-30", payDate: "2024-09-13", ticker: "CPF", companyName: "เจริญโภคภัณฑ์อาหาร", market: "SET", port: "SET", dps: 0.45, grossAmount: 1575.0, wht: 157.5, netReceived: 1417.5 },
    { xdDate: "2024-08-20", payDate: "2024-09-05", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 2.0, grossAmount: 290.0, wht: 29.0, netReceived: 261.0 },
    { xdDate: "2024-08-19", payDate: "2024-09-03", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 4.87, grossAmount: 12028.9, wht: 1202.89, netReceived: 10826.01 },
    { xdDate: "2024-08-07", payDate: "2024-08-07", ticker: "CHUBB Life", companyName: "ชับบ์ ไลฟ์ แอสชัวรันซ์", market: "Insurance", port: "Insurance", dps: 1.0, grossAmount: 12000.0, wht: 0.0, netReceived: 12000.0 },
    { xdDate: "2024-07-03", payDate: "2024-07-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2024-07-03", payDate: "2024-07-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2024-05-14", payDate: "2024-05-31", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.19, grossAmount: 950.0, wht: 0.0, netReceived: 950.0 },
    { xdDate: "2024-02-21", payDate: "2024-04-19", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.7, grossAmount: 246.5, wht: 24.65, netReceived: 221.85 },
    { xdDate: "2024-02-19", payDate: "2024-04-17", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 4.61, grossAmount: 11386.7, wht: 1138.67, netReceived: 10248.03 },
    { xdDate: "2024-04-03", payDate: "2024-04-03", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2024-04-03", payDate: "2024-04-03", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2024-02-23", payDate: "2024-03-18", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.16, grossAmount: 800.0, wht: 0.0, netReceived: 800.0 },
    { xdDate: "2023-11-21", payDate: "2023-12-06", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.16, grossAmount: 800.0, wht: 80.0, netReceived: 720.0 },
    { xdDate: "2023-11-08", payDate: "2023-11-17", ticker: "KFLTFDIV", companyName: "กองทุนเปิดกรุงศรีหุ้นระยะยาวปันผล", market: "LTF", port: "LTF", dps: 0.4, grossAmount: 673.61, wht: 67.36, netReceived: 606.25 },
    { xdDate: "2023-09-30", payDate: "2023-09-30", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2023-09-30", payDate: "2023-09-30", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2023-08-23", payDate: "2023-09-08", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.47, grossAmount: 213.15, wht: 21.31, netReceived: 191.84 },
    { xdDate: "2023-08-23", payDate: "2023-09-06", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.23, grossAmount: 1150.0, wht: 115.0, netReceived: 1035.0 },
    { xdDate: "2023-08-18", payDate: "2023-09-05", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 4.0, grossAmount: 9880.0, wht: 988.0, netReceived: 8892.0 },
    { xdDate: "2023-08-07", payDate: "2023-08-25", ticker: "BTS", companyName: "บีทีเอส กรุ๊ป โฮลดิ้งส์", market: "SET", port: "SET", dps: 0.16, grossAmount: 6080.0, wht: 608.0, netReceived: 5472.0 },
    { xdDate: "2023-08-07", payDate: "2023-08-07", ticker: "CHUBB Life", companyName: "ชับบ์ ไลฟ์ แอสชัวรันซ์", market: "Insurance", port: "Insurance", dps: 1.0, grossAmount: 12000.0, wht: 0.0, netReceived: 12000.0 },
    { xdDate: "2023-06-30", payDate: "2023-06-30", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2023-06-30", payDate: "2023-06-30", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2023-05-23", payDate: "2023-06-07", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.23, grossAmount: 1150.0, wht: 115.0, netReceived: 1035.0 },
    { xdDate: "2023-05-08", payDate: "2023-05-25", ticker: "CPF", companyName: "เจริญโภคภัณฑ์อาหาร", market: "SET", port: "SET", dps: 0.35, grossAmount: 1225.0, wht: 122.5, netReceived: 1102.5 },
    { xdDate: "2023-02-23", payDate: "2023-04-21", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.56, grossAmount: 226.2, wht: 22.62, netReceived: 203.58 },
    { xdDate: "2023-02-22", payDate: "2023-04-19", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 4.24, grossAmount: 10472.8, wht: 1047.28, netReceived: 9425.52 },
    { xdDate: "2023-03-31", payDate: "2023-03-31", ticker: "SiriHub-Al", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2023-03-31", payDate: "2023-03-31", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2023-03-07", payDate: "2023-03-20", ticker: "3BBIF", companyName: "กองทุนรวมโครงสร้างพื้นฐาน 3BBIF", market: "SET", port: "SET", dps: 0.23, grossAmount: 1150.0, wht: 115.0, netReceived: 1035.0 },
    { xdDate: "2023-01-30", payDate: "2023-02-10", ticker: "BTS", companyName: "บีทีเอส กรุ๊ป โฮลดิ้งส์", market: "SET", port: "SET", dps: 0.15, grossAmount: 5700.0, wht: 570.0, netReceived: 5130.0 },
    { xdDate: "2023-01-10", payDate: "2023-01-27", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.4, grossAmount: 203.0, wht: 20.3, netReceived: 182.7 },
    { xdDate: "2022-11-08", payDate: "2022-11-17", ticker: "KFLTFDIV", companyName: "กองทุนเปิดกรุงศรีหุ้นระยะยาวปันผล", market: "LTF", port: "LTF", dps: 0.3, grossAmount: 505.21, wht: 50.52, netReceived: 454.69 },
    { xdDate: "2022-09-30", payDate: "2022-09-30", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2022-09-30", payDate: "2022-09-30", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2022-09-07", payDate: "2022-08-23", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.76, grossAmount: 255.2, wht: 38.28, netReceived: 216.92 },
    { xdDate: "2022-09-06", payDate: "2022-08-19", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 3.45, grossAmount: 8280.0, wht: 1242.0, netReceived: 7038.0 },
    { xdDate: "2022-08-07", payDate: "2022-08-07", ticker: "CHUBB Life", companyName: "ชับบ์ ไลฟ์ แอสชัวรันซ์", market: "Insurance", port: "Insurance", dps: 1.0, grossAmount: 12000.0, wht: 0.0, netReceived: 12000.0 },
    { xdDate: "2022-08-23", payDate: "2022-08-03", ticker: "BTS", companyName: "บีทีเอส กรุ๊ป โฮลดิ้งส์", market: "SET", port: "SET", dps: 0.16, grossAmount: 6080.0, wht: 912.0, netReceived: 5168.0 },
    { xdDate: "2022-06-30", payDate: "2022-06-30", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.1125, grossAmount: 2249.8, wht: 337.47, netReceived: 1912.33 },
    { xdDate: "2022-06-30", payDate: "2022-06-30", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.2, grossAmount: 800.0, wht: 120.0, netReceived: 680.0 },
    { xdDate: "2022-03-31", payDate: "2022-03-31", ticker: "SiriHub-A", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ A", market: "ICO", port: "ICO", dps: 0.2129, grossAmount: 4257.8, wht: 638.67, netReceived: 3619.13 },
    { xdDate: "2022-03-31", payDate: "2022-03-31", ticker: "SiriHub-B", companyName: "โทเคนดิจิทัลเพื่อการลงทุนสิริ ฮับ B", market: "ICO", port: "ICO", dps: 0.3785, grossAmount: 1514.0, wht: 227.1, netReceived: 1286.9 },
    { xdDate: "2022-04-21", payDate: "2022-02-23", ticker: "INTUCH/GULF", companyName: "กัลฟ์ / อินทัช โฮลดิ้งส์", market: "SET", port: "SET", dps: 1.6, grossAmount: 232.0, wht: 34.8, netReceived: 197.2 },
    { xdDate: "2022-04-19", payDate: "2022-02-18", ticker: "ADVANC", companyName: "แอดวานซ์ อินโฟร์ เซอร์วิส", market: "SET", port: "SET", dps: 4.24, grossAmount: 10176.0, wht: 1526.4, netReceived: 8649.6 },
    { xdDate: "2022-02-24", payDate: "2022-02-07", ticker: "BTS", companyName: "บีทีเอส กรุ๊ป โฮลดิ้งส์", market: "SET", port: "SET", dps: 0.15, grossAmount: 5700.0, wht: 855.0, netReceived: 4845.0 },
  ],

  // Dividend Monthly Inflow Chart (2024, 2025, 2026)
  dividendMonthlyTimeline: [
    { month: "ม.ค.", year2024: 10500, year2025: 11200, year2026: 12400, set: 8200, us: 2200, interest: 2000 },
    { month: "ก.พ.", year2024: 12000, year2025: 14500, year2026: 18200, set: 14000, us: 2400, interest: 1800 },
    { month: "มี.ค.", year2024: 28000, year2025: 31000, year2026: 35400, set: 29000, us: 3600, interest: 2800 },
    { month: "เม.ย.", year2024: 55000, year2025: 61500, year2026: 68500, set: 61000, us: 4500, interest: 3000 },
    { month: "พ.ค.", year2024: 18500, year2025: 20400, year2026: 22600, set: 17500, us: 3100, interest: 2000 },
    { month: "มิ.ย.", year2024: 16200, year2025: 17800, year2026: 19400, set: 12000, us: 2400, interest: 5000 },
    { month: "ก.ค.", year2024: 19000, year2025: 21500, year2026: 24200, set: 18500, us: 3200, interest: 2500 },
    { month: "ส.ค.", year2024: 31000, year2025: 34800, year2026: 38700, set: 32000, us: 4200, interest: 2500 },
    { month: "ก.ย.", year2024: 58000, year2025: 65200, year2026: 72800, set: 64500, us: 4800, interest: 3500 },
    { month: "ต.ค.", year2024: 14000, year2025: 16500, year2026: 22000, set: 16500, us: 3200, interest: 2300 },
    { month: "พ.ย.", year2024: 15500, year2025: 18000, year2026: 24000, set: 18000, us: 3500, interest: 2500 },
    { month: "ธ.ค.", year2024: 24500, year2025: 28000, year2026: 32000, set: 23000, us: 4000, interest: 5000 }
  ],

  // 5 Investment Sources (Invest Monthly)
  investmentSources: [
    { id: "salary", name: "🟦 เงินเดือนประจำ (Salary)", monthlyAmount: 25000, yearlyAmount: 300000, note: "DCA สม่ำเสมอทุกวันที่ 28", color: "#3b82f6" },
    { id: "bonus", name: "🟨 โบนัสประจำปี (Bonus)", monthlyAmount: 10000, yearlyAmount: 120000, note: "ออม 60% ของโบนัสสิ้นปี", color: "#eab308" },
    { id: "tax_refund", name: "🟩 ขอคืนภาษี (Tax Refund)", monthlyAmount: 3750, yearlyAmount: 45000, note: "คืนภาษี เม.ย. นำมาทบต้น 100%", color: "#10b981" },
    { id: "reinvest", name: "🟪 ปันผลทบต้น (Div Re-invest)", monthlyAmount: 32138, yearlyAmount: 385663, note: "ทบต้นอัตโนมัติสร้าง Snowball Effect", color: "#8b5cf6" },
    { id: "rebalance", name: "🔴 ปรับพอร์ต (Rebalance)", monthlyAmount: 0, yearlyAmount: 50000, note: "ปรับสัดส่วนสินทรัพย์ปีละ 2 ครั้ง", color: "#f43f5e" }
  ],

  // Forecast SET70_US30-V2 Data (Forecast Total Assess)
  forecastByYear: {
    "2021": 3254000,
    "2022": 4019940,
    "2023": 4599920,
    "2024": 5308290,
    "2025": 6004090,
    "2026": 6692381,
    "2027": 7441418,
    "2028": 8451106,
    "2029": 9575055,
    "2030": 10776867,
    "2031": 12066632,
    "2032": 13449677,
    "2033": 14937135,
    "2034": 16535455,
    "2035": 18251577,
    "2036": 20092967,
    "2037": 22067661,
    "2038": 24184308,
    "2039": 26452223
},

  forecastRoadmap: [
    {
        "year": 2021,
        "age": 42,
        "forecastTotalAssess": 3254000,
        "actualTotalAssess": null,
        "kpiResult": "Pass",
        "monthlySaving": 25000,
        "investExcPvd": 100000,
        "mktSet": null,
        "usPort": null,
        "pvdTotal": 1108000,
        "divSet": null,
        "divUs": null,
        "retiredDivPerYear": null,
        "retiredEarnPerMonth": null
    },
    {
        "year": 2022,
        "age": 43,
        "forecastTotalAssess": 4019940,
        "actualTotalAssess": 4200000,
        "kpiResult": "Pass",
        "monthlySaving": 26000,
        "investExcPvd": 511740,
        "mktSet": null,
        "usPort": null,
        "pvdTotal": 1259200,
        "divSet": null,
        "divUs": null,
        "retiredDivPerYear": null,
        "retiredEarnPerMonth": null
    },
    {
        "year": 2023,
        "age": 44,
        "forecastTotalAssess": 4599920,
        "actualTotalAssess": 4533077,
        "kpiResult": "Fail",
        "monthlySaving": 27000,
        "investExcPvd": 524580,
        "mktSet": null,
        "usPort": null,
        "pvdTotal": 1417600,
        "divSet": null,
        "divUs": null,
        "retiredDivPerYear": null,
        "retiredEarnPerMonth": null
    },
    {
        "year": 2024,
        "age": 45,
        "forecastTotalAssess": 5308290,
        "actualTotalAssess": 5401237,
        "kpiResult": "Pass",
        "monthlySaving": 28000,
        "investExcPvd": 542770,
        "mktSet": null,
        "usPort": null,
        "pvdTotal": 1583200,
        "divSet": null,
        "divUs": null,
        "retiredDivPerYear": null,
        "retiredEarnPerMonth": null
    },
    {
        "year": 2025,
        "age": 46,
        "forecastTotalAssess": 6004090,
        "actualTotalAssess": 5939144,
        "kpiResult": "Fail",
        "monthlySaving": 29000,
        "investExcPvd": 523000,
        "mktSet": null,
        "usPort": null,
        "pvdTotal": 1756000,
        "divSet": 54891,
        "divUs": null,
        "retiredDivPerYear": null,
        "retiredEarnPerMonth": null
    },
    {
        "year": 2026,
        "age": 47,
        "forecastTotalAssess": 6692381,
        "actualTotalAssess": 7105799,
        "kpiResult": "Pass",
        "monthlySaving": 30500,
        "investExcPvd": 508291,
        "mktSet": 2030000,
        "usPort": 242000,
        "pvdTotal": 1936000,
        "divSet": 81952,
        "divUs": 10285,
        "retiredDivPerYear": 92237,
        "retiredEarnPerMonth": 7686
    },
    {
        "year": 2027,
        "age": 48,
        "forecastTotalAssess": 7441418,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 32000,
        "investExcPvd": 561837,
        "mktSet": 2357315,
        "usPort": 370973,
        "pvdTotal": 2123200,
        "divSet": 99955,
        "divUs": 31533,
        "retiredDivPerYear": 131487,
        "retiredEarnPerMonth": 11998
    },
    {
        "year": 2028,
        "age": 49,
        "forecastTotalAssess": 8451106,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 48500,
        "investExcPvd": 815287,
        "mktSet": 2827087,
        "usPort": 566549,
        "pvdTotal": 2317600,
        "divSet": 125792,
        "divUs": 48157,
        "retiredDivPerYear": 173949,
        "retiredEarnPerMonth": 15806
    },
    {
        "year": 2029,
        "age": 50,
        "forecastTotalAssess": 9575055,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 50500,
        "investExcPvd": 922349,
        "mktSet": 3362571,
        "usPort": 797278,
        "pvdTotal": 2519200,
        "divSet": 155244,
        "divUs": 67769,
        "retiredDivPerYear": 223012,
        "retiredEarnPerMonth": 20201
    },
    {
        "year": 2030,
        "age": 51,
        "forecastTotalAssess": 10776867,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 52500,
        "investExcPvd": 993012,
        "mktSet": 3941665,
        "usPort": 1054949,
        "pvdTotal": 2728000,
        "divSet": 187094,
        "divUs": 89671,
        "retiredDivPerYear": 276765,
        "retiredEarnPerMonth": 25013
    },
    {
        "year": 2031,
        "age": 52,
        "forecastTotalAssess": 12066632,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 55000,
        "investExcPvd": 1073765,
        "mktSet": 4570018,
        "usPort": 1343441,
        "pvdTotal": 2944000,
        "divSet": 221653,
        "divUs": 114192,
        "retiredDivPerYear": 335846,
        "retiredEarnPerMonth": 30296
    },
    {
        "year": 2032,
        "age": 53,
        "forecastTotalAssess": 13449677,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 57500,
        "investExcPvd": 1159846,
        "mktSet": 5250498,
        "usPort": 1665619,
        "pvdTotal": 3167200,
        "divSet": 259080,
        "divUs": 141578,
        "retiredDivPerYear": 400657,
        "retiredEarnPerMonth": 36087
    },
    {
        "year": 2033,
        "age": 54,
        "forecastTotalAssess": 14937135,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 60500,
        "investExcPvd": 1257057,
        "mktSet": 5989249,
        "usPort": 2025988,
        "pvdTotal": 3397600,
        "divSet": 299711,
        "divUs": 172209,
        "retiredDivPerYear": 471920,
        "retiredEarnPerMonth": 42449
    },
    {
        "year": 2034,
        "age": 55,
        "forecastTotalAssess": 16535455,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 63500,
        "investExcPvd": 1360720,
        "mktSet": 6789663,
        "usPort": 2428096,
        "pvdTotal": 3635200,
        "divSet": 343734,
        "divUs": 206388,
        "retiredDivPerYear": 550122,
        "retiredEarnPerMonth": 49424
    },
    {
        "year": 2035,
        "age": 56,
        "forecastTotalAssess": 18251577,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 66500,
        "investExcPvd": 1471322,
        "mktSet": 7655328,
        "usPort": 2875821,
        "pvdTotal": 3880000,
        "divSet": 391345,
        "divUs": 244445,
        "retiredDivPerYear": 635790,
        "retiredEarnPerMonth": 57059
    },
    {
        "year": 2036,
        "age": 57,
        "forecastTotalAssess": 20092967,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 69500,
        "investExcPvd": 1589390,
        "mktSet": 8590043,
        "usPort": 3373400,
        "pvdTotal": 4132000,
        "divSet": 442755,
        "divUs": 286739,
        "retiredDivPerYear": 729494,
        "retiredEarnPerMonth": 65403
    },
    {
        "year": 2037,
        "age": 58,
        "forecastTotalAssess": 22067661,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 72500,
        "investExcPvd": 1715494,
        "mktSet": 9597826,
        "usPort": 3925464,
        "pvdTotal": 4391200,
        "divSet": 498183,
        "divUs": 333664,
        "retiredDivPerYear": 831847,
        "retiredEarnPerMonth": 74510
    },
    {
        "year": 2038,
        "age": 59,
        "forecastTotalAssess": 24184308,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 75500,
        "investExcPvd": 1850247,
        "mktSet": 10682929,
        "usPort": 4537075,
        "pvdTotal": 4657600,
        "divSet": 557863,
        "divUs": 385651,
        "retiredDivPerYear": 943515,
        "retiredEarnPerMonth": 84437
    },
    {
        "year": 2039,
        "age": 60,
        "forecastTotalAssess": 26452223,
        "actualTotalAssess": null,
        "kpiResult": null,
        "monthlySaving": 78500,
        "investExcPvd": 1994315,
        "mktSet": 11849853,
        "usPort": 5213765,
        "pvdTotal": 4931200,
        "divSet": 622044,
        "divUs": 443170,
        "retiredDivPerYear": 1065214,
        "retiredEarnPerMonth": 95247
    }
],

  // Wealth Roadmap Milestones (From Forecast SET70_US30-V2 "Forecast Total Assess")
  milestones: [
    { id: 1, year: 2024, age: 45, title: "Milestone 1 (2024)", target: 5308290, targetLabel: "฿ 5.31M", actual: 5401237, status: "achieved", statusLabel: "Achieved ✅ (101.8%)", note: "สำเร็จปี 2024 ตามเป้าหมาย Forecast Total Assess" },
    { id: 2, year: 2026, age: 47, title: "Milestone 2 (2026)", target: 6692381, targetLabel: "฿ 6.69M", actual: 7105257, status: "achieved", statusLabel: "Achieved ✅ (106.2%)", note: "ปัจจุบันทะลุเป้าหมายปี 2026 แล้ว (+฿ 413k / KPI Pass)" },
    { id: 3, year: 2027, age: 48, title: "Milestone 3 (2027)", target: 7441418, targetLabel: "฿ 7.44M", actual: null, status: "in_progress", statusLabel: "In Progress ⏳ (95.5%)", note: "เป้าหมายปีถัดไป ต้องการอีก ฿ 336k" },
    { id: 4, year: 2030, age: 51, title: "Milestone 4 (10M)", target: 10776867, targetLabel: "฿ 10.78M", actual: null, status: "in_progress", statusLabel: "10M Target 🚀 (65.9%)", note: "ก้าวสู่พอร์ต 8 หลัก (10 ล้านบาท)" },
    { id: 5, year: 2034, age: 55, title: "Milestone 5 (Freedom)", target: 16535455, targetLabel: "฿ 16.54M", actual: null, status: "freedom", statusLabel: "Financial Freedom 🌟", note: "อิสรภาพการเงินถาวร ปันผล ฿ 43k/ด." },
    { id: 6, year: 2039, age: 60, title: "Milestone 6 (Retire 60)", target: 26452223, targetLabel: "฿ 26.45M", actual: null, status: "ultimate", statusLabel: "Golden Freedom 🏆", note: "เป้าหมายเกษียณอายุ 60 ปีเต็ม รายรับ ฿ 136k/ด." }
  ],

  // 10 Latest Transactions (From Expense Sheet - October 2026)
  expenseTransactions: [
    { date: "01-Oct-2026", category: "Mommy", mainCategory: "Fixed costs", description: "Mommy", amount: 5000 },
    { date: "01-Oct-2026", category: "Convenience store", mainCategory: "Variable costs", description: "7-11", amount: 29 },
    { date: "30-Sep-2026", category: "Sport & Shoe", mainCategory: "Variable costs", description: "เสื้อ Liverpool จ่าย Roger", amount: 1728 },
    { date: "30-Sep-2026", category: "Food", mainCategory: "Variable costs", description: "Burger king", amount: 214 },
    { date: "30-Sep-2026", category: "Food", mainCategory: "Variable costs", description: "เล็กเลือดหมู", amount: 90 },
    { date: "30-Sep-2026", category: "Convenience store", mainCategory: "Variable costs", description: "7-11", amount: 22 },
    { date: "29-Sep-2026", category: "Convenience store", mainCategory: "Variable costs", description: "7-11", amount: 7 },
    { date: "29-Sep-2026", category: "Food", mainCategory: "Variable costs", description: "Salad Factory", amount: 200 },
    { date: "29-Sep-2026", category: "Food", mainCategory: "Variable costs", description: "ครัวคุณแขก", amount: 60 },
    { date: "28-Sep-2026", category: "Food", mainCategory: "Variable costs", description: "Noodle ให้ ballgo", amount: 90 }
  ]
};

// Global Store State
var currentFinData = JSON.parse(JSON.stringify(DEFAULT_FIN_DATA));
