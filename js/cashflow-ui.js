/* =============================================================================
   cashflow-ui.js  —  New Cash Flow Page UI (Two-Column Bento Layout)
   Renders: balance overview, expense stats bars, health chart, latest
   transactions, category deep dive line chart, cf-cat-list breakdown.
   ============================================================================= */

let _cfRange = '6M';

const CF_CAT_COLORS = {
  housing:  '#6366f1', tax: '#f59e0b', food: '#10b981', travel: '#0ea5e9',
  gadgets: '#8b5cf6', family: '#ec4899', transport: '#f43f5e', health: '#14b8a6',
};
const CF_CAT_EMOJI = {
  housing: '🏠', tax: '📑', food: '🍔', travel: '✈️',
  gadgets: '💻', family: '👨‍👩‍👦', transport: '🚗', health: '🏃',
};

function cfFmt(n) {
  if (!n || isNaN(n)) return '฿ —';
  return `฿ ${Math.round(n).toLocaleString('th-TH')}`;
}
function cfFmtK(n) {
  if (!n || isNaN(n)) return '—';
  if (Math.abs(n) >= 1000) return `฿${(n/1000).toFixed(1).replace(/\.0$/,'')}k`;
  return `฿${n}`;
}

// Main entry — called from refreshAllDataViews
function renderCashFlowPage() {
  const data = currentFinData;
  const cfList = (data.monthlyCashFlow || []).filter(m => m.income > 0 || m.outcome > 0);
  const cats   = data.expenseCategories || [];

  _renderCfBalance(cfList, data);
  _renderCfBars(cfList, _cfRange);
  _renderCfHealth(cfList, _cfRange);
  _renderCfLatest(data.expenseTransactions || []);

  const defaultCat = 'food';
  _renderCfCatList(cats, defaultCat);
  _renderCfDeepDiveLine(defaultCat, cats);
}


let _cfBalanceDefault = { amt: 0, sub: 'เงินสดคงเหลือพร้อมใช้ (Cash)' };

function onCfCircleHover(amt, sub) {
  const amtEl = document.getElementById('cfCashBalance');
  const subEl = document.getElementById('cfCashSubtitle');
  if (amtEl) amtEl.textContent = cfFmt(amt);
  if (subEl) subEl.textContent = sub;
}

function onCfCircleLeave() {
  const amtEl = document.getElementById('cfCashBalance');
  const subEl = document.getElementById('cfCashSubtitle');
  if (amtEl) amtEl.textContent = cfFmt(_cfBalanceDefault.amt);
  if (subEl) subEl.textContent = _cfBalanceDefault.sub;
}

// 1. Balance Overview (ภาพรวมกระแสเงินสด)
function _renderCfBalance(cfList, data) {
  const last = cfList.slice(-1)[0];
  const o = (data && data.overview) || (typeof currentFinData !== 'undefined' && currentFinData.overview) || {};
  
  // 1. รายรับเดือนนี้ (Income)
  const incomeVal = (last && last.income) ? last.income : (o.latestIncome || 137906);

  // 2. เงินสดคงเหลือพร้อมใช้ (Cash only จาก Sheet Portfolio-Lastest)
  let cashVal = 0;
  if (o.cashAmount !== undefined && o.cashAmount !== null && !isNaN(o.cashAmount) && o.cashAmount > 0) {
    cashVal = o.cashAmount;
  } else if (o.totalCash !== undefined && o.totalCash !== null && !isNaN(o.totalCash) && o.totalCash > 0) {
    cashVal = o.totalCash;
  } else if (data && data.assetAllocation) {
    const cashAlloc = data.assetAllocation.find(a => a.code === 'CASH' || a.id === 'cash');
    if (cashAlloc && cashAlloc.value > 0) cashVal = cashAlloc.value;
  }
  if (!cashVal || isNaN(cashVal)) cashVal = 70130;

  // 3. รายจ่ายสุทธิ (Outcome)
  const outcomeVal = (last && last.outcome) ? last.outcome : (o.latestNetExpense || 67604);

  // ค่าเริ่มต้น: แสดงข้อมูล "เงินสดคงเหลือพร้อมใช้ (Cash)"
  _cfBalanceDefault = {
    amt: cashVal,
    sub: 'เงินสดคงเหลือพร้อมใช้ (Cash)'
  };

  const s = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  s('cfCashBalance',  cfFmt(cashVal));
  s('cfCashSubtitle', 'เงินสดคงเหลือพร้อมใช้ (Cash)');
  s('cfCircleIncome', cfFmtK(incomeVal));
  s('cfCircleCash',   cfFmtK(cashVal));
  s('cfCircleOutcome',cfFmtK(outcomeVal));

  // ผูก Event Hover สำหรับวงกลมทั้ง 3 วง
  const incomeWrap  = document.getElementById('cfCircleIncomeWrap');
  const cashWrap    = document.getElementById('cfCircleCashWrap');
  const outcomeWrap = document.getElementById('cfCircleOutcomeWrap');
  const circlesContainer = document.getElementById('cfCirclesContainer');

  if (incomeWrap) {
    incomeWrap.onmouseenter = () => onCfCircleHover(incomeVal, 'รายรับเดือนนี้ (Income)');
  }
  if (cashWrap) {
    cashWrap.onmouseenter = () => onCfCircleHover(cashVal, 'เงินสดคงเหลือพร้อมใช้ (Cash)');
  }
  if (outcomeWrap) {
    outcomeWrap.onmouseenter = () => onCfCircleHover(outcomeVal, 'รายจ่ายสุทธิ (Outcome)');
  }
  if (circlesContainer) {
    circlesContainer.onmouseleave = onCfCircleLeave;
  }
}

// 2. Expense Stats Bars
function setCfRange(range, btn) {
  _cfRange = range;
  document.querySelectorAll('#cf-range-6, #cf-range-12').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const cfList = (currentFinData.monthlyCashFlow || []).filter(m => m.income > 0 || m.outcome > 0);
  _renderCfBars(cfList, range);
  _renderCfHealth(cfList, range);
}

let _cfDefaultBarsNote = '';

function onCfBarHover(lbl, outcomeAmt, incomeAmt) {
  const noteEl = document.getElementById('cfBarsNote');
  if (noteEl) {
    const netSave = (incomeAmt || 0) - (outcomeAmt || 0);
    const saveTxt = netSave >= 0 ? `+${cfFmt(netSave)}` : `-${cfFmt(Math.abs(netSave))}`;
    noteEl.textContent = `เดือน ${lbl} · รายรับ ${cfFmt(incomeAmt)} · รายจ่าย ${cfFmt(outcomeAmt)} (ออม ${saveTxt})`;
  }
}

function onCfBarLeave() {
  const noteEl = document.getElementById('cfBarsNote');
  if (noteEl && _cfDefaultBarsNote) noteEl.textContent = _cfDefaultBarsNote;
}

