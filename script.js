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
const braceletInput = document.getElementById("braceletName");
const generateBtn = document.getElementById("generateBracelet");
const downloadBtn = document.getElementById("downloadBracelet");

if (braceletCanvas && braceletInput && generateBtn && downloadBtn) {
  const ctx = braceletCanvas.getContext("2d");
  const neonGreen = "#39FF14";
  const darkBg = "#111111"; // Un negro un poco menos puro para contraste
  const textWhite = "#FFFFFF";
  const lightGrey = "#AAAAAA"; // Para subtítulos o texto secundario

  // Función de ayuda para dibujar el código de barras decorativo
  function drawBarcode(x, y, width, height) {
    ctx.fillStyle = textWhite; // Barras blancas sobre fondo oscuro
    let currentX = x;
    while (currentX < x + width) {
      const lineWidth = Math.random() * 4 + 1;
      ctx.fillRect(currentX, y, lineWidth, height);
      currentX += lineWidth + Math.random() * 3 + 2;
    }
  }

  // Función para dibujar un ícono de mano derecha simplificado
  function drawRightHandIcon(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    // Pulgar
    ctx.arc(x + size * 0.1, y + size * 0.4, size * 0.15, 0, Math.PI * 2);
    // Base de la palma
    ctx.arc(x + size * 0.3, y + size * 0.6, size * 0.25, 0, Math.PI * 2);
    // Dedos (simplificados)
    ctx.roundRect(x + size * 0.2, y + size * 0.1, size * 0.15, size * 0.4, size * 0.07);
    ctx.roundRect(x + size * 0.35, y + size * 0.05, size * 0.15, size * 0.45, size * 0.07);
    ctx.roundRect(x + size * 0.5, y + size * 0.1, size * 0.15, size * 0.4, size * 0.07);
    ctx.fill();
  }


  // Función principal para dibujar el brazalete
  function drawBracelet(name) {
    const w = braceletCanvas.width; // 800
    const h = braceletCanvas.height; // 300
    const padding = 15;
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const cornerRadius = 25; // Bordes un poco más suaves

    // --- 1. Preparar el Lienzo ---
    ctx.clearRect(0, 0, w, h);

    // Fondo oscuro que será la base del brazalete
    ctx.fillStyle = darkBg;
    ctx.beginPath();
    ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
    ctx.fill();

    // Guardar el estado para clipping
    ctx.save();
    ctx.clip(); // Todo lo que se dibuje ahora estará dentro de la forma redondeada

    // --- 2. Dibujar las Secciones ---
    const section1Width = 240; // Izquierda - GALA ICAT
    const section3Width = 200; // Derecha - ALL ACCESS

    // Sección central (nombre) - Es simplemente el espacio que queda
    const section2StartX = padding + section1Width;
    const section2Width = innerW - section1Width - section3Width;

    // Gradiente para las secciones verdes
    const greenGradient = ctx.createLinearGradient(0, 0, 0, h);
    greenGradient.addColorStop(0, "#2ecc40"); // Verde más oscuro
    greenGradient.addColorStop(0.5, neonGreen); // Verde neón brillante
    greenGradient.addColorStop(1, "#2ecc40"); // Verde más oscuro

    // Sección 1: Izquierda (Verde)
    ctx.fillStyle = greenGradient;
    ctx.fillRect(padding, padding, section1Width, innerH);

    // Sección 3: Derecha (Verde)
    ctx.fillStyle = greenGradient;
    ctx.fillRect(w - section3Width - padding, padding, section3Width, innerH);

    // --- 3. Añadir Texto y Gráficos ---

    // Texto Sección 1 (Izquierda)
    ctx.fillStyle = darkBg; // Texto oscuro sobre el verde
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 55px 'Playfair Display', serif";
    ctx.fillText("GALA", padding + section1Width / 2, h / 2 - 50);
    ctx.fillText("ICAT", padding + section1Width / 2, h / 2 + 10);
    ctx.font = "bold 30px 'Inter', sans-serif";
    ctx.fillText("2025", padding + section1Width / 2, h / 2 + 65);

    // Ícono y Texto "Mano Derecha"
    drawRightHandIcon(padding + section1Width / 2 - 25, padding + 30, 50, darkBg);
    ctx.font = "bold 16px 'Inter', sans-serif";
    ctx.fillText("Mano Derecha", padding + section1Width / 2, padding + 100);


    // Texto Sección 2 (Centro - Nombre y Evento)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Subtítulo del evento
    ctx.fillStyle = lightGrey;
    ctx.font = "normal 20px 'Inter', sans-serif";
    ctx.fillText("Presenta tu:", w / 2, h / 2 - 85); // Pequeño texto antes del nombre

    // Nombre (con glow neón)
    ctx.fillStyle = neonGreen;
    ctx.shadowColor = neonGreen;
    ctx.shadowBlur = 25; // Más glow
    let fontSize = 52;
    const maxNameWidth = section2Width - 40; // Ancho máximo del nombre
    let textWidth;
    do {
      fontSize--;
      ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
      textWidth = ctx.measureText(name.toUpperCase()).width;
    } while (textWidth > maxNameWidth && fontSize > 20);

    ctx.fillText(name.toUpperCase(), w / 2, h / 2 - 20);
    ctx.shadowBlur = 0; // Resetear sombra para el siguiente texto

    // Subtítulo "DISCO PARTY"
    ctx.fillStyle = textWhite;
    ctx.font = "normal 22px 'Inter', sans-serif";
    ctx.fillText("DISCO PARTY", w / 2, h / 2 + 30);

    // --- Información adicional (texto inferior central) ---
    ctx.fillStyle = lightGrey;
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("Este brazalete es tu pase de acceso.", w / 2, h - padding - 40);
    ctx.fillText("Preséntalo digitalmente o impreso. Sin brazalete, no hay entrada.", w / 2, h - padding - 20);


    // Texto Sección 3 (Derecha)
    ctx.fillStyle = darkBg; // Texto oscuro sobre el verde
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 34px 'Inter', sans-serif";
    ctx.fillText("ALL ACCESS", w - section3Width / 2 - padding, h / 2 - 70);

    ctx.font = "normal 22px 'Inter', sans-serif";
    ctx.fillText("15 NOV 2025", w - section3Width / 2 - padding, h / 2 - 20);

    // Gráfico de Código de Barras (ahora blanco sobre verde)
    ctx.fillStyle = darkBg; // Las barras serán oscuras
    const barcodeX = w - section3Width / 2 - padding - 80;
    const barcodeY = h / 2 + 30;
    const barcodeW = 160;
    const barcodeH = 50;
    // Dibuja el fondo de las barras primero
    ctx.fillRect(barcodeX - 5, barcodeY - 5, barcodeW + 10, barcodeH + 10);
    // Ahora dibuja las barras
    drawBarcode(barcodeX, barcodeY, barcodeW, barcodeH);


    // --- 4. Añadir Borde Exterior de Glow ---
    ctx.restore(); // Restaurar el canvas para quitar el clip

    ctx.strokeStyle = neonGreen;
    ctx.lineWidth = 4;
    ctx.shadowColor = neonGreen;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(padding, padding, innerW, innerH, cornerRadius);
    ctx.stroke();

    ctx.shadowBlur = 0; // Resetear sombra

    // Mostrar botón de descarga
    downloadBtn.style.display = "block";
  }

  // --- Lógica de Eventos (Sin Cambios) ---

  generateBtn.addEventListener("click", () => {
    const name = braceletInput.value.trim();
    if (name) {
      drawBracelet(name);
    } else {
      alert("Por favor, ingresa tu nombre completo");
    }
  });

  braceletInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const name = braceletInput.value.trim();
      if (name) {
        drawBracelet(name);
      }
    }
  });

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
