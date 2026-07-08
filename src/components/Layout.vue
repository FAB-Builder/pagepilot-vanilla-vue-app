<script setup lang="ts">
import { ExternalLink } from '@lucide/vue';
import GithubIcon from './icons/GithubIcon.vue';
import PagePilotIcon from './icons/PagePilotIcon.vue';
import FloatingGoogleTranslator from './FloatingGoogleTranslator.vue';
import Toast from './Toast.vue';

const PAGEPILOT_URL = 'https://pagepilot.fabbuilder.com/';
const AHDJS_REPO_URL = 'https://github.com/ishaan-puniani/ahdjs';
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!-- Fixed header -->
    <header class="z-20 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-[1700px] items-center gap-2 px-4 sm:px-6">
        <RouterLink
          to="/"
          class="flex shrink-0 items-center gap-2 font-semibold text-ink"
          aria-label="PagePilot home"
        >
          <PagePilotIcon class="h-10 w-auto" />
        </RouterLink>

        <div class="ml-auto flex items-center gap-2">
          <a
            :href="PAGEPILOT_URL"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Open Page Pilot
            <ExternalLink :size="13" class="opacity-80" />
          </a>
          <a
            :href="AHDJS_REPO_URL"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
          >
            <GithubIcon class="h-3.5 w-3.5" />
            ahdjs
          </a>
        </div>
      </div>
    </header>

    <!-- Body: only the content area scrolls -->
    <div class="flex flex-1 overflow-hidden">
      <main class="scroll-slim flex-1 overflow-y-auto">
        <div class="mx-auto max-w-[1700px] px-4 pb-16 pt-8 sm:px-6">
          <RouterView />
        </div>
      </main>
    </div>

    <FloatingGoogleTranslator />
    <Toast />
  </div>
</template>
