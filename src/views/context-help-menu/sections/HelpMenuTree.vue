<script setup lang="ts">
/**
 * Recursive help-menu tree used by the live drawer in LiveDemo.vue.
 * Port of React's local `MenuTree` component — a self-referencing
 * (recursive) component, which Vue SFCs support out of the box via the
 * component's registered `name` (inferred here from the filename).
 */
import { ChevronDown, ChevronUp } from '@lucide/vue';

interface HelpItem {
  id: string;
  name: string;
  description?: string;
  href?: string;
  children: HelpItem[];
}

withDefaults(
  defineProps<{
    items: HelpItem[];
    activeId: string;
    expanded: Set<string>;
    depth?: number;
  }>(),
  {
    depth: 0,
  },
);

const emit = defineEmits<{
  select: [item: HelpItem];
  toggle: [id: string];
}>();

const BRAND = '#5550ff';
const BRAND_TINT = '#eef2ff';
const GREY_200 = '#e5e7eb';
</script>

<template>
  <template v-for="item in items" :key="item.id">
    <div v-if="depth === 0" :style="{ borderBottom: `1px solid ${GREY_200}` }">
      <div
        @click="emit('select', item)"
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          cursor: 'pointer',
          backgroundColor: activeId === item.id ? BRAND_TINT : 'transparent',
          transition: 'background 0.15s',
        }"
      >
        <span
          :style="{
            flex: 1,
            fontSize: '14px',
            fontWeight: 500,
            color: activeId === item.id ? BRAND : '#374151',
          }"
        >
          {{ item.name }}
        </span>
        <span
          v-if="(item.children ?? []).length > 0"
          @click.stop="emit('toggle', item.id)"
          style="color: #9ca3af; display: flex; align-items: center; cursor: pointer"
        >
          <ChevronUp v-if="expanded.has(item.id)" :size="15" />
          <ChevronDown v-else :size="15" />
        </span>
      </div>
      <div
        v-if="(item.children ?? []).length > 0 && expanded.has(item.id)"
        style="display: flex; flex-direction: column; gap: 8px; padding: 10px; background-color: #f9fafb; border-radius: 8px; margin: 0 8px 8px"
      >
        <HelpMenuTree
          :items="item.children"
          :active-id="activeId"
          :expanded="expanded"
          :depth="depth + 1"
          @select="(it) => emit('select', it)"
          @toggle="(id) => emit('toggle', id)"
        />
      </div>
    </div>

    <div v-else>
      <div
        @click="emit('select', item)"
        :style="{
          padding: '7px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          color: activeId === item.id ? BRAND : '#4b5563',
          backgroundColor: activeId === item.id ? BRAND_TINT : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: activeId === item.id ? 500 : 400,
          fontSize: '13px',
          transition: 'all 0.15s',
        }"
      >
        <span
          :style="{ flex: 1, fontSize: '13px', color: activeId === item.id ? BRAND : '#4b5563' }"
        >
          {{ item.name }}
        </span>
        <span
          v-if="(item.children ?? []).length > 0"
          @click.stop="emit('toggle', item.id)"
          style="color: #9ca3af; display: flex; align-items: center; cursor: pointer"
        >
          <ChevronUp v-if="expanded.has(item.id)" :size="13" />
          <ChevronDown v-else :size="13" />
        </span>
      </div>
      <div
        v-if="(item.children ?? []).length > 0 && expanded.has(item.id)"
        style="padding-left: 10px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px"
      >
        <HelpMenuTree
          :items="item.children"
          :active-id="activeId"
          :expanded="expanded"
          :depth="depth + 1"
          @select="(it) => emit('select', it)"
          @toggle="(id) => emit('toggle', id)"
        />
      </div>
    </div>
  </template>
</template>
