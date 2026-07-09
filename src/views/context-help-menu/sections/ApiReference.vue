<script setup lang="ts">
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';

const FIELDS: [string, string, string][] = [
  ['id', 'string', 'Unique identifier for the menu item.'],
  ['name', 'string', 'Label shown in the drawer sidebar.'],
  ['description', 'string', 'Optional subtitle shown below the name.'],
  ['href', 'string', 'Slug of the Page Pilot page rendered when this item is clicked. Leave empty for category-only items.'],
  ['menuImage', 'string', 'Optional image URL displayed alongside the item.'],
  ['parentId', 'string | null', 'ID of the parent item, or null for root items.'],
  ['depth', 'number', 'Nesting level: 0 = root, 1 = child, 2 = grandchild …'],
  ['index', 'number', 'Sort order within the parent. Lower values appear first.'],
  ['children', 'HelpItem[]', 'Nested sub-items. Empty array for leaf nodes.'],
];
</script>

<template>
  <Section id="api-reference" title="API reference">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th class="pb-2 pr-6">Field</th>
            <th class="pb-2 pr-6">Type</th>
            <th class="pb-2">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          <tr v-for="[field, type, desc] in FIELDS" :key="field">
            <td class="py-2 pr-6 font-mono">
              <Code>{{ field }}</Code>
            </td>
            <td class="py-2 pr-6 font-mono text-xs text-slate-500">{{ type }}</td>
            <td class="py-2">{{ desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mb-2 mt-6 font-semibold text-slate-800">Endpoint</h3>
    <pre class="rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700">GET /api/tenant/{WORKSPACE_ID}/menu-by-name/{MENU_NAME}</pre>
    <p class="mt-2">
      <Code>MENU_NAME</Code> is the name you gave your menu in
      <a
        href="https://pagepilot.fabbuilder.com/menu"
        target="_blank"
        rel="noreferrer"
        class="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
      >
        Page Pilot → Menus
      </a>
      . Returns a <Code>MenuApiResponse</Code> object; the drawer consumes
      <Code>response.configuration</Code> — the root array of <Code>HelpItem</Code> nodes.
    </p>
    <p>
      No authentication is required for this endpoint. Responses are safe to cache at the session
      level (the default AHDjs TTL is 1 hour).
    </p>
  </Section>
</template>
