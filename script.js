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

// --- LÓGICA DEL GENERADOR DE BRAZALETE (VERSIÓN MEJORADA) ---
const braceletCanvas = document.getElementById("braceletCanvas");
const braceletInput = document.getElementById("braceletName");
const generateBtn = document.getElementById("generateBracelet");
const downloadBtn = document.getElementById("downloadBracelet");

if (braceletCanvas && braceletInput && generateBtn && downloadBtn) {
  const ctx = braceletCanvas.getContext("2d");
  const neonGreen = "#39FF14";
  const darkBg = "#000000";
  const accentWhite = "#FFFFFF";

  // Función de ayuda para dibujar el código de barras decorativo
  function drawBarcode(x, y, width, height) {
    ctx.fillStyle = darkBg;
    let currentX = x;
    while (currentX < x + width) {
      const lineWidth = Math.random() * 4 + 1; // Ancho de línea aleatorio
      ctx.fillRect(currentX, y, lineWidth, height);
      currentX += lineWidth + Math.random() * 3 + 2; // Espacio aleatorio
    }
  }

  // Función principal para dibujar el brazalete
  function drawBracelet(name) {
    const w = braceletCanvas.width; // 800
    const h = braceletCanvas.height; // 300
    const padding = 10;
    const innerW = w - padding * 2; // 780
    const innerH = h - padding * 2; // 280
    const cornerRadius = 30;

    // --- 1. Preparar el Lienzo ---
    // Limpiar canvas
    ctx.clearRect(0, 0, w, h);

    // Fondo general (se verá como un "borde" negro)
    ctx.fillStyle = darkBg;
    ctx.fillRect(0, 0, w, h);

    // Guardar el estado para clipping
    ctx.save();

    // --- 2. Crear la Forma Base del Brazalete ---
    // Crear el camino redondeado principal
    ctx.beginPath();
    ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
    ctx.fillStyle = darkBg;
    ctx.fill();

    // Establecer esta forma como un "clip"
    // Todo lo que dibujemos de ahora en adelante solo aparecerá DENTRO de esta forma
    ctx.clip();

    // --- 3. Dibujar las Secciones (Apartados) ---

    // Sección 1: Izquierda (Verde)
    const section1Width = 220;
    ctx.fillStyle = neonGreen;
    ctx.fillRect(padding, padding, section1Width, innerH);

    // Sección 3: Derecha (Verde)
    const section3Width = 200;
    ctx.fillStyle = neonGreen;
    ctx.fillRect(w - section3Width - padding, padding, section3Width, innerH);

    // La Sección 2 (Centro) ya es negra por el fondo que pusimos en el paso 2

    // --- 4. Añadir Texto y Gráficos ---

    // Texto Sección 1 (Izquierda)
    ctx.fillStyle = darkBg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 50px 'Playfair Display', serif";
    ctx.fillText("GALA", padding + section1Width / 2, h / 2 - 60);
    ctx.fillText("ICAT", padding + section1Width / 2, h / 2);
    ctx.font = "bold 30px 'Inter', sans-serif";
    ctx.fillText("2025", padding + section1Width / 2, h / 2 + 60);

    // Texto Sección 2 (Centro - Nombre)
    ctx.fillStyle = neonGreen;
    ctx.shadowColor = neonGreen;
    ctx.shadowBlur = 15;
    ctx.textAlign = "center";

    // Lógica para auto-ajustar el tamaño del nombre
    let fontSize = 52;
    const maxWidth = w - section1Width - section3Width - padding * 4; // Ancho max del nombre
    let textWidth;
    do {
      fontSize--;
      ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
      textWidth = ctx.measureText(name.toUpperCase()).width;
    } while (textWidth > maxWidth && fontSize > 18);

    ctx.fillText(name.toUpperCase(), w / 2, h / 2 - 15);

    // Subtítulo
    ctx.shadowBlur = 0; // Quitar sombra para el subtítulo
    ctx.fillStyle = accentWhite;
    ctx.font = "normal 20px 'Inter', sans-serif";
    ctx.fillText("DISCO PARTY", w / 2, h / 2 + 35);

    // Texto Sección 3 (Derecha)
    ctx.fillStyle = darkBg;
    ctx.textAlign = "center";
    ctx.font = "bold 36px 'Inter', sans-serif";
    ctx.fillText("ALL ACCESS", w - section3Width / 2 - padding, h / 2 - 60);

    ctx.font = "normal 24px 'Inter', sans-serif";
    ctx.fillText("15 NOV 2025", w - section3Width / 2 - padding, h / 2);

    // Gráfico de Código de Barras
    drawBarcode(w - section3Width / 2 - padding - 80, h / 2 + 40, 160, 50);

    // --- 5. Añadir Brillo Exterior ---
    // Restaurar el canvas (quitar el clip) para dibujar el borde brillante
    ctx.restore();

    ctx.strokeStyle = neonGreen;
    ctx.lineWidth = 4;
    ctx.shadowColor = neonGreen;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
    ctx.stroke();

    // Resetear sombra
    ctx.shadowBlur = 0;

    // Mostrar botón de descarga
    downloadBtn.style.display = "block";
  }

  // --- Lógica de Eventos (Sin Cambios) ---

  // Generar brazalete con clic
  generateBtn.addEventListener("click", () => {
    const name = braceletInput.value.trim();
    if (name) {
      drawBracelet(name);
    } else {
      alert("Por favor, ingresa tu nombre completo");
    }
  });

  // Generar brazalete con "Enter"
  braceletInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitar que el form se envíe si existe
      const name = braceletInput.value.trim();
      if (name) {
        drawBracelet(name);
      }
    }
  });

  // Descargar brazalete
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    const nameSlug = braceletInput.value
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    link.download = `brazalete-gala-icat-2025-${nameSlug}.png`;
    link.href = braceletCanvas.toDataURL("image/png");
    link.click();
  });
}
