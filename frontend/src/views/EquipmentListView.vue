<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { equipmentService } from '@/services/equipmentService.js'
import { filterProducts, getSubcategories } from '@/utils/equipmentFilters.js'
import EquipmentFilters from '@/components/equipment/EquipmentFilters.vue'
import EquipmentTable from '@/components/equipment/EquipmentTable.vue'
import EquipmentCard from '@/components/equipment/EquipmentCard.vue'

const categories = ref([])
const products = ref([])
const search = ref('')
const categoryId = ref(null)
const subcategoryId = ref(null)
const loading = ref(false)
const error = ref(null)
const viewMode = ref('cards')
const subcategories = computed(() => getSubcategories(categories.value, categoryId.value))
const filteredProducts = computed(() => filterProducts(products.value, {
  search: search.value ?? '', categoryId: categoryId.value, subcategoryId: subcategoryId.value,
}))
let controller
let requestId = 0

watch(categoryId, () => { subcategoryId.value = null })

/** Lädt Kategorien und Produkte parallel; verwirft abgebrochene und veraltete Antworten. */
async function loadEquipment() {
  const currentRequest = ++requestId
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = null
  try {
    const [loadedCategories, loadedProducts] = await Promise.all([
      equipmentService.getCategories({ signal: controller.signal }),
      equipmentService.getProducts({ signal: controller.signal }),
    ])
    if (currentRequest !== requestId) return
    categories.value = loadedCategories
    products.value = loadedProducts
    if (!loadedCategories.some((category) => category.id === categoryId.value)) categoryId.value = null
    if (!getSubcategories(loadedCategories, categoryId.value).some((item) => item.id === subcategoryId.value)) {
      subcategoryId.value = null
    }
  } catch (failure) {
    if (currentRequest === requestId && failure.code !== 'canceled') {
      error.value = failure
      controller.abort()
    }
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

/** Setzt ausschließlich lokale Filter zurück; löst keine API-Abfrage aus. */
function resetFilters() {
  search.value = ''
  categoryId.value = null
  subcategoryId.value = null
}

onMounted(loadEquipment)
onBeforeUnmount(() => { requestId += 1; controller?.abort() })
</script>

<template>
  <h1 class="text-h4 mb-2">Equipment</h1>
  <p class="text-body-1 text-medium-emphasis mb-6">Produkte und Exemplare aus dem Schulinventar.</p>
  <EquipmentFilters
    v-model:search="search" v-model:category-id="categoryId" v-model:subcategory-id="subcategoryId"
    :categories="categories" :subcategories="subcategories" :disabled="loading || Boolean(error)" @reset="resetFilters"
  />
  <div v-if="loading" class="text-center py-8" role="status" aria-live="polite">
    <v-progress-circular indeterminate color="primary" class="mb-3" aria-label="Equipment wird geladen" />
    <p>Equipment wird geladen …</p>
  </div>
  <v-alert v-else-if="error" type="error" variant="tonal" role="alert">
    <p class="mb-3">Die Equipment-Liste konnte nicht geladen werden. {{ error.message }}</p>
    <v-btn variant="outlined" @click="loadEquipment">Erneut versuchen</v-btn>
  </v-alert>
  <template v-else>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <p class="text-body-2" role="status" aria-live="polite">{{ filteredProducts.length }} von {{ products.length }} Produkten</p>
      <v-btn-toggle v-model="viewMode" mandatory divided color="primary" aria-label="Darstellung">
        <v-btn value="table" icon="mdi-table" aria-label="Tabellenansicht" :aria-pressed="viewMode === 'table'" />
        <v-btn value="cards" icon="mdi-view-grid-outline" aria-label="Kartenansicht" :aria-pressed="viewMode === 'cards'" />
      </v-btn-toggle>
    </div>
    <p class="text-caption text-medium-emphasis mb-4">
      Die Exemplaranzahl ist der Gesamtbestand. Verfügbarkeitsinformationen liegen noch nicht vor.
    </p>
    <v-alert v-if="products.length === 0" type="info" variant="tonal">Es sind noch keine Produkte im Inventar vorhanden.</v-alert>
    <v-alert v-else-if="filteredProducts.length === 0" type="info" variant="tonal">
      <p class="mb-3">Keine Produkte passen zu deiner Suche und den gewählten Filtern.</p>
      <v-btn variant="outlined" @click="resetFilters">Filter zurücksetzen</v-btn>
    </v-alert>
    <EquipmentTable v-else-if="viewMode === 'table'" :products="filteredProducts" />
    <v-row v-else>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" lg="4">
        <EquipmentCard :product="product" />
      </v-col>
    </v-row>
  </template>
</template>
