<script setup>
import logo from '@/assets/qrent-logo.png'
</script>

<template>
  <header class="header">
    <RouterLink to="/">
      <img :src="logo" alt="QRent – zur Startseite" class="logo" />
    </RouterLink>

    <nav class="nav">
      <RouterLink to="/">Startseite</RouterLink>
      <RouterLink to="/ausleihen">Ausleihen</RouterLink>
      <RouterLink to="/rueckgabe">Rückgabe</RouterLink>
      <RouterLink to="/inventar">Inventar</RouterLink>
      <RouterLink to="/tutorials">Tutorials</RouterLink>
      <RouterLink to="/verleihungen">Aktuelle Verleihungen</RouterLink>
      <RouterLink to="/logs">Logs</RouterLink>
    </nav>
        <span class="version">QRent v0.1</span>
  </header>

  <main class="content">
    <RouterView />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 16px;
  border-bottom: 1px solid black;
  position: sticky;
  top: 0;
  background: white;
}

.logo {
  height: 40px;
  display: block;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.nav a {
  color: black;
}

.nav a.router-link-exact-active {
  font-weight: bold;
}

.content {
  max-width: 800px;
  margin: 24px auto;
  padding: 16px;
  border: 1px solid black;
}
.version {
  margin-left: auto;
}
</style>
