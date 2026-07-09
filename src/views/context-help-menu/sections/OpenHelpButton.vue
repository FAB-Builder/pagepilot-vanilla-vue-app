<script setup lang="ts">
/**
 * Trigger button + live floating help drawer. Port of React's
 * `OpenHelpButton` (which owns `open` state and mounts `HelpDrawerDemo`)
 * from sections/LiveDemo.tsx. Rendered standalone in the page header
 * (see ../index.vue), exactly like React renders <OpenHelpButton /> in
 * index.tsx's header — decoupled from the "Live demo" Section anchor.
 *
 * Fetches the real "fab-docs-site" menu from Page Pilot, caches it in
 * localStorage, and renders a right-anchored drawer teleported to
 * <body> via <Teleport to="body"> — the Vue equivalent of React's
 * createPortal(..., document.body).
 */
import { ref, reactive, computed, watch } from 'vue';
import { ChevronLeft, X, CircleQuestionMark, LoaderCircle, CircleAlert, FileX } from '@lucide/vue';
import HelpMenuTree from './HelpMenuTree.vue';
import { pagePilotApiBase } from '../../../lib/ahd';

const API_BASE = pagePilotApiBase('64d2b934c6cfdc96aa3734c5');
const MENU_API = `${API_BASE}/menu-by-name/fab-docs-site`;
const CACHE_KEY = 'pp_help_menu_fab_docs_site';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — same as ahd-fe useStickyState

interface HelpItem {
  id: string;
  name: string;
  description?: string;
  href?: string;
  children: HelpItem[];
}

interface PageSection {
  id: string;
  content: string;
}
interface PageContent {
  id?: string;
  name?: string;
  editor?: string;
  sections?: PageSection[];
}

function flattenItems(items: HelpItem[]): HelpItem[] {
  return items.flatMap((item) => [item, ...flattenItems(item.children ?? [])]);
}

function readCache(): HelpItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: HelpItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

/* ── Trigger open/close state ── */
const open = ref(false);

/* ── Drawer state ── */
const cached = readCache();
const menuItems = ref<HelpItem[]>(cached ?? []);
const menuLoading = ref(!cached);
const menuError = ref<string | null>(null);

const activeId = ref('');
const expanded = reactive(new Set<string>());
const query = ref('');

const pageContent = ref<PageContent | null>(null);
const pageLoading = ref(false);
const pageError = ref<string | null>(null);

const overlayRef = ref<HTMLDivElement | null>(null);

function loadMenu() {
  if (cached) return;
  fetch(MENU_API)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      const items = data.configuration ?? [];
      menuItems.value = items;
      writeCache(items);
      menuLoading.value = false;
    })
    .catch((err) => {
      menuError.value = err.message;
      menuLoading.value = false;
    });
}

// Fetch the menu (only if not cached) the first time the drawer is opened —
// mirrors React's useEffect(() => { if (open) fetchMenu... }, []) which ran
// on mount of HelpDrawerDemo (itself only mounted once `open` became true).
let menuRequested = false;
watch(open, (isOpen) => {
  if (isOpen && !menuRequested) {
    menuRequested = true;
    loadMenu();
  }
});

const allItems = computed(() => flattenItems(menuItems.value));
const activeItem = computed(() => allItems.value.find((it) => it.id === activeId.value));

// Fetch page content when an item with an href is selected.
watch(activeId, () => {
  const item = activeItem.value;
  if (!item?.href) {
    pageContent.value = null;
    pageError.value = null;
    return;
  }
  pageLoading.value = true;
  pageContent.value = null;
  pageError.value = null;
  const slug = item.href.replace(/^\/+/, '');
  fetch(`${API_BASE}/pagebypath/${slug}`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      pageContent.value = data;
      pageLoading.value = false;
    })
    .catch((err) => {
      pageError.value = err.message;
      pageLoading.value = false;
    });
});

function toggleExpand(id: string) {
  if (expanded.has(id)) expanded.delete(id);
  else expanded.add(id);
}

function handleSelect(item: HelpItem) {
  activeId.value = item.id;
  if ((item.children ?? []).length > 0) expanded.add(item.id);
}

function handleBack() {
  activeId.value = '';
  pageContent.value = null;
  pageError.value = null;
}

function retryPage() {
  const id = activeId.value;
  activeId.value = '';
  setTimeout(() => {
    activeId.value = id;
  }, 0);
}

const filtered = computed(() => {
  const q = query.value.trim();
  if (!q) return menuItems.value;
  const lower = q.toLowerCase();
  return allItems.value.filter(
    (it) => it.name.toLowerCase().includes(lower) || it.description?.toLowerCase().includes(lower),
  );
});

const showContent = computed(() => !!activeId.value && !!activeItem.value?.href);

function onOverlayClick(e: MouseEvent) {
  if (e.target === overlayRef.value) closeDrawer();
}

function openDrawer() {
  open.value = true;
}

function closeDrawer() {
  open.value = false;
}
</script>

