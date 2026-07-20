import type { Component } from 'vue';

export interface DocSection {
  id: string;
  label: string;
}

export interface SubModule {
  /** Route to navigate to, e.g. "/pages/fetch-pages". */
  to: string;
  /** Label shown in the left rail. */
  label: string;
  /** Optional icon rendered before the label in the left rail. */
  icon?: Component;
}
