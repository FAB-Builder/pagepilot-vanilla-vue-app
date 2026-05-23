<template>
  <div class="home">
    <h1 class="home-title">PagePilot Modules</h1>
    <p class="home-subtitle">Select a module to explore its demo</p>
    <div class="module-grid">
      <RouterLink to="/tour" class="module-card">
        <div class="module-icon">🗺️</div>
        <h2 class="module-name">Tour</h2>
        <p class="module-desc">Trigger product tours using application ID and slug</p>
      </RouterLink>
      <RouterLink to="/tooltip" class="module-card">
        <div class="module-icon">💬</div>
        <h2 class="module-name">Tooltip</h2>
        <p class="module-desc">Render contextual tooltips using application ID and slug</p>
      </RouterLink>
      <RouterLink to="/app-banner" class="module-card">
        <div class="module-icon">🖼️</div>
        <h2 class="module-name">App Banner</h2>
        <p class="module-desc">Display app banners using an identifier</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 32px;
}

.home-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.home-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 32px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.module-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: box-shadow 0.15s, border-color 0.15s;
  cursor: pointer;
}

.module-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.module-icon {
  font-size: 28px;
}

.module-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.module-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}
</style>
