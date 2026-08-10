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
  { id: 'editing', label: 'Editing cells' },
  { id: 'structure', label: 'Structure' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'alignment', label: 'Alignment' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="Table" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Table Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A real HTML table with an optional header row. Cells are edited directly on the
          canvas; rows, columns, and styling come from the sidebar.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          A new Table starts as a 3×3 grid with the first row set as a header. Cell contents are
          stored as a flat array, which is why resizing the table preserves the text that still
          fits inside the new shape.
        </p>
      </Section>

      <Section id="editing" title="Editing cells">
        <p>Two canvas interactions drive most table editing:</p>
        <PropertyCard type="click">
          <strong>Click any cell</strong> to edit its text in place.
        </PropertyCard>
        <PropertyCard type="right-click">
          <strong>Right-click a cell</strong> for a context menu to insert or delete rows and
          columns at that position, or delete the whole table.
        </PropertyCard>
        <BlockCallout variant="tip" title="Resizing keeps what fits">
          Changing the row or column count doesn't clear the table. Content that still falls
          inside the new grid is preserved, and newly created positions come in blank — so
          trimming a column and adding it back loses only that column's text.
        </BlockCallout>
      </Section>

      <Section id="structure" title="Structure">
        <PropertyCard type="number (1–50)" default-value="3">
          <strong>Rows</strong>
        </PropertyCard>
        <PropertyCard type="number (1–20)" default-value="3">
          <strong>Columns</strong>
        </PropertyCard>
        <PropertyCard type="boolean" default-value="true">
          <strong>First row as header</strong> — renders the first row as header cells, which
          pick up the header background and header text color below.
        </PropertyCard>
        <PropertyCard type="percent (1–100)" default-value="100%">
          <strong>Width</strong> — the table's width as a percentage of its container. Stored as
          a CSS length string (e.g. <Code>"100%"</Code>).
        </PropertyCard>
        <BlockCallout title="Structure is shared across devices">
          Rows, columns, the header toggle, cell contents, and width always write to the base
          block regardless of which device tab is active — a table can't have a different number
          of columns per device. The whole Structure section is hidden on Tablet/Mobile.
        </BlockCallout>
      </Section>

      <Section id="appearance" title="Appearance">
        <PropertyCard type="per-side spacing">
          <strong>Padding</strong> and <strong>Margin</strong> — around the table as a whole.
        </PropertyCard>
        <PropertyCard type="number (0–60)" default-value="8">
          <strong>Cell padding</strong> — space inside every cell, in px.
        </PropertyCard>
        <PropertyCard type="number (0–10)" default-value="2">
          <strong>Border width</strong> — in px.
        </PropertyCard>
        <PropertyCard type="solid color" default-value="#e5e7eb">
          <strong>Border color</strong> — solid only; gradients aren't accepted here.
        </PropertyCard>
        <PropertyCard type="color | null" default-value="#f3f4f6">
          <strong>Header background</strong>
        </PropertyCard>
        <PropertyCard type="color | null" default-value="#111827">
          <strong>Header text color</strong>
        </PropertyCard>
        <PropertyCard type="font stack">
          <strong>Font family</strong>
        </PropertyCard>
        <PropertyCard type="number (8–48)" default-value="14">
          <strong>Font size</strong> — in px.
        </PropertyCard>
        <PropertyCard type="color | null" default-value="#262626">
          <strong>Text color</strong>
        </PropertyCard>
      </Section>

      <Section id="alignment" title="Alignment">
        <p>
          Two separate controls that are easy to mix up: one moves the <em>table</em>, the other
          moves <em>text inside the header row</em>.
        </p>
        <PropertyCard type="'left' | 'center' | 'right'" default-value="left">
          <strong>Table alignment</strong> — positions the whole table within its container.
        </PropertyCard>
        <BlockCallout variant="warning" title="Only does something when Width is under 100%">
          A full-width table already fills its container, so there's nowhere to move it. Drop
          <strong>Width</strong> below <Code>100%</Code> first, then this control takes effect —
          the sidebar shows the same reminder as a tooltip.
        </BlockCallout>
        <PropertyCard type="'left' | 'center' | 'right'" default-value="left">
          <strong>Header alignment</strong> — aligns text in the header row only. Body cells and
          the caption keep their own default alignment and aren't affected.
        </PropertyCard>
        <BlockCallout title="Header row must be on">
          Header alignment applies to header cells, so it has no visible effect unless
          <strong>First row as header</strong> is enabled.
        </BlockCallout>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Padding, margin, border color, header colors, font family, font size, text color, and
          both alignment controls can differ per device. Each device falls back to
          <strong>Desktop</strong> when unset; Tablet and Mobile are independent.
        </p>
        <BlockCallout title="Not per-device">
          The whole Structure section — rows, columns, header toggle, width — plus
          <strong>cell padding</strong> and <strong>border width</strong> are shared across
          devices and hidden on the Tablet/Mobile tabs.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
