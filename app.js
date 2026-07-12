const weeklyReadings = [
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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyRainfall = {
  2023: [51.0, 15.5, 102.0, 77.5, 41.5, 24.0, 84.0, 59.5, 83.0, 146.5, 106.5, 94.0],
  2024: [89.0, 143.5, 37.5, 58.0, 92.5, 42.5, 107.0, 16.0, 142.0, 48.5, 177.0, 82.0],
  2025: [39.0, 39.5, 15.0, 16.5, 36.0, 27.5, 36.0, 19.5, 57.0, 59.5, 103.0, 51.0],
  2026: [72.7, 52.6, 41.4, 5.0, 33.6, 32.7, 0.4, null, null, null, null, null],
};

const yearColors = {
  2023: "#8f3f5c",
  2024: "#55764c",
  2025: "#e7ae45",
  2026: "#1d7189",
};

let monthlyMode = "grouped";

function fillStats() {
  const recordedRain = weeklyReadings.map((d) => d.rain);
  const total = recordedRain.reduce((sum, value) => sum + value, 0);
  const wettest = weeklyReadings.reduce((best, item) => (item.rain > best.rain ? item : best), weeklyReadings[0]);
  const dryWeeks = weeklyReadings.filter((item) => item.rain === 0).length;
  const overSix = weeklyReadings.filter((item) => item.rain > 6).length;
  const summary = [
    ["Total rainfall", `${total.toFixed(1)} mm`],
    ["Average recorded week", `${(total / weeklyReadings.length).toFixed(1)} mm`],
    ["Wettest week", wettest.week],
    ["Weeks over 6 mm", String(overSix)],
    ["Dry weeks", String(dryWeeks)],
  ];

  document.querySelector("#statsGrid").innerHTML = summary
    .map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function fillSeasonCards() {
  const seasons = [
    ["Winter", [11, 0, 1]],
    ["Spring", [2, 3, 4]],
    ["Summer so far", [5, 6, 7]],
    ["Autumn", [8, 9, 10]],
  ];

  const cards = seasons.map(([name, monthIndexes]) => {
    const values = monthIndexes.map((index) => monthlyRainfall[2026][index]).filter((value) => value != null);
    const total = values.reduce((sum, value) => sum + value, 0);
    const label = values.length ? `${total.toFixed(1)} mm` : "Awaiting data";
    const note =
      values.length === monthIndexes.length
        ? "Complete monthly comparison for 2026."
        : "Shown from the 2026 readings available so far.";
    return `<article class="season-card"><h3>${name}</h3><strong>${label}</strong><p>${note}</p></article>`;
  });

  document.querySelector("#seasonCards").innerHTML = cards.join("");
}

function fillYearRings() {
  const totals = Object.entries(monthlyRainfall).map(([year, values]) => ({
    year,
    total: values.reduce((sum, value) => sum + (value || 0), 0),
    count: values.filter((value) => value != null).length,
  }));
  const maxTotal = Math.max(...totals.map((item) => item.total), 1);

  document.querySelector("#yearRings").innerHTML = totals
    .map((item) => {
      const progress = item.total > 0 ? `${Math.max(6, (item.total / maxTotal) * 100)}%` : "3%";
      const amount = item.total > 0 ? `${item.total.toFixed(1)} mm` : "Add monthly values";
      const completeness = item.count === 12 ? "Full year" : item.count > 0 ? `${item.count} months so far` : "Ready for data";
      return `
        <div class="year-ring">
          <div class="ring" style="--progress: ${progress}; color: ${yearColors[item.year]}">${item.year}</div>
          <div>
            <span><strong>${amount}</strong></span>
            <em>${completeness}</em>
          </div>
        </div>`;
    })
    .join("");
}

function niceCeil(value, step) {
  return Math.ceil(value / step) * step;
}

function niceFloor(value, step) {
  return Math.floor(value / step) * step;
}

function setupCanvas(canvas) {
  const wrapper = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function drawMonthlyChart() {
  const canvas = document.querySelector("#monthlyChart");
  const { ctx, width, height } = setupCanvas(canvas);
  const compact = width < 680;
  const pad = {
    top: 28,
    right: compact ? 18 : 32,
    bottom: compact ? 76 : 62,
    left: compact ? 48 : 64,
  };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const years = Object.keys(monthlyRainfall);
  const visibleYears = monthlyMode === "focus" ? ["2026"] : years;
  const numericValues = visibleYears.flatMap((year) => monthlyRainfall[year].filter((value) => value != null));
  const maxRain = niceCeil(Math.max(...numericValues, 10), 20);
  const xStep = plotW / months.length;

  ctx.font = "12px Arial, Helvetica, sans-serif";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d4e0e3";
  ctx.fillStyle = "#53666b";

  for (let tick = 0; tick <= 5; tick += 1) {
    const value = (maxRain / 5) * tick;
    const y = pad.top + plotH - (value / maxRain) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(String(Math.round(value)), 12, y + 4);
  }

  ctx.save();
  ctx.translate(16, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Rainfall (mm)", -34, 0);
  ctx.restore();

  const groupW = Math.min(58, xStep * 0.72);
  const barW = monthlyMode === "focus" ? Math.min(28, groupW) : Math.max(4, groupW / visibleYears.length - 3);

  months.forEach((month, monthIndex) => {
    const groupX = pad.left + xStep * monthIndex + xStep / 2;

    visibleYears.forEach((year, yearIndex) => {
      const value = monthlyRainfall[year][monthIndex];
      if (value == null) return;
      const offset = monthlyMode === "focus" ? 0 : (yearIndex - (visibleYears.length - 1) / 2) * (barW + 3);
      const x = groupX + offset - barW / 2;
      const y = pad.top + plotH - (value / maxRain) * plotH;
      ctx.fillStyle = yearColors[year];
      ctx.fillRect(x, y, barW, pad.top + plotH - y);
    });

    ctx.fillStyle = "#53666b";
    ctx.fillText(month, groupX - ctx.measureText(month).width / 2, pad.top + plotH + 28);
  });

  if (monthlyMode === "grouped") {
    drawYearLegend(ctx, visibleYears, width, pad.top + 6);
  }

  ctx.strokeStyle = "#8aa1a8";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + plotH);
  ctx.lineTo(width - pad.right, pad.top + plotH);
  ctx.stroke();

  const hasHistoricalValues = ["2023", "2024", "2025"].some((year) => monthlyRainfall[year].some((value) => value != null));
  if (!hasHistoricalValues) {
    ctx.fillStyle = "rgba(20, 36, 41, 0.76)";
    ctx.font = compact ? "13px Arial, Helvetica, sans-serif" : "15px Arial, Helvetica, sans-serif";
    const message = "2023-2025 values can be added here once copied from the sheet";
    ctx.fillText(message, pad.left + 10, pad.top + 24);
  }
}

function drawYearLegend(ctx, years, right, y) {
  let x = right - 18;
  ctx.font = "12px Arial, Helvetica, sans-serif";
  years
    .slice()
    .reverse()
    .forEach((year) => {
      const textW = ctx.measureText(year).width;
      x -= textW + 32;
      ctx.fillStyle = yearColors[year];
      ctx.fillRect(x, y, 18, 8);
      ctx.fillStyle = "#53666b";
      ctx.fillText(year, x + 24, y + 8);
    });
}

function drawWeatherChart() {
  const canvas = document.querySelector("#weatherChart");
  const { ctx, width, height } = setupCanvas(canvas);
  const compact = width < 680;
  const pad = {
    top: 22,
    right: compact ? 48 : 68,
    bottom: compact ? 88 : 72,
    left: compact ? 48 : 62,
  };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const rainMax = niceCeil(Math.max(...weeklyReadings.map((d) => d.rain)), 10);
  const tempMin = niceFloor(Math.min(...weeklyReadings.map((d) => d.min)), 5);
  const tempMax = niceCeil(Math.max(...weeklyReadings.map((d) => d.max)), 5);
  const xStep = plotW / weeklyReadings.length;
  const barW = Math.max(4, Math.min(18, xStep * 0.54));

  const xAt = (index) => pad.left + xStep * index + xStep / 2;
  const rainY = (value) => pad.top + plotH - (value / rainMax) * plotH;
  const tempY = (value) => pad.top + plotH - ((value - tempMin) / (tempMax - tempMin)) * plotH;

  ctx.font = "12px Arial, Helvetica, sans-serif";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d4e0e3";
  ctx.fillStyle = "#53666b";

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

  weeklyReadings.forEach((d, index) => {
    const x = xAt(index);
    const y = rainY(d.rain);
    ctx.fillStyle = "#1d7189";
    ctx.fillRect(x - barW / 2, y, barW, pad.top + plotH - y);
  });

  drawLine(ctx, weeklyReadings.map((d, index) => [xAt(index), tempY(d.max)]), "#c45d2c");
  drawLine(ctx, weeklyReadings.map((d, index) => [xAt(index), tempY(d.min)]), "#536fc1");

  const seenMonths = new Set();
  const labelEvery = 3;
  weeklyReadings.forEach((d, index) => {
    const month = d.week.match(/[A-Z][a-z]+/)?.[0] || "";
    if (compact) {
      if (seenMonths.has(month)) return;
      seenMonths.add(month);
    } else if (index % labelEvery !== 0 && index !== weeklyReadings.length - 1) {
      return;
    }
    const x = xAt(index);
    const label = compact ? month : d.week;
    ctx.save();
    ctx.translate(x, pad.top + plotH + 18);
    ctx.rotate(compact ? 0 : -Math.PI / 3);
    ctx.fillStyle = "#53666b";
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

function drawAllCharts() {
  drawMonthlyChart();
  drawWeatherChart();
}

function setupControls() {
  document.querySelectorAll("[data-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      monthlyMode = button.dataset.chartMode;
      document.querySelectorAll("[data-chart-mode]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      drawMonthlyChart();
    });
  });
}

fillStats();
fillSeasonCards();
fillYearRings();
setupControls();
drawAllCharts();
window.addEventListener("resize", drawAllCharts);
