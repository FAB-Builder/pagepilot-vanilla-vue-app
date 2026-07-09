import AHDjsLib from 'ahdjs';
import 'ahdjs/build/css/index.css';
import {
  PAGE_PILOT_API_HOST,
  DEMO_APPLICATION_ID,
  LEAD_API_HOST,
  LEAD_APPLICATION_ID,
  FAB_CRM_URL,
  CS_GENERAL_SETTINGS_URL,
  leadApiBase,
  PAGEPILOT_API_HOST,
  PAGEPILOT_APP_URL,
  PAGEPILOT_GROUPS_URL,
  pagePilotApiBase,
  FORM_BUILDER_FE_BASE,
  FORM_BUILDER_API_BASE,
  FORM_WORKSPACE_ID,
  DEMO_FORM_WORKSPACE_ID,
  DEMO_FORM_ID,
  formBuilderApiBase,
} from '../shared/constants/constants';

const AHDjs = (AHDjsLib as any).default ?? AHDjsLib;

/**
 * The PagePilot API host. Matches the host used by the AHD admin app
 * (see the "Integrate PagePilot" dialog in ahd-fe).
 */
export const AHD_API_HOST = PAGE_PILOT_API_HOST;

export {
  DEMO_APPLICATION_ID,
  LEAD_API_HOST,
  LEAD_APPLICATION_ID,
  FAB_CRM_URL,
  CS_GENERAL_SETTINGS_URL,
  leadApiBase,
  PAGEPILOT_API_HOST,
  PAGEPILOT_APP_URL,
  PAGEPILOT_GROUPS_URL,
  pagePilotApiBase,
  FORM_BUILDER_FE_BASE,
  FORM_BUILDER_API_BASE,
  FORM_WORKSPACE_ID,
  DEMO_FORM_WORKSPACE_ID,
  DEMO_FORM_ID,
  formBuilderApiBase,
};

export interface AhdInstance {
  initializeSiteMap: (refetch: boolean) => Promise<void>;
  showHighlights: (slug: string, refetch: boolean) => Promise<void>;
  showPageTour: (slug: string) => Promise<void>;
  renderAppBanner: (identifier: string, refetch: boolean) => Promise<unknown>;
  stop: (...args: unknown[]) => void;
}

export interface CreateAhdOptions {
  applicationId: string;
  visitorId?: string;
  showProgressbar?: boolean;
}

/**
 * Create an AHDjs client. Mirrors the snippet shown in the ahd-fe
 * "Configure AHDjs" integration dialog:
 *
 *   const ahdJs = new AHDjs(undefined, {
 *     applicationId: "YOUR_APPLICATION_ID",
 *     apiHost: "https://pagepilot.fabbuilder.com",
 *     visitorId: "visitor-id",
 *     showProgressbar: false,
 *   });
 *   ahdJs.initializeSiteMap();
 *   ahdJs.showHighlights("tours", true);
 */
export function createAhd({
  applicationId,
  visitorId = 'visitor-id',
  showProgressbar = false,
}: CreateAhdOptions): AhdInstance {
  return AHDjs(undefined, {
    applicationId,
    apiHost: AHD_API_HOST,
    visitorId,
    showProgressbar,
  }) as AhdInstance;
}
