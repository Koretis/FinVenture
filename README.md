# 🚀 FinVenture — Personal Financial Intelligence Dashboard

> แดชบอร์ดติดตามการเงินส่วนบุคคล เชื่อมต่อ Google Sheets แบบ Real-time · ไม่ต้องมี Backend · ทำงานได้บน Browser เพียงอย่างเดียว

---

## 📋 ภาพรวม (Overview)

**FinVenture** คือ Personal Finance Dashboard ที่ออกแบบมาในสไตล์ **Neo-Bento / Apple Linear** ครอบคลุมการติดตามสินทรัพย์, กระแสเงินสด, พอร์ตการลงทุน, เงินปันผล และแผน Financial Freedom ทั้งหมดในหน้าเดียว โดยดึงข้อมูลจาก **Google Sheets** ของผู้ใช้โดยตรงแบบ Realtime ผ่าน Google Visualization API (GVIZ) โดยไม่ต้องมี Backend Server หรือ API Key ใดๆ

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 📊 Tab 1 — ภาพรวม (Overview)
- **Hero KPI Cards** — แสดงมูลค่าพอร์ต, กำไร/ขาดทุน, เงินสด, ปันผล YTD, รายได้/รายจ่ายล่าสุด
- **Net Worth History Chart** — กราฟเส้น SVG แสดงมูลค่าพอร์ตย้อนหลัง 45 เดือน (2023–2026) พร้อม Forecast
  - กรองตามช่วงเวลา: 6M / 1Y / 3Y / ALL
  - กรองตามประเภทสินทรัพย์: ALL / SET / PVD / US / GOLD / CRYPTO / INS / CASH
  - สลับโหมดเส้น: Smooth / Linear
- **Asset Allocation Capsule** — แสดงสัดส่วนการลงทุนแบบ Pill ด้วยสี 7 กลุ่มสินทรัพย์
- **Sankey Diagram** — แผนภาพแสดงกระแสเงิน รายได้ → ออม/ลงทุน → รายจ่าย
- **Freedom Goal Card** — แสดงเป้าหมาย Financial Freedom และความคืบหน้า

### 💸 Tab 2 — กระแสเงินสด (Cash Flow)
- **Balance Overview** — วงกลม 3 วง แสดงเงินสด / รายรับ / รายจ่าย เดือนปัจจุบัน
- **สถิติรายจ่าย (Expense Bar Chart)** — กราฟแท่งโค้งแสดงรายจ่ายย้อนหลัง 6 หรือ 12 เดือน พร้อม Peak Month Pill
- **สุขภาพการเงิน (Financial Health)** — มาตรวัด SVG คำนวณจาก `(รายรับ − รายจ่าย) / รายรับ × 100%`
- **รายการล่าสุด** — 10 รายการค่าใช้จ่ายล่าสุด จาก Sheet `Expense`
- **สัดส่วนรายหมวด** — Progress bar แต่ละหมวดหมู่พร้อมสถิติ: ยอดรวม, ค่าเฉลี่ยต่อปี, สัดส่วน%, เดือนสูงสุด
- **เจาะลึกรายจ่ายรายหมวดหมู่ (Category Deep Dive)** — กราฟเส้น SVG รายเดือนของแต่ละหมวด เปลี่ยนได้ผ่าน Dropdown

**หมวดหมู่รายจ่าย (8 หมวด):**

| Emoji | หมวดหลัก | ตัวอย่างรายการ |
|-------|-----------|----------------|
| 🏠 | ที่พักอาศัย (Housing) | ค่าเช่า, ผ่อนบ้าน, ค่าส่วนกลาง |
| 🍔 | อาหาร (Food) | ร้านอาหาร, ร้านสะดวกซื้อ, GrabFood |
| ✈️ | ท่องเที่ยว (Travel) | ตั๋ว, โรงแรม, ทัวร์ |
| 💻 | อุปกรณ์ (Gadgets) | โทรศัพท์, คอมพิวเตอร์, Subscription |
| 🚗 | เดินทาง (Transport) | น้ำมัน, Grab, ทางด่วน, ประกันภัยรถยนต์ |
| 👨‍👩‍👦 | ครอบครัว (Family) | ค่าเล่าเรียน, ของขวัญ |
| 🏃 | สุขภาพ (Health) | โรงพยาบาล, ยา, ฟิตเนส |
| 📑 | ภาษี/ประกัน (Tax) | ภาษีเงินได้, ประกันชีวิต, ประกันสุขภาพ |