function _renderCfBars(cfList, range) {
  const el     = document.getElementById('cfBars');
  const noteEl = document.getElementById('cfBarsNote');
  if (!el) return;
  const valid  = (cfList || []).filter(m => (m.outcome > 0 || m.income > 0));
  const count  = range === '6M' ? 6 : 12;
  const months = valid.slice(-count);
  if (!months.length) { el.innerHTML = '<div style="font-size:11px;color:var(--fg-muted);padding:20px;text-align:center;">ไม่มีข้อมูล</div>'; return; }
  
  // Calculate unified scale for Income (bars) and Outcome (line)
  const maxVal    = Math.max(...months.map(m => Math.max(m.outcome || 0, m.income || 0)), 1);
  const peakIncM  = months.reduce((b, m) => (m.income || 0) > (b.income || 0) ? m : b, months[0]);
  const peakOutM  = months.reduce((b, m) => (m.outcome || 0) > (b.outcome || 0) ? m : b, months[0]);
  const trackH    = 120;
  const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const n = months.length;

  el.onmouseleave = onCfBarLeave;

  // 1. Build Bars HTML (Income / รายรับ)
  const barsHtml = months.map((m, i) => {
    const h      = Math.max(16, Math.round(((m.income || 0) / maxVal) * trackH));
    const isPeak = (m === peakIncM) || (m.income === peakIncM.income);
    const isFeatured = isPeak;

    // Resolve month label for horizontal axis (แกนนอน)
    let lbl = '';
    if (m.label) {
      lbl = m.label.split(' ')[0];
    }
    if (!lbl && m.month) {
      const mNum = typeof m.month === 'number' ? m.month : parseInt(m.month.toString().split('-')[1] || '1', 10);
      lbl = MONTHS_TH[(mNum - 1) % 12] || '';
    }

    const badge = `<div class="cf-peak-badge" style="bottom:${h}px;"><span class="cf-peak-dot"></span><span class="cf-peak-pill">${cfFmtK(m.income)}</span></div>`;

    return `<div class="cf-bar-col${isFeatured ? ' featured' : ''}" onmouseenter="onCfBarHover('${lbl}', ${m.outcome || 0}, ${m.income || 0})">
      <div class="cf-bar-track">${badge}<div class="cf-bar" style="height:${h}px;"></div></div>
      <span class="cf-bar-lbl">${lbl}</span></div>`;
  }).join('');

  // 2. Build Sky Blue Outcome (Expenses / รายจ่าย) Line Overlay (500 x 120 coordinate space)
  const outcomePts = months.map((m, i) => {
    const x = ((i + 0.5) / n) * 500;
    const y = Math.max(8, Math.min(112, Math.round((1 - (m.outcome || 0) / maxVal) * trackH)));
    return { x, y, val: m.outcome || 0 };
  });

  const outcomeSpline = _getCfSmoothSpline(outcomePts);
  const dotsHtml = outcomePts.map(pt => `
    <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.2" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2"/>
  `).join('');

  const overlaySvg = `
    <svg class="cf-income-overlay-svg" viewBox="0 0 500 ${trackH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cfSkyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(56, 189, 248, 0.45)" />
        </filter>
      </defs>
      <path d="${outcomeSpline.line}" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#cfSkyGlow)"/>
      ${dotsHtml}
    </svg>
  `;

  el.innerHTML = overlaySvg + barsHtml;

  if (noteEl) {
    let peakOutLbl = '';
    if (peakOutM.label) peakOutLbl = peakOutM.label.split(' ')[0];
    if (!peakOutLbl && peakOutM.month) {
      const mNum = typeof peakOutM.month === 'number' ? peakOutM.month : parseInt(peakOutM.month.toString().split('-')[1] || '1', 10);
      peakOutLbl = MONTHS_TH[(mNum - 1) % 12] || '';
    }
    const avgInc = Math.round(months.reduce((acc, m) => acc + (m.income || 0), 0) / (months.length || 1));
    const avgOut = Math.round(months.reduce((acc, m) => acc + (m.outcome || 0), 0) / (months.length || 1));
    _cfDefaultBarsNote = `แท่ง: รายรับ (เฉลี่ย ${cfFmtK(avgInc)}) · เส้นฟ้า: รายจ่าย (เฉลี่ย ${cfFmtK(avgOut)} / สูงสุด ${peakOutLbl} ${cfFmt(peakOutM.outcome)})`;
    noteEl.textContent = _cfDefaultBarsNote;
  }
}


// Smooth Cubic Spline Generator for SVG
function _getCfSmoothSpline(pts) {
  if (pts.length < 2) return { line: '', curvePart: '' };
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  let curvePart = '';
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
}

// 3. Financial Health SVG (Vivid Blue-Violet Card with White Smooth Line & Interactive Hover Dot)
function _renderCfHealth(cfList, range) {
  const valid = (cfList || []).filter(m => m.income > 0);
  if (!valid.length) return;
  const count = range === '1Y' ? 12 : 6;
  const months = valid.slice(-count);
  if (months.length < 2) return;

  const rates = months.map(m => Math.max(0, Math.min(100, Math.round(((m.income - m.outcome) / m.income) * 1000) / 10)));
  const lastRate = rates[rates.length - 1];
  const prevRate = rates.length > 1 ? rates[rates.length - 2] : lastRate;
  const diff = Math.round((lastRate - prevRate) * 10) / 10;

  const s = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const defaultTrend = diff >= 0 ? `▲ เพิ่มขึ้น +${diff}% จากเดือนที่แล้ว` : `▼ ลดลง ${Math.abs(diff)}% จากเดือนที่แล้ว`;
  
  s('cfHealthVal', `${lastRate}%`);
  s('cfHealthTrend', defaultTrend);

  const W = 300, H = 110, PAD_X = 16, PAD_TOP = 24, PAD_BOT = 26;
  const n = rates.length;

  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const yMin = Math.max(0, Math.floor((minRate - 10) / 10) * 10);
  const yMax = Math.min(100, Math.ceil((maxRate + 10) / 10) * 10);
  const yRange = (yMax - yMin) || 1;

  const pts = rates.map((r, i) => {
    const x = PAD_X + (i / (n - 1)) * (W - PAD_X * 2);
    const y = PAD_TOP + (1 - (r - yMin) / yRange) * (H - PAD_TOP - PAD_BOT);
    return { x, y };
  });

  const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const healthPoints = pts.map((pt, i) => {
    const m = months[i];
    let lbl = '';
    if (m.label) lbl = m.label.split(' ')[0];
    if (!lbl && m.month) {
      const mNum = typeof m.month === 'number' ? m.month : parseInt(m.month.toString().split('-')[1] || '1', 10);
      lbl = MONTHS_TH[(mNum - 1) % 12] || '';
    }
    return {
      x: pt.x,
      y: pt.y,
      rate: rates[i],
      monthLbl: lbl || `M${i+1}`,
      income: m.income,
      outcome: m.outcome
    };
  });

  const spline = _getCfSmoothSpline(pts);
  const lp = spline.line;
  const ap = `M ${pts[0].x.toFixed(1)},${H - 10} L ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}${spline.curvePart} L ${pts[n-1].x.toFixed(1)},${H - 10} Z`;

  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
  setAttr('cfHealthLine', 'd', lp);
  setAttr('cfHealthLine', 'stroke-width', '1.6');
  setAttr('cfHealthArea', 'd', ap);

  const startLbl = document.getElementById('cfHealthStartLbl');
  if (startLbl) {
    startLbl.setAttribute('x', pts[0].x.toFixed(1));
    startLbl.setAttribute('y', (pts[0].y - 8).toFixed(1));
    startLbl.textContent = `${rates[0]}%`;
  }

  const lastPt = healthPoints[healthPoints.length - 1];
  const dotGroup = document.getElementById('cfHealthDotGroup');
  const dotVal = document.getElementById('cfHealthDotVal');

  const updateToPoint = (pt) => {
    if (dotGroup) {
      dotGroup.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
    }
    if (dotVal) {
      dotVal.setAttribute('y', pt.y > 80 ? '-10' : '15');
      dotVal.textContent = `${pt.rate}%`;
    }
    s('cfHealthVal', `${pt.rate}%`);
    s('cfHealthTrend', `เดือน ${pt.monthLbl} · อัตราการออม ${pt.rate}%`);
  };

  const resetToDefault = () => {
    if (dotGroup) {
      dotGroup.setAttribute('transform', `translate(${lastPt.x.toFixed(1)}, ${lastPt.y.toFixed(1)})`);
    }
    if (dotVal) {
      dotVal.setAttribute('y', lastPt.y > 80 ? '-10' : '15');
      dotVal.textContent = `${lastRate}%`;
    }
    s('cfHealthVal', `${lastRate}%`);
    s('cfHealthTrend', defaultTrend);
  };

  // Set default to latest month
  resetToDefault();

  const svg = document.getElementById('cfHealthSvg');
  if (svg) {
    svg.onmousemove = (e) => {
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * 300;
      let closest = healthPoints[0];
      let minDist = Math.abs(closest.x - svgX);
      for (let i = 1; i < healthPoints.length; i++) {
        const dist = Math.abs(healthPoints[i].x - svgX);
        if (dist < minDist) {
          minDist = dist;
          closest = healthPoints[i];
        }
      }
      updateToPoint(closest);
    };
    svg.onmouseleave = resetToDefault;
    svg.ontouchmove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.touches[0].clientX - rect.left) / rect.width) * 300;
        let closest = healthPoints[0];
        let minDist = Math.abs(closest.x - svgX);
        for (let i = 1; i < healthPoints.length; i++) {
          const dist = Math.abs(healthPoints[i].x - svgX);
          if (dist < minDist) {
            minDist = dist;
            closest = healthPoints[i];
          }
        }
        updateToPoint(closest);
      }
    };
    svg.ontouchend = resetToDefault;
  }
}

