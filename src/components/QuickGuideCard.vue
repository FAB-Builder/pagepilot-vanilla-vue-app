<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "QuickGuideCard" });
</script>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import 'ahdjs/build/css/index.css'
import AHDjsService from '@/services/AHDjsService'

// --- Types ---
interface QuickGuideItem {
  label: string;
  videoUrl?: string;
  externalLink?: string;
  onClick?: () => void;
}

interface BannerPair {
  identifier: string;
  mobileIdentifier: string;
  title?: string;
}

interface Props {
  banners: BannerPair[];
  title?: string;
  subtitle?: string;
  items?: QuickGuideItem[];
  wrapperClassName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});

// Simulated current user — replace with your actual auth/user store
const currentUser = { id: "visitor-id" };

// --- CS Banners toggle ---
const showCSBanners = ref(true);

// --- Custom inputs ---
const inputApplicationId = ref("");
const inputIdentifier = ref("");

// Debounced versions (updated after 600ms of no typing)
const debouncedApplicationId = ref("");
const debouncedIdentifier = ref("");

let appIdTimer: ReturnType<typeof setTimeout> | null = null;
let identifierTimer: ReturnType<typeof setTimeout> | null = null;

const onApplicationIdInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  inputApplicationId.value = value;
  if (appIdTimer) clearTimeout(appIdTimer);
  appIdTimer = setTimeout(() => {
    debouncedApplicationId.value = value;
  }, 600);
};

const onIdentifierInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  inputIdentifier.value = value;
  if (identifierTimer) clearTimeout(identifierTimer);
  identifierTimer = setTimeout(() => {
    debouncedIdentifier.value = value;
  }, 600);
};

// The active banners list depending on toggle
const activeBanners = computed<BannerPair[]>(() => {
  if (showCSBanners.value) return props.banners;
  if (debouncedIdentifier.value) {
    return [
      {
        identifier: debouncedIdentifier.value,
        mobileIdentifier: debouncedIdentifier.value + "-mobile",
      },
    ];
  }
  return [];
});

// Active applicationId depending on toggle
const activeApplicationId = computed(() =>
  showCSBanners.value ? "6754c71afc22646fb4a77d0b" : debouncedApplicationId.value
);

// Banner loading state
const bannerStatus = ref<"loading" | "success" | "failed">("loading");

// Active video url for modal overlay
const activeVideoUrl = ref<string | null>(null);

// Fetch and render app banners for both mobile and desktop identifiers
const fetchAppBanner = async (): Promise<boolean> => {
  if (!activeBanners.value.length || (!showCSBanners.value && !activeApplicationId.value)) {
    bannerStatus.value = "failed";
    return false;
  }
  try {
    bannerStatus.value = "loading";

    const ahdJS = AHDjsService.getInstance().init(currentUser.id, activeApplicationId.value);

    await Promise.all(
      activeBanners.value.flatMap((b) => [
        ahdJS.renderAppBanner(b.mobileIdentifier, true),
        ahdJS.renderAppBanner(b.identifier, true),
      ])
    );

    bannerStatus.value = "success";
    return true;
  } catch (error) {
    console.log(error);
    bannerStatus.value = "failed";
    return false;
  }
};

// Handle item click: video, external link, or custom onClick
const handleItemClick = (item: QuickGuideItem) => {
  if (item.videoUrl) {
    activeVideoUrl.value = item.videoUrl;
  }
  if (item.externalLink) {
    window.open(item.externalLink, "_blank", "noopener,noreferrer");
  }
  if (item.onClick) {
    item.onClick();
  }
};

// Re-fetch when toggle or debounced inputs change
watch([showCSBanners, debouncedApplicationId, debouncedIdentifier, () => props.banners], () => {
  fetchAppBanner();
}, { deep: true });

onMounted(() => {
  fetchAppBanner();
});
</script>

<template>
  <div :class="wrapperClassName">
    <div>
      <!-- Controls bar -->
      <div class="controls-bar">
        <label class="toggle-label">
          <input type="checkbox" v-model="showCSBanners" />
          <span class="toggle-text">Show CS Banners</span>
        </label>

        <template v-if="!showCSBanners">
          <div class="input-group">
            <label class="input-label">Application ID</label>
            <input
              class="text-input"
              type="text"
              placeholder="Enter Application ID"
              :value="inputApplicationId"
              @input="onApplicationIdInput"
            />
          </div>
          <div class="input-group">
            <label class="input-label">Identifier</label>
            <input
              class="text-input"
              type="text"
              placeholder="Enter Identifier"
              :value="inputIdentifier"
              @input="onIdentifierInput"
            />
          </div>
        </template>
      </div>

      <div class="banner-wrapper">
        <template v-for="banner in activeBanners" :key="banner.identifier">
          <div class="banner-pair">
            <div class="banner-slot">
              <br /><br /><br />
              <span class="banner-label">{{ banner.mobileIdentifier }}</span>
              <br />
              <br />
              <hr />
              <br />
              <div :id="banner.mobileIdentifier" class="banner-div" />
            </div>
            <div class="banner-slot">
              <span class="banner-label">{{ banner.identifier }}</span>
              <br /><br /><br />
              <hr />
              <div :id="banner.identifier" class="banner-div" />
            </div>
          </div>
        </template>
      </div>

      <!-- Optional quick guide items list -->
      <ul v-if="items && items.length > 0" class="items-list">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="item"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  padding: 12px 0 16px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.toggle-text {
  user-select: none;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.text-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  min-width: 220px;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>
