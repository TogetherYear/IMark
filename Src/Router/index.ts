import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Default',
        redirect: '/Application'
    },
    {
        path: '/:pathMatch(.*)',
        name: '404',
        redirect: '/Empty'
    },
    {
        path: '/Empty',
        name: 'Empty',
        component: () => import('@/Views/Empty/Empty.vue')
    },
    {
        path: '/Application',
        name: 'Application',
        component: () => import('@/Views/Application/Application.vue')
    },
    {
        path: '/Update',
        name: 'Update',
        component: () => import('@/Views/Update/Update.vue')
    },
    {
        path: '/Picture',
        name: 'Picture',
        component: () => import('@/Views/Picture/Picture.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
