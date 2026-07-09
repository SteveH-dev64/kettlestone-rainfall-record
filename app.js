const readings = [
  { week: "1 Jan - 7 Jan", rain: 9, max: 5.2, min: -7.1 },
  { week: "8 Jan - 14 Jan", rain: 37, max: 10.8, min: -3.0 },
  { week: "15 Jan - 21 Jan", rain: 18, max: 10.0, min: 2.1 },
  { week: "22 Jan - 28 Jan", rain: 7, max: 8.4, min: -0.1 },
  { week: "29 Jan - 4 Feb", rain: 4, max: 9.7, min: 1.7 },
  { week: "5 Feb - 11 Feb", rain: 15, max: 11.2, min: 3.1 },
  { week: "12 Feb - 18 Feb", rain: 20, max: 6.9, min: -0.8 },
  { week: "19 Feb - 25 Feb", rain: 11, max: 16.5, min: 1.8 },
  { week: "26 Feb - 4 Mar", rain: 10, max: 15.1, min: 2.5 },
  { week: "5 Mar - 11 Mar", rain: 6, max: 15.8, min: 5.2 },
  { week: "12 Mar - 18 Mar", rain: 16, max: 16.7, min: 0.7 },
  { week: "19 Mar - 25 Mar", rain: 6, max: 15.7, min: -0.3 },
  { week: "26 Mar - 1 Apr", rain: 9, max: 15.1, min: 1.0 },
  { week: "2 Apr - 8 Apr", rain: 0, max: 21.8, min: 0.6 },
  { week: "9 Apr - 15 Apr", rain: 2, max: 19.4, min: 2.1 },
  { week: "16 Apr - 22 Apr", rain: 0, max: 16.7, min: 1.5 },
  { week: "23 Apr - 29 Apr", rain: 1, max: 19.2, min: -0.3 },
  { week: "30 Apr - 6 May", rain: 5, max: 21.6, min: 2.9 },
  { week: "7 May - 13 May", rain: 8, max: 17.4, min: 0.7 },
  { week: "14 May - 20 May", rain: 13.5, max: 17.6, min: 3.7 },
  { week: "21 May - 27 May", rain: 1, max: 31.6, min: 9.6 },
  { week: "28 May - 3 Jun", rain: 12, max: 24.3, min: 10.6 },
  { week: "4 Jun - 10 Jun", rain: 14, max: 19.0, min: 7.0 },
  { week: "11 Jun - 17 Jun", rain: 10, max: 23.0, min: 7.1 },
  { week: "18 Jun - 24 Jun", rain: 1, max: 29.1, min: 13.8 },
  { week: "25 Jun - 1 Jul", rain: 3, max: 32.9, min: 12.3 },
  { week: "2 Jul - 8 Jul", rain: 0, max: 28.9, min: 11.2 },
];

const summary = [
  ["Total rainfall", "238.5 mm"],
  ["Average recorded week", "8.8 mm"],
  ["Wettest week", "8 Jan - 14 Jan"],
  ["Dry weeks", "3"],
  ["Recorded weeks", "27"],
];

function fillStats() {
  const statsGrid = document.querySelector("#statsGrid");
  statsGrid.innerHTML = summary
    .map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function niceCeil(value, step) {
  return Math.ceil(value / step) * step;
}

function niceFloor(value, step) {
  return Math.floor(value / step) * step;
}

function drawWeatherChart() {
  const canvas = document.querySelector("#weatherChart");
  const wrapper = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const compact = width < 680;
  const pad = {
    top: 22,
    right: compact ? 48 : 68,
    bottom: compact ? 88 : 72,
    left: compact ? 48 : 62,
  };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const rainMax = niceCeil(Math.max(...readings.map((d) => d.rain)), 10);
  const tempMin = niceFloor(Math.min(...readings.map((d) => d.min)), 5);
  const tempMax = niceCeil(Math.max(...readings.map((d) => d.max)), 5);
  const xStep = plotW / readings.length;
  const barW = Math.max(4, Math.min(18, xStep * 0.54));

  const xAt = (index) => pad.left + xStep * index + xStep / 2;
  const rainY = (value) => pad.top + plotH - (value / rainMax) * plotH;
  const tempY = (value) => pad.top + plotH - ((value - tempMin) / (tempMax - tempMin)) * plotH;

  ctx.font = "12px Arial, Helvetica, sans-serif";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d4e0e3";
  ctx.fillStyle = "#52666f";

  for (let tick = 0; tick <= 4; tick += 1) {
    const rainValue = (rainMax / 4) * tick;
    const y = rainY(rainValue);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(String(Math.round(rainValue)), 10, y + 4);

    const tempValue = tempMin + ((tempMax - tempMin) / 4) * tick;
    const label = `${Math.round(tempValue)}`;
    const labelW = ctx.measureText(label).width;
    ctx.fillText(label, width - pad.right + 14, y + 4);
  }

  ctx.save();
  ctx.translate(15, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Rainfall (mm)", -36, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(width - 12, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Temperature (C)", -48, 0);
  ctx.restore();

  readings.forEach((d, index) => {
    const x = xAt(index);
    const y = rainY(d.rain);
    ctx.fillStyle = "#1f6f8b";
    ctx.fillRect(x - barW / 2, y, barW, pad.top + plotH - y);
  });

  drawLine(ctx, readings.map((d, index) => [xAt(index), tempY(d.max)]), "#c75f2b");
  drawLine(ctx, readings.map((d, index) => [xAt(index), tempY(d.min)]), "#5b6fb9");

  const seenMonths = new Set();
  const labelEvery = 3;
  readings.forEach((d, index) => {
    const month = d.week.match(/[A-Z][a-z]+/)?.[0] || "";
    if (compact) {
      if (seenMonths.has(month)) return;
      seenMonths.add(month);
    } else if (index % labelEvery !== 0 && index !== readings.length - 1) {
      return;
    }
    const x = xAt(index);
    const label = compact ? month : d.week;
    ctx.save();
    ctx.translate(x, pad.top + plotH + 18);
    ctx.rotate(compact ? 0 : -Math.PI / 3);
    ctx.fillStyle = "#52666f";
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });

  ctx.strokeStyle = "#8aa1a8";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + plotH);
  ctx.lineTo(width - pad.right, pad.top + plotH);
  ctx.lineTo(width - pad.right, pad.top);
  ctx.stroke();
}

function drawLine(ctx, points, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

fillStats();
drawWeatherChart();
window.addEventListener("resize", drawWeatherChart);
