<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { equipmentService } from '@/services/equipmentService.js'

const route = useRoute()
const product = ref(null)
const loading = ref(false)
const error = ref(null)
let controller
let requestId = 0

/** Lädt bei jedem ID-Wechsel neu und verhindert, dass alte Antworten das aktuelle Produkt ersetzen. */
async function loadProduct() {
  const currentRequest = ++requestId
  controller?.abort()
  controller = new AbortController()
  product.value = null
  error.value = null
  loading.value = true
  try {
    const loaded = await equipmentService.getProduct(route.params.id, { signal: controller.signal })
    if (currentRequest === requestId) product.value = loaded
  } catch (failure) {
    if (currentRequest === requestId && failure.code !== 'canceled') error.value = failure
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

watch(() => route.params.id, loadProduct, { immediate: true })
onBeforeUnmount(() => { requestId += 1; controller?.abort() })
</script>

<template>
  <v-btn :to="{ name: 'inventory' }" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
    Zur Equipment-Liste
  </v-btn>
  <div v-if="loading" class="text-center py-8" role="status" aria-live="polite">
    <v-progress-circular indeterminate color="primary" class="mb-3" aria-label="Produktdetails werden geladen" />
    <p>Produktdetails werden geladen …</p>
  </div>
  <v-alert v-else-if="error" type="error" variant="tonal" role="alert">
    <h1 class="text-h6 mb-2">{{ error.status === 404 ? 'Produkt nicht gefunden' : 'Produktdetails nicht verfügbar' }}</h1>
    <p class="mb-3">{{ error.status === 404 ? 'Das angeforderte Produkt existiert nicht oder wurde entfernt.' : error.message }}</p>
    <v-btn v-if="![400, 404].includes(error.status)" variant="outlined" @click="loadProduct">Erneut versuchen</v-btn>
  </v-alert>
  <template v-else-if="product">
    <p class="text-caption text-medium-emphasis mb-2">Produktcode {{ product.code }}</p>
    <h1 class="text-h4 mb-4 text-break">{{ product.name }}</h1>
    <div class="d-flex flex-wrap ga-2 mb-6">
      <v-chip color="primary" variant="tonal">{{ product.category.name }}</v-chip>
      <v-chip variant="tonal">{{ product.subcategory.name }}</v-chip>
    </div>
    <h2 class="text-h6 mb-2">Beschreibung</h2>
    <p class="product-description mb-6">{{ product.description?.trim() || 'Keine Beschreibung hinterlegt.' }}</p>
    <h2 class="text-h6 mb-2">Exemplare ({{ product.items.length }})</h2>
    <p class="text-caption text-medium-emphasis mb-4">
      Aufgelistet sind alle Exemplare dieses Produkts. Daraus lässt sich keine aktuelle Verfügbarkeit ableiten.
    </p>
    <v-alert v-if="product.items.length === 0" type="info" variant="tonal">Für dieses Produkt sind noch keine Exemplare hinterlegt.</v-alert>
    <v-table v-else aria-label="Exemplare dieses Produkts">
      <thead><tr><th scope="col">Inventarnummer</th><th scope="col">Bemerkungen</th></tr></thead>
      <tbody>
        <tr v-for="item in product.items" :key="item.id">
          <th scope="row">{{ item.inventoryNumber }}</th>
          <td class="product-description">{{ item.notes?.trim() || 'Keine Bemerkungen hinterlegt.' }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
</template>

<style scoped>
.product-description {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