### 📈 Tab 3 — พอร์ตการลงทุน (Portfolio)
- **Holdings Table** — ตารางสินทรัพย์ทั้งหมดพร้อมข้อมูล ราคา, กำไร/ขาดทุน, สัดส่วน
- **Portfolio Stats** — สรุปสถิติพอร์ต: Total Cost, Market Value, Capital Gain %, Yield on Cost
- กรองตามประเภทสินทรัพย์: ALL / SET / US / GOLD / CRYPTO / PVD / INS / CASH

### 💰 Tab 4 — เงินปันผล (Dividends)
- **Dividend Timeline** — กราฟเส้นแสดงเงินปันผลรายเดือน
- สรุปปันผล YTD, ปันผลเฉลี่ยต่อเดือน, ปันผลคาดการณ์ทั้งปี

### 🗺️ Tab 5 — แผนการ (Roadmap)
- **Roadmap View** — แสดงแผน Financial Freedom Forecast ระยะยาว
- สัดส่วนการลงทุน 70% SET / 30% US
- เป้าหมาย Passive Income และ Freedom Fund

---

## 🗂️ โครงสร้างไฟล์ (File Structure)

```
FinVenture/
├── index.html               # ไฟล์หลัก — HTML, CSS inline, และ UI Layout ทั้งหมด
├── start-server.command     # สคริปต์เปิด Local Server (macOS — Double-click)
├── README.md                # ไฟล์นี้
│
├── js/
│   ├── data-store.js        # Default dataset & currentFinData schema (Fallback ก่อน sync)
│   ├── sheets-api.js        # Google GVIZ API Engine — ดึงและ parse ข้อมูลจาก Sheets
│   ├── charts.js            # SVG & Canvas Charting Engine (FinCharts namespace)
│   ├── cashflow-ui.js       # Cash Flow Page UI Module (renderCashFlowPage)
│   └── app.js               # Main Controller — Tab, Theme, Currency, Sync
│
└── css/                     # (CSS ฝังรวมอยู่ใน index.html)
```

---

## 🔗 การเชื่อมต่อ Google Sheets (Data Source)

ข้อมูลทั้งหมดดึงมาจาก **Google Spreadsheet** เดียวผ่าน Google Visualization (GVIZ) API  
ไม่ต้องใช้ OAuth, Service Account, หรือ API Key ใดๆ — ใช้งานได้ทันทีถ้า Spreadsheet ตั้ง **Share → Anyone with the link → Viewer**

### Sheets ที่ใช้งาน

| Sheet Name | ข้อมูลที่ดึง |
|---|---|
| `Portfolio-Lastest` | KPI ภาพรวม: Net Worth, Capital Gain, Cash, ปันผล |
| `Portfolio` | ประวัติมูลค่าพอร์ตรายเดือน (ย้อนหลัง) |
| `Expenses-Monthly` | ยอดรายจ่ายรายเดือนแยกหมวดหมู่ (Category Deep Dive) |
| `Invest Monthly` | สรุปการลงทุนรายเดือน |
| `Settrade-HIS` | ประวัติ/ราคาหุ้นจาก Settrade |
| `USD-Stock` | พอร์ตหุ้นสหรัฐ (Dime) |
| `Dividen-Fund` | ปันผลกองทุน |
| `SET DIV` | ปันผลหุ้น SET |
| `Expense` | รายการค่าใช้จ่ายรายวัน (10 รายการล่าสุด) |
| `Forecast SET70_US30-V2` | แผนการลงทุนระยะยาว |

---

## 🚀 วิธีใช้งาน (Getting Started)

### วิธีที่ 1 — Double-click (macOS, แนะนำ)
1. ดับเบิลคลิกที่ไฟล์ `start-server.command`
2. ถ้าถูกบล็อคโดย macOS ให้ไปที่ **System Settings → Privacy & Security → Open Anyway**
3. Browser จะเปิด `http://localhost:8080/index.html` อัตโนมัติ

### วิธีที่ 2 — Terminal
```bash
cd /path/to/FinVenture
python3 -m http.server 8080
```
จากนั้นเปิด Browser ที่ `http://localhost:8080`

> ⚠️ **ต้องเปิดผ่าน HTTP Server เท่านั้น** ไม่สามารถเปิดไฟล์ `index.html` โดยตรงผ่าน `file://` ได้ เนื่องจาก Browser จะบล็อค Cross-Origin Fetch ของ GVIZ API

---

## ⚙️ การตั้งค่า Google Sheets (First-Time Setup)

