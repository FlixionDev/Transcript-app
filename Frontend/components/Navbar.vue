<template>
    <nav class="backdrop-blur-md bg-[#101828]/60 border-b border-white/10 p-4 shadow-sm rounded-md">
        <div class="flex justify-between items-center">
            <!-- Logo linked to home -->
            <NuxtLink to="/">
                <img src="/logo.svg" alt="Transcribe.AI" class="h-10 w-auto" />
            </NuxtLink>
            <!-- Right side: Create Transcript button and user section -->
            <div class="flex items-center space-x-4">
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                    @click="$router.push('/create-transcript')">
                    Create Transcript
                </button>
                <template v-if="true /* isLoggedIn */">
                    <div class="flex items-center space-x-2 text-white">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>{{ "username" }}</span>
                    </div>
                </template>
                <!-- <template v-else> -->
                <button class="text-indigo-600 hover:text-indigo-500" @click="$router.push('/login')">
                    Login
                </button>
                <!-- </template> -->
            </div>
        </div>
    </nav>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
// import { useUserStore } from '~/store/user'
// import { computed } from 'vue'

// Assuming a user store with isLoggedIn and username properties
// const userStore = useUserStore()
// const isLoggedIn = computed(() => userStore.isLoggedIn)
// const username = computed(() => userStore.username)
</script>
