<script setup>
/** Filtereingaben; Datenauswahl und Requests bleiben in der View. */
defineProps({
  categories: { type: Array, required: true },
  subcategories: { type: Array, required: true },
  disabled: { type: Boolean, default: false },
})
const search = defineModel('search', { type: String, default: '' })
const categoryId = defineModel('categoryId', { type: Number, default: null })
const subcategoryId = defineModel('subcategoryId', { type: Number, default: null })
defineEmits(['reset'])
</script>

<template>
  <v-row class="mb-2">
    <v-col cols="12" md="5">
      <v-text-field
        v-model="search" label="Name oder Produktcode suchen" prepend-inner-icon="mdi-magnify"
        :disabled="disabled" clearable hide-details @click:clear="search = ''"
      />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-select
        v-model="categoryId" :items="categories" item-title="name" item-value="id"
        label="Kategorie" :disabled="disabled" clearable hide-details no-data-text="Keine Kategorien vorhanden"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-select
        v-model="subcategoryId" :items="subcategories" item-title="name" item-value="id"
        label="Unterkategorie" :disabled="disabled || categoryId == null" clearable hide-details
        :placeholder="categoryId == null ? 'Zuerst Kategorie wählen' : 'Alle Unterkategorien'"
        no-data-text="Keine Unterkategorien vorhanden"
      />
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn variant="text" prepend-icon="mdi-filter-remove-outline" :disabled="disabled" @click="$emit('reset')">
        Filter zurücksetzen
      </v-btn>
    </v-col>
  </v-row>
</template>
