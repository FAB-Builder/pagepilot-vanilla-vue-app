import { PAGEPILOT_API_HOST } from '../../lib/ahd';

export const FETCH_MENU_CODE = `// WORKSPACE_ID  — your workspace id from pagepilot.fabbuilder.com/tenant
// MENU_NAME     — the name you gave your menu in Page Pilot → Menus
const PAGEPILOT_API = '${PAGEPILOT_API_HOST}/tenant/YOUR_WORKSPACE_ID';

async function fetchMenu(menuName) {
  const res = await fetch(\`\${PAGEPILOT_API}/menu-by-name/\${menuName}\`);
  if (!res.ok) throw new Error(\`Failed to fetch: \${res.status}\`);
  const data = await res.json();
  return data.configuration; // HelpItem[]
}

// Usage — pass the exact name of your menu:
const items = await fetchMenu('my-help-menu');`;

export const FETCH_PAGE_CODE = `// When a menu item is clicked, fetch the linked page by its href (slug).
// The endpoint is:  GET /pagebypath/{slug}

const PAGEPILOT_API = '${PAGEPILOT_API_HOST}/tenant/YOUR_WORKSPACE_ID';

async function fetchPageByPath(slug) {
  const res = await fetch(\`\${PAGEPILOT_API}/pagebypath/\${slug}\`);
  if (!res.ok) throw new Error(\`Failed to fetch page: \${res.status}\`);
  return res.json(); // Page object
}

// The page object contains a sections array.
// Each section has a content field (HTML string).
// Render each section in order:
const page = await fetchPageByPath('help/getting-started');

page.sections.forEach((section) => {
  // render section.content as raw HTML (sanitize with DOMPurify)
  container.innerHTML = DOMPurify.sanitize(section.content);
});`;

export const FULL_DRAWER_CODE = `<script setup>
import { ref, watch } from 'vue';
import DOMPurify from 'dompurify';

const PAGEPILOT_API = '${PAGEPILOT_API_HOST}/tenant/YOUR_WORKSPACE_ID';

const props = defineProps(['open', 'onClose', 'menuName']);

const menuItems = ref([]);
const activePage = ref(null);
const pageLoading = ref(false);

// Step 1 — fetch the menu tree
async function fetchMenu(menuName) {
  const res = await fetch(\`\${PAGEPILOT_API}/menu-by-name/\${menuName}\`);
  const data = await res.json();
  return data.configuration ?? []; // HelpItem[]
}

// Step 2 — fetch page content when an item is clicked
async function fetchPageByPath(slug) {
  const res = await fetch(\`\${PAGEPILOT_API}/pagebypath/\${slug}\`);
  if (!res.ok) throw new Error(\`\${res.status}\`);
  return res.json();
}

watch(
  () => props.open,
  (open) => {
    if (open) fetchMenu(props.menuName).then((items) => (menuItems.value = items));
  },
);

const handleItemClick = async (item) => {
  if (!item.href) return; // category header — no page
  pageLoading.value = true;
  activePage.value = null;
  try {
    activePage.value = await fetchPageByPath(item.href);
  } finally {
    pageLoading.value = false;
  }
};
<\/script>

<template>
  <div v-if="open" class="help-drawer">
    <button @click="onClose">✕</button>

    <div v-if="activePage">
      <button @click="activePage = null">← Back</button>
      <h2>{{ activePage.name }}</h2>
      <div
        v-for="section in activePage.sections"
        :key="section.id"
        v-html="DOMPurify.sanitize(section.content)"
      />
    </div>
    <p v-else-if="pageLoading">Loading…</p>
    <MenuTree v-else :items="menuItems" @select="handleItemClick" />
  </div>
</template>`;

export const CONFIGURE_MENU_CODE = `// 1. Go to Page Pilot → Menus → Create menu
// 2. Give it any name, e.g.  my-help-menu
// 3. Add top-level items, each with:
//    • Name  — label shown in the drawer
//    • Href  — slug of a Page Pilot page whose content opens when clicked
//    • Optional children for nested sections

// Example hierarchy that matches the API shape:
const exampleConfig = [
  {
    name: "Getting Started",
    href: "help/getting-started",   // ← must be a published page slug
    children: [
      { name: "Quick Setup",    href: "help/quick-setup",    children: [] },
      { name: "Configuration",  href: "help/configuration",  children: [] },
    ],
  },
  {
    name: "Tours",
    href: "help/tours",
    children: [
      { name: "Creating a Tour",  href: "help/creating-tour",  children: [] },
      { name: "Tour Analytics",   href: "help/tour-analytics", children: [] },
    ],
  },
];

// Fetch it by the name you chose:
const res = await fetch(
  'https://pagepilot.fabbuilder.com/api/tenant/YOUR_WORKSPACE_ID/menu-by-name/my-help-menu'
);
const { configuration } = await res.json(); // HelpItem[]`;
