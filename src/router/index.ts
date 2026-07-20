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
import HeadingBlockView from '../views/blocks/heading/index.vue'
import TextBlockView from '../views/blocks/text/index.vue'
import ListBlockView from '../views/blocks/list/index.vue'
import TableBlockView from '../views/blocks/table/index.vue'
import MarkdownBlockView from '../views/blocks/markdown/index.vue'
import QuillBlockView from '../views/blocks/quill/index.vue'
import ButtonBlockView from '../views/blocks/button/index.vue'
import ButtonGroupBlockView from '../views/blocks/button-group/index.vue'
import AccordionBlockView from '../views/blocks/accordion/index.vue'
import TabsBlockView from '../views/blocks/tabs/index.vue'
import StepperBlockView from '../views/blocks/stepper/index.vue'
import ImageBlockView from '../views/blocks/image/index.vue'
import LogoBlockView from '../views/blocks/logo/index.vue'
import VideoBlockView from '../views/blocks/video/index.vue'
import AvatarBlockView from '../views/blocks/avatar/index.vue'
import ContainerBlockView from '../views/blocks/container/index.vue'
import ColumnsBlockView from '../views/blocks/columns/index.vue'
import FlexColumnsBlockView from '../views/blocks/flex-columns/index.vue'
import GridBlockView from '../views/blocks/grid/index.vue'
import CarouselBlockView from '../views/blocks/carousel/index.vue'
import PaginationBlockView from '../views/blocks/pagination/index.vue'
import MarqueeBlockView from '../views/blocks/marquee/index.vue'
import DividerBlockView from '../views/blocks/divider/index.vue'
import SpacerBlockView from '../views/blocks/spacer/index.vue'
import HtmlBlockView from '../views/blocks/html/index.vue'
import { BLOCKS_DEFAULT } from '../views/blocks/subModules'

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
        // Blocks module — redirects to its first sub-module
        { path: 'blocks', redirect: BLOCKS_DEFAULT },
        { path: 'blocks/heading', component: HeadingBlockView },
        { path: 'blocks/text', component: TextBlockView },
        { path: 'blocks/list', component: ListBlockView },
        { path: 'blocks/table', component: TableBlockView },
        { path: 'blocks/markdown', component: MarkdownBlockView },
        { path: 'blocks/quill', component: QuillBlockView },
        { path: 'blocks/button', component: ButtonBlockView },
        { path: 'blocks/button-group', component: ButtonGroupBlockView },
        { path: 'blocks/accordion', component: AccordionBlockView },
        { path: 'blocks/tabs', component: TabsBlockView },
        { path: 'blocks/stepper', component: StepperBlockView },
        { path: 'blocks/image', component: ImageBlockView },
        { path: 'blocks/logo', component: LogoBlockView },
        { path: 'blocks/video', component: VideoBlockView },
        { path: 'blocks/avatar', component: AvatarBlockView },
        { path: 'blocks/container', component: ContainerBlockView },
        { path: 'blocks/columns', component: ColumnsBlockView },
        { path: 'blocks/flex-columns', component: FlexColumnsBlockView },
        { path: 'blocks/grid', component: GridBlockView },
        { path: 'blocks/carousel', component: CarouselBlockView },
        { path: 'blocks/pagination', component: PaginationBlockView },
        { path: 'blocks/marquee', component: MarqueeBlockView },
        { path: 'blocks/divider', component: DividerBlockView },
        { path: 'blocks/spacer', component: SpacerBlockView },
        { path: 'blocks/html', component: HtmlBlockView },
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
