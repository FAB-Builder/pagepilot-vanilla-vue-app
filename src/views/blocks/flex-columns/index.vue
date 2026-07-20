<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'layout', label: 'Columns & row layout' },
  { id: 'options', label: 'Gap, align & column options' },
  { id: 'per-column', label: 'Per-column settings' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Flex Columns" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Flex Columns Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Flexbox-based columns that can stay in a row or wrap onto multiple lines, with
          per-column width control and a per-device row layout.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          A new Flex Columns block starts with two equal columns and a 16px gap. Unlike the
          table-based <strong>Columns</strong> block, this one uses real flexbox — so columns
          can wrap, stretch, and size themselves individually.
        </p>
      </Section>

      <Section id="layout" title="Columns & row layout">
        <PropertyCard type="number (min 2)" default-value="2">
          <strong>Columns</strong> — a stepper. Adding a column adds a new per-column section
          below.
        </PropertyCard>
        <PropertyCard type="'row' | 'wrap'" default-value="row">
          <strong>Layout</strong> — <Code>row</Code> keeps all columns on one line;
          <Code>wrap</Code> lets them flow onto additional lines when they don't fit.
        </PropertyCard>
        <BlockCallout title="Row layout is stored per device">
          This control targets whichever device tab is active, writing
          <Code>desktopLayout</Code>, <Code>tabletLayout</Code>, or
          <Code>mobileLayout</Code>. Mobile defaults to <Code>wrap</Code> even when you haven't
          set it, since a multi-column row rarely fits on a phone.
        </BlockCallout>
      </Section>

      <Section id="options" title="Gap, align & column options">
        <PropertyCard type="number" default-value="16">
          <strong>Gap</strong> — space between columns, in px.
        </PropertyCard>
        <PropertyCard
          type="'flex-start' | 'center' | 'flex-end' | 'stretch'"
          default-value="flex-start"
        >
          <strong>Align</strong> — vertical alignment of columns against each other: top,
          centre, bottom, or stretch to equal height.
        </PropertyCard>
        <PropertyCard type="boolean" default-value="true">
          <strong>Equal columns</strong> — forces every column to the same width, ignoring
          per-column width settings.
        </PropertyCard>
        <PropertyCard type="boolean" default-value="false">
          <strong>Reverse order</strong> — flips the visual order of the columns without moving
          the underlying blocks.
        </PropertyCard>
      </Section>

      <Section id="per-column" title="Per-column settings">
        <p>
          Below the layout section, each column gets its own collapsible section for
          individual width and styling — useful for an asymmetric split like a wide content
          column beside a narrow sidebar. These apply only when
          <strong>Equal columns</strong> is off.
        </p>
      </Section>

      <Section id="appearance" title="Appearance">
        <PropertyCard type="color | null" default-value="null">
          <strong>Color</strong> — background behind the columns.
        </PropertyCard>
        <PropertyCard type="per-side spacing" default-value="0 on all sides">
          <strong>Padding</strong> and <strong>Margin</strong>
        </PropertyCard>
        <PropertyCard type="number | per-corner" default-value="0">
          <strong>Radius</strong>
        </PropertyCard>
        <PropertyCard type="color | null" default-value="null">
          <strong>Border</strong> color. Setting it reveals a per-side
          <strong>Border width</strong> control, defaulting to 1px all round.
        </PropertyCard>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          <strong>Layout</strong> (row vs wrap) is genuinely per-device via
          <Code>desktopLayout</Code> / <Code>tabletLayout</Code> / <Code>mobileLayout</Code>,
          published as real <Code>@media</Code> CSS. Background, padding, margin, radius, and
          border also differ per device.
        </p>
        <BlockCallout title="Not per-device">
          Column count, gap, align, equal-columns, and reverse-order are shared across devices
          and hidden on the Tablet/Mobile tabs.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
