<script setup lang="ts">
import { ref } from 'vue';
import { ExternalLink, Search, X } from '@lucide/vue';
import GithubIcon from './icons/GithubIcon.vue';
import PagePilotIcon from './icons/PagePilotIcon.vue';
import FloatingGoogleTranslator from './FloatingGoogleTranslator.vue';
import Toast from './Toast.vue';
import SearchBar from './SearchBar.vue';

const PAGEPILOT_URL = 'https://pagepilot.fabbuilder.com/';
const AHDJS_REPO_URL = 'https://github.com/ishaan-puniani/ahdjs';

const mobileSearchOpen = ref(false);
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

        <div class="ml-4 hidden flex-1 justify-center sm:flex">
          <SearchBar />
        </div>

        <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            @click="mobileSearchOpen = !mobileSearchOpen"
            :aria-label="mobileSearchOpen ? 'Close search' : 'Open search'"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-ink sm:hidden"
          >
            <X v-if="mobileSearchOpen" :size="16" />
            <Search v-else :size="16" />
          </button>
          <a
            :href="PAGEPILOT_URL"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:px-3"
          >
            <span class="hidden sm:inline">Open Page Pilot</span>
            <span class="sm:hidden">Open</span>
            <ExternalLink :size="13" class="opacity-80" />
          </a>
          <a
            :href="AHDJS_REPO_URL"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-ink sm:px-3"
          >
            <GithubIcon class="h-3.5 w-3.5" />
            <span class="hidden sm:inline">ahdjs</span>
          </a>
        </div>
      </div>

      <div v-if="mobileSearchOpen" class="border-t border-slate-200/80 px-4 py-2.5 sm:hidden">
        <SearchBar auto-focus @navigate="mobileSearchOpen = false" />
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
