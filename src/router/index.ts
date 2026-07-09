import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import HomeView from '../views/HomeView.vue'
import ToursView from '../views/ToursView.vue'
import DemosView from '../views/DemosView.vue'
import TooltipsView from '../views/TooltipsView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import FormsView from '../views/FormsView.vue'
import AppBannerView from '../views/AppBannerView.vue'
import ContextHelpMenuView from '../views/context-help-menu/index.vue'
import WebinarView from '../views/webinar/index.vue'
import FetchPagesView from '../views/pages/fetch-pages/index.vue'
import TemplateVariablesView from '../views/pages/template-variables/index.vue'
import LinkPageToMenuView from '../views/pages/link-page-to-menu/index.vue'
import EditorCssView from '../views/pages/editor-css/index.vue'
import ExternalSectionsView from '../views/pages/external-sections/index.vue'
import { PAGES_DEFAULT } from '../views/pages/subModules'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: HomeView },
        { path: 'tours', component: ToursView },
        { path: 'demos', component: DemosView },
        { path: 'tooltips', component: TooltipsView },
        { path: 'templates', component: TemplatesView },
        // Pages module — redirects to its first sub-module
        { path: 'pages', redirect: PAGES_DEFAULT },
        { path: 'pages/fetch-pages', component: FetchPagesView },
        { path: 'pages/template-variables', component: TemplateVariablesView },
        { path: 'pages/link-page-to-menu', component: LinkPageToMenuView },
        { path: 'pages/editor-css', component: EditorCssView },
        { path: 'pages/external-sections', component: ExternalSectionsView },
        { path: 'context-help-menu', component: ContextHelpMenuView },
        { path: 'webinar', component: WebinarView },
        { path: 'forms', component: FormsView },
        { path: 'app-banner', component: AppBannerView },
        // Unknown slug → send the user back home
        { path: ':pathMatch(.*)*', redirect: '/' },
      ],
    },
  ],
})

// Port of React's <ScrollToTop />: reset scroll position on every navigation.
router.afterEach(() => {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
})

export default router
