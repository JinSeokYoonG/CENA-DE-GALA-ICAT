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

// --- LÓGICA DEL GENERADOR DE BRAZALETE ---
const braceletCanvas = document.getElementById("braceletCanvas")
const braceletInput = document.getElementById("braceletName")
const generateBtn = document.getElementById("generateBracelet")
const downloadBtn = document.getElementById("downloadBracelet")

if (braceletCanvas && braceletInput && generateBtn && downloadBtn) {
  const ctx = braceletCanvas.getContext("2d")

  // Function to draw the bracelet
  function drawBracelet(name) {
    // Clear canvas
    ctx.clearRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Background - Black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Draw bracelet band with neon green glow
    const bandHeight = 120
    const bandY = (braceletCanvas.height - bandHeight) / 2

    // Neon green gradient for the band
    const gradient = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight)
    gradient.addColorStop(0, "#2ecc40")
    gradient.addColorStop(0.5, "#39FF14")
    gradient.addColorStop(1, "#2ecc40")

    // Draw main band with rounded edges
    ctx.fillStyle = gradient
    ctx.shadowColor = "#39FF14"
    ctx.shadowBlur = 30
    ctx.beginPath()
    ctx.roundRect(50, bandY, braceletCanvas.width - 100, bandHeight, 20)
    ctx.fill()

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw decorative lines on top and bottom
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(50, bandY + 15)
    ctx.lineTo(braceletCanvas.width - 50, bandY + 15)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(50, bandY + bandHeight - 15)
    ctx.lineTo(braceletCanvas.width - 50, bandY + bandHeight - 15)
    ctx.stroke()

    // Draw event title at top
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px 'Playfair Display', serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("GALA ICAT 2025", braceletCanvas.width / 2, bandY + 35)

    // Draw name in the center
    ctx.font = "bold 36px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
    ctx.shadowBlur = 5
    ctx.fillText(name.toUpperCase(), braceletCanvas.width / 2, braceletCanvas.height / 2)
    ctx.shadowBlur = 0

    // Draw date at bottom
    ctx.font = "20px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.fillText("15 NOV 2025", braceletCanvas.width / 2, bandY + bandHeight - 35)

    // Add decorative stars
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial"
    ctx.fillText("★", 100, braceletCanvas.height / 2)
    ctx.fillText("★", braceletCanvas.width - 100, braceletCanvas.height / 2)

    // Add neon glow effect around the entire bracelet
    ctx.strokeStyle = "#39FF14"
    ctx.lineWidth = 2
    ctx.shadowColor = "#39FF14"
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.roundRect(50, bandY, braceletCanvas.width - 100, bandHeight, 20)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Show download button
    downloadBtn.style.display = "block"
  }

  // Generate bracelet on button click
  generateBtn.addEventListener("click", () => {
    const name = braceletInput.value.trim()
    if (name) {
      drawBracelet(name)
    } else {
      alert("Por favor, ingresa tu nombre completo")
    }
  })

  // Generate bracelet on Enter key
  braceletInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const name = braceletInput.value.trim()
      if (name) {
        drawBracelet(name)
      }
    }
  })

  // Download bracelet
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = `brazalete-gala-icat-2025-${braceletInput.value.trim().replace(/\s+/g, "-")}.png`
    link.href = braceletCanvas.toDataURL("image/png")
    link.click()
  })
}
