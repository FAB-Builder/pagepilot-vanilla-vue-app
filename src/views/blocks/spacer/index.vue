<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '../../../components/doc/Section.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'height', label: 'Height' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Spacer" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Spacer Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Blank vertical space. One setting: how tall.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          Use a Spacer when you want breathing room that isn't tied to any particular block's
          margin. For a visible separating line, use <strong>Divider</strong> instead.
        </p>
        <BlockCallout variant="tip" title="Spacer vs. margin">
          A block's own margin is usually the better tool — it moves with the block when you
          reorder the page. Reach for a Spacer when the gap belongs to the layout rather than to
          either neighbour.
        </BlockCallout>
      </Section>

      <Section id="height" title="Height">
        <PropertyCard type="number (0–128)" default-value="16">
          <strong>Height</strong> — in px, clamped to this range.
        </PropertyCard>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Height can differ per device — a 64px gap that works on desktop is often too much on a
          phone. Each device falls back to <strong>Desktop</strong> when unset; Tablet and
          Mobile are independent.
        </p>
      </Section>
    </article>
  </DocLayout>
</template>
