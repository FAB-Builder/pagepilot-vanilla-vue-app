import { ref } from 'vue';

/**
 * Module-scoped toast state shared across the whole app. Simpler than
 * React's Context/Provider pair since Vue doesn't need a wrapping
 * component to share reactive state — a single module-level `ref` pair
 * is enough. `Toast.vue` renders this state; `show()` is imported
 * anywhere a toast needs to be triggered.
 */
const message = ref<string | null>(null);
const visible = ref(false);

let timer: ReturnType<typeof setTimeout> | undefined;

function show(msg: string) {
  clearTimeout(timer);
  message.value = msg;
  visible.value = true;
  timer = setTimeout(() => {
    visible.value = false;
  }, 2200);
}

export function useToast() {
  return { message, visible, show };
}
