<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** Gemeinsame Einträge als horizontale Navigation oder mobile Liste. */
const props = defineProps({
  items: { type: Array, required: true },
  mobile: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])
const route = useRoute()
const router = useRouter()
const groups = computed(() => [
  { key: 'primary', title: 'Navigation' },
  { key: 'management', title: 'Verwaltung' },
  { key: 'additional', title: 'Weitere Bereiche' },
].map((group) => ({ ...group, items: props.items.filter((item) => item.group === group.key) }))
  .filter((group) => group.items.length))

/**
 * Markiert auch Detailseiten unter ihrem übergeordneten Navigationsziel.
 * @param {Object} item Navigationseintrag.
 * @returns {boolean} Ob das Ziel zur aktuellen Seite gehört.
 */
function isActive(item) {
  const path = router.resolve(item.to).path
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav v-if="mobile" aria-label="Mobile Hauptnavigation">
    <v-list nav density="comfortable" aria-label="Seiten">
      <template v-for="group in groups" :key="group.key">
        <v-list-subheader>{{ group.title }}</v-list-subheader>
        <v-list-item
          v-for="item in group.items" :key="item.name" :to="item.to"
          :title="item.title" :prepend-icon="item.icon" :active="isActive(item)"
          class="navigation-entry" color="navigation" base-color="navigation" :ripple="false"
          active-class="navigation-entry--active" @click="emit('navigate')"
        />
      </template>
    </v-list>
  </nav>
  <nav v-else class="desktop-navigation d-flex align-center" aria-label="Hauptnavigation">
    <template v-for="group in groups" :key="group.key">
      <template v-if="group.key === 'primary'">
        <v-btn
          v-for="item in group.items" :key="item.name" :to="item.to"
          :active="isActive(item)" color="navigation" variant="text" size="small" :ripple="false"
          class="navigation-entry" :class="{ 'navigation-entry--active': isActive(item) }"
        >{{ item.title }}</v-btn>
      </template>
      <v-menu v-else>
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps" size="small" append-icon="mdi-chevron-down"
            variant="text" color="navigation" class="navigation-entry" :ripple="false"
            :class="{ 'navigation-entry--active': group.items.some(isActive) }"
          >{{ group.key === 'management' ? 'Verwaltung' : 'Mehr' }}</v-btn>
        </template>
        <v-list :aria-label="group.title" min-width="240">
          <v-list-item
            v-for="item in group.items" :key="item.name" :to="item.to"
            :title="item.title" :prepend-icon="item.icon" :active="isActive(item)"
            class="navigation-entry" color="navigation" base-color="navigation" active-class="navigation-entry--active" :ripple="false"
          />
        </v-list>
      </v-menu>
    </template>
  </nav>
</template>

<style scoped>
.navigation-entry {
  position: relative;
  border-radius: 0 !important;
}

.desktop-navigation,
.desktop-navigation > .navigation-entry {
  height: 100%;
}

.navigation-entry:hover {
  background-color: rgb(var(--v-theme-surface));
}

.navigation-entry:focus-visible {
  outline: 2px solid rgb(var(--v-theme-navigation-indicator));
  outline-offset: -2px;
}

.navigation-entry--active::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  border-radius: 0;
  background: rgb(var(--v-theme-navigation-indicator));
  pointer-events: none;
}

/* Hover verwendet eine weiße Fläche; Vuetify-Overlays und Klickwellen entfallen. */
.navigation-entry :deep(.v-btn__overlay),
.navigation-entry :deep(.v-list-item__overlay) {
  opacity: 0;
}
</style>
