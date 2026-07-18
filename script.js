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

const presets = {
  style1: {
    label: "Стиль 1",
    top: "#18060d",
    bottom: "#5c1326",
    accent: "#ff2f64",
    accentSoft: "#ff90ad",
    bubble: "rgba(39, 0, 11, 0.88)"
  },
  style2: {
    label: "Стиль 2",
    top: "#0f1635",
    bottom: "#3f2d8e",
    accent: "#8f74ff",
    accentSoft: "#d0c5ff",
    bubble: "rgba(16, 12, 48, 0.88)"
  },
  style3: {
    label: "Стиль 3",
    top: "#081714",
    bottom: "#0f5c53",
    accent: "#41d3a7",
    accentSoft: "#b8fff0",
    bubble: "rgba(1, 33, 28, 0.88)"
  },
  style4: {
    label: "Стиль 4",
    top: "#171008",
    bottom: "#724319",
    accent: "#ffb643",
    accentSoft: "#ffebbd",
    bubble: "rgba(55, 26, 0, 0.88)"
  }
};

const elements = {
  styleButtons: Array.from(document.querySelectorAll("[data-style]")),
  promoInput: document.getElementById("promoInput"),
  footerInput: document.getElementById("footerInput"),
  downloadButton: document.getElementById("downloadButton"),
  resetButton: document.getElementById("resetButton"),
  clearStyleButton: document.getElementById("clearStyleButton"),
  styleStatus: document.getElementById("styleStatus")
};

function resizeCanvas() {
  canvas.width = 1280;
  canvas.height = 720;
}

function roundedRect(x, y, width, height, radius) {
  const safe = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safe, y);
  ctx.lineTo(x + width - safe, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safe);
  ctx.lineTo(x + width, y + height - safe);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safe, y + height);
  ctx.lineTo(x + safe, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safe);
  ctx.lineTo(x, y + safe);
  ctx.quadraticCurveTo(x, y, x + safe, y);
  ctx.closePath();
}

function fillRoundedRect(x, y, width, height, radius, fillStyle) {
  roundedRect(x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundedRect(x, y, width, height, radius, strokeStyle, lineWidth) {
  roundedRect(x, y, width, height, radius);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function applyButtonState() {
  elements.styleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.style === state.style);
  });

  elements.styleStatus.textContent = state.style ? presets[state.style].label : "Стиль не выбран";
}

function drawBackgroundGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 88) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 88) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDiagonalOverlay() {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 180, 200, 0.22)";
  ctx.lineWidth = 3;

  for (let x = -180; x <= canvas.width + 140; x += 86) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 170, canvas.height);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEmptyState() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, "#0b1625");
  base.addColorStop(1, "#070e18");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundGrid();

  fillRoundedRect(84, 84, 1112, 552, 34, "rgba(10, 18, 30, 0.9)");
  strokeRoundedRect(84, 84, 1112, 552, 34, "rgba(122, 163, 255, 0.18)", 2);

  ctx.fillStyle = "#86a9f8";
  ctx.font = "700 22px Inter";
  ctx.fillText("MEDIA PROMO", 126, 146);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 92px Inter";
  ctx.fillText("МОСКВА", 126, 276);

  ctx.font = "800 44px Inter";
  ctx.fillText("Выбери стиль справа", 126, 350);

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "500 28px Inter";
  ctx.fillText("Баннер не показывается сам при загрузке.", 126, 412);
  ctx.fillText("Нажми на одну из карточек стиля, чтобы активировать сцену.", 126, 452);

  fillRoundedRect(126, 524, 510, 74, 22, "rgba(17, 29, 48, 0.94)");
  ctx.fillStyle = "#dce8ff";
  ctx.font = "700 33px Inter";
  ctx.fillText(defaults.footer, 154, 571);
}

function drawBubbles(accent, bubble) {
  const dots = [
    [458, 244, 26, accent], [500, 178, 24, accent], [548, 260, 20, accent], [594, 342, 24, bubble],
    [684, 224, 17, bubble], [742, 344, 27, bubble], [790, 212, 20, accent], [856, 286, 18, bubble],
    [908, 178, 22, accent], [932, 416, 18, accent], [813, 452, 16, bubble], [670, 452, 22, bubble],
    [564, 434, 20, accent], [490, 382, 19, bubble], [436, 316, 23, accent], [982, 254, 14, bubble]
  ];

  dots.forEach(([x, y, radius, color], index) => {
    ctx.globalAlpha = 0.92 - index * 0.02;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

function drawSceneFrame() {
  strokeRoundedRect(84, 84, 1112, 552, 34, "rgba(255, 122, 155, 0.35)", 2);
  strokeRoundedRect(108, 108, 1064, 504, 24, "rgba(255, 122, 155, 0.28)", 2);
}

function drawStyledBanner() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const preset = presets[state.style];
  const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, preset.top);
  base.addColorStop(1, preset.bottom);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundGrid();
  drawDiagonalOverlay();

  fillRoundedRect(84, 84, 1112, 552, 34, "rgba(23, 8, 18, 0.22)");
  drawSceneFrame();

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(176, 196, 202, 214);

  const glow = ctx.createRadialGradient(694, 352, 56, 694, 352, 290);
  glow.addColorStop(0, "rgba(255,255,255,0.65)");
  glow.addColorStop(0.12, preset.accentSoft);
  glow.addColorStop(0.28, preset.accent);
  glow.addColorStop(0.56, "rgba(0,0,0,0.28)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(280, 90, 700, 560);

  drawBubbles(preset.accent, preset.bubble);

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = "800 22px Inter";
  ctx.textAlign = "right";
  ctx.fillText("MEDIA PROMO • СТИЛЬ", 1062, 122);

  ctx.fillStyle = preset.accent;
  ctx.font = "800 34px Inter";
  ctx.textAlign = "center";
  ctx.fillText(state.promo, 775, 186);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 104px Inter";
  ctx.fillText("SERVER: MOSCOW", 522, 358);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "700 38px Inter";
  ctx.fillText("CAPITAL DISTRICT", 530, 420);

  ctx.fillStyle = preset.accent;
  ctx.font = "800 50px Inter";
  ctx.fillText(state.footer, 306, 558);
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
  link.download = `moscow-media-promo-${state.style || "empty"}.png`;
  link.click();
}

function resetState() {
  state.style = defaults.style;
  state.promo = defaults.promo;
  state.footer = defaults.footer;
  elements.promoInput.value = defaults.promo;
  elements.footerInput.value = defaults.footer;
  render();
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

  elements.resetButton.addEventListener("click", resetState);

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
