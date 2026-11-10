<script setup>
// Ausschließlich die ausdrücklich vorgesehenen Mock-Zugänge der Entwicklungsumgebung.
const users = [
  { email: 'schueler1@tgm.ac.at', password: 'student123' },
  { email: 'schueler2@tgm.ac.at', password: 'student123' },
  { email: 'lehrer1@tgm.ac.at', password: 'teacher123' },
  { email: 'lehrer2@tgm.ac.at', password: 'teacher123' },
  { email: 'admin1@tgm.ac.at', password: 'admin123' },
  { email: 'admin2@tgm.ac.at', password: 'admin123' },
]
</script>

<template>
  <section aria-label="Entwicklungszugänge" class="mt-2 text-caption">
    <v-table density="compact" class="development-users text-caption">
      <thead>
        <tr><th scope="col">E-Mail</th><th scope="col">Passwort</th></tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.email">
          <td class="text-break">{{ user.email }}</td>
          <td><code>{{ user.password }}</code></td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>

<style scoped>
.development-users {
  --v-table-header-height: 24px;
  --v-table-row-height: 24px;
}

.development-users :deep(th),
.development-users :deep(td) {
  padding: 2px 6px;
}

.development-users code {
  font: inherit;
}
</style>
