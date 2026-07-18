const canvas = document.getElementById("promoCanvas");
const ctx = canvas.getContext("2d");

const logoImage = new Image();
logoImage.src = "assets/logo.png";

const defaultState = {
  style: "style1",
  server: "Москва",
  shape: "square",
  element: "logo",
  showBackground: true,
  backgroundColor: "#070911",
  promoCode: "/promo > 2",
  footerText: "скачать игру в тгк - @zyro_media",
  customTitle: "",
  uploadedImage: null
};

const state = { ...defaultState };

const stylePresets = {
  style1: {
    name: "Стиль 1",
    backgroundTop: "#180d14",
    backgroundBottom: "#5d121f",
    accent: "#ff2950",
    splash: "rgba(255, 28, 68, 0.92)",
    shadow: "rgba(25, 0, 0, 0.94)",
    textMain: "#ffffff",
    textAccentA: "#ffd8df",
    textAccentB: "#ff315d",
    frame: "rgba(255, 98, 130, 0.36)",
    logoGlow: "rgba(255, 72, 108, 0.48)",
    pattern: "slashes"
  },
  style2: {
    name: "Стиль 2",
    backgroundTop: "#111523",
    backgroundBottom: "#2b1451",
    accent: "#8c5bff",
    splash: "rgba(150, 84, 255, 0.88)",
    shadow: "rgba(7, 0, 22, 0.92)",
    textMain: "#faf7ff",
    textAccentA: "#efe0ff",
    textAccentB: "#8b5dff",
    frame: "rgba(153, 109, 255, 0.34)",
    logoGlow: "rgba(129, 88, 255, 0.42)",
    pattern: "rings"
  },
  style3: {
    name: "Стиль 3",
    backgroundTop: "#071926",
    backgroundBottom: "#13536b",
    accent: "#35d8ff",
    splash: "rgba(36, 205, 255, 0.9)",
    shadow: "rgba(0, 14, 28, 0.9)",
    textMain: "#f0fdff",
    textAccentA: "#d2fcff",
    textAccentB: "#4fe7ff",
    frame: "rgba(90, 226, 255, 0.32)",
    logoGlow: "rgba(78, 229, 255, 0.4)",
    pattern: "grid"
  },
  style4: {
    name: "Стиль 4",
    backgroundTop: "#24170f",
    backgroundBottom: "#603a14",
    accent: "#ffaf39",
    splash: "rgba(255, 167, 56, 0.88)",
    shadow: "rgba(28, 14, 0, 0.92)",
    textMain: "#fff7eb",
    textAccentA: "#fff0ce",
    textAccentB: "#ffb144",
    frame: "rgba(255, 192, 104, 0.34)",
    logoGlow: "rgba(255, 172, 67, 0.42)",
    pattern: "beams"
  }
};

const serverMeta = {
  "Москва": { title: "MOSCOW", label: "CAPITAL DISTRICT" },
  "Питер": { title: "PITER", label: "NORTHERN LINE" },
  "Екатеринбург": { title: "EKB", label: "URAL CORE" }
};