<template>
  <button
    type="button"
    @click="openDrawer"
    class="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
  >
    <CircleQuestionMark :size="16" />
    Open Help Drawer
  </button>

  <!-- Teleported drawer — Vue's equivalent of React's createPortal(..., document.body) -->
  <Teleport to="body">
    <div
      v-if="open"
      ref="overlayRef"
      @click="onOverlayClick"
      style="position: fixed; inset: 0; z-index: 1300; background: rgba(0, 0, 0, 0.35); display: flex; justify-content: flex-end"
    >
      <div
        style="position: relative; width: min(45vw, 540px); min-width: 360px; height: 100%; background: #fff; display: flex; flex-direction: column; box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12)"
      >
        <!-- Close — absolute top-right of panel -->
        <button
          type="button"
          @click="closeDrawer"
          style="position: absolute; top: 8px; right: 12px; z-index: 999; background: transparent; border: none; cursor: pointer; color: #5550ff; display: flex; align-items: center; padding: 4px"
        >
          <X :size="18" />
        </button>

        <!-- ── Content view ── -->
        <div v-if="showContent" style="display: flex; flex-direction: column; height: 100%">
          <!-- Header with back -->
          <div
            style="position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid #e5e7eb; padding: 10px 48px 10px 12px; display: flex; align-items: center; gap: 8px; min-height: 46px"
          >
            <button
              type="button"
              @click="handleBack"
              style="background: transparent; border: none; cursor: pointer; display: flex; align-items: center; padding: 2px; flex-shrink: 0; line-height: 1"
            >
              <ChevronLeft :size="20" :stroke-width="2.5" color="#5550ff" />
            </button>
            <span
              style="font-size: 16px; font-weight: 600; color: #111827; line-height: 1.3; word-break: break-word; overflow-wrap: break-word"
            >
              {{ activeItem?.name }}
            </span>
          </div>

          <!-- Content body -->
          <div style="flex: 1; overflow-y: auto; background-color: #fff">
            <div
              v-if="pageLoading"
              style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 32px; gap: 12px"
            >
              <LoaderCircle :size="28" color="#5550ff" class="animate-spin" />
            </div>
            <div
              v-else-if="pageError"
              style="display: flex; flex-direction: column; align-items: center; padding: 40px 32px; gap: 12px; text-align: center"
            >
              <CircleAlert :size="40" color="#f87171" />
              <p style="font-size: 14px; color: #dc2626; margin: 0">Error loading content: {{ pageError }}</p>
              <button
                @click="retryPage"
                style="padding: 9px 22px; background: #5550ff; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer"
              >
                Retry
              </button>
            </div>
            <div
              v-else-if="pageContent"
              style="font-size: 15px; line-height: 1.7; color: #374151; padding: 20px; word-break: break-word; overflow-wrap: break-word"
            >
              <div v-for="sec in pageContent.sections" :key="sec.id" v-html="sec.content" />
            </div>
            <div
              v-else
              style="display: flex; flex-direction: column; align-items: center; padding: 40px 32px; gap: 12px; text-align: center"
            >
              <FileX :size="40" color="#d1d5db" />
              <p style="font-size: 14px; color: #6b7280; margin: 0">No content available for this topic.</p>
              <p v-if="activeItem?.href" style="font-size: 12px; color: #9ca3af; margin: 0">
                Reference: {{ activeItem.href }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── Menu list view ── -->
        <div v-else style="display: flex; flex-direction: column; height: 100%">
          <!-- Title -->
          <div style="padding: 16px 48px 8px 16px">
            <span style="font-size: 16px; font-weight: 600; color: #111827">Help &amp; Support</span>
          </div>

          <!-- Search -->
          <div style="border-bottom: 1px solid #e5e7eb; background: #fff; position: sticky; top: 0; z-index: 20">
            <div style="padding: 10px 14px">
              <div style="position: relative">
                <input
                  type="text"
                  v-model="query"
                  placeholder="Search"
                  style="
                    width: 100%;
                    padding: 8px 32px 8px 32px;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 14px;
                    background: #fff
                      url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%239ca3af&quot; stroke-width=&quot;2&quot;><circle cx=&quot;11&quot; cy=&quot;11&quot; r=&quot;8&quot;/><path d=&quot;m21 21-4.35-4.35&quot;/></svg>')
                      no-repeat 8px center;
                    outline: none;
                    color: #111827;
                    box-sizing: border-box;
                  "
                />
                <button
                  v-if="query"
                  @click="query = ''"
                  style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; font-size: 18px; color: #9ca3af; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Section label -->
          <span
            style="padding: 10px 0 7px 15px; border-bottom: 1px solid #e5e7eb; color: #374151; display: block; font-size: 13px; font-weight: 500"
          >
            {{ query ? `Search Results (${filtered.length})` : 'All Topics' }}
          </span>

          <!-- Items -->
          <div style="flex: 1; overflow-y: auto; padding-bottom: 24px">
            <div
              v-if="menuLoading"
              style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 40px 20px; color: #9ca3af"
            >
              <LoaderCircle :size="18" color="#5550ff" class="animate-spin" /> Loading…
            </div>
            <div v-else-if="menuError" style="padding: 40px 20px; text-align: center; color: #dc2626; font-size: 14px">
              Failed to load: {{ menuError }}
            </div>
            <div
              v-else-if="filtered.length === 0"
              style="padding: 40px 20px; text-align: center; color: #6b7280"
            >
              <p style="margin-bottom: 16px; font-size: 14px">No results for "{{ query }}"</p>
              <button
                @click="query = ''"
                style="padding: 8px 16px; background: #5550ff; color: #fff; border: none; border-radius: 6px; font-size: 14px; cursor: pointer"
              >
                Clear search
              </button>
            </div>
            <template v-else>
              <template v-if="query.trim()">
                <div
                  v-for="item in filtered"
                  :key="item.id"
                  @click="handleSelect(item)"
                  :style="{
                    borderBottom: '1px solid #e5e7eb',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: activeId === item.id ? '#5550ff' : '#374151',
                  }"
                >
                  {{ item.name }}
                </div>
              </template>
              <HelpMenuTree
                v-else
                :items="filtered"
                :active-id="activeId"
                :expanded="expanded"
                @select="handleSelect"
                @toggle="toggleExpand"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
