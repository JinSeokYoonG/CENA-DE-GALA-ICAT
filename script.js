// --- LÓGICA DEL SOBRE Y CONTENIDO ---
const envelopeWrapper = document.getElementById("envelope-wrapper")
const galaContainer = document.getElementById("gala-container")
const footer = document.getElementById("footer")
const musicControl = document.getElementById("musicControl")
const themeToggle = document.getElementById("themeToggle")
const music = document.getElementById("backgroundMusic")
const volumeUpIcon = document.getElementById("volumeUpIcon")
const volumeOffIcon = document.getElementById("volumeOffIcon")

document.body.classList.add("waiting")

envelopeWrapper.addEventListener("click", () => {
  document.body.classList.remove("waiting")
  envelopeWrapper.classList.add("open")
  document.body.style.overflowY = "auto"
  if (galaContainer) galaContainer.classList.add("visible")
  footer.classList.add("visible")
  musicControl.classList.add("visible")
  themeToggle.classList.add("visible")

  music.play().catch((e) => console.error("La reproducción automática fue bloqueada."))

  if (music.muted) {
    volumeUpIcon.style.display = "none"
    volumeOffIcon.style.display = "block"
  } else {
    volumeUpIcon.style.display = "block"
    volumeOffIcon.style.display = "none"
  }

  setTimeout(() => {
    envelopeWrapper.style.display = "none"
  }, 2000)
})

// --- LÓGICA DEL BOTÓN DE MÚSICA (Mute/Unmute) ---
musicControl.addEventListener("click", () => {
  if (music.muted) {
    music.muted = false
    volumeUpIcon.style.display = "block"
    volumeOffIcon.style.display = "none"
  } else {
    music.muted = true
    volumeUpIcon.style.display = "none"
    volumeOffIcon.style.display = "block"
  }
})

// --- LÓGICA DE TEMA (OSCURO/CLARO) (CON TRANSICIÓN DE OLA SIN FLASH) ---
const sunIcon = document.getElementById("themeIconSun")
const moonIcon = document.getElementById("themeIconMoon")
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
const waveOverlay = document.getElementById("wave-overlay")

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark")
    sunIcon.style.display = "none"
    moonIcon.style.display = "block"
    localStorage.setItem("theme", "dark")
  } else {
    document.documentElement.setAttribute("data-theme", "light")
    sunIcon.style.display = "block"
    moonIcon.style.display = "none"
    localStorage.setItem("theme", "light")
  }
}

themeToggle.addEventListener("click", (e) => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || (prefersDark.matches ? "dark" : "light")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  const targetBg = newTheme === "dark" ? "#1a1a1a" : "#faf9f7"

  waveOverlay.style.backgroundColor = targetBg
  waveOverlay.style.top = e.clientY - 0.5 + "px"
  waveOverlay.style.left = e.clientX - 0.5 + "px"
  waveOverlay.style.transform = "scale(0)"
  waveOverlay.style.transition = "transform 0s"

  requestAnimationFrame(() => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const maxDist = Math.max(
      Math.hypot(e.clientX, e.clientY),
      Math.hypot(viewportWidth - e.clientX, e.clientY),
      Math.hypot(e.clientX, viewportHeight - e.clientY),
      Math.hypot(viewportWidth - e.clientX, viewportHeight - e.clientY),
    )
    const scaleFactor = maxDist * 2

    waveOverlay.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
    waveOverlay.style.transform = `scale(${scaleFactor})`

    setTimeout(() => {
      applyTheme(newTheme)
    }, 600)

    setTimeout(() => {
      waveOverlay.style.transform = "scale(0)"
      waveOverlay.style.transition = "transform 0s"
    }, 750)
  })
})

// Carga inicial del tema
const savedTheme = localStorage.getItem("theme")
if (savedTheme) {
  applyTheme(savedTheme)
} else {
  applyTheme(prefersDark.matches ? "dark" : "light")
}
prefersDark.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(e.matches ? "dark" : "light")
  }
})

// --- LÓGICA DE NAVEGACIÓN PARA GALA ---
const galaNav = document.getElementById("gala-nav")
if (galaNav) {
  galaNav.addEventListener("click", (e) => {
    const clickedButton = e.target.closest(".nav-btn")
    if (!clickedButton) return

    const targetTab = clickedButton.dataset.tab
    const allButtons = galaNav.querySelectorAll(".nav-btn")
    const allTabs = document.querySelectorAll(".tab-content")

    // Remove active class from all buttons and tabs
    allButtons.forEach((btn) => btn.classList.remove("active"))
    allTabs.forEach((tab) => tab.classList.remove("active"))

    // Add active class to clicked button and corresponding tab
    clickedButton.classList.add("active")
    const targetTabElement = document.getElementById(targetTab)
    if (targetTabElement) {
      targetTabElement.classList.add("active")
    }
  })
}

// --- LÓGICA DEL NUEVO CURSOR ---
const dot = document.getElementById("cursor-dot")
const outline = document.getElementById("cursor-outline")

window.addEventListener("mousemove", (e) => {
  dot.style.left = e.clientX + "px"
  dot.style.top = e.clientY + "px"
  outline.style.left = e.clientX + "px"
  outline.style.top = e.clientY + "px"
})

