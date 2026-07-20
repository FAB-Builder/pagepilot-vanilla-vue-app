<script setup lang="ts">
/**
 * Ctrl+K command-palette-style search dropdown. Port of React's SearchBar.tsx.
 *
 * Navigation mirrors React's `navigate(path)` + delayed hash-anchor scroll:
 * push the path first via the router, then — once the target route has had a
 * chance to mount — set the `#section` hash via `history.replaceState` and
 * scroll the element into view. The double `requestAnimationFrame` +
 * `setTimeout(60)` wait matches React's original timing.
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, X, CornerDownLeft } from '@lucide/vue';
import { SEARCH_INDEX, type SearchEntry } from '../searchIndex';

const props = withDefaults(defineProps<{ autoFocus?: boolean }>(), {
  autoFocus: false,
});

const emit = defineEmits<{ navigate: [] }>();

function normalize(s: string) {
  return s.toLowerCase();
}

function scoreEntry(entry: SearchEntry, q: string): number {
  const title = normalize(entry.title);
  const module = normalize(entry.module);
  const keywords = entry.keywords ? normalize(entry.keywords) : '';

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (module.includes(q)) return 40;
  if (keywords.includes(q)) return 20;
  return 0;
}

const query = ref('');
const open = ref(false);
const activeIndex = ref(0);
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const router = useRouter();

const results = computed<SearchEntry[]>(() => {
  const q = normalize(query.value.trim());
  if (!q) return [];
  return SEARCH_INDEX.map((entry) => ({ entry, score: scoreEntry(entry, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9)
    .map((r) => r.entry);
});

watch(query, () => {
  activeIndex.value = 0;
});

onMounted(() => {
  if (props.autoFocus) inputRef.value?.focus();
});

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

function handleShortcut(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    inputRef.value?.focus();
    open.value = true;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleShortcut);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleShortcut);
});

function goTo(entry: SearchEntry) {
  const [path, hash] = entry.to.split('#');
  router.push(path ?? entry.to);
  if (hash) {
    // Let the route mount before scrolling to the section anchor.
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.history.replaceState(null, '', `#${hash}`);
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  }
  query.value = '';
  open.value = false;
  inputRef.value?.blur();
  emit('navigate');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter' && results.value[activeIndex.value]) {
    goTo(results.value[activeIndex.value]!);
  } else if (e.key === 'Escape') {
    open.value = false;
    inputRef.value?.blur();
  }
}

function clearQuery() {
  query.value = '';
  open.value = false;
  inputRef.value?.focus();
}
</script>

<template>
  <div ref="containerRef" :class="`relative w-full ${autoFocus ? '' : 'max-w-sm'}`">
    <div class="relative">
      <Search :size="14" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        ref="inputRef"
        type="text"
        v-model="query"
        @input="open = true"
        @focus="open = true"
        @keydown="onKeydown"
        placeholder="Search docs, modules, sections..."
        aria-label="Search documentation"
        class="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-14 text-[13px] text-ink placeholder:text-slate-400 outline-none transition-colors focus:border-brand"
      />
      <button
        v-if="query"
        type="button"
        @click="clearQuery"
        aria-label="Clear search"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        <X :size="14" />
      </button>
      <kbd
        v-else
        class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400"
      >
        Ctrl K
      </kbd>
    </div>

    <div
      v-if="open && query"
      class="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-soft"
    >
      <p v-if="results.length === 0" class="px-3 py-2.5 text-[13px] text-slate-400">
        No results for "{{ query }}"
      </p>
      <template v-else>
        <button
          v-for="(entry, i) in results"
          :key="entry.to"
          type="button"
          @mouseenter="activeIndex = i"
          @click="goTo(entry)"
          :class="[
            'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-[13px] transition-colors',
            i === activeIndex ? 'bg-brand-tint text-brand' : 'text-ink',
          ]"
        >
          <span class="truncate">{{ entry.title }}</span>
          <span class="flex shrink-0 items-center gap-1.5">
            <span class="truncate text-[11px] text-slate-400">{{ entry.module }}</span>
            <CornerDownLeft v-if="i === activeIndex" :size="12" class="text-slate-400" />
          </span>
        </button>
      </template>
    </div>
  </div>
</template>
