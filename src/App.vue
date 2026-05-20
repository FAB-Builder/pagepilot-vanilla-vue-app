<script setup lang="ts">
import QuickGuideCard from './components/QuickGuideCard.vue'

const projectName = 'App Banner Demo'

// Banner pairs: each entry maps a mobile identifier to its desktop counterpart
const banners = [
  { title: 'Channel',   mobileIdentifier: 'CHANNEL_M',  identifier: 'COMMUNICATION_CHANNEL' },
  { title: 'Insight',   mobileIdentifier: 'INSIGHT_M',  identifier: 'INSIGHT' },
  { title: 'Gallery',   mobileIdentifier: 'GALLERY_M',  identifier: 'GALLERY' },
  { title: 'Form',      mobileIdentifier: 'FORM_M',     identifier: 'FUNNEL' },
  { title: 'General',   mobileIdentifier: 'GENERAL_M',  identifier: '#FUNNELS' },
  { title: 'Apps',      mobileIdentifier: 'APPS_M',     identifier: 'APPS' },
  { title: 'Workflow',  mobileIdentifier: 'WORKFLOW_M', identifier: 'WORKFLOW' },
  { title: 'Chat',      mobileIdentifier: 'CHAT_M',     identifier: 'TAGS' },
  { title: 'Contact',   mobileIdentifier: 'CONTACT_M',  identifier: 'CONTACT' },
]
</script>

<template>
  <div class="container">
    <h1 class="project-name">{{ projectName }}</h1>

    <QuickGuideCard :banners="banners" wrapper-class-name="banner-card" />
  </div>
</template>

<!-- <style scoped>
.container {
  /* max-width: 800px; */
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}
.project-name {
  font-size: 2rem;
  color: #42b883;
  text-align: center;
  margin-bottom: 2rem;
}
.banner-card {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style> -->
