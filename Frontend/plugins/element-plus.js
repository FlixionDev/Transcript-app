import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Import Element Plus styles

// Importing all icons from @element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export default defineNuxtPlugin((nuxtApp) => {
    // Use Element Plus globally
    nuxtApp.vueApp.use(ElementPlus);

    // Register all icons from @element-plus/icons-vue
    Object.keys(ElementPlusIconsVue).forEach((key) => {
        nuxtApp.vueApp.component(key, ElementPlusIconsVue[key]);
    });
});
