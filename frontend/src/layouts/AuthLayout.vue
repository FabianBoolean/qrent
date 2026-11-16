<script setup>
import AppVersion from '@/components/common/AppVersion.vue'
</script>

<template>
  <v-main>
    <v-container class="fill-height d-flex align-center justify-center pa-4">
      <div class="auth-content">
        <RouterView />
        <AppVersion />
      </div>
    </v-container>
  </v-main>
</template>

<style scoped>
.auth-content {
  width: 100%;
  max-width: 460px;
}
</style>
