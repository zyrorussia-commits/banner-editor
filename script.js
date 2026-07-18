const presets = {
  "1200x300": { width: 1200, height: 300 },
  "1200x500": { width: 1200, height: 500 },
  "1000x420": { width: 1000, height: 420 },
  "1600x900": { width: 1600, height: 900 }
};

const themes = {
  ember: {
    backgroundTop: "#170f0c",
    backgroundBottom: "#090807",
    glowA: "rgba(255, 110, 53, 0.28)",
    glowB: "rgba(255, 173, 93, 0.18)",
    text: "#fff3ea",
    muted: "rgba(255, 240, 231, 0.7)",
    panel: "rgba(255, 255, 255, 0.06)"
  },
  carbon: {
    backgroundTop: "#101214",
    backgroundBottom: "#090a0b",
    glowA: "rgba(210, 210, 210, 0.16)",
    glowB: "rgba(122, 122, 122, 0.14)",
    text: "#f3f6f7",
    muted: "rgba(243, 246, 247, 0.7)",
    panel: "rgba(255, 255, 255, 0.05)"
  },
  ocean: {
    backgroundTop: "#07151f",
    backgroundBottom: "#050a12",
    glowA: "rgba(0, 191, 255, 0.24)",
    glowB: "rgba(74, 222, 255, 0.16)",
    text: "#eaf9ff",
    muted: "rgba(234, 249, 255, 0.72)",
    panel: "rgba(255, 255, 255, 0.05)"
  },
  forest: {
    backgroundTop: "#0d150e",
    backgroundBottom: "#070b08",
    glowA: "rgba(61, 208, 116, 0.24)",
    glowB: "rgba(163, 242, 119, 0.14)",
    text: "#efffee",
    muted: "rgba(239, 255, 238, 0.72)",
    panel: "rgba(255, 255, 255, 0.05)"
  }
};

const titleSuggestions = [
  "ZYRO RUSSIA",
  "FORUM DESIGN PACK",
  "OFFICIAL COMMUNITY",
  "MEDIA DEPARTMENT",
  "EVENT BANNER"
];

const subtitleSuggestions = [
  "Редактор баннеров для форума и игровых тем",
  "Шапки, карточки и промо в одном инструменте",
  "Быстрый конструктор для публикаций и анонсов",
  "Минималистичный редактор для визуала проекта"
];

const badgeSuggestions = [
  "OFFICIAL TOOL",
  "MEDIA KIT",
  "SUMMER 2026",
  "DESIGN UNIT",
  "ZYRO TEAM"
];

const els = {
  canvas: document.getElementById("bannerCanvas"),
  preset: document.getElementById("bannerPreset"),
  title: document.getElementById("bannerTitle"),
  subtitle: document.getElementById("bannerSubtitle"),
  badge: document.getElementById("bannerBadge"),
  theme: document.getElementById("themePreset"),
  accent: document.getElementById("accentColor"),
  shapeOpacity: document.getElementById("shapeOpacity"),
  grainStrength: document.getElementById("grainStrength"),
  titleScale: document.getElementById("titleScale"),
  subtitleScale: document.getElementById("subtitleScale"),
  titleAlign: document.getElementById("titleAlign"),
  showFrame: document.getElementById("showFrame"),
  sizeIndicator: document.getElementById("sizeIndicator"),
  downloadButton: document.getElementById("downloadPngButton"),
  randomizeButton: document.getElementById("randomizeButton"),
  resetButton: document.getElementById("resetButton")
};

const ctx = els.canvas.getContext("2d");