function refreshFinancialHealth() {
  const btn = document.querySelector('.cf-health-sync-btn');
  if (btn) {
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => { btn.style.transform = ''; }, 400);
  }
  const cfList = (currentFinData.monthlyCashFlow || []).filter(m => m.income > 0 || m.outcome > 0);
  _renderCfHealth(cfList, _cfRange);
}

// 4. Latest Transactions
function _renderCfLatest(txns) {
  const listEl  = document.getElementById('cfLatestList');
  const countEl = document.getElementById('cfLatestCount');
  if (!listEl) return;
  const show = txns.slice(0, 10);
  if (countEl) countEl.textContent = `${show.length} รายการ`;
  if (!show.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--fg-muted);padding:16px 0;text-align:center;">ไม่พบข้อมูลใน sheet Expense</div>';
    return;
  }

  const getTransactionEmoji = (cat, mainCat, desc) => {
    const text = `${cat || ''} ${mainCat || ''} ${desc || ''}`.toLowerCase();
    
    // 1. แม่ / ครอบครัว / Mommy
    if (text.includes('mommy') || text.includes('mom') || text.includes('แม่') || text.includes('คุณแม่')) return '👩‍👧';
    if (text.includes('family') || text.includes('ครอบครัว') || text.includes('ลูก') || text.includes('พ่อ')) return '👨‍👩‍👦';

    // 2. อาหาร / ร้านสะดวกซื้อ / เครื่องดื่ม
    if (text.includes('convenience') || text.includes('7-11') || text.includes('711') || text.includes('เซเว่น') || text.includes('cj') || text.includes('lotus') || text.includes('big c') || text.includes('tops')) return '🏪';
    if (text.includes('coffee') || text.includes('cafe') || text.includes('กาแฟ') || text.includes('amazon') || text.includes('starbucks') || text.includes('ชา')) return '☕';
    if (text.includes('food') || text.includes('อาหาร') || text.includes('ข้าว') || text.includes('noodle') || text.includes('ก๋วยเตี๋ยว') || text.includes('ส้มตำ') || text.includes('เลือดหมู') || text.includes('bento') || text.includes('salad') || text.includes('burger') || text.includes('mcdonald') || text.includes('subway') || text.includes('kfc') || text.includes('จันทนา') || text.includes('คุณแขก')) return '🍔';

    // 3. ที่อยู่อาศัย / คอนโด / สินเชื่อ / สาธารณูปโภค
    if (text.includes('condo loan') || text.includes('loan') || text.includes('สินเชื่อ') || text.includes('ผ่อนคอนโด') || text.includes('ผ่อนบ้าน')) return '🏦';
    if (text.includes('mea') || text.includes('ค่าไฟ') || text.includes('ไฟฟ้า') || text.includes('electric')) return '⚡';
    if (text.includes('mwa') || text.includes('ค่าน้ำ') || text.includes('ประปา') || text.includes('water')) return '💧';
    if (text.includes('internet') || text.includes('mobile') || text.includes('เน็ต') || text.includes('ais') || text.includes('true') || text.includes('dtac') || text.includes('wifi') || text.includes('โทรศัพท์')) return '📶';
    if (text.includes('decorate') || text.includes('ตกแต่ง') || text.includes('เฟอร์นิเจอร์') || text.includes('ikea') || text.includes('homepro')) return '🛋️';
    if (text.includes('condo services') || text.includes('ส่วนกลาง') || text.includes('แม่บ้าน') || text.includes('ทำความสะอาด')) return '🧹';
    if (text.includes('hous') || text.includes('condo') || text.includes('คอนโด') || text.includes('บ้าน')) return '🏠';

    // 4. เดินทาง / รถยนต์ / ทางด่วน / ขนส่งสาธารณะ
    if (text.includes('easy pass') || text.includes('ทางด่วน') || text.includes('toll')) return '🛣️';
    if (text.includes('gasoline') || text.includes('oil') || text.includes('น้ำมัน') || text.includes('ปตท') || text.includes('ptt') || text.includes('shell') || text.includes('bcp')) return '⛽';
    if (text.includes('parking') || text.includes('ที่จอดรถ')) return '🅿️';
    if (text.includes('taxi') || text.includes('grab') || text.includes('bolt') || text.includes('แท็กซี่')) return '🚕';
    if (text.includes('motorcycle') || text.includes('มอเตอร์ไซค์') || text.includes('วิน')) return '🛵';
    if (text.includes('bus') || text.includes('รถเมล์')) return '🚌';
    if (text.includes('train') || text.includes('bts') || text.includes('mrt') || text.includes('รถไฟฟ้า') || text.includes('arl')) return '🚊';
    if (text.includes('trans') || text.includes('เดินทาง') || text.includes('car') || text.includes('รถ')) return '🚗';

    // 5. สุขภาพ / ประกัน / กีฬา
    if (text.includes('sport') || text.includes('shoe') || text.includes('รองเท้า') || text.includes('วิ่ง') || text.includes('gym') || text.includes('fitness') || text.includes('กีฬา')) return '👟';
    if (text.includes('life insurance') || text.includes('ประกันชีวิต')) return '🩺';
    if (text.includes('car insurance') || text.includes('ประกันรถ')) return '🛡️';
    if (text.includes('health insurance') || text.includes('ประกันสุขภาพ')) return '🏥';
    if (text.includes('insurance') || text.includes('ประกัน')) return '🛡️';
    if (text.includes('health') || text.includes('สุขภาพ') || text.includes('welfare') || text.includes('รักษา') || text.includes('ยา') || text.includes('hospital') || text.includes('หมอ') || text.includes('คลินิก')) return '💊';

    // 6. เสื้อผ้า / เครื่องแต่งกาย / แก็ดเจ็ต
    if (text.includes('cloth') || text.includes('เสื้อ') || text.includes('กางเกง') || text.includes('uniqlo') || text.includes('zara')) return '👕';
    if (text.includes('bag') || text.includes('กระเป๋า')) return '👜';
    if (text.includes('camera') || text.includes('กล้อง')) return '📷';
    if (text.includes('phone') || text.includes('มือถือ') || text.includes('iphone') || text.includes('ipad')) return '📱';
    if (text.includes('computer') || text.includes('notebook') || text.includes('tablet') || text.includes('macbook') || text.includes('laptop')) return '💻';
    if (text.includes('gadget') || text.includes('tech') || text.includes('ไอที') || text.includes('electronic')) return '🎧';

    // 7. บันเทิง / ท่องเที่ยว / ของขวัญ
    if (text.includes('travel') || text.includes('ท่องเที่ยว') || text.includes('เที่ยว') || text.includes('โรงแรม') || text.includes('hotel') || text.includes('flight') || text.includes('ตั๋วเครื่องบิน')) return '✈️';
    if (text.includes('entertainment') || text.includes('บันเทิง') || text.includes('หนัง') || text.includes('netflix') || text.includes('cinema') || text.includes('เกม') || text.includes('game') || text.includes('youtube')) return '🎬';
    if (text.includes('gift') || text.includes('ของขวัญ') || text.includes('ทำบุญ') || text.includes('บริจาค')) return '🎁';

    // 8. ภาษี / กองทุน / เงินออม / รายรับ
    if (text.includes('tax') || text.includes('ภาษี') || text.includes('40(1)')) return '📑';
    if (text.includes('pvd') || text.includes('provident')) return '🏢';
    if (text.includes('saving') || text.includes('save') || text.includes('ออม') || text.includes('me')) return '💰';
    if (text.includes('invest') || text.includes('reinvest') || text.includes('set') || text.includes('scb') || text.includes('stock') || text.includes('หุ้น')) return '📈';
    if (text.includes('salary') || text.includes('เงินเดือน') || text.includes('income')) return '💵';

    return '🧾';
  };

  const rowsHtml = show.map(t => {
    const isIncome = (t.mainCategory || '').toLowerCase().includes('income') || (t.category || '').toLowerCase().includes('income');
    const amtColor = isIncome ? '#10b981' : '#f43f5e';
    const sign = isIncome ? '+' : '-';
    const em = getTransactionEmoji(t.category, t.mainCategory, t.description);
    
    let subDetail = t.category || t.mainCategory || '';
    if (subDetail.toLowerCase() === (t.description || '').toLowerCase()) {
      subDetail = t.mainCategory || '';
    }

    return `
    <div class="cf-row">
      <div class="cf-row-left">
        <div class="cf-avatar">${em}</div>
        <div class="cf-row-main">
          <div class="cf-row-name" title="${t.description || t.category || 'รายการ'}">${t.description || t.category || 'รายการ'}</div>
          <div class="cf-row-sub">${subDetail}</div>
        </div>
      </div>
      <div class="cf-row-date">${t.date}</div>
      <div class="cf-row-amt num" style="color:${amtColor};">${sign}${cfFmt(t.amount)}</div>
    </div>`;
  }).join('');

  listEl.innerHTML = rowsHtml;
}

