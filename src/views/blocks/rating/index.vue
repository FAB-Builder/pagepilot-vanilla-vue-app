<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '@/components/doc/Section.vue';
import Code from '@/components/doc/Code.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'value', label: 'Value & stars' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'text', label: 'Text & spacing' },
  { id: 'variables', label: 'Driving it with a variable' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Rating" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Rating Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A row of stars filled to a score — for review summaries, testimonials, and product
          ratings. Supports half stars.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          The block takes a <strong>value</strong> out of a <strong>max</strong> and draws that
          many filled stars, optionally with the number beside them. It's a display block — it
          shows a rating, it doesn't collect one.
        </p>
        <p>
          You'll find it under <strong>Support/Utility</strong> in the Add Block menu.
        </p>
        <BlockCallout variant="info" title="Read-only by design">
          There's no click-to-rate interaction. The published page is static HTML, so the stars
          render at whatever value you set (or whatever a variable resolves to). To collect
          ratings from visitors, use a form instead.
        </BlockCallout>
      </Section>

      <Section id="value" title="Value & stars">
        <PropertyCard type="number | string" default-value="0">
          <strong>Rating value</strong> — the score to display. Fractional values are supported:
          <Code>4.5</Code> renders four full stars and one half star.
        </PropertyCard>
        <PropertyCard type="number | string" default-value="5">
          <strong>Max stars</strong> — how many stars to draw in total.
        </PropertyCard>
        <PropertyCard type="boolean">
          <strong>Show value</strong> — appends the numeric score as text next to the stars.
        </PropertyCard>
      </Section>

      <Section id="appearance" title="Appearance">
        <PropertyCard type="color | null">
          <strong>Star color</strong> — the filled portion.
        </PropertyCard>
        <PropertyCard type="color | null">
          <strong>Empty star color</strong> — the unfilled remainder, so partial and empty stars
          stay visible against the background.
        </PropertyCard>
        <PropertyCard type="number (8–80)" default-value="24">
          <strong>Star size</strong> — in px.
        </PropertyCard>
        <PropertyCard type="number (0–40)" default-value="4">
          <strong>Star gap</strong> — space between stars, in px.
        </PropertyCard>
      </Section>

      <Section id="text" title="Text & spacing">
        <p>These apply to the numeric label shown by <strong>Show value</strong>.</p>
        <PropertyCard type="color | null">
          <strong>Text color</strong>
        </PropertyCard>
        <PropertyCard type="font stack">
          <strong>Font family</strong>
        </PropertyCard>
        <PropertyCard type="number | string">
          <strong>Font size</strong>
        </PropertyCard>
        <PropertyCard type="font weight">
          <strong>Font weight</strong>
        </PropertyCard>
        <PropertyCard type="'left' | 'center' | 'right'">
          <strong>Alignment</strong> — positions the whole star row within its container.
        </PropertyCard>
        <PropertyCard type="per-side spacing">
          <strong>Padding</strong> and <strong>Margin</strong> — around the block as a whole.
        </PropertyCard>
      </Section>

      <Section id="variables" title="Driving it with a variable">
        <p>
          <strong>Rating value</strong> and <strong>Max stars</strong> are text fields rather
          than number steppers, so you can put a template token in either:
        </p>
        <div class="my-3 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700">
          <span v-pre>Rating value: <span class="text-brand">{{product.averageRating}}</span></span>
          <br />
          Max stars: <span class="text-brand">5</span>
        </div>
        <p>
          The token resolves at render time and is then read as a number. Type a plain number and
          it's stored as a number; type anything containing <Code v-pre>{{</Code> and it's
          kept as a string for the variable system to substitute later.
        </p>
        <BlockCallout variant="warning" title="Unresolved tokens fall back">
          If a token resolves to something that isn't a number — a missing or empty variable —
          the block falls back to <Code>0</Code> for the value and <Code>5</Code> for the max,
          rendering an empty five-star row rather than breaking the layout.
        </BlockCallout>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Font size, font family, font weight, alignment, padding, and margin can differ per
          device. Each device falls back to <strong>Desktop</strong> when unset; Tablet and
          Mobile are independent.
        </p>
        <BlockCallout title="Not per-device">
          The value, max, and show-value toggle are shared across devices, as are the star colors
          and the star size and gap.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
