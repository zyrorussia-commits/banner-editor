const canvas = document.getElementById("promoCanvas");
const ctx = canvas.getContext("2d");

const defaultPromo = "/promo > 2";
const defaultFooter = "скачать игру в тгк @crmp_zyro";

const state = {
  style: null,
  promo: defaultPromo,
  footer: defaultFooter
};

const styles = {
  style1: {
    name: "Стиль 1",
    top: "#180d14",
    bottom: "#681322",
    accent: "#ff4967",
    accentSoft: "#ffd5dc",
    glow: "rgba(255, 73, 103, 0.35)",
    panel: "rgba(255, 255, 255, 0.08)"
  },
  style2: {
    name: "Стиль 2",
    top: "#101826",
    bottom: "#1e4fd0",
    accent: "#79a8ff",
    accentSoft: "#e1ebff",
    glow: "rgba(121, 168, 255, 0.32)",
    panel: "rgba(255, 255, 255, 0.08)"
  },
  style3: {
    name: "Стиль 3",
    top: "#101713",
    bottom: "#207440",
    accent: "#6de68d",
    accentSoft: "#ddffe7",
    glow: "rgba(109, 230, 141, 0.3)",
    panel: "rgba(255, 255, 255, 0.08)"
  },
  style4: {
    name: "Стиль 4",
    top: "#19120d",
    bottom: "#b56a18",
    accent: "#ffc56a",
    accentSoft: "#fff0d2",
    glow: "rgba(255, 197, 106, 0.3)",
    panel: "rgba(255, 255, 255, 0.08)"
  }
};

const elements = {
  styleButtons: Array.from(document.querySelectorAll("[data-style]")),
  promoInput: document.getElementById("promoInput"),
  footerInput: document.getElementById("footerInput"),
  statusLabel: document.getElementById("statusLabel"),
  downloadButton: document.getElementById("downloadButton"),
  resetButton: document.getElementById("resetButton")
};

function resizeCanvas() {
  canvas.width = 1400;
  canvas.height = 780;
}

function setActiveStyle() {
  elements.styleButtons.forEach((button) => {
    const isActive = button.dataset.style === state.style;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function syncUi() {
  setActiveStyle();
  elements.promoInput.value = state.promo;
  elements.footerInput.value = state.footer;
  elements.statusLabel.textContent = state.style ? styles[state.style].name : "Стиль не выбран";
}

function drawEmptyState() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#111821");
  gradient.addColorStop(1, "#0b1016");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.fillStyle = "#f5f7fb";
  ctx.font = "700 64px Manrope, sans-serif";
  ctx.fillText("Выбери стиль справа", 120, 280);

  ctx.font = "500 30px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fillText("Стиль не должен включаться сам до клика", 120, 344);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(120, 470, 1160, 1);
  ctx.font = "700 34px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.fillText(defaultFooter, 120, 514);
}

function drawBanner() {
  const preset = styles[state.style];
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, preset.top);
  background.addColorStop(1, preset.bottom);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(1040, 160, 20, 1040, 160, 340);
  glow.addColorStop(0, preset.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = preset.panel;
  ctx.fillRect(72, 72, canvas.width - 144, canvas.height - 144);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(72, 72, canvas.width - 144, canvas.height - 144);
  ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);

  ctx.fillStyle = preset.accent;
  ctx.fillRect(110, 116, 260, 12);
  ctx.fillRect(110, 144, 160, 12);

  ctx.fillStyle = preset.accentSoft;
  ctx.font = "800 54px Manrope, sans-serif";
  ctx.fillText(state.promo, 110, 188);

  ctx.font = "900 156px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("МОСКВА", 106, 302);

  ctx.font = "700 34px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.fillText("CITY SERVER", 114, 338);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(1110, 238, 162, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = preset.accent;
  ctx.beginPath();
  ctx.arc(1110, 238, 118, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0f1116";
  ctx.font = "700 42px Unbounded, sans-serif";
  ctx.fillText("ZYRO", 1028, 220);
  ctx.font = "600 24px Manrope, sans-serif";
  ctx.fillText("TGK", 1068, 262);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 60px Manrope, sans-serif";
  ctx.fillText("скачать игру", 110, 514);

  ctx.fillStyle = preset.accentSoft;
  ctx.fillText("в тгк @crmp_zyro", 110, 584);

  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.fillRect(110, 654, 1180, 1);
  ctx.font = "700 32px Manrope, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(state.footer, 110, 680);
}

function render() {
  syncUi();

  if (!state.style) {
    drawEmptyState();
    return;
  }

  drawBanner();
}

function resetState() {
  state.style = null;
  state.promo = defaultPromo;
  state.footer = defaultFooter;
  render();
}

function downloadBanner() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `zyro-moscow-${state.style || "empty"}.png`;
  link.click();
}

function bindEvents() {
  elements.styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.style = button.dataset.style;
      render();
    });
  });

  elements.promoInput.addEventListener("input", (event) => {
    state.promo = event.target.value || defaultPromo;
    render();
  });

  elements.footerInput.addEventListener("input", (event) => {
    state.footer = event.target.value || defaultFooter;
    render();
  });

  elements.resetButton.addEventListener("click", resetState);
  elements.downloadButton.addEventListener("click", downloadBanner);
}

bindEvents();
render();