// 5. CF Cat List (right column)
function _renderCfCatList(cats, selectedId) {
  const listEl  = document.getElementById('cfCatList');
  if (!listEl || !cats.length) return;
  const sel    = cats.find(c => c.id === selectedId) || cats[0];
  const maxAmt = Math.max(...cats.map(c => c.latestAmount), 1);
  listEl.innerHTML = cats.map(c => {
    const pct   = Math.max(3, Math.round((c.latestAmount / maxAmt) * 100));
    const color = CF_CAT_COLORS[c.id] || '#6366f1';
    const em    = CF_CAT_EMOJI[c.id] || '📊';
    return `<div class="cf-cat-row${c.id===selectedId?' selected':''}" onclick="onCfCatRowClick('${c.id}')">
      <div class="cf-cat-name">${em} ${c.shortName||c.id}</div>
      <div class="cf-cat-val" style="color:${color};">${cfFmtK(c.latestAmount)}</div>
      <div class="cf-cat-track"><div class="cf-cat-fill" style="width:${pct}%;background:${color};"></div></div>
    </div>`;
  }).join('');
  const s = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  if (sel) {
    s('cfCatTotal', cfFmt(sel.latestAmount));
    s('cfCatAvg',   sel.yearlyAvg ? cfFmt(sel.yearlyAvg) : '—');
    s('cfCatShare', sel.sharePercent != null ? `${sel.sharePercent}%` : '—%');
    s('cfCatPeak',  sel.peakMonth || '—');
  }
}

// 6. Deep Dive Line Chart (Smooth Spline, 30% Smaller, Interactive Hover Dot, YoY Comparison)
let _currentDeepDiveCatId = 'food';
let _cfComparePrevYear = false;

function onCfToggleComparePrev(checked) {
  _cfComparePrevYear = !!checked;
  _renderCfDeepDiveLine(_currentDeepDiveCatId, (currentFinData && currentFinData.expenseCategories) || []);
}
window.onCfToggleComparePrev = onCfToggleComparePrev;

