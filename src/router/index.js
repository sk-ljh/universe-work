import Vue from 'vue'
import Router from 'vue-router'

import Home from "../pages/home/Home.vue"
import HomeInner from "../pages/home/HomeInner.vue"
import Universe from "../pages/universe/Universe.vue"
Vue.use(Router)

export default new Router({
    routes: [

        {
            path: '/',
            redirect: "/Universe",
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            children: [{
                path: '/home/homeInner',
                name: 'homeInner',
                component: HomeInner
            }, ]
        },
        {
            path: '/universe',
            name: 'Universe',
            component: Universe,

        },

    ]
})