<script setup lang="ts">
import { Languages, X } from '@lucide/vue';
import { ref, onMounted, onUnmounted } from 'vue';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

const isOpen = ref(false);

const elementId = 'google_translate_element';
let isMounted = true;

function tidyGoogleMarkup() {
  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }

  container.querySelectorAll('.goog-te-gadget').forEach((gadget, index) => {
    if (index > 0) {
      gadget.remove();
    }
  });

  container.querySelectorAll('.goog-te-gadget-simple').forEach((gadget, index) => {
    if (index > 0) {
      gadget.remove();
    }
  });

  const languageButton = container.querySelector('.goog-te-gadget-simple');
  languageButton?.setAttribute('aria-label', 'Select language');
}

function initializeGoogleTranslate() {
  const container = document.getElementById(elementId);

  if (!isMounted || !container || !window.google?.translate) {
    return;
  }

  container.innerHTML = '';

  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages:
        'en,es,fr,de,it,pt,ru,ja,ko,zh-CN,zh-TW,ar,hi,bn,pa,te,mr,gu,kn,ml,or,ta,uk,pl,tr,nl,sv,da,fi,no,cs,sk,hu,ro,bg,hr,sr,sl,et,lt,lv,id,th,vi,my,km,lo,fa,he,ur',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    elementId,
  );

  window.setTimeout(tidyGoogleMarkup, 300);
}

onMounted(() => {
  isMounted = true;
  window.googleTranslateElementInit = initializeGoogleTranslate;

  if (window.google?.translate) {
    initializeGoogleTranslate();
    return;
  }

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.async = true;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }
});

onUnmounted(() => {
  isMounted = false;
});
</script>

<template>
  <div class="floating-translator-container">
    <button
      type="button"
      class="floating-translator-toggle"
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? 'Close language selector' : 'Open language selector'"
      :aria-expanded="isOpen"
      aria-controls="floating-translator-panel"
    >
      <Languages aria-hidden="true" :size="24" :stroke-width="2.25" />
    </button>

    <div
      id="floating-translator-panel"
      :class="`floating-translator-panel notranslate${isOpen ? ' is-open' : ''}`"
      translate="no"
      :aria-hidden="!isOpen"
    >
      <div class="floating-translator-panel-header">
        <div>
          <p class="floating-translator-panel-eyebrow">Translate</p>
          <h3 class="floating-translator-panel-title">Choose language</h3>
        </div>
        <button
          type="button"
          class="floating-translator-close"
          @click="isOpen = false"
          aria-label="Close language selector"
        >
          <X aria-hidden="true" :size="16" :stroke-width="2.5" />
        </button>
      </div>
      <div class="floating-translator-panel-content">
        <p class="floating-translator-help">
          Select your preferred language for this documentation.
        </p>
        <div id="google_translate_element" class="notranslate" translate="yes"></div>
      </div>
    </div>
  </div>
</template>

<!--
  Unscoped (global) style block: Google's translate widget injects its own
  DOM (`.goog-te-gadget*`) directly into #google_translate_element outside
  Vue's control, so scoped `data-v-*` attribute selectors would never match
  it. These rules must stay global, matching React's index.css block.
-->
<style>
.floating-translator-container {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  z-index: 999;
  font-family: inherit;
}

@media (max-width: 768px) {
  .floating-translator-container {
    right: 16px;
  }
}

.floating-translator-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(79, 70, 229, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.floating-translator-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(79, 70, 229, 0.45);
}

.floating-translator-toggle:active {
  transform: translateY(0) scale(0.98);
}

.floating-translator-toggle:focus-visible,
.floating-translator-close:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .floating-translator-toggle {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
}

.floating-translator-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: min(320px, calc(100vw - 32px));
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) scale(0.98);
  transform-origin: bottom right;
  pointer-events: none;
}

html.dark .floating-translator-panel {
  background: #111827;
  border-color: rgba(148, 163, 184, 0.16);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
}

.floating-translator-panel.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

@media (max-width: 768px) {
  .floating-translator-panel {
    bottom: 62px;
  }
}

.floating-translator-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 18px 16px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.22), transparent 34%),
    linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.floating-translator-panel-eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.floating-translator-panel-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.25;
  /* Override the app's global `h1..h4 { text-ink }` rule so the title stays
     white on the purple header. */
  color: #ffffff;
}

.floating-translator-close {
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0 0 2px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.floating-translator-close:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: scale(1.04);
}

.floating-translator-panel-content {
  padding: 18px;
}

.floating-translator-help {
  margin: 0 0 14px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

html.dark .floating-translator-help {
  color: #94a3b8;
}

html.dark .floating-translator-panel-content .goog-te-gadget-simple {
  background: #1e293b;
  border-color: #334155;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
}
html.dark .floating-translator-panel-content .goog-te-gadget-simple span {
  color: #e2e8f0 !important;
}
html.dark .floating-translator-panel-content .goog-te-gadget-simple span[aria-hidden='true'] {
  color: #94a3b8 !important;
}
html.dark .floating-translator-panel-content .goog-te-gadget-simple:hover {
  background: #263449;
  border-color: #6366f1;
}

.floating-translator-panel-content #google_translate_element {
  min-height: 48px;
  overflow: hidden;
}

.floating-translator-panel-content .goog-te-gadget {
  width: 100%;
  font-family: inherit;
  color: transparent;
  font-size: 0;
  margin: 0;
}

.floating-translator-panel-content .goog-te-gadget ~ .goog-te-gadget,
.floating-translator-panel-content .goog-te-gadget:not(:first-child) {
  display: none !important;
}

.floating-translator-panel-content .goog-te-gadget-simple {
  display: block;
  width: 100%;
  min-height: 48px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.floating-translator-panel-content .goog-te-gadget-simple:hover {
  background: #ffffff;
  border-color: #a5b4fc;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.12);
}

.floating-translator-panel-content .goog-te-gadget-simple img {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}

.floating-translator-panel-content .goog-te-gadget-simple span {
  color: #0f172a !important;
  font-family: inherit !important;
  font-size: 14px;
  line-height: 1.2;
  text-decoration: none !important;
  vertical-align: middle;
}

.floating-translator-panel-content .goog-te-gadget-simple span[style*='border-left'] {
  float: right;
  margin-left: 10px !important;
  border-left: 0 !important;
}

.floating-translator-panel-content .goog-te-gadget-simple span[aria-hidden='true'] {
  color: #64748b !important;
}

.floating-translator-panel-content .goog-te-gadget-simple:nth-child(n + 2) {
  display: none !important;
}

.goog-te-banner-frame {
  display: none !important;
}

body {
  top: 0 !important;
}
</style>