function _renderCfDeepDiveLine(catId, cats) {
  const container = document.getElementById('cfDeepDiveChart');
  if (!container) return;
  _currentDeepDiveCatId = catId;

  // Sync toggle switch state if exists
  const toggleEl = document.getElementById('cfComparePrevToggle');
  if (toggleEl) toggleEl.checked = _cfComparePrevYear;

  const cat = (cats || []).find(c => c.id === catId) || (cats || [])[0];
  if (!cat || !cat.monthlyHistory || cat.monthlyHistory.length < 2) {
    container.innerHTML = '<div style="font-size:11px;color:var(--fg-muted);padding:16px;text-align:center;">ข้อมูลไม่เพียงพอ</div>';
    return;
  }

  const history = cat.monthlyHistory;
  const prevHistory = (cat.prevMonthlyHistory || []).slice(0, history.length);
  const hasPrev = _cfComparePrevYear && prevHistory.length >= 2;

  const color   = CF_CAT_COLORS[cat.id] || '#6366f1';
  const em      = CF_CAT_EMOJI[cat.id] || '📊';
  const n       = history.length;

  const lastVal = history[n - 1] || cat.latestAmount;
  const prevVal = n > 1 ? history[n - 2] : lastVal;
  const diff    = lastVal - prevVal;
  const pctDiff = prevVal > 0 ? Math.round((Math.abs(diff) / prevVal) * 100) : 0;

  let defaultTrendText = diff === 0 
    ? 'ทรงตัวเท่ากับเดือนก่อน' 
    : (diff > 0 ? `▲ เพิ่มขึ้น +${cfFmt(diff)} (+${pctDiff}%) จากเดือนก่อน` : `▼ ลดลง -${cfFmt(Math.abs(diff))} (-${pctDiff}%) จากเดือนก่อน`);

  if (hasPrev && prevHistory[n - 1] !== undefined) {
    const lastPrevVal = prevHistory[n - 1];
    const yoyDiff = lastVal - lastPrevVal;
    const yoyPct = lastPrevVal > 0 ? Math.round((Math.abs(yoyDiff) / lastPrevVal) * 100) : 0;
    const yoySign = yoyDiff >= 0 ? '+' : '-';
    defaultTrendText = yoyDiff === 0
      ? `เทียบปีก่อนหน้า: ทรงตัวเท่ากัน (฿${cfFmt(lastPrevVal)})`
      : (yoyDiff > 0 ? `เทียบปีก่อนหน้า: ▲ เพิ่มขึ้น +${cfFmt(yoyDiff)} (+${yoyPct}%) จาก ฿${cfFmt(lastPrevVal)}` : `เทียบปีก่อนหน้า: ▼ ลดลง -${cfFmt(Math.abs(yoyDiff))} (-${yoyPct}%) จาก ฿${cfFmt(lastPrevVal)}`);
  }

  const s = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  s('cfDeepDiveSub', `${em} ${cat.shortName || cat.name || catId} · แนวโน้มรายเดือนย้อนหลัง`);
  s('cfDeepDiveAmt', cfFmt(lastVal));
  s('cfDeepDiveTrend', defaultTrendText);

  const badgeEl = document.getElementById('cfDeepDiveBadge');
  if (badgeEl) {
    badgeEl.textContent = `${em} ${cat.shortName || cat.name || catId}`;
    badgeEl.style.background = `${color}18`;
    badgeEl.style.color = color;
    badgeEl.style.border = `1px solid ${color}30`;
  }

  // 30% Smaller SVG Layout
  const W = 480, H = 100;
  const PADt = 16, PADb = 20, PADl = 38, PADr = 16;
  const iW = W - PADl - PADr, iH = H - PADt - PADb;

  const allVals = hasPrev ? [...history, ...prevHistory] : history;
  const maxRaw = Math.max(...allVals, 1);
  const minRaw = Math.min(...allVals);
  const spread = maxRaw - minRaw;

  // Dynamic scaling identical to cfHealth for expressive curvature
  let yMin, yMax;
  if (spread > 0 && minRaw > spread * 0.4) {
    const pad = spread * 0.25;
    yMin = Math.max(0, Math.floor(minRaw - pad));
    yMax = Math.ceil(maxRaw + pad);
  } else {
    yMin = 0;
    yMax = Math.ceil(maxRaw * 1.12);
  }
  const yRange = (yMax - yMin) || 1;

  // Current Year Points & Spline
  const xs = history.map((_, i) => PADl + (i / (n - 1)) * iW);
  const ys = history.map(v => PADt + (1 - (v - yMin) / yRange) * iH);
  const pts = xs.map((x, i) => ({ x, y: ys[i], val: history[i] }));

  const spline = _getCfSmoothSpline(pts);
  const lp = spline.line;
  const ap = `M ${pts[0].x.toFixed(1)},${PADt + iH} L ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}${spline.curvePart} L ${pts[n - 1].x.toFixed(1)},${PADt + iH} Z`;

  // Previous Year Points & Spline (Continuous Solid Line - เส้นต่อเนื่องแทน dash)
  let prevLineSvg = '';
  let prevPts = [];
  if (hasPrev) {
    const prevXs = prevHistory.map((_, i) => PADl + (i / (n - 1)) * iW);
    const prevYs = prevHistory.map(v => PADt + (1 - (v - yMin) / yRange) * iH);
    prevPts = prevXs.map((x, i) => ({ x, y: prevYs[i], val: prevHistory[i] }));
    const prevSpline = _getCfSmoothSpline(prevPts);
    prevLineSvg = `
      <path d="${prevSpline.line}" fill="none" stroke="${color}" stroke-width="1.6" opacity="0.38" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const step = n <= 6 ? 1 : 2;
  const xLbls = xs.map((x, i) => (i % step === 0 || i === n - 1)
    ? `<text x="${x.toFixed(1)}" y="${H - 3}" text-anchor="middle" font-size="9" font-weight="600" fill="var(--fg-muted)">${MONTHS_TH[i % 12] || ''}</text>`
    : '').join('');

  const gridVals = yMin > 0
    ? [Math.round(yMin + yRange * 0.5), yMax]
    : [Math.round(yMax * 0.5), yMax];
  const yGrid = gridVals.map(v => {
    const y = PADt + (1 - (v - yMin) / yRange) * iH;
    const lbl = v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v;
    return `<text x="${PADl - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8.5" font-weight="600" fill="var(--fg-muted)">${lbl}</text>
            <line x1="${PADl}" y1="${y.toFixed(1)}" x2="${PADl + iW}" y2="${y.toFixed(1)}" stroke="rgba(100, 130, 180, 0.12)" stroke-dasharray="2,3" stroke-width="1"/>`;
  }).join('');

  const ddPoints = pts.map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    val: history[i],
    idx: i,
    monthLbl: MONTHS_TH[i % 12] || `M${i + 1}`
  }));

  const lastPt = ddPoints[ddPoints.length - 1];

  container.innerHTML = `<svg id="cfDeepDiveSvg" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;overflow:visible;cursor:crosshair;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cfDdG_${catId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    ${yGrid}
    <path d="${ap}" fill="url(#cfDdG_${catId})"/>
    ${prevLineSvg}
    <path d="${lp}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    ${xLbls}
    <!-- Interactive Previous Year Hover Dot (Continuous, smooth cubic transition) -->
    <g id="cfDdPrevDotGroup" style="display:none; transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0.55;">
      <circle cx="0" cy="0" r="3" fill="${color}" stroke="#ffffff" stroke-width="1.2"/>
      <text id="cfDdPrevDotVal" x="0" y="-8" text-anchor="middle" fill="${color}" font-size="10" font-weight="700" font-family="'JetBrains Mono', monospace"></text>
    </g>
    <!-- Interactive Current Year Hover Dot & Plain Text Label (Smooth cubic transition matching cfHealth) -->
    <g id="cfDdDotGroup" style="transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);">
      <circle cx="0" cy="0" r="3.5" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <text id="cfDdDotVal" x="0" y="-8" text-anchor="middle" fill="${color}" font-size="11" font-weight="800" font-family="'JetBrains Mono', monospace">${cfFmtK(lastVal)}</text>
    </g>
  </svg>`;

  const svg = document.getElementById('cfDeepDiveSvg');
  const dotGroup = document.getElementById('cfDdDotGroup');
  const dotVal = document.getElementById('cfDdDotVal');
  const prevDotGroup = document.getElementById('cfDdPrevDotGroup');
  const prevDotVal = document.getElementById('cfDdPrevDotVal');

  const updateToPoint = (pt) => {
    const idx = pt.idx;
    if (dotGroup) dotGroup.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
    if (dotVal) {
      dotVal.setAttribute('y', pt.y < 22 ? '14' : '-8');
      dotVal.textContent = cfFmt(pt.val);
    }
    if (hasPrev && prevPts[idx] && prevDotGroup) {
      prevDotGroup.style.display = '';
      prevDotGroup.setAttribute('transform', `translate(${prevPts[idx].x.toFixed(1)}, ${prevPts[idx].y.toFixed(1)})`);
      if (prevDotVal) {
        prevDotVal.setAttribute('y', prevPts[idx].y < 22 ? '14' : '-8');
        prevDotVal.textContent = cfFmt(prevPts[idx].val);
      }
    } else if (prevDotGroup) {
      prevDotGroup.style.display = 'none';
    }

    s('cfDeepDiveAmt', cfFmt(pt.val));

    if (hasPrev && prevPts[idx]) {
      const pVal = prevPts[idx].val;
      const pDiff = pt.val - pVal;
      const pPct = pVal > 0 ? Math.round((Math.abs(pDiff) / pVal) * 100) : 0;
      const pDiffTxt = pDiff === 0 ? 'เท่าปีก่อน' : (pDiff > 0 ? `▲ +${cfFmt(pDiff)} (+${pPct}%)` : `▼ -${cfFmt(Math.abs(pDiff))} (-${pPct}%)`);
      s('cfDeepDiveTrend', `เดือน ${pt.monthLbl} · ปีนี้ ${cfFmt(pt.val)} (ปีก่อน ${cfFmt(pVal)} | YoY ${pDiffTxt})`);
    } else {
      s('cfDeepDiveTrend', `เดือน ${pt.monthLbl} · ยอดใช้จ่าย ${cfFmt(pt.val)}`);
    }
  };

  const resetToDefault = () => {
    if (dotGroup) dotGroup.setAttribute('transform', `translate(${lastPt.x.toFixed(1)}, ${lastPt.y.toFixed(1)})`);
    if (dotVal) {
      dotVal.setAttribute('y', lastPt.y < 22 ? '14' : '-8');
      dotVal.textContent = cfFmt(lastVal);
    }
    if (hasPrev && prevPts[lastPt.idx] && prevDotGroup) {
      prevDotGroup.style.display = '';
      prevDotGroup.setAttribute('transform', `translate(${prevPts[lastPt.idx].x.toFixed(1)}, ${prevPts[lastPt.idx].y.toFixed(1)})`);
      if (prevDotVal) {
        prevDotVal.setAttribute('y', prevPts[lastPt.idx].y < 22 ? '14' : '-8');
        prevDotVal.textContent = cfFmt(prevPts[lastPt.idx].val);
      }
    } else if (prevDotGroup) {
      prevDotGroup.style.display = 'none';
    }
    s('cfDeepDiveAmt', cfFmt(lastVal));
    s('cfDeepDiveTrend', defaultTrendText);
  };

  // Default to latest month
  resetToDefault();

  if (svg) {
    svg.onmousemove = (e) => {
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * W;
      let closest = ddPoints[0];
      let minDist = Math.abs(closest.x - svgX);
      for (let i = 1; i < ddPoints.length; i++) {
        const dist = Math.abs(ddPoints[i].x - svgX);
        if (dist < minDist) {
          minDist = dist;
          closest = ddPoints[i];
        }
      }
      updateToPoint(closest);
    };
    svg.onmouseleave = resetToDefault;
    svg.ontouchmove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.touches[0].clientX - rect.left) / rect.width) * W;
        let closest = ddPoints[0];
        let minDist = Math.abs(closest.x - svgX);
        for (let i = 1; i < ddPoints.length; i++) {
          const dist = Math.abs(ddPoints[i].x - svgX);
          if (dist < minDist) {
            minDist = dist;
            closest = ddPoints[i];
          }
        }
        updateToPoint(closest);
      }
    };
    svg.ontouchend = resetToDefault;
  }
}

// 7. Tip Card
function _renderCfTips(cats) {
  const listEl = document.getElementById('cfTipList');
  if (!listEl || !cats.length) return;
  const top3   = [...cats].sort((a,b) => b.latestAmount - a.latestAmount).slice(0,3);
  const total  = top3.reduce((s,c) => s+c.latestAmount, 0) || 1;
  const TIPS   = {
    housing: 'รีไฟแนนซ์หรือต่อรองดอกเบี้ย อาจลดได้ ฿2,000–3,500/เดือน',
    food:    'ตั้งงบ ฿250/วัน และทำอาหารเอง 3 วัน/สัปดาห์',
    transport:'ใช้ BTS/MRT เพิ่มขึ้น 3 วัน/สัปดาห์ ประหยัดน้ำมัน',
    gadgets: 'ประเมิน need vs want ก่อนซื้ออุปกรณ์ใหม่',
    travel:  'จองล่วงหน้า 2-3 เดือน ราคาถูกกว่า 30%',
    health:  'ออกกำลังกายสม่ำเสมอเพื่อลดค่ารักษาในอนาคต',
    family:  'วางแผนงบประมาณครอบครัวระยะยาวร่วมกัน',
    tax:     'ใช้สิทธิ์ลดหย่อนให้ครบ เช่น RMF/SSF',
  };
  listEl.innerHTML = top3.map(c => {
    const pct = Math.round((c.latestAmount / total) * 100);
    return `<li>${CF_CAT_EMOJI[c.id]||'📊'} <strong>${c.shortName} ${pct}%</strong> — ${TIPS[c.id]||'วางแผนการใช้จ่าย'}</li>`;
  }).join('');
}

function toggleCfTip() {
  const extra  = document.getElementById('cfTipExtra');
  const toggle = document.getElementById('cfTipToggle');
  if (!extra) return;
  if (extra.hasAttribute('hidden')) { extra.removeAttribute('hidden'); if(toggle) toggle.textContent = 'ซ่อน ▲'; }
  else { extra.setAttribute('hidden',''); if(toggle) toggle.textContent = 'ดูเพิ่มเติม ▼'; }
}

// 8. Category click handler (synced directly with cfCatList)
function onCfCatRowClick(catId) {
  const cats = currentFinData.expenseCategories || [];
  _renderCfDeepDiveLine(catId, cats);
  _renderCfCatList(cats, catId);
}

/* =============================================================================
   Cash Flow Recording System (Receive, Pay, Saving & Invest)
   Handles modal interactions, customizable default presets (up to 5),
   and seamless synchronization to Google Sheets "Expense" tab.
   ============================================================================= */

const CF_DESC_STORAGE_KEY = 'finventure_custom_descriptions';

const CF_INITIAL_DESCS = {
  receive: [
    "DIV from JPEQ",
    "DIV from QQQI"
  ],
  pay: [
    "7-11",
    "Noodle"
  ],
  saving: [
    "Active Salary to Dime",
    "Active Salary to Aom ทอง",
    "Active Salary to Bitkub",
    "Active Salary to SET"
  ]
};

const CF_RECEIVE_SUBCATS = [
  "Income Salary",
  "Others income (Divide)"
];

const CF_PAY_CATEGORIES = {
  "Fixed costs": [
    "Tax 40(1)",
    "Provident fund",
    "Welfare",
    "Mommy",
    "Condo Loan",
    "Internet/Mobile",
    "MEA",
    "MWA"
  ],
  "Variable costs": [
    "Decorate Condo",
    "Condo services",
    "Cloth",
    "Bag",
    "Sport & Shoe",
    "Health",
    "Easy Pass",
    "Gasoline",
    "Parking",
    "Taxi",
    "Motorcycle & Bus",
    "Train",
    "Food",
    "Convenience store",
    "Entertainment",
    "Travel",
    "Gifts",
    "Car",
    "Computer/Notebook/Tablet",
    "Electronic device",
    "Phone",
    "Camera",
    "Others"
  ],
  "Advance": [
    "Advance Paid",
    "Refund advanced paid"
  ]
};

let _cfActiveMode = 'receive';

function getCfCustomDescriptions(mode) {
  try {
    const raw = localStorage.getItem(CF_DESC_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed[mode])) {
        return parsed[mode].slice(0, 5);
      }
    }
  } catch (e) {
    console.warn('Error reading custom descriptions', e);
  }
  return [...(CF_INITIAL_DESCS[mode] || [])].slice(0, 5);
}

function saveCfCustomDescriptions(mode, list) {
  try {
    let all = {};
    const raw = localStorage.getItem(CF_DESC_STORAGE_KEY);
    if (raw) {
      try { all = JSON.parse(raw) || {}; } catch (e) {}
    }
    all[mode] = (list || []).slice(0, 5);
    localStorage.setItem(CF_DESC_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('Error saving custom descriptions', e);
  }
}

function formatSheetDate(dateStr) {
  if (!dateStr) {
    const now = new Date();
    dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mStr = months[(m - 1) % 12] || "Jan";
  return `${d}-${mStr}-${y}`;
}

function escapeCfHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openExpenseRecordModal(mode) {
  _cfActiveMode = mode || 'receive';
  const modal = document.getElementById('cfExpenseRecordModal');
  const title = document.getElementById('cfRecModalTitle');
  if (!modal) return;

  // 1. Title & Header
  if (title) {
    if (mode === 'receive') {
      title.innerHTML = '📥 บันทึกรายรับ (Receive)';
    } else if (mode === 'pay') {
      title.innerHTML = '📤 บันทึกรายจ่าย (Pay)';
    } else if (mode === 'saving') {
      title.innerHTML = '💎 บันทึกการออม &amp; ลงทุน (Saving &amp; Invest)';
    }
  }

  // 2. Default Date to Today
  const dateInput = document.getElementById('cfRecDate');
  if (dateInput) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    dateInput.value = todayStr;
  }

  // 3. Category & Subcategory Elements
  const catSelect = document.getElementById('cfRecCategorySelect');
  const catBadge = document.getElementById('cfRecCategoryBadge');
  const subcatSelect = document.getElementById('cfRecSubcategorySelect');
  const subcatBadge = document.getElementById('cfRecSubcategoryBadge');
  const payContainer = document.getElementById('cfRecPaymentContainer');
  const paySelect = document.getElementById('cfRecPaymentSelect');

  if (mode === 'receive') {
    // Category = incoming (fixed)
    if (catSelect) catSelect.style.display = 'none';
    if (catBadge) {
      catBadge.style.display = 'block';
      catBadge.innerHTML = '<span style="color:#10b981;">●</span> incoming';
    }
    // Subcategory: Income Salary & Others income (Divide)
    if (subcatBadge) subcatBadge.style.display = 'none';
    if (subcatSelect) {
      subcatSelect.style.display = 'block';
      subcatSelect.innerHTML = CF_RECEIVE_SUBCATS.map(s => `<option value="${escapeCfHtml(s)}">${escapeCfHtml(s)}</option>`).join('');
    }
    // Payment Method: Hidden, always Cash
    if (payContainer) payContainer.style.display = 'none';
    if (paySelect) paySelect.value = 'Cash';

  } else if (mode === 'pay') {
    // Category: Fixed costs, Variable costs, Advance
    if (catBadge) catBadge.style.display = 'none';
    if (catSelect) {
      catSelect.style.display = 'block';
      catSelect.value = 'Variable costs';
    }
    // Subcategory: dynamic based on category
    if (subcatBadge) subcatBadge.style.display = 'none';
    if (subcatSelect) {
      subcatSelect.style.display = 'block';
    }
    onPayCategoryChange();
    // Payment Method: Cash, Credit card
    if (payContainer) payContainer.style.display = 'block';
    if (paySelect) paySelect.value = 'Cash';

  } else if (mode === 'saving') {
    // Category = Saving, Subcategory = Saving (both fixed)
    if (catSelect) catSelect.style.display = 'none';
    if (catBadge) {
      catBadge.style.display = 'block';
      catBadge.innerHTML = '<span style="color:#6366f1;">●</span> Saving';
    }
    if (subcatSelect) subcatSelect.style.display = 'none';
    if (subcatBadge) {
      subcatBadge.style.display = 'block';
      subcatBadge.innerHTML = '<span style="color:#6366f1;">●</span> Saving';
    }
    // Payment Method: Hidden, always Cash
    if (payContainer) payContainer.style.display = 'none';
    if (paySelect) paySelect.value = 'Cash';
  }

  // 4. Description & Quick Chips
  const descInput = document.getElementById('cfRecDescInput');
  if (descInput) descInput.value = '';
  const mgrBox = document.getElementById('cfDescManagerBox');
  if (mgrBox) mgrBox.style.display = 'none';
  renderCfDescChips(_cfActiveMode);

  // 5. Amount
  const amtInput = document.getElementById('cfRecAmountInput');
  if (amtInput) amtInput.value = '';

  // 6. Apps Script Status & Inputs
  const cfg = SheetsAPI.getConfig();
  const scriptUrl = cfg.appsScriptUrl || localStorage.getItem('finventure_apps_script_url') || '';
  const scriptInput = document.getElementById('cfAppsScriptUrlInput');
  if (scriptInput) scriptInput.value = scriptUrl;

  const statusIndicator = document.getElementById('cfAppsScriptStatusIndicator');
  if (statusIndicator) {
    if (scriptUrl && scriptUrl.startsWith('http')) {
      statusIndicator.innerHTML = `<span>📊 บันทึกตรงสู่ Google Sheet: <strong>Expense</strong></span> <span class="pill pill-em" style="font-size:10.5px; padding:2px 8px;">Auto-Sync ⚡</span>`;
    } else {
      statusIndicator.innerHTML = `<span>📊 ชีตเป้าหมาย: <strong>Expense</strong></span> <span style="font-size:10.5px; color:var(--fg-muted);">(ซิงค์ด่วนในแดชบอร์ด)</span>`;
    }
  }

  const guideBox = document.getElementById('cfAppsScriptConfigBox');
  if (guideBox) guideBox.style.display = 'none';

  const modalStatus = document.getElementById('cfRecModalStatus');
  if (modalStatus) modalStatus.innerHTML = '';

  modal.style.display = 'flex';
  setTimeout(() => {
    if (amtInput) amtInput.focus();
  }, 100);
}

function closeExpenseRecordModal() {
  const modal = document.getElementById('cfExpenseRecordModal');
  if (modal) modal.style.display = 'none';
}

function onPayCategoryChange() {
  const catSelect = document.getElementById('cfRecCategorySelect');
  const subcatSelect = document.getElementById('cfRecSubcategorySelect');
  if (!catSelect || !subcatSelect) return;

  const selectedCat = catSelect.value || 'Variable costs';
  const subOptions = CF_PAY_CATEGORIES[selectedCat] || [];
  subcatSelect.innerHTML = subOptions.map(s => `<option value="${escapeCfHtml(s)}">${escapeCfHtml(s)}</option>`).join('');
}

function renderCfDescChips(mode) {
  const container = document.getElementById('cfRecChipsContainer');
  const countText = document.getElementById('cfDescCountText');
  if (!container) return;

  const list = getCfCustomDescriptions(mode);
  if (countText) countText.textContent = `${list.length}/5`;

  if (!list.length) {
    container.innerHTML = '<span style="font-size:11px; color:var(--fg-muted);">ไม่มีรายการลัด (กด "⚙️ ปรับแต่งค่าเริ่มต้น" เพื่อเพิ่ม)</span>';
    return;
  }

  const html = list.map(item => {
    return `<button type="button" class="cf-chip" onclick="selectCfDescChip(this, '${escapeCfHtml(item).replace(/'/g, "\\'")}')">${escapeCfHtml(item)}</button>`;
  }).join('');

  container.innerHTML = html;
}

