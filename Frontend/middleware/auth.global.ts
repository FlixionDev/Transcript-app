import { useUserStore } from '../store/user'
export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()
    const isAuthenticated = computed(() => userStore.isAuthenticated)
    const publicPages = ['/login', '/register']

    if (to.path === '/' && isAuthenticated.value) {
        return navigateTo('/transcribe')
    } else if (to.path === '/transcribe' && !isAuthenticated.value) {
        return navigateTo('/login')
    }

    if (!isAuthenticated.value && !publicPages.includes(to.path)) {
        return navigateTo('/login')
    }

    if (isAuthenticated.value && publicPages.includes(to.path)) {
        return navigateTo('/transcribe/')
    }

})
