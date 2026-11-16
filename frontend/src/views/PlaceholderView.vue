<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <h1 class="text-h5 mb-4">{{ route.meta.title }}</h1>
  <v-alert type="info" variant="tonal">
    Platzhalter: Dieser Bereich wird in einem späteren Schritt umgesetzt.
  </v-alert>
</template>
