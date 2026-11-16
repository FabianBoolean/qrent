<script setup>
/** Produktübersicht ohne zusätzliche Requests; Detail-Links sind per Tastatur erreichbar. */
defineProps({ products: { type: Array, required: true } })
</script>

<template>
  <v-table aria-label="Equipment-Produkte">
    <thead>
      <tr>
        <th scope="col">Produktcode</th>
        <th scope="col">Produkt</th>
        <th scope="col">Kategorie</th>
        <th scope="col">Unterkategorie</th>
        <th scope="col" class="text-right">Exemplare</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.code }}</td>
        <td>
          <RouterLink :to="{ name: 'equipment-detail', params: { id: product.id } }" class="text-navigation">
            {{ product.name }}
          </RouterLink>
        </td>
        <td>{{ product.category.name }}</td>
        <td>{{ product.subcategory.name }}</td>
        <td class="text-right">{{ product.itemCount }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
