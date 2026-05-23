<script setup lang="ts">
import QuickGuideCard from '../components/QuickGuideCard.vue'

const banners = [
  { title: 'Channel',  mobileIdentifier: 'CHANNEL_M',  identifier: 'COMMUNICATION_CHANNEL' },
  { title: 'Insight',  mobileIdentifier: 'INSIGHT_M',  identifier: 'INSIGHT' },
  { title: 'Gallery',  mobileIdentifier: 'GALLERY_M',  identifier: 'GALLERY' },
  { title: 'Form',     mobileIdentifier: 'FORM_M',     identifier: 'FUNNEL' },
  { title: 'General',  mobileIdentifier: 'GENERAL_M',  identifier: '#FUNNELS' },
  { title: 'Apps',     mobileIdentifier: 'APPS_M',     identifier: 'APPS' },
  { title: 'Workflow', mobileIdentifier: 'WORKFLOW_M', identifier: 'WORKFLOW' },
  { title: 'Chat',     mobileIdentifier: 'CHAT_M',     identifier: 'TAGS' },
  { title: 'Contact',  mobileIdentifier: 'CONTACT_M',  identifier: 'CONTACT' },
]
</script>

<template>
  <div>
    <h1 class="view-title">App Banner</h1>
    <QuickGuideCard :banners="banners" wrapper-class-name="banner-card" />
  </div>
</template>

<style scoped>
.view-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}
</style>