1. เปิดแอป → กดปุ่ม **⚙️ Settings** (มุมขวาบน)
2. ใส่ **Sheet ID** หรือ **URL เต็ม** ของ Google Spreadsheet ที่ต้องการเชื่อมต่อ
   - ตัวอย่าง URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - ระบบจะ extract Sheet ID ให้อัตโนมัติ
3. กด **Save & Sync**
4. หากสำเร็จจะเห็น 🟢 **Live** ที่แถบบนสุด

**Sync อัตโนมัติ:** ระบบ sync ทุก **15 นาที** หรือกดปุ่ม 🔄 เพื่อ sync ทันที  
**ข้อมูล fallback:** หากยังไม่ได้เชื่อมต่อ ระบบจะแสดงข้อมูลตัวอย่างจาก `data-store.js`

---

## 🎨 การปรับแต่ง UI (Customization)

### ธีม (Themes)
| ธีม | ลักษณะ |
|-----|--------|
| 🌙 Dark | พื้นหลังดำ เหมาะสำหรับการดูกลางคืน |
| ☀️ Light | พื้นหลังขาว สะอาดตา |
| 🔵 Blue | พื้นหลังน้ำเงินเข้ม สไตล์ Bloomberg |
| 🍱 Bento | สไตล์ Neo-Bento ขาว/เทา (Default) |

### สกุลเงิน (Currency)
- **฿ THB** — แสดงค่าเป็นบาทไทย
- **$ USD** — แปลงค่าตามอัตราแลกเปลี่ยน (Default: 35.5 บาท/ดอลลาร์)

---

## 🏗️ สถาปัตยกรรม (Architecture)

```
Google Sheets (GVIZ API)
        │
        ▼
  sheets-api.js        ← ดึงและ parse ข้อมูลจาก 10 Sheets แบบ Parallel
        │
        ▼
  currentFinData        ← Global State Object (schema จาก data-store.js)
        │
   ┌────┴────────┐
   ▼             ▼
charts.js   cashflow-ui.js    ← Render SVG / HTML ลงใน DOM
        │
        ▼
    app.js                    ← Tab Navigation, Theme, Currency, Sync trigger
        │
        ▼
   index.html                 ← Layout, CSS Variables, HTML Skeleton
```

**Data Flow:**
1. `SheetsAPI.syncAllSheets()` ดึงข้อมูลจาก Google Sheets แบบ Parallel (`Promise.all`)
2. `applySyncedData()` merge ข้อมูลเข้า `currentFinData`
3. `refreshAllDataViews()` เรียก render function ทุกตัว
4. แต่ละ render function อ่านจาก `currentFinData` โดยตรง

---

## 📦 Dependencies

ทุกอย่างเขียนด้วย **Vanilla JS + Inline SVG** ไม่พึ่งพา Framework หรือ Library ภายนอกใดๆ — ไม่มี NPM, ไม่มี node_modules

---

## 📐 Browser Support

| Browser | รองรับ |
|---------|--------|
| Chrome 100+ | ✅ แนะนำ |
| Safari 16+ | ✅ รองรับ |
| Firefox 100+ | ✅ รองรับ |
| Edge 100+ | ✅ รองรับ |

---

## 🔒 ความปลอดภัย (Security & Privacy)

- **ข้อมูลทั้งหมดอยู่บนเครื่องของผู้ใช้** — ไม่มี Backend, ไม่มีการส่งข้อมูลออกไปยัง Server ใดๆ
- Sheet ID ถูกเก็บใน `localStorage` ของ Browser เท่านั้น
- การดึงข้อมูลจาก Google Sheets ทำผ่าน GVIZ API สาธารณะ (Read-only)
- **ไม่มี OAuth** — ใช้งานได้เลยโดยไม่ต้อง Login ใดๆ

---

## 🗓️ Changelog สำคัญ

| วันที่ | การเปลี่ยนแปลง |
|--------|----------------|
| ก.ย. 2569 | เพิ่ม Category Deep Dive Line Chart |
| ก.ย. 2569 | เพิ่ม Financial Health Gauge SVG |
| ก.ย. 2569 | เพิ่ม Latest 10 Transactions จาก Sheet Expense |
| ก.ย. 2569 | ปรับ Expense Bar Chart เป็นกราฟแท่งโค้งพร้อม Peak Pill |
| ก.ย. 2569 | เพิ่มหมวดประกันภัยรถยนต์ในหมวด 🚗 เดินทาง |
| ก.ย. 2569 | ปรับ Layout Cash Flow Page เป็น Two-Column Bento |

---

*Built with ❤️ by Koredison · Powered by Google Sheets + Vanilla JavaScript*
