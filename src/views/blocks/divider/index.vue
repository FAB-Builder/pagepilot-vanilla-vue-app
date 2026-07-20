<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '../../../components/doc/Section.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'style', label: 'Line style' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Divider" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Divider Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A horizontal rule for separating sections. Two settings — color and thickness — plus
          the spacing around it.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          Divider is the simplest way to break up a page visually. If you want blank space
          rather than a visible line, use the <strong>Spacer</strong> block instead.
        </p>
      </Section>

      <Section id="style" title="Line style">
        <PropertyCard type="color" default-value="#CCCCCC">
          <strong>Color</strong> — the line color, with a hex readout beside the swatch.
        </PropertyCard>
        <PropertyCard type="number" default-value="1">
          <strong>Thickness</strong> — line height in px.
        </PropertyCard>
      </Section>

      <Section id="spacing" title="Spacing">
        <PropertyCard type="per-side spacing" default-value="0 on all sides">
          <strong>Padding</strong> and <strong>Margin</strong> — the space around the line. This
          is usually what you actually want to adjust: a divider with no margin sits tight
          against neighbouring blocks.
        </PropertyCard>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Padding and margin can differ per device. Each device falls back to
          <strong>Desktop</strong> when unset; Tablet and Mobile are independent.
        </p>
        <BlockCallout title="Not per-device">
          Line color and thickness are shared across devices — a divider looks the same
          everywhere, only its spacing changes.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
