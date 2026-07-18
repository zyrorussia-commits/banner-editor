const canvas = document.getElementById("promoCanvas");
const ctx = canvas.getContext("2d");

const state = {
  style: "style1",
  server: "Москва",
  shape: "square",
  element: "bear",
  showBackground: true,
  backgroundColor: "#070911",
  promoCode: "/promo > 2",
  footerText: "скачать игру в тгк - @crmp_rage",
  customTitle: "",
  uploadedImage: null
};

const stylePresets = {
  style1: {
    backgroundTop: "#161d39",
    backgroundBottom: "#173258",
    splashMain: "rgba(255, 19, 19, 0.92)",
    splashDark: "rgba(0, 0, 0, 0.94)",
    accent: "#ff2950",
    textMain: "#ffffff",
    textAccent: "#ff4a72"
  },
  style2: {
    backgroundTop: "#171421",
    backgroundBottom: "#2a1e43",
    splashMain: "rgba(119, 54, 255, 0.88)",
    splashDark: "rgba(8, 8, 16, 0.92)",
    accent: "#8a58ff",
    textMain: "#ffffff",
    textAccent: "#9a6bff"
  },
  style3: {
    backgroundTop: "#0c1824",
    backgroundBottom: "#143c4e",
    splashMain: "rgba(0, 201, 255, 0.88)",
    splashDark: "rgba(0, 14, 18, 0.92)",
    accent: "#31d8ff",
    textMain: "#ebffff",
    textAccent: "#59ecff"
  },
  style4: {
    backgroundTop: "#1f1712",
    backgroundBottom: "#453117",
    splashMain: "rgba(255, 140, 36, 0.9)",
    splashDark: "rgba(15, 10, 5, 0.92)",
    accent: "#ff9f2e",
    textMain: "#fffaf2",
    textAccent: "#ffb556"
  }
};

const serverMeta = {
  "Москва": {
    title: "SERVER: MOSCOW",
    origin: "CRMP MOSCOW"
  },
  "Питер": {
    title: "SERVER: PITER",
    origin: "CRMP SAINT-P"
  },
  "Екатеринбург": {
    title: "SERVER: EKB",
    origin: "CRMP EKB"
  }
};

const els = {
  downloadButton: document.getElementById("downloadButton"),
  resetButton: document.getElementById("resetButton"),
  shuffleButton: document.getElementById("shuffleButton"),
  backgroundToggle: document.getElementById("backgroundToggle"),
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const parsed = Number.parseInt(raw, 16);
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
    button.classList.toggle("active", button.dataset[key] === value);
  });
}