function selectCfDescChip(btn, text) {
  const descInput = document.getElementById('cfRecDescInput');
  if (descInput) {
    descInput.value = text;
    descInput.focus();
  }
  document.querySelectorAll('#cfRecChipsContainer .cf-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function toggleDescManager() {
  const box = document.getElementById('cfDescManagerBox');
  if (!box) return;
  const isHidden = box.style.display === 'none' || !box.style.display;
  box.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    renderCfDescManager(_cfActiveMode);
    const newInp = document.getElementById('cfNewDescInput');
    if (newInp) newInp.focus();
  }
}

function renderCfDescManager(mode) {
  const listEl = document.getElementById('cfDescManagerList');
  const countText = document.getElementById('cfDescCountText');
  const addRow = document.getElementById('cfDescAddRow');
  if (!listEl) return;

  const list = getCfCustomDescriptions(mode);
  if (countText) countText.textContent = `${list.length}/5`;

  if (!list.length) {
    listEl.innerHTML = '<div style="font-size:11.5px; color:var(--fg-muted); padding:4px 0;">ยังไม่มีค่าเริ่มต้นที่กำหนดไว้</div>';
  } else {
    listEl.innerHTML = list.map((item, idx) => {
      return `
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface); padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); font-size: 12px;">
        <span style="font-weight: 600;">${idx + 1}. ${escapeCfHtml(item)}</span>
        <button type="button" style="background:none; border:none; color:#f43f5e; cursor:pointer; font-size:13px; padding:2px 6px;" onclick="handleRemoveCustomDesc(${idx})" title="ลบรายการนี้">🗑️</button>
      </div>`;
    }).join('');
  }

  // Disable add button if limit of 5 is reached
  if (addRow) {
    const btn = addRow.querySelector('button');
    const inp = addRow.querySelector('input');
    if (list.length >= 5) {
      if (btn) btn.disabled = true;
      if (inp) {
        inp.disabled = true;
        inp.placeholder = 'ครบ 5 ข้อความแล้ว (ลบออกก่อนเพิ่มใหม่)';
      }
    } else {
      if (btn) btn.disabled = false;
      if (inp) {
        inp.disabled = false;
        inp.placeholder = 'พิมพ์ข้อความใหม่...';
      }
    }
  }
}

