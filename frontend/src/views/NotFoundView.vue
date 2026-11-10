<script setup>
import AppVersion from '@/components/common/AppVersion.vue'
</script>

<template>
  <v-main>
    <v-container class="qrent-container py-6">
      <v-card title="Seite nicht gefunden">
        <v-card-text>Die angeforderte Seite existiert nicht.</v-card-text>
        <v-card-actions>
          <v-btn to="/dashboard" color="primary">Zur Startseite</v-btn>
        </v-card-actions>
      </v-card>
      <AppVersion />
    </v-container>
  </v-main>
</template>