function hexToRgb(hex) {
  const safeHex = hex.replace("#", "");
  const value = Number.parseInt(safeHex, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function resizeCanvas() {
  const selected = presets[els.preset.value];
  els.canvas.width = selected.width;
  els.canvas.height = selected.height;
  els.sizeIndicator.textContent = `${selected.width} x ${selected.height}`;
}

function drawBackground(width, height, theme, accentColor, glowStrength) {
  const baseGradient = ctx.createLinearGradient(0, 0, 0, height);
  baseGradient.addColorStop(0, theme.backgroundTop);
  baseGradient.addColorStop(1, theme.backgroundBottom);
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);

  const radialA = ctx.createRadialGradient(width * 0.18, height * 0.12, 0, width * 0.18, height * 0.12, width * 0.34);
  radialA.addColorStop(0, rgba(accentColor, glowStrength));
  radialA.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = radialA;
  ctx.fillRect(0, 0, width, height);

  const radialB = ctx.createRadialGradient(width * 0.86, height * 0.8, 0, width * 0.86, height * 0.8, width * 0.28);
  radialB.addColorStop(0, theme.glowB);
  radialB.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = radialB;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = theme.panel;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height * 0.12, width * 0.9, height * 0.76, Math.min(30, height * 0.08));
  ctx.fill();
  ctx.restore();
}

function drawShapes(width, height, accentColor, glowStrength) {
  ctx.save();
  ctx.globalAlpha = clamp(glowStrength + 0.12, 0.18, 0.8);

  ctx.fillStyle = rgba(accentColor, 0.32);
  ctx.beginPath();
  ctx.roundRect(width * 0.69, height * 0.13, width * 0.2, height * 0.18, height * 0.07);
  ctx.fill();

  ctx.fillStyle = rgba(accentColor, 0.18);
  ctx.beginPath();
  ctx.roundRect(width * 0.74, height * 0.36, width * 0.14, height * 0.4, height * 0.07);
  ctx.fill();

  ctx.strokeStyle = rgba(accentColor, 0.55);
  ctx.lineWidth = Math.max(2, width * 0.0023);
  ctx.beginPath();
  ctx.arc(width * 0.83, height * 0.56, height * 0.17, Math.PI * 0.08, Math.PI * 1.67);
  ctx.stroke();

  ctx.restore();
}

function drawFrame(width, height, accentColor) {
  ctx.save();
  ctx.strokeStyle = rgba(accentColor, 0.42);
  ctx.lineWidth = Math.max(2, width * 0.0022);
  ctx.beginPath();
  ctx.roundRect(width * 0.026, height * 0.06, width * 0.948, height * 0.88, Math.min(34, height * 0.09));
  ctx.stroke();
  ctx.restore();
}

function drawText(width, height, theme, accentColor) {
  const title = (els.title.value || "ZYRO RUSSIA").trim();
  const subtitle = (els.subtitle.value || "Редактор баннеров для форума и игровых тем").trim();
  const badge = (els.badge.value || "OFFICIAL TOOL").trim().toUpperCase();
  const align = els.titleAlign.value;
  const titleSize = Math.round(height * 0.18 * (Number(els.titleScale.value) / 100));
  const subtitleSize = Math.round(height * 0.074 * (Number(els.subtitleScale.value) / 100));
  const badgeSize = Math.round(height * 0.055);

  let x = width * 0.09;
  if (align === "center") x = width * 0.5;
  if (align === "right") x = width * 0.91;

  ctx.textAlign = align;
  ctx.textBaseline = "top";

  const badgeWidth = ctx.measureText ? Math.max(width * 0.12, badge.length * badgeSize * 0.7) : width * 0.2;
  const badgeX = align === "left" ? x : align === "center" ? x - badgeWidth / 2 : x - badgeWidth;
  const badgeY = height * 0.18;

  ctx.save();
  ctx.fillStyle = rgba(accentColor, 0.17);
  ctx.beginPath();
  ctx.roundRect(badgeX - 16, badgeY - 10, badgeWidth + 32, height * 0.12, height * 0.05);
  ctx.fill();
  ctx.restore();

  ctx.font = `700 ${badgeSize}px Manrope, sans-serif`;
  ctx.fillStyle = rgba(accentColor, 0.95);
  ctx.fillText(badge, x, badgeY);

  ctx.shadowColor = rgba(accentColor, 0.25);
  ctx.shadowBlur = Math.max(10, height * 0.06);
  ctx.font = `800 ${titleSize}px Unbounded, sans-serif`;
  ctx.fillStyle = theme.text;
  ctx.fillText(title, x, height * 0.36);

  ctx.shadowBlur = 0;
  ctx.font = `500 ${subtitleSize}px Manrope, sans-serif`;
  ctx.fillStyle = theme.muted;

  wrapText(subtitle, x, height * 0.61, width * 0.5, subtitleSize * 1.45, align);
}

