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
  async function drawBracelet(name) {
    // Clear canvas
    ctx.clearRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Background - Black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, braceletCanvas.width, braceletCanvas.height)

    // Main wristband dimensions
    const bandWidth = 1100
    const bandHeight = 300
    const bandX = (braceletCanvas.width - bandWidth) / 2
    const bandY = (braceletCanvas.height - bandHeight) / 2

    // Draw main band background with neon green
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
    ctx.lineWidth = 2
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.moveTo(bandX + 280, bandY + 20)
    ctx.lineTo(bandX + 280, bandY + bandHeight - 20)
    ctx.stroke()
    ctx.setLineDash([])

    // Left section (tear-off stub) - darker green
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
    ctx.fillRect(bandX, bandY, 280, bandHeight)

    // Draw decorative borders
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 4
    ctx.strokeRect(bandX + 5, bandY + 5, bandWidth - 10, bandHeight - 10)

    // Inner decorative line
    ctx.lineWidth = 2
    ctx.strokeRect(bandX + 15, bandY + 15, bandWidth - 30, bandHeight - 30)

    // Generate QR code URL with event info and name
    const qrData = encodeURIComponent(`GALA ICAT 2025 - ${name} - 15 NOV 2025 - ENTRADA VERIFICADA`)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&bgcolor=39FF14&color=000000`

    // Load and draw QR code
    const qrImage = new Image()
    qrImage.crossOrigin = "anonymous"
    qrImage.src = qrCodeUrl

    await new Promise((resolve) => {
      qrImage.onload = () => {
        // Draw QR code in the left section
        const qrSize = 180
        const qrX = bandX + 50
        const qrY = bandY + (bandHeight - qrSize) / 2

        // White background for QR
        ctx.fillStyle = "#39FF14"
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)

        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

        // QR label
        ctx.fillStyle = "#000000"
        ctx.font = "bold 14px 'Inter', sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("ESCANEAR", qrX + qrSize / 2, qrY + qrSize + 30)
        ctx.fillText("PARA VERIFICAR", qrX + qrSize / 2, qrY + qrSize + 48)

        resolve()
      }
      qrImage.onerror = () => {
        console.error("Error loading QR code")
        resolve()
      }
    })

    // Right section - Main content area
    const contentX = bandX + 320
    const contentWidth = bandWidth - 340

    // Event logo/title at top
    ctx.fillStyle = "#000000"
    ctx.font = "bold 48px 'Playfair Display', serif"
    ctx.textAlign = "center"
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = 8
    ctx.fillText("GALA ICAT", contentX + contentWidth / 2, bandY + 70)
    ctx.shadowBlur = 0

    // Year
    ctx.font = "bold 36px 'Inter', sans-serif"
    ctx.fillText("2025", contentX + contentWidth / 2, bandY + 110)

    // Decorative line
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(contentX + 100, bandY + 130)
    ctx.lineTo(contentX + contentWidth - 100, bandY + 130)
    ctx.stroke()

    // Guest name - centered and prominent
    ctx.font = "bold 42px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"
    ctx.shadowBlur = 10
    const nameText = name.toUpperCase()
    ctx.fillText(nameText, contentX + contentWidth / 2, bandY + 185)
    ctx.shadowBlur = 0

    // Decorative line
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(contentX + 100, bandY + 205)
    ctx.lineTo(contentX + contentWidth - 100, bandY + 205)
    ctx.stroke()

    // Date and location
    ctx.font = "bold 24px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.fillText("15 NOVIEMBRE 2025", contentX + contentWidth / 2, bandY + 240)

    ctx.font = "20px 'Inter', sans-serif"
    ctx.fillText("CLUB SOCIAL · COATEPEQUE", contentX + contentWidth / 2, bandY + 268)

    // Add security pattern in corners
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.arc(bandX + bandWidth - 40, bandY + 40, 3 + i * 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(bandX + bandWidth - 40, bandY + bandHeight - 40, 3 + i * 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add "VIP ACCESS" watermark
    ctx.save()
    ctx.globalAlpha = 0.15
    ctx.font = "bold 60px 'Inter', sans-serif"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.fillText("VIP ACCESS", contentX + contentWidth / 2, bandY + bandHeight / 2 + 20)
    ctx.restore()

    // Add holographic effect lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.moveTo(contentX, bandY + i * 15)
      ctx.lineTo(contentX + contentWidth, bandY + i * 15 + 30)
      ctx.stroke()
    }

    // Add neon glow effect around entire wristband
    ctx.strokeStyle = "#39FF14"
    ctx.lineWidth = 3
    ctx.shadowColor = "#39FF14"
    ctx.shadowBlur = 30
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
