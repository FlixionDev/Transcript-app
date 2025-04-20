<template>
    <div class="flex flex-col min-h-screen justify-between">
        <Navbar />
        <div class="flex-1">
            <slot />
        </div>
        <Footer />
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(() => {
    if (router.currentRoute.value.path === '/') {
        router.push('/transcribe')
    }
})

</script>
