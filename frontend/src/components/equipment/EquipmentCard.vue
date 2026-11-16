<script setup>
/** Einzelne Produktkarte mit realen Stammdaten, ohne erfundene Bilder oder Verfügbarkeit. */
defineProps({ product: { type: Object, required: true } })
</script>

<template>
  <v-card variant="outlined" class="h-100 d-flex flex-column">
    <v-card-text class="flex-grow-1">
      <div class="text-caption text-medium-emphasis mb-2">Produktcode {{ product.code }}</div>
      <h2 class="text-h6 mb-3 text-break">
        <RouterLink :to="{ name: 'equipment-detail', params: { id: product.id } }" class="text-navigation">
          {{ product.name }}
        </RouterLink>
      </h2>
      <p class="text-body-2 mb-1">{{ product.category.name }}</p>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ product.subcategory.name }}</p>
      <v-chip size="small" prepend-icon="mdi-package-variant-closed">
        {{ product.itemCount }} {{ product.itemCount === 1 ? 'Exemplar' : 'Exemplare' }} insgesamt
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-btn :to="{ name: 'equipment-detail', params: { id: product.id } }" color="primary" :aria-label="`Details zu ${product.name}`">
        Details ansehen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
