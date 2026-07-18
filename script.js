const canvas = document.getElementById("promoCanvas");
const ctx = canvas.getContext("2d");

const defaultPromo = "/promo > 2";
const defaultFooter = "скачать игру в тгк @crmp_zyro";

const state = {
  style: null,
  promo: defaultPromo,
  footer: defaultFooter
};

const presets = {
  style1: {
    bgTop: "#18080d",
    bgBottom: "#521020",
    accent: "#ff4268",
    soft: "#ffd5df"
  },
  style2: {
    bgTop: "#0f1320",
    bgBottom: "#253b8f",
    accent: "#6da3ff",
    soft: "#dce8ff"
  },
  style3: {
    bgTop: "#111510",
    bgBottom: "#1f6234",
    accent: "#69de8d",
    soft: "#dcffe7"
  },
  style4: {
    bgTop: "#17110b",
    bgBottom: "#825117",
    accent: "#ffbf57",
    soft: "#ffefd0"
  }
};

const elements = {
  styleButtons: Array.from(document.querySelectorAll("[data-style]")),
  promoInput: document.getElementById("promoInput"),
  footerInput: document.getElementById("footerInput"),
  downloadButton: document.getElementById("downloadButton")
};

function resizeCanvas() {
  canvas.width = 1280;
  canvas.height = 720;
}

function setActiveStyle() {
  elements.styleButtons.forEach((button) => {
    const active = button.dataset.style === state.style;
    button.classList.toggle("is-active", active);
  });
}

function drawCenteredText(text, y, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, y);
}

function drawEmptyState() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#0d0e13");
  bg.addColorStop(1, "#08090d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

  drawCenteredText("Москва", 240, "800 92px Manrope", "#ffffff");
  drawCenteredText("Выбери стиль справа", 340, "700 50px Manrope", "#f3f4f8");
  drawCenteredText("Стиль не включается сам до клика", 405, "500 30px Manrope", "rgba(255,255,255,0.55)");
  drawCenteredText(defaultFooter, 610, "700 38px Manrope", "rgba(255,255,255,0.86)");
}

function drawBanner() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const preset = presets[state.style];
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, preset.bgTop);
  bg.addColorStop(1, preset.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(820, 280, 40, 820, 280, 320);
  glow.addColorStop(0, `${preset.accent}dd`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(90, 90, canvas.width - 180, canvas.height - 180);

  ctx.textAlign = "left";
  ctx.font = "800 62px Manrope";
  ctx.fillStyle = preset.accent;
  ctx.fillText(state.promo, 110, 145);

  ctx.font = "800 160px Manrope";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("МОСКВА", 105, 340);

  ctx.font = "700 42px Manrope";
  ctx.fillStyle = preset.soft;
  ctx.fillText("СЕРВЕР", 114, 394);

  ctx.fillStyle = preset.accent;
  ctx.fillRect(110, 468, 420, 6);

  ctx.font = "800 54px Manrope";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("скачать игру", 110, 555);

  ctx.font = "700 44px Manrope";
  ctx.fillStyle = preset.soft;
  ctx.fillText("в тгк @crmp_zyro", 110, 615);

  ctx.textAlign = "center";
  ctx.font = "700 34px Manrope";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(state.footer, canvas.width / 2, 680);
}

function render() {
  setActiveStyle();

  if (!state.style) {
    drawEmptyState();
    return;
  }

  drawBanner();
}

function downloadBanner() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `moscow-banner-${state.style || "empty"}.png`;
  link.click();
}

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

elements.downloadButton.addEventListener("click", downloadBanner);

render();