function handleAddCustomDesc() {
  const input = document.getElementById('cfNewDescInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  const list = getCfCustomDescriptions(_cfActiveMode);
  if (list.length >= 5) {
    alert('จำกัดไม่เกิน 5 ข้อความตามที่กำหนดครับ');
    return;
  }
  if (!list.includes(val)) {
    list.push(val);
    saveCfCustomDescriptions(_cfActiveMode, list);
  }
  input.value = '';
  renderCfDescManager(_cfActiveMode);
  renderCfDescChips(_cfActiveMode);
}

function handleRemoveCustomDesc(idx) {
  const list = getCfCustomDescriptions(_cfActiveMode);
  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    saveCfCustomDescriptions(_cfActiveMode, list);
    renderCfDescManager(_cfActiveMode);
    renderCfDescChips(_cfActiveMode);
  }
}

function toggleAppsScriptGuide() {
  const box = document.getElementById('cfAppsScriptConfigBox');
  if (!box) return;
  box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
}

function handleSaveAppsScriptUrl() {
  const input = document.getElementById('cfAppsScriptUrlInput');
  if (!input) return;
  const url = input.value.trim();
  const cfg = SheetsAPI.getConfig();
  cfg.appsScriptUrl = url;
  SheetsAPI.saveConfig(cfg);
  localStorage.setItem('finventure_apps_script_url', url);

  const statusIndicator = document.getElementById('cfAppsScriptStatusIndicator');
  if (statusIndicator) {
    if (url && url.startsWith('http')) {
      statusIndicator.innerHTML = `<span>📊 บันทึกตรงสู่ Google Sheet: <strong>Expense</strong></span> <span class="pill pill-em" style="font-size:10.5px; padding:2px 8px;">Auto-Sync ⚡</span>`;
    } else {
      statusIndicator.innerHTML = `<span>📊 ชีตเป้าหมาย: <strong>Expense</strong></span> <span style="font-size:10.5px; color:var(--fg-muted);">(ซิงค์ด่วนในแดชบอร์ด)</span>`;
    }
  }
  showCfToast('บันทึก Apps Script Web App URL เรียบร้อย', '🔗');
}

