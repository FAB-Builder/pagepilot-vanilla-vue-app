<script setup lang="ts">
</script>

<template>
  <div class="app-layout">
    <nav class="tab-nav">
      <RouterLink to="/" class="tab-link" exact-active-class="tab-link--active">Home</RouterLink>
      <RouterLink to="/tour" class="tab-link" active-class="tab-link--active">Tour</RouterLink>
      <RouterLink to="/tooltip" class="tab-link" active-class="tab-link--active">Tooltip</RouterLink>
      <RouterLink to="/app-banner" class="tab-link" active-class="tab-link--active">App Banner</RouterLink>
    </nav>
    <div class="tab-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-layout {
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

.tab-nav {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  background: #fff;
  padding: 0 24px;
}

.tab-link {
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}

.tab-link:hover {
  color: #111827;
}

.tab-link--active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}

.tab-content {
  padding: 24px;
}
</style>
