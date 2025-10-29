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

  async function drawBracelet(name) {
    // Clear canvas
    ctx.clearRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Background - Black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Main wristband dimensions - wider horizontal format
    const bandWidth = 1300
    const bandHeight = 280
    const bandX = (braceletCanvas.width - bandWidth) / 2
    const bandY = (braceletCanvas.height - bandHeight) / 2

    // Draw main band background with neon green gradient
    const gradient = ctx.createLinearGradient(bandX, bandY, bandX, bandY + bandHeight)
    gradient.addColorStop(0, "#2ecc40")
    gradient.addColorStop(0.5, "#39FF14")
    gradient.addColorStop(1, "#2ecc40")

    ctx.fillStyle = gradient
    ctx.shadowColor = "#39FF14"
    ctx.shadowBlur = 40
    ctx.fillRect(bandX, bandY, bandWidth, bandHeight)
    ctx.shadowBlur = 0

    // Draw perforated tear-off line on the left side
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(bandX + 220, bandY + 15)
    ctx.lineTo(bandX + 220, bandY + bandHeight - 15)
    ctx.stroke()
    ctx.setLineDash([])

    // Left section (tear-off stub) - darker with pattern
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(bandX, bandY, 220, bandHeight)

    // Security pattern in stub
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillRect(bandX + 10 + i * 14, bandY + 10 + j * 35, 8, 25)
      }
    }

    // Draw decorative borders
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 6
    ctx.strokeRect(bandX + 3, bandY + 3, bandWidth - 6, bandHeight - 6)

    // Inner decorative line
    ctx.lineWidth = 2
    ctx.strokeRect(bandX + 12, bandY + 12, bandWidth - 24, bandHeight - 24)

    // Right section - Main content area
    const contentX = bandX + 240
    const contentWidth = bandWidth - 260

    // Event title at top - bold and prominent
    ctx.fillStyle = "#000000"
    ctx.font = "bold 56px 'Playfair Display', serif"
    ctx.textAlign = "left"
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
    ctx.shadowBlur = 5
    ctx.fillText("GALA SMART TECH", contentX + 20, bandY + 65)
    ctx.shadowBlur = 0

    // Year badge
    ctx.fillStyle = "#000000"
    ctx.fillRect(contentX + contentWidth - 120, bandY + 25, 100, 50)
    ctx.fillStyle = "#39FF14"
    ctx.font = "bold 32px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("2025", contentX + contentWidth - 70, bandY + 60)

    // Decorative line under title
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(contentX + 20, bandY + 85)
    ctx.lineTo(contentX + contentWidth - 140, bandY + 85)
    ctx.stroke()

    // Guest name - large and centered
    ctx.font = "bold 48px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "left"
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)"
    ctx.shadowBlur = 8
    const nameText = name.toUpperCase()
    ctx.fillText(nameText, contentX + 20, bandY + 145)
    ctx.shadowBlur = 0

    // Event details
    ctx.font = "bold 22px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "left"
    ctx.fillText("15 NOVIEMBRE 2025 · 5:00 PM", contentX + 20, bandY + 185)

    ctx.font = "20px 'Inter', sans-serif"
    ctx.fillText("CLUB SOCIAL · COATEPEQUE", contentX + 20, bandY + 215)

    // VIP badge
    ctx.fillStyle = "#000000"
    ctx.fillRect(contentX + 20, bandY + 230, 80, 35)
    ctx.fillStyle = "#39FF14"
    ctx.font = "bold 20px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("VIP", contentX + 60, bandY + 253)

    // Generate barcode based on name
    const barcodeX = contentX + contentWidth - 280
    const barcodeY = bandY + 110
    const barcodeWidth = 260
    const barcodeHeight = 120

    // Barcode background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(barcodeX - 10, barcodeY - 10, barcodeWidth + 20, barcodeHeight + 40)

    // Generate barcode pattern from name
    ctx.fillStyle = "#000000"
    const nameHash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const barCount = 40
    const barWidth = barcodeWidth / barCount

    for (let i = 0; i < barCount; i++) {
      const seed = (nameHash * (i + 1)) % 7
      const height = barcodeHeight * (0.6 + seed / 20)
      const yOffset = (barcodeHeight - height) / 2

      if ((nameHash + i) % 3 !== 0) {
        ctx.fillRect(barcodeX + i * barWidth, barcodeY + yOffset, barWidth * 0.7, height)
      }
    }

    // Barcode number below
    ctx.fillStyle = "#000000"
    ctx.font = "bold 16px 'Courier New', monospace"
    ctx.textAlign = "center"
    const barcodeNumber = String(nameHash).padStart(12, "0").slice(0, 12)
    ctx.fillText(barcodeNumber, barcodeX + barcodeWidth / 2, barcodeY + barcodeHeight + 25)

    // Add decorative elements
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(contentX + 140 + i * 25, bandY + 240, 8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add holographic effect lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)"
    ctx.lineWidth = 1
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      ctx.moveTo(contentX, bandY + 30 + i * 22)
      ctx.lineTo(contentX + 200, bandY + 50 + i * 22)
      ctx.stroke()
    }

    // Add neon glow effect around entire wristband
    ctx.strokeStyle = "#39FF14"
    ctx.lineWidth = 4
    ctx.shadowColor = "#39FF14"
    ctx.shadowBlur = 35
    ctx.strokeRect(bandX, bandY, bandWidth, bandHeight)
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
      alert("Por favor, ingresa tu nombre")
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
