<script setup>
/**
 * Zeigt das QR-Etikett eines Exemplars (Logo, QR-Code, Inventarnummer) und bietet es als PNG an.
 * Alles passiert im Browser, es gibt keinen Backend-Aufruf.
 *
 * Props:
 * - inventoryNumber: 8-stellige Inventarnummer, die im QR-Code gespeichert wird.
 */
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import logoUrl from '@/assets/qrent-logo.png'
import { formatInventoryNumber, normalizeInventoryNumber } from '@/utils/inventoryNumber.js'

const props = defineProps({
  inventoryNumber: { type: String, required: true },
})

// Maße des Etiketts in Pixeln. 600 px Breite reichen für ca. 5 cm in guter Druckqualität.
const LABEL_WIDTH = 600
const PADDING = 40
const LOGO_WIDTH = 360
const QR_SIZE = 520
const NUMBER_FONT_SIZE = 64

const canvas = ref(null)
const errorMessage = ref('')
// Zählt die Zeichenvorgänge, damit ein langsamer alter Vorgang keinen neueren überschreibt.
let drawId = 0

/**
 * Lädt ein Bild und wartet, bis es vollständig dekodiert ist.
 * @param {string} src Bildadresse.
 * @returns {Promise<HTMLImageElement>} Das geladene Bild.
 */
async function loadImage(src) {
  const image = new Image()
  image.src = src
  await image.decode()
  return image
}

/** Zeichnet das komplette Etikett neu auf das sichtbare Canvas. */
async function drawLabel() {
  const currentDrawId = ++drawId
  errorMessage.value = ''

  try {
    const inventoryNumber = normalizeInventoryNumber(props.inventoryNumber)
    // Wirft einen Fehler, wenn die Nummer ungültig ist.
    const numberText = formatInventoryNumber(inventoryNumber)

    // Fehlerkorrektur H: bleibt lesbar, auch wenn ca. 30 % beschädigt sind. Bei 8 Ziffern
    // wird der Code dadurch nicht größer. margin: 4 ist die vorgeschriebene weiße Ruhezone.
    const qrCanvas = await QRCode.toCanvas(document.createElement('canvas'), inventoryNumber, {
      width: QR_SIZE,
      margin: 4,
      errorCorrectionLevel: 'H',
    })
    const logo = await loadImage(logoUrl)

    if (currentDrawId !== drawId || !canvas.value) return

    const logoHeight = Math.round((LOGO_WIDTH / logo.naturalWidth) * logo.naturalHeight)
    const labelHeight = PADDING + logoHeight + QR_SIZE + NUMBER_FONT_SIZE + PADDING
    const ctx = canvas.value.getContext('2d')

    canvas.value.width = LABEL_WIDTH
    canvas.value.height = labelHeight

    // Weißer Hintergrund, sonst wäre das PNG durchsichtig.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, LABEL_WIDTH, labelHeight)

    ctx.drawImage(logo, (LABEL_WIDTH - LOGO_WIDTH) / 2, PADDING, LOGO_WIDTH, logoHeight)
    ctx.drawImage(qrCanvas, (LABEL_WIDTH - QR_SIZE) / 2, PADDING + logoHeight)

    ctx.fillStyle = '#000000'
    ctx.font = `bold ${NUMBER_FONT_SIZE}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(numberText, LABEL_WIDTH / 2, PADDING + logoHeight + QR_SIZE + NUMBER_FONT_SIZE / 2)
  } catch {
    if (currentDrawId === drawId) errorMessage.value = 'Das Etikett konnte nicht erstellt werden.'
  }
}

/** Speichert das aktuelle Etikett als PNG-Datei, z. B. "qrent-01010002.png". */
function downloadPng() {
  canvas.value.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qrent-${normalizeInventoryNumber(props.inventoryNumber)}.png`
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

onMounted(drawLabel)
watch(() => props.inventoryNumber, drawLabel)
</script>

<template>
  <div>
    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>
    <div v-show="!errorMessage">
      <canvas ref="canvas" class="qr-label-preview mb-4" aria-label="Vorschau des QR-Etiketts" />
      <div>
        <v-btn color="primary" prepend-icon="mdi-download" @click="downloadPng">
          Als PNG herunterladen
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Das Canvas hat 600 px, die Vorschau wird nur verkleinert angezeigt. */
.qr-label-preview {
  display: block;
  width: 100%;
  max-width: 240px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
