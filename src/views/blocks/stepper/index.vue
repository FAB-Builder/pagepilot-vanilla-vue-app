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
  { id: 'type', label: 'Type & steps' },
  { id: 'dots', label: 'Dot styling' },
  { id: 'numeric', label: 'Numeric styling' },
  { id: 'layout', label: 'Background, alignment & spacing' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Stepper" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">Stepper Block</h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A progress indicator for multi-step tours — dots, a numeric counter, or both, showing
          which step the visitor is currently on.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          The Stepper is designed for tour and tooltip flows. Drop it into a step and it shows
          the visitor how far along they are.
        </p>
        <BlockCallout title="Total steps is driven by the tour, not typed">
          The <strong>Total steps</strong> field is read-only. When the block is used inside a
          tour, it syncs to the tour's actual step count on load, and the active step is clamped
          so it can never point past the last step. Add or remove steps in the tour and the
          stepper follows.
        </BlockCallout>
      </Section>

      <Section id="type" title="Type & steps">
        <PropertyCard type="'dots' | 'numeric' | 'both'" default-value="dots">
          <strong>Type</strong> — which indicator renders. The sidebar shows only the styling
          controls that apply to your choice: dot controls for <Code>dots</Code>, numeric
          controls for <Code>numeric</Code>, and both sets for <Code>both</Code>.
        </PropertyCard>
        <PropertyCard type="number (1–20)" default-value="5">
          <strong>Total steps</strong> — read-only; synced from the tour's step count.
        </PropertyCard>
        <PropertyCard type="number" default-value="current step">
          <strong>Active step</strong> — which step is highlighted, 1-based. Defaults to the
          step the block was added on.
        </PropertyCard>
      </Section>

      <Section id="dots" title="Dot styling">
        <p>
          Shown when Type is <Code>dots</Code> or <Code>both</Code>:
        </p>
        <PropertyCard type="color" default-value="#3F73FF">
          <strong>Active dot</strong> — the current step's dot color.
        </PropertyCard>
        <PropertyCard type="color" default-value="#FFFFFF">
          <strong>Inactive dot</strong> — every other dot.
        </PropertyCard>
        <PropertyCard type="number (4–48)" default-value="14">
          <strong>Dot size</strong> — in px, clamped to this range.
        </PropertyCard>
        <PropertyCard type="number (0–40)" default-value="12">
          <strong>Spacing</strong> — gap between dots, in px.
        </PropertyCard>
      </Section>

      <Section id="numeric" title="Numeric styling">
        <p>
          Shown when Type is <Code>numeric</Code> or <Code>both</Code>:
        </p>
        <PropertyCard type="color | null">
          <strong>Color</strong> — the counter text color.
        </PropertyCard>
        <PropertyCard type="number (8–48)">
          <strong>Font size</strong> — in px, clamped to this range.
        </PropertyCard>
        <PropertyCard type="'above' | 'below' | 'left' | 'right'">
          <strong>Numeric position</strong> — where the counter sits relative to the dots. Only
          appears when Type is <Code>both</Code>, since it has no meaning without dots to
          position against.
        </PropertyCard>
      </Section>

      <Section id="layout" title="Background, alignment & spacing">
        <PropertyCard type="color | null" default-value="null">
          <strong>Background</strong>
        </PropertyCard>
        <PropertyCard type="'left' | 'center' | 'right'" default-value="center">
          <strong>Alignment</strong> — where the stepper sits horizontally.
        </PropertyCard>
        <PropertyCard type="per-side spacing" default-value="0 on all sides">
          <strong>Padding</strong> and <strong>Margin</strong>
        </PropertyCard>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Alignment, padding, and margin can differ per device. Each device falls back to
          <strong>Desktop</strong> when unset; Tablet and Mobile are independent.
        </p>
        <BlockCallout title="Not per-device">
          Type, total steps, and active step are shared across devices — the flow has the same
          number of steps regardless of screen size, so those controls are hidden on the
          Tablet/Mobile tabs.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
