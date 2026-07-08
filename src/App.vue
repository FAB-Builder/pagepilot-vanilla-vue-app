<script setup lang="ts">
// The 4-tab nav shell that used to live here has been replaced entirely by
// `components/Layout.vue`, mounted as the router's top-level parent route
// (matching React's <Route element={<Layout />}> wrapper in App.tsx). This
// component is now just the router outlet.
</script>

<template>
  <RouterView />
</template>