const els = {
  downloadButton: document.getElementById("downloadButton"),
  resetButton: document.getElementById("resetButton"),
  shuffleButton: document.getElementById("shuffleButton"),
  backgroundToggle: document.getElementById("backgroundToggle"),
  removeBackgroundButton: document.getElementById("removeBackgroundButton"),
  statusChip: document.getElementById("statusChip"),
  styleButtons: Array.from(document.querySelectorAll("[data-style]")),
  serverButtons: Array.from(document.querySelectorAll("[data-server]")),
  shapeButtons: Array.from(document.querySelectorAll("[data-shape]")),
  elementButtons: Array.from(document.querySelectorAll("[data-element]")),
  swatches: Array.from(document.querySelectorAll("[data-bg]")),
  promoCodeInput: document.getElementById("promoCodeInput"),
  footerInput: document.getElementById("footerInput"),
  addTextButton: document.getElementById("addTextButton"),
  addElementButton: document.getElementById("addElementButton"),
  formatButton: document.getElementById("formatButton"),
  backgroundUpload: document.getElementById("backgroundUpload")
};

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const parsed = Number.parseInt(value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function fitCanvas() {
  canvas.width = 1400;
  canvas.height = 780;
}

function setActive(buttons, key, value) {
  buttons.forEach((button) => {
    const isActive = button.dataset[key] === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyState(nextState) {
  Object.assign(state, nextState);
  syncControls();
  renderCanvas();
}

function drawBackground(preset) {
  if (!state.showBackground) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, preset.backgroundTop);
  gradient.addColorStop(1, preset.backgroundBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = rgba(state.backgroundColor, 0.3);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (state.uploadedImage) {
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.drawImage(state.uploadedImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  const glow = ctx.createRadialGradient(1080, 110, 20, 1080, 110, 340);
  glow.addColorStop(0, rgba(preset.accent, 0.26));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPattern(preset) {
  ctx.save();
  ctx.strokeStyle = preset.frame;
  ctx.fillStyle = preset.frame;

  if (preset.pattern === "slashes") {
    ctx.lineWidth = 2;
    for (let i = -220; i < 1600; i += 88) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 240, 780);
      ctx.stroke();
    }
  }

  if (preset.pattern === "rings") {
    ctx.lineWidth = 2;
    [210, 282, 356].forEach((radius) => {
      ctx.beginPath();
      ctx.arc(1060, 152, radius, 0.15 * Math.PI, 1.42 * Math.PI);
      ctx.stroke();
    });
  }

  if (preset.pattern === "grid") {
    ctx.globalAlpha = 0.28;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.fillRect(x, 0, 1, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.fillRect(0, y, canvas.width, 1);
    }
  }

  if (preset.pattern === "beams") {
    ctx.globalAlpha = 0.26;
    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath();
      ctx.moveTo(160 + i * 150, -40);
      ctx.lineTo(280 + i * 150, -40);
      ctx.lineTo(56 + i * 128, 820);
      ctx.lineTo(-16 + i * 128, 820);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawCentralSplash(preset) {
  ctx.save();
  const splash = ctx.createRadialGradient(760, 390, 60, 760, 390, 430);
  splash.addColorStop(0, "rgba(255,255,255,0.12)");
  splash.addColorStop(0.24, preset.splash);
  splash.addColorStop(0.56, preset.shadow);
  splash.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = splash;
  ctx.beginPath();
  ctx.ellipse(786, 396, 470, 246, 0.04, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 58; i += 1) {
    const x = 440 + Math.random() * 620;
    const y = 176 + Math.random() * 360;
    const radius = 8 + Math.random() * 26;
    ctx.fillStyle = Math.random() > 0.45 ? preset.splash : preset.shadow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStar(cx, cy, outerRadius, innerRadius, points) {
  let rotation = (Math.PI / 2) * 3;
  const step = Math.PI / points;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < points; i += 1) {
    ctx.lineTo(cx + Math.cos(rotation) * outerRadius, cy + Math.sin(rotation) * outerRadius);
    rotation += step;
    ctx.lineTo(cx + Math.cos(rotation) * innerRadius, cy + Math.sin(rotation) * innerRadius);
    rotation += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function drawShapeOverlay(preset) {
  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = rgba(preset.accent, 0.58);
  ctx.strokeStyle = rgba("#ffffff", 0.18);
  ctx.lineWidth = 3;

  if (state.shape === "square") {
    ctx.fillRect(206, 168, 222, 222);
    ctx.strokeRect(206, 168, 222, 222);
  }

  if (state.shape === "circle") {
    ctx.beginPath();
    ctx.arc(320, 278, 122, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(320, 116);
    ctx.lineTo(184, 404);
    ctx.lineTo(456, 404);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "star") {
    drawStar(324, 282, 126, 56, 5);
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "grid") {
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        ctx.fillRect(192 + col * 54, 150 + row * 54, 34, 34);
      }
    }
  }

  ctx.restore();
}

function drawLogo(preset) {
  if (!logoImage.complete || !logoImage.naturalWidth) {
    return;
  }

  ctx.save();
  ctx.shadowColor = preset.logoGlow;
  ctx.shadowBlur = 42;
  ctx.globalAlpha = 0.98;
  ctx.drawImage(logoImage, 40, 54, 824, 544);
  ctx.restore();
}

function drawBearMark(preset) {
  ctx.save();
  ctx.translate(286, 274);
  ctx.shadowColor = preset.logoGlow;
  ctx.shadowBlur = 24;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-90, 12);
  ctx.lineTo(-18, -78);
  ctx.lineTo(76, -58);
  ctx.lineTo(112, -4);
  ctx.lineTo(64, 82);
  ctx.lineTo(-40, 82);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#111317";
  ctx.beginPath();
  ctx.moveTo(-42, -12);
  ctx.lineTo(8, -46);
  ctx.lineTo(44, -8);
  ctx.lineTo(-6, 20);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = preset.accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-72, 4);
  ctx.lineTo(-44, -32);
  ctx.lineTo(-14, -10);
  ctx.stroke();
  ctx.restore();
}

function drawMoonMark(preset) {
  ctx.save();
  ctx.translate(292, 268);
  ctx.shadowColor = preset.logoGlow;
  ctx.shadowBlur = 26;
  ctx.fillStyle = "#ffe2a3";
  ctx.beginPath();
  ctx.arc(0, 0, 88, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(32, -16, 82, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShieldMark(preset) {
  ctx.save();
  ctx.translate(294, 262);
  ctx.shadowColor = preset.logoGlow;
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(0, -96);
  ctx.lineTo(76, -52);
  ctx.lineTo(52, 62);
  ctx.lineTo(0, 112);
  ctx.lineTo(-52, 62);
  ctx.lineTo(-76, -52);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = preset.accent;
  ctx.fillRect(-10, -30, 20, 86);
  ctx.fillRect(-40, 8, 80, 18);
  ctx.restore();
}

function drawBatMark(preset) {
  ctx.save();
  ctx.translate(292, 270);
  ctx.shadowColor = preset.logoGlow;
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-118, 10);
  ctx.quadraticCurveTo(-76, -52, -24, -22);
  ctx.lineTo(0, -68);
  ctx.lineTo(24, -22);
  ctx.quadraticCurveTo(76, -52, 118, 10);
  ctx.lineTo(54, -6);
  ctx.lineTo(26, 44);
  ctx.lineTo(0, 10);
  ctx.lineTo(-26, 44);
  ctx.lineTo(-54, -6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawElement(preset) {
  if (state.element === "none") {
    return;
  }

  if (state.element === "logo") {
    drawLogo(preset);
    return;
  }

  if (state.element === "bear") {
    drawBearMark(preset);
    return;
  }

  if (state.element === "spark") {
    drawMoonMark(preset);
    return;
  }

  if (state.element === "shield") {
    drawShieldMark(preset);
    return;
  }

  if (state.element === "crown") {
    drawBatMark(preset);
  }
}

function drawTextBlock(preset) {
  const meta = serverMeta[state.server];
  const title = (state.customTitle || meta.title).toUpperCase();

  ctx.save();
  ctx.textBaseline = "top";

  ctx.font = "800 54px Manrope, sans-serif";
  ctx.fillStyle = preset.textAccentB;
  ctx.fillText(state.promoCode, 742, 110);

  ctx.font = "900 112px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.34)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = preset.textMain;
  ctx.fillText("SERVER:", 610, 248);

  const serverX = 610 + ctx.measureText("SERVER:").width + 22;
  const gradient = ctx.createLinearGradient(serverX, 230, serverX, 390);
  gradient.addColorStop(0, preset.textAccentA);
  gradient.addColorStop(0.54, preset.textAccentB);
  gradient.addColorStop(1, preset.textAccentB);
  ctx.fillStyle = gradient;
  ctx.fillText(title, serverX, 248);

  ctx.shadowBlur = 8;
  ctx.font = "700 28px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.fillText(meta.label, 614, 374);

  ctx.font = "800 42px Manrope, sans-serif";
  ctx.fillStyle = preset.textAccentB;
  ctx.fillText(state.footerText, 356, 560);

  ctx.shadowBlur = 0;
  ctx.font = "700 18px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.36)";
  ctx.fillText(`ZYRO STUDIO • ${stylePresets[state.style].name.toUpperCase()}`, 956, 34);

  ctx.restore();
}

function drawFrame(preset) {
  ctx.save();
  ctx.strokeStyle = preset.frame;
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
  ctx.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);
  ctx.restore();
}

function drawNoise() {
  ctx.save();
  ctx.globalAlpha = 0.05;

  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random()})`;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.restore();
}

function renderCanvas() {
  fitCanvas();
  const preset = stylePresets[state.style] || stylePresets[defaultState.style];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(preset);
  drawPattern(preset);
  drawCentralSplash(preset);
  drawShapeOverlay(preset);
  drawElement(preset);
  drawTextBlock(preset);
  drawFrame(preset);
  drawNoise();
}

function syncControls() {
  setActive(els.styleButtons, "style", state.style);
  setActive(els.serverButtons, "server", state.server);
  setActive(els.shapeButtons, "shape", state.shape);
  setActive(els.elementButtons, "element", state.element);
  setActive(els.swatches, "bg", state.backgroundColor);

  els.backgroundToggle.classList.toggle("is-active", state.showBackground);
  els.backgroundToggle.setAttribute("aria-pressed", String(state.showBackground));
  els.backgroundToggle.textContent = state.showBackground ? "Фон включен" : "Фон выключен";

  els.promoCodeInput.value = state.promoCode;
  els.footerInput.value = state.footerText;
  els.statusChip.textContent = `${stylePresets[state.style].name} · ${state.server}`;
}

function downloadPng() {
  const link = document.createElement("a");
  const serverName = state.server.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");
  link.href = canvas.toDataURL("image/png");
  link.download = `zyrostudio-${serverName}-${state.style}.png`;
  link.click();
}

function randomizeScene() {
  applyState({
    style: randomFrom(Object.keys(stylePresets)),
    server: randomFrom(Object.keys(serverMeta)),
    shape: randomFrom(["square", "circle", "triangle", "star", "grid"]),
    element: randomFrom(["logo", "bear", "spark", "shield", "crown"]),
    backgroundColor: randomFrom(["#070911", "#162d4d", "#2a2351", "#20355b"]),
    promoCode: randomFrom(["/promo > 2", "/promo > 5", "/media +bonus", "/bonus > 3"]),
    footerText: randomFrom([
      "скачать игру в тгк - @zyro_media",
      "подключайся прямо сейчас - @zyro_russia",
      "медиа набор и розыгрыши - @zyro_media",
      "промокоды и бонусы - @zyro_news"
    ])
  });
}

function resetScene() {
  els.backgroundUpload.value = "";
  applyState({ ...defaultState, uploadedImage: null });
}

function bindEvents() {
  els.downloadButton.addEventListener("click", downloadPng);
  els.resetButton.addEventListener("click", resetScene);
  els.shuffleButton.addEventListener("click", randomizeScene);

  els.backgroundToggle.addEventListener("click", () => {
    applyState({ showBackground: !state.showBackground });
  });

  els.removeBackgroundButton.addEventListener("click", () => {
    els.backgroundUpload.value = "";
    applyState({ uploadedImage: null });
  });

  els.styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyState({ style: button.dataset.style });
    });
  });

  els.serverButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyState({ server: button.dataset.server });
    });
  });

  els.shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyState({ shape: button.dataset.shape });
    });
  });

  els.elementButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyState({ element: button.dataset.element });
    });
  });

  els.swatches.forEach((button) => {
    button.addEventListener("click", () => {
      applyState({ backgroundColor: button.dataset.bg });
    });
  });

  els.promoCodeInput.addEventListener("input", (event) => {
    state.promoCode = event.target.value || defaultState.promoCode;
    renderCanvas();
  });

  els.footerInput.addEventListener("input", (event) => {
    state.footerText = event.target.value || defaultState.footerText;
    renderCanvas();
  });

  els.addTextButton.addEventListener("click", () => {
    const current = state.customTitle || serverMeta[state.server].title;
    const nextTitle = window.prompt("Введи серверный заголовок", current);
    if (nextTitle === null) {
      return;
    }
    applyState({ customTitle: nextTitle.trim().toUpperCase() });
  });

  els.addElementButton.addEventListener("click", () => {
    const order = ["logo", "bear", "spark", "shield", "crown", "none"];
    const index = order.indexOf(state.element);
    applyState({ element: order[(index + 1) % order.length] });
  });

  els.formatButton.addEventListener("click", () => {
    const order = ["style1", "style2", "style3", "style4"];
    const index = order.indexOf(state.style);
    applyState({ style: order[(index + 1) % order.length] });
  });

  els.backgroundUpload.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const image = new Image();
    image.onload = () => {
      applyState({ uploadedImage: image });
    };
    image.src = URL.createObjectURL(file);
  });
}

function init() {
  bindEvents();
  applyState({ ...defaultState });
}

logoImage.addEventListener("load", renderCanvas);
init();
