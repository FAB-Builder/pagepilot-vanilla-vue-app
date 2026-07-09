<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createAhd, DEMO_APPLICATION_ID, type AhdInstance } from '../lib/ahd';
import type { BannerType } from './appBannerTypes';

const props = defineProps<{
  type: BannerType;
}>();

const ahdInstance = ref<AhdInstance | null>(null);
const rendered = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const renderBanner = async () => {
  error.value = null;
  loading.value = true;
  rendered.value = true;
  try {
    const ahd = createAhd({ applicationId: DEMO_APPLICATION_ID });
    ahdInstance.value = ahd;
    await ahd.initializeSiteMap(false);
    await ahd.renderAppBanner(props.type.identifier, true);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to render the banner.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.type.autoRender) {
    renderBanner();
  }
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2.5">
      <span class="rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand">
        {{ type.identifier }}
      </span>
      <button
        type="button"
        @click="renderBanner"
        :disabled="loading"
        class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {{ loading ? 'Fetching...' : type.autoRender ? 'Re-fetch' : 'Fetch & render' }}
      </button>
    </div>
    <p v-if="error" class="text-sm font-semibold text-rose-600">{{ error }}</p>
    <div v-if="type.value !== 'modal'" class="min-h-[60px] rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
      <div :id="type.identifier" />
      <p v-if="!rendered && !type.autoRender" class="text-sm text-slate-400">
        Click "Fetch &amp; render" to load the {{ type.name.toLowerCase() }}.
      </p>
    </div>
  </div>
</template>
