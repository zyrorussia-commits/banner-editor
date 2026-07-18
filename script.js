const canvas = document.getElementById("promoCanvas");
const ctx = canvas.getContext("2d");

const defaults = {
  style: null,
  promo: "/promo > 2",
  footer: "скачать игру в тгк @crmp_zyro"
};

const state = {
  style: defaults.style,
  promo: defaults.promo,
  footer: defaults.footer
};

const styles = {
  style1: {
    label: "Стиль 1",
    top: "#18070d",
    bottom: "#5d1122",
    accent: "#ff2c64",
    accentSoft: "#ff9ab8",
    glow: "rgba(255, 44, 100, 0.42)"
  },
  style2: {
    label: "Стиль 2",
    top: "#08121f",
    bottom: "#174f79",
    accent: "#44c2ff",
    accentSoft: "#bceeff",
    glow: "rgba(68, 194, 255, 0.38)"
  },
  style3: {
    label: "Стиль 3",
    top: "#09110a",
    bottom: "#1d5f33",
    accent: "#6dff8f",
    accentSoft: "#cfffda",
    glow: "rgba(109, 255, 143, 0.32)"
  },
  style4: {
    label: "Стиль 4",
    top: "#120d08",
    bottom: "#7c4d14",
    accent: "#ffbf4d",
    accentSoft: "#ffedc7",
    glow: "rgba(255, 191, 77, 0.34)"
  }
};

const elements = {
  styleButtons: Array.from(document.querySelectorAll("[data-style]")),
  promoInput: document.getElementById("promoInput"),
  footerInput: document.getElementById("footerInput"),
  downloadButton: document.getElementById("downloadButton"),
  clearStyleButton: document.getElementById("clearStyleButton"),
  styleStatus: document.getElementById("styleStatus")
};

function resizeCanvas() {
  canvas.width = 1280;
  canvas.height = 720;
}

function roundRectPath(x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function fillRoundRect(x, y, width, height, radius, fillStyle) {
  roundRectPath(x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundRect(x, y, width, height, radius, strokeStyle, lineWidth) {
  roundRectPath(x, y, width, height, radius);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function applyButtonState() {
  elements.styleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.style === state.style);
  });

  elements.styleStatus.textContent = state.style ? styles[state.style].label : "Стиль не выбран";
}

function drawGridOverlay() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEmptyState() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, "#0a1625");
  bg.addColorStop(1, "#08101b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGridOverlay();

  fillRoundRect(70, 70, 1140, 580, 34, "rgba(8, 16, 28, 0.84)");
  strokeRoundRect(70, 70, 1140, 580, 34, "rgba(122, 163, 255, 0.16)", 2);

  ctx.fillStyle = "#7aa3ff";
  ctx.font = "700 22px Inter";
  ctx.textAlign = "left";
  ctx.fillText("RAGE MEDIA PROMO", 118, 136);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 82px Inter";
  ctx.fillText("МОСКВА", 118, 270);

  ctx.font = "700 44px Inter";
  ctx.fillText("Стиль пока не выбран", 118, 348);

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "500 28px Inter";
  ctx.fillText("Нажми на карточку справа, чтобы включить один из 4 стилей.", 118, 404);
  ctx.fillText("Баннер не активируется сам при загрузке.", 118, 444);

  fillRoundRect(118, 520, 438, 70, 20, "rgba(18, 34, 55, 0.92)");
  ctx.fillStyle = "#dbe7ff";
  ctx.font = "700 34px Inter";
  ctx.fillText(defaults.footer, 144, 565);
}

function drawAccentBubbles(color) {
  const bubbles = [
    [905, 192, 34], [970, 254, 27], [864, 276, 18], [759, 228, 22],
    [728, 327, 28], [865, 368, 20], [1008, 370, 16], [944, 438, 24],
    [800, 451, 17], [681, 422, 21], [610, 278, 14], [589, 375, 26]
  ];

  ctx.fillStyle = color;

  bubbles.forEach(([x, y, radius], index) => {
    ctx.globalAlpha = 0.9 - index * 0.04;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

function drawStyledBanner() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const preset = styles[state.style];
  const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, preset.top);
  background.addColorStop(1, preset.bottom);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGridOverlay();

  fillRoundRect(66, 66, 1148, 588, 34, "rgba(20, 10, 18, 0.22)");
  strokeRoundRect(66, 66, 1148, 588, 34, "rgba(255,255,255,0.14)", 2);
  strokeRoundRect(92, 92, 1096, 536, 26, "rgba(255,255,255,0.08)", 2);

  const glow = ctx.createRadialGradient(778, 345, 50, 778, 345, 280);
  glow.addColorStop(0, "rgba(255,255,255,0.66)");
  glow.addColorStop(0.18, preset.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(330, 80, 690, 540);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(176, 168, 198, 210);

  drawAccentBubbles(preset.accent);

  ctx.fillStyle = preset.accent;
  ctx.font = "800 34px Inter";
  ctx.textAlign = "center";
  ctx.fillText(state.promo, canvas.width / 2, 168);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 106px Inter";
  ctx.fillText("SERVER: MOSCOW", 525, 332);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "700 40px Inter";
  ctx.fillText("CAPITAL DISTRICT", 530, 394);

  ctx.fillStyle = preset.accent;
  ctx.font = "800 52px Inter";
  ctx.fillText(state.footer, 310, 558);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "700 20px Inter";
  ctx.fillText("RAGE MEDIA PROMO  •  МОСКВА", 860, 108);
}

function render() {
  applyButtonState();

  if (!state.style) {
    drawEmptyState();
    return;
  }

  drawStyledBanner();
}

function downloadBanner() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `moscow-banner-${state.style || "empty"}.png`;
  link.click();
}

function setupEvents() {
  elements.styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.style = button.dataset.style;
      render();
    });
  });

  elements.clearStyleButton.addEventListener("click", () => {
    state.style = null;
    render();
  });

  elements.promoInput.addEventListener("input", (event) => {
    state.promo = event.target.value.trim() || defaults.promo;
    render();
  });

  elements.footerInput.addEventListener("input", (event) => {
    state.footer = event.target.value.trim() || defaults.footer;
    render();
  });

  elements.downloadButton.addEventListener("click", downloadBanner);
}

function init() {
  setupEvents();
  render();
}

init();