function drawBackground(preset) {
  if (!state.showBackground) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, preset.backgroundTop);
  gradient.addColorStop(1, preset.backgroundBottom);
  ctx.fillStyle = state.uploadedImage ? state.backgroundColor : gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (state.uploadedImage) {
    ctx.save();
    ctx.globalAlpha = 0.48;
    ctx.drawImage(state.uploadedImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    overlay.addColorStop(0, rgba(state.backgroundColor, 0.78));
    overlay.addColorStop(1, rgba("#07111d", 0.72));
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = rgba(state.backgroundColor, 0.35);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawBackdropCloud(preset) {
  ctx.save();

  const coreGradient = ctx.createRadialGradient(680, 365, 40, 680, 365, 430);
  coreGradient.addColorStop(0, "rgba(255,255,255,0.2)");
  coreGradient.addColorStop(0.18, preset.splashMain);
  coreGradient.addColorStop(0.46, preset.splashDark);
  coreGradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.ellipse(690, 372, 420, 205, -0.05, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 70; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radiusX = 370 + Math.random() * 180;
    const radiusY = 115 + Math.random() * 140;
    const x = 690 + Math.cos(angle) * radiusX;
    const y = 372 + Math.sin(angle) * radiusY;
    const size = 4 + Math.random() * 18;
    ctx.fillStyle = Math.random() > 0.4 ? preset.splashMain : "rgba(0,0,0,0.9)";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(0,0,0,0.75)";
  ctx.lineWidth = 8;
  [528, 612, 1006].forEach((x, index) => {
    ctx.beginPath();
    ctx.moveTo(x, 525 + index * 8);
    ctx.lineTo(x + (index === 1 ? -8 : 4), 650 + index * 18);
    ctx.stroke();
  });

  ctx.restore();
}

function drawShapeOverlay(preset) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = rgba(preset.accent, 0.4);
  ctx.strokeStyle = rgba("#ffffff", 0.18);
  ctx.lineWidth = 3;

  if (state.shape === "square") {
    ctx.fillRect(325, 198, 160, 160);
    ctx.strokeRect(325, 198, 160, 160);
  }

  if (state.shape === "circle") {
    ctx.beginPath();
    ctx.arc(392, 275, 88, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(390, 162);
    ctx.lineTo(287, 358);
    ctx.lineTo(492, 358);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "star") {
    drawStar(392, 275, 95, 42, 5);
    ctx.fill();
    ctx.stroke();
  }

  if (state.shape === "grid") {
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        ctx.fillRect(300 + col * 36, 190 + row * 36, 22, 22);
      }
    }
  }

  ctx.restore();
}

function drawStar(cx, cy, outerRadius, innerRadius, points) {
  let rotation = Math.PI / 2 * 3;
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

function drawElementBadge(preset) {
  if (state.element === "none") {
    return;
  }

  ctx.save();
  ctx.translate(365, 250);
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;

  if (state.element === "bear") {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-65, 18);
    ctx.lineTo(-22, -42);
    ctx.lineTo(44, -28);
    ctx.lineTo(72, 6);
    ctx.lineTo(36, 54);
    ctx.lineTo(-26, 54);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#111317";
    ctx.beginPath();
    ctx.moveTo(-32, -8);
    ctx.lineTo(6, -28);
    ctx.lineTo(26, -8);
    ctx.lineTo(-8, 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = preset.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-52, -2);
    ctx.lineTo(-32, -24);
    ctx.lineTo(-16, -10);
    ctx.stroke();
  }

  if (state.element === "spark") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦", 0, 34);
  }

  if (state.element === "shield") {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(0, -54);
    ctx.lineTo(46, -30);
    ctx.lineTo(32, 42);
    ctx.lineTo(0, 62);
    ctx.lineTo(-32, 42);
    ctx.lineTo(-46, -30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = preset.accent;
    ctx.fillRect(-6, -12, 12, 44);
    ctx.fillRect(-24, 4, 48, 12);
  }

  if (state.element === "crown") {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-58, 40);
    ctx.lineTo(-46, -16);
    ctx.lineTo(-14, 6);
    ctx.lineTo(0, -34);
    ctx.lineTo(14, 6);
    ctx.lineTo(46, -16);
    ctx.lineTo(58, 40);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = preset.accent;
    ctx.fillRect(-54, 40, 108, 10);
  }

  ctx.restore();
}

function drawTexts(preset) {
  const meta = serverMeta[state.server];
  const titleText = state.customTitle || meta.title;

  ctx.save();
  ctx.textBaseline = "top";

  ctx.font = "800 62px Manrope, sans-serif";
  ctx.fillStyle = "#ff2b24";
  ctx.fillText(state.promoCode, 615, 158);

  ctx.shadowColor = "rgba(0,0,0,0.42)";
  ctx.shadowBlur = 14;
  ctx.font = "900 108px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
  ctx.fillStyle = preset.textMain;
  ctx.fillText("SERVER:", 420, 240);

  const measured = ctx.measureText("SERVER:");
  const mainX = 420 + measured.width + 18;

  const accentGradient = ctx.createLinearGradient(mainX, 210, mainX, 358);
  accentGradient.addColorStop(0, "#ff9bb1");
  accentGradient.addColorStop(0.52, preset.textAccent);
  accentGradient.addColorStop(1, "#d60043");
  ctx.fillStyle = accentGradient;
  ctx.fillText(titleText.replace("SERVER: ", ""), mainX, 240);

  ctx.shadowBlur = 10;
  ctx.font = "800 52px Manrope, sans-serif";
  ctx.fillStyle = "#ff3b30";
  ctx.fillText(state.footerText, 370, 492);

  ctx.shadowBlur = 0;
  ctx.font = "700 14px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillText("ZYRO RUSSIA MEDIA", 1250, 22);

  ctx.restore();
}

function drawForegroundGlow(preset) {
  ctx.save();
  const glow = ctx.createRadialGradient(690, 362, 80, 690, 362, 300);
  glow.addColorStop(0, rgba(preset.accent, 0.28));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(240, 130, 900, 470);
  ctx.restore();
}

function drawNoise() {
  ctx.save();
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 2400; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${Math.random()})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function renderCanvas() {
  fitCanvas();
  const preset = stylePresets[state.style];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(preset);
  drawBackdropCloud(preset);
  drawShapeOverlay(preset);
  drawElementBadge(preset);
  drawForegroundGlow(preset);
  drawTexts(preset);
  drawNoise();
}