setTimeout(() => {
  const hoverElements = document.querySelectorAll(
    "a, button, .nav-btn, #envelope-wrapper, .music-control, .theme-toggle, .detail-item, .gallery-item",
  )

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover")
    })
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover")
    })
  })
}, 100)

// --- LÓGICA DEL GENERADOR DE BRAZALETE (VERSIÓN 2.0 - MUCHO MEJORADA) ---
const braceletCanvas = document.getElementById("braceletCanvas");
const ctx = braceletCanvas.getContext("2d");
const generateBtn = document.getElementById("generateBracelet");
const downloadBtn = document.getElementById("downloadBracelet");

generateBtn.addEventListener("click", () => {
  const name = document.getElementById("braceletName").value.trim();
  if (!name) {
    alert("Por favor, ingresa tu nombre completo.");
    return;
  }
  drawBracelet(name);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "brazalete_gala.png";
  link.href = braceletCanvas.toDataURL("image/png");
  link.click();
});

function drawBracelet(name) {
  const w = braceletCanvas.width;
  const h = braceletCanvas.height;
  const padding = 15;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const cornerRadius = 80;

  ctx.clearRect(0, 0, w, h);

  // Fondo base
  ctx.fillStyle = "#0c0c0c";
  ctx.beginPath();
  ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
  ctx.fill();

  ctx.save();
  ctx.clip();

  // Secciones
  const section1Width = 260;
  const section3Width = 220;
  const section2StartX = padding + section1Width;
  const section2Width = innerW - section1Width - section3Width;

  const neon = "#00ff66";
  const greenGradient = ctx.createLinearGradient(0, 0, 0, h);
  greenGradient.addColorStop(0, "#00cc44");
  greenGradient.addColorStop(0.5, neon);
  greenGradient.addColorStop(1, "#00cc44");

  // Sección 1
  ctx.fillStyle = greenGradient;
  ctx.fillRect(padding, padding, section1Width, innerH);

  // Sección 3
  ctx.fillStyle = greenGradient;
  ctx.fillRect(w - section3Width - padding, padding, section3Width, innerH);

  // Sección central
  ctx.fillStyle = "#000";
  ctx.fillRect(section2StartX, padding, section2Width, innerH);

  // --- IZQUIERDA ---
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "bold 22px 'Inter', sans-serif";
  ctx.fillText("Mano Derecha", padding + section1Width / 2, h / 2 - 90);

  ctx.font = "40px 'Inter', sans-serif";
  ctx.fillText("✋", padding + section1Width / 2, h / 2 - 45);

  ctx.font = "bold 38px 'Inter', sans-serif";
  ctx.fillText("GALA", padding + section1Width / 2, h / 2 + 5);
  ctx.fillText("ICAT", padding + section1Width / 2, h / 2 + 50);
  ctx.font = "bold 30px 'Inter', sans-serif";
  ctx.fillText("2025", padding + section1Width / 2, h / 2 + 95);
  ctx.font = "bold 22px 'Inter', sans-serif";
  ctx.fillText("Inter", padding + section1Width / 2, h / 2 + 125);

  // --- CENTRO ---
  ctx.textAlign = "center";
  ctx.fillStyle = "#aaa";
  ctx.font = "20px 'Inter', sans-serif";
  ctx.fillText("Presenta tu:", w / 2, h / 2 - 70);

  ctx.fillStyle = neon;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 25;
  let fontSize = 80;
  const maxNameWidth = section2Width - 40;
  let textWidth;
  do {
    fontSize--;
    ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
    textWidth = ctx.measureText(name.toUpperCase()).width;
  } while (textWidth > maxNameWidth && fontSize > 20);
  ctx.fillText(name.toUpperCase(), w / 2, h / 2 + 10);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#fff";
  ctx.font = "24px 'Inter', sans-serif";
  ctx.fillText("DISCO PARTY", w / 2, h / 2 + 60);

  ctx.fillStyle = "#aaa";
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillText("Este brazalete es tu pase de acceso.", w / 2, h - 55);
  ctx.fillText("Preséntalo digitalmente o impreso. Sin brazalete, no hay entrada.", w / 2, h - 35);

  // --- DERECHA ---
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.font = "bold 34px 'Inter', sans-serif";
  ctx.fillText("ALL ACCESS", w - section3Width / 2 - padding, h / 2 - 60);

  ctx.font = "normal 22px 'Inter', sans-serif";
  ctx.fillText("15 NOV 2025", w - section3Width / 2 - padding, h / 2 - 20);

  // Código de barras
  const barcodeX = w - section3Width / 2 - padding - 80;
  const barcodeY = h / 2 + 30;
  const barcodeW = 160;
  const barcodeH = 55;
  ctx.fillStyle = "#000";
  ctx.fillRect(barcodeX - 5, barcodeY - 5, barcodeW + 10, barcodeH + 10);

  // Barras blancas
  ctx.fillStyle = "#fff";
  let currentX = barcodeX;
  while (currentX < barcodeX + barcodeW) {
    const lineWidth = Math.random() * 4 + 1;
    ctx.fillRect(currentX, barcodeY, lineWidth, barcodeH);
    currentX += lineWidth + Math.random() * 3 + 2;
  }

  // Borde luminoso
  ctx.restore();
  ctx.strokeStyle = neon;
  ctx.lineWidth = 4;
  ctx.shadowColor = neon;
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
  ctx.stroke();
  ctx.shadowBlur = 0;

  downloadBtn.style.display = "block";
}
