import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueHtml2Canvas from "vue-html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import PvBugtracker from "pv-bugtracker";
import Widget from "./Widget.vue";

export default {
    install(Vue, options) {
        Vue.use(VueHtml2Canvas);
        Vue.use(BootstrapVue);
        Vue.use(IconsPlugin);
        Vue.component("pv-bugtracker", Widget);
        Vue.prototype.$pvBugtracker = new PvBugtracker(options);
    }
};