function downloadPng() {
  const link = document.createElement("a");
  const serverName = state.server.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");
  link.href = canvas.toDataURL("image/png");
  link.download = `zyro-media-${serverName}.png`;
  link.click();
}

function randomizeScene() {
  state.style = randomFrom(Object.keys(stylePresets));
  state.server = randomFrom(Object.keys(serverMeta));
  state.shape = randomFrom(["square", "circle", "triangle", "star", "grid"]);
  state.element = randomFrom(["bear", "spark", "shield", "crown"]);
  state.backgroundColor = randomFrom(["#070911", "#162d4d", "#2a2351", "#20355b"]);

  const promoVariants = ["/promo > 2", "/promo > 5", "/media +promo", "/bonus > 3"];
  const footerVariants = [
    "скачать игру в тгк - @crmp_rage",
    "подключайся прямо сейчас - @zyro_russia",
    "медиа набор и розыгрыши - @zyro_media",
    "промокоды и бонусы - @zyro_news"
  ];

  state.promoCode = randomFrom(promoVariants);
  state.footerText = randomFrom(footerVariants);

  syncControls();
  renderCanvas();
}

function resetScene() {
  state.style = "style1";
  state.server = "Москва";
  state.shape = "square";
  state.element = "bear";
  state.showBackground = true;
  state.backgroundColor = "#070911";
  state.promoCode = "/promo > 2";
  state.footerText = "скачать игру в тгк - @crmp_rage";
  state.customTitle = "";
  state.uploadedImage = null;
  els.backgroundUpload.value = "";
  syncControls();
  renderCanvas();
}

function syncControls() {
  setActive(els.styleButtons, "style", state.style);
  setActive(els.serverButtons, "server", state.server);
  setActive(els.shapeButtons, "shape", state.shape);
  setActive(els.elementButtons, "element", state.element);
  setActive(els.swatches, "bg", state.backgroundColor);
  els.backgroundToggle.classList.toggle("on", state.showBackground);
  els.backgroundToggle.textContent = state.showBackground ? "ВКЛ" : "ВЫКЛ";
  els.backgroundToggle.setAttribute("aria-pressed", String(state.showBackground));
  els.promoCodeInput.value = state.promoCode;
  els.footerInput.value = state.footerText;
}

function bindEvents() {
  els.downloadButton.addEventListener("click", downloadPng);
  els.resetButton.addEventListener("click", resetScene);
  els.shuffleButton.addEventListener("click", randomizeScene);

  els.backgroundToggle.addEventListener("click", () => {
    state.showBackground = !state.showBackground;
    syncControls();
    renderCanvas();
  });

  els.styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.style = button.dataset.style;
      syncControls();
      renderCanvas();
    });
  });

  els.serverButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.server = button.dataset.server;
      syncControls();
      renderCanvas();
    });
  });

  els.shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.shape = button.dataset.shape;
      syncControls();
      renderCanvas();
    });
  });

  els.elementButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.element = button.dataset.element;
      syncControls();
      renderCanvas();
    });
  });

  els.swatches.forEach((button) => {
    button.addEventListener("click", () => {
      state.backgroundColor = button.dataset.bg;
      syncControls();
      renderCanvas();
    });
  });

  els.promoCodeInput.addEventListener("input", (event) => {
    state.promoCode = event.target.value || "/promo > 2";
    renderCanvas();
  });

  els.footerInput.addEventListener("input", (event) => {
    state.footerText = event.target.value || "скачать игру в тгк - @crmp_rage";
    renderCanvas();
  });

  els.addTextButton.addEventListener("click", () => {
    const nextTitle = window.prompt("Введи крупный заголовок сервера", state.customTitle || serverMeta[state.server].title.replace("SERVER: ", ""));
    if (nextTitle === null) {
      return;
    }
    const cleaned = nextTitle.trim();
    state.customTitle = cleaned ? `SERVER: ${cleaned.toUpperCase()}` : "";
    renderCanvas();
  });

  els.addElementButton.addEventListener("click", () => {
    const order = ["bear", "spark", "shield", "crown", "none"];
    const index = order.indexOf(state.element);
    state.element = order[(index + 1) % order.length];
    syncControls();
    renderCanvas();
  });

  els.formatButton.addEventListener("click", () => {
    const order = ["style1", "style2", "style3", "style4"];
    const index = order.indexOf(state.style);
    state.style = order[(index + 1) % order.length];
    syncControls();
    renderCanvas();
  });

  els.backgroundUpload.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const image = new Image();
    image.onload = () => {
      state.uploadedImage = image;
      renderCanvas();
    };
    image.src = URL.createObjectURL(file);
  });
}

bindEvents();
resetScene();
