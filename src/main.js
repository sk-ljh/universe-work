// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'


import router from './router'

import AmapVue from '@amap/amap-vue';
import AmapVueConfig from '@amap/amap-vue/lib/config';
Vue.config.productionTip = false

/* eslint-disable no-new */
window._AMapSecurityConfig = {
    securityJsCode: 'f987d4361e6f9467fb215ad7d40d2314',
}

AmapVue.config.version = '2.0'; // 默认2.0，这里可以不修改
AmapVue.config.key = '7c34d49a7cc366a6d73d7a2648be4bac';
AmapVue.config.plugins = [
    'AMap.ToolBar',
    'AMap.MoveAnimation',
    // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
];
AmapVue.config.AMapUI = { // 是否加载 AMapUI，缺省不加载
        "version": '1.1', // AMapUI 版本
        "plugins": ['overlay/SimpleMarker'], // 需要加载的 AMapUI ui插件
    },
    AmapVue.config.Loca = { // 是否加载 Loca， 缺省不加载
        "version": '2.0' // Loca 版本
    },
    Vue.use(AmapVue);
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})