function wrapText(text, x, y, maxWidth, lineHeight, align) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);

  lines.slice(0, 3).forEach((item, index) => {
    ctx.textAlign = align;
    ctx.fillText(item, x, y + index * lineHeight);
  });
}

function drawNoise(width, height, strength) {
  if (strength <= 0) return;

  ctx.save();
  ctx.globalAlpha = strength / 100;

  for (let i = 0; i < width * height * 0.0008; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const alpha = Math.random() * 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.restore();
}

function renderBanner() {
  resizeCanvas();

  const width = els.canvas.width;
  const height = els.canvas.height;
  const theme = themes[els.theme.value];
  const accentColor = els.accent.value;
  const glowStrength = Number(els.shapeOpacity.value) / 100;
  const grainStrength = Number(els.grainStrength.value);

  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height, theme, accentColor, glowStrength);
  drawShapes(width, height, accentColor, glowStrength);
  if (els.showFrame.value === "yes") {
    drawFrame(width, height, accentColor);
  }
  drawText(width, height, theme, accentColor);
  drawNoise(width, height, grainStrength);
}

function downloadPng() {
  const link = document.createElement("a");
  const titleSlug = (els.title.value || "banner")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  link.href = els.canvas.toDataURL("image/png");
  link.download = `${titleSlug || "banner"}-${els.canvas.width}x${els.canvas.height}.png`;
  link.click();
}

function applyThemePreset(name) {
  const defaultAccents = {
    ember: "#ff6a2b",
    carbon: "#b4bcc2",
    ocean: "#2dc8ff",
    forest: "#5fd36f"
  };

  els.accent.value = defaultAccents[name];
  renderBanner();
}

function randomizeBanner() {
  const themeNames = Object.keys(themes);
  const presetNames = Object.keys(presets);
  const alignments = ["left", "center", "right"];

  els.theme.value = randomFrom(themeNames);
  els.preset.value = randomFrom(presetNames);
  els.title.value = randomFrom(titleSuggestions);
  els.subtitle.value = randomFrom(subtitleSuggestions);
  els.badge.value = randomFrom(badgeSuggestions);
  els.titleAlign.value = randomFrom(alignments);
  els.shapeOpacity.value = String(30 + Math.floor(Math.random() * 45));
  els.grainStrength.value = String(Math.floor(Math.random() * 16));
  els.titleScale.value = String(90 + Math.floor(Math.random() * 31));
  els.subtitleScale.value = String(90 + Math.floor(Math.random() * 26));
  els.showFrame.value = Math.random() > 0.35 ? "yes" : "no";

  applyThemePreset(els.theme.value);
}

function resetBanner() {
  els.preset.value = "1200x300";
  els.title.value = "ZYRO RUSSIA";
  els.subtitle.value = "Редактор баннеров для форума и игровых тем";
  els.badge.value = "OFFICIAL TOOL";
  els.theme.value = "ember";
  els.accent.value = "#ff6a2b";
  els.shapeOpacity.value = "50";
  els.grainStrength.value = "10";
  els.titleScale.value = "100";
  els.subtitleScale.value = "100";
  els.titleAlign.value = "left";
  els.showFrame.value = "yes";
  renderBanner();
}

[
  els.preset,
  els.title,
  els.subtitle,
  els.badge,
  els.theme,
  els.accent,
  els.shapeOpacity,
  els.grainStrength,
  els.titleScale,
  els.subtitleScale,
  els.titleAlign,
  els.showFrame
].forEach((element) => {
  element.addEventListener("input", renderBanner);
  element.addEventListener("change", renderBanner);
});

els.theme.addEventListener("change", () => {
  applyThemePreset(els.theme.value);
});

els.downloadButton.addEventListener("click", downloadPng);
els.randomizeButton.addEventListener("click", randomizeBanner);
els.resetButton.addEventListener("click", resetBanner);

resetBanner();