function copyAppsScriptCode() {
  const code = `function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    if (params.action === "getUser") {
      var props = PropertiesService.getScriptProperties();
      var user = props.getProperty("AUTH_USER") || "";
      var passHash = props.getProperty("AUTH_HASH") || "";
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        user: user,
        passHash: passHash
      })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "ready", service: "FinVenture API" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(contents);

    // 1. User Management (Private Cloud Storage via ScriptProperties)
    if (data.action === "saveUser") {
      var props = PropertiesService.getScriptProperties();
      props.setProperty("AUTH_USER", data.username || "");
      props.setProperty("AUTH_HASH", data.passHash || "");
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "User saved" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Default: Record Expense Row
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Expense");
    if (!sheet) {
      sheet = ss.insertSheet("Expense");
      sheet.appendRow(["Date", "Category", "Subcategory", "Description", "Amount", "Payment Method", "Remark"]);
    }
    sheet.appendRow([
      data.date || Utilities.formatDate(new Date(), "GMT+7", "d-MMM-yyyy"),
      data.category || "",
      data.subcategory || "",
      data.description || "",
      Number(data.amount) || 0,
      data.paymentMethod || "Cash",
      data.remark || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showCfToast('คัดลอกโค้ด Google Apps Script แล้ว! นำไปวางใน Extensions > Apps Script', '📋');
    }).catch(() => {
      prompt('คัดลอกโค้ดด้านล่างนี้ไปวางใน Google Apps Script:', code);
    });
  } else {
    prompt('คัดลอกโค้ดด้านล่างนี้ไปวางใน Google Apps Script:', code);
  }
}

let _cfToastTimer = null;
function showCfToast(msg, icon = '✅') {
  const toast = document.getElementById('cfToast');
  const msgEl = document.getElementById('cfToastMsg');
  const iconEl = document.getElementById('cfToastIcon');
  if (!toast) return;

  if (msgEl) msgEl.textContent = msg;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.add('show');
  clearTimeout(_cfToastTimer);
  _cfToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

async function handleSaveExpenseRecord() {
  const dateInput = document.getElementById('cfRecDate');
  const amtInput = document.getElementById('cfRecAmountInput');
  const descInput = document.getElementById('cfRecDescInput');
  const statusEl = document.getElementById('cfRecModalStatus');
  const submitBtn = document.getElementById('cfRecSubmitBtn');

  const rawDate = dateInput ? dateInput.value : '';
  const numAmt = amtInput ? parseFloat(amtInput.value) : 0;

  if (!rawDate) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#f43f5e;">⚠️ กรุณาเลือกวันที่จากปฏิทิน</span>';
    if (dateInput) dateInput.focus();
    return;
  }

  if (isNaN(numAmt) || numAmt <= 0) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#f43f5e;">⚠️ กรุณาระบุจำนวนเงินที่มากกว่า 0</span>';
    if (amtInput) amtInput.focus();
    return;
  }

  let category = '';
  let subcategory = '';
  let paymentMethod = 'Cash';

  if (_cfActiveMode === 'receive') {
    category = 'incoming';
    const subSelect = document.getElementById('cfRecSubcategorySelect');
    subcategory = (subSelect && subSelect.value) ? subSelect.value : 'Income Salary';
    paymentMethod = 'Cash'; // e. Payment Method ไม่ต้องแสดงแต่ให้บันทึกเป็น Cash เสมอ

  } else if (_cfActiveMode === 'pay') {
    const catSelect = document.getElementById('cfRecCategorySelect');
    category = (catSelect && catSelect.value) ? catSelect.value : 'Variable costs';
    const subSelect = document.getElementById('cfRecSubcategorySelect');
    subcategory = (subSelect && subSelect.value) ? subSelect.value : 'Others';
    const paySelect = document.getElementById('cfRecPaymentSelect');
    paymentMethod = (paySelect && paySelect.value) ? paySelect.value : 'Cash';

  } else if (_cfActiveMode === 'saving') {
    category = 'Saving';
    subcategory = 'Saving'; // Category = Saving และ Subcategory = Saving เสมอ
    paymentMethod = 'Cash'; // e. Payment Method ไม่ต้องแสดงแต่ให้บันทึกเป็น Cash เสมอ
  }

  let description = descInput ? descInput.value.trim() : '';
  if (!description) {
    description = subcategory || category;
  }

  const formattedDate = formatSheetDate(rawDate);
  const [y, m, d] = rawDate.split('-').map(Number);
  const timestamp = new Date(y, m - 1, d || 1).getTime();

  const record = {
    rowIdx: Date.now(),
    timestamp,
    date: formattedDate,
    category: category,
    subcategory: subcategory,
    mainCategory: category,
    description: description,
    amount: numAmt,
    paymentMethod: paymentMethod,
    remark: ''
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'กำลังบันทึก... ⏳';
  }

  try {
    const res = await SheetsAPI.saveExpenseRecord(record);

    if (res && !res.success) {
      if (res.needConfig) {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color:#f43f5e;">⚠️ ยังไม่ได้ตั้งค่า Web App URL: กรุณาใส่ URL ในกล่องด้านล่างแล้วกด "บันทึก" ก่อนครับ</span>`;
        }
        const cfgBox = document.getElementById('cfAppsScriptConfigBox');
        if (cfgBox) cfgBox.style.display = 'block';
        const urlInp = document.getElementById('cfAppsScriptUrlInput');
        if (urlInp) urlInp.focus();
      } else {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color:#f43f5e;">❌ ไม่สามารถส่งข้อมูลได้: ${res.error || res.message}</span>`;
        }
      }
      return;
    }

    closeExpenseRecordModal();

    const amtFmt = `฿${Math.round(numAmt).toLocaleString('th-TH')}`;
    let successMsg = '';
    if (_cfActiveMode === 'receive') {
      successMsg = `ส่งข้อมูลรายรับ ${amtFmt} (${description}) เข้า Google Sheet แล้ว!`;
    } else if (_cfActiveMode === 'pay') {
      successMsg = `ส่งข้อมูลรายจ่าย ${amtFmt} (${description}) เข้า Google Sheet แล้ว!`;
    } else {
      successMsg = `ส่งข้อมูลเงินออม & ลงทุน ${amtFmt} (${description}) เข้า Google Sheet แล้ว!`;
    }

    showCfToast(successMsg, '⚡');

  } catch (err) {
    console.error('Error saving expense record', err);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#f43f5e;">❌ เกิดข้อผิดพลาด: ${err.message}</span>`;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'บันทึกข้อมูล (Save)';
    }
  }
}
