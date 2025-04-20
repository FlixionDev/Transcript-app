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
                    @click="$router.push('/transcribe/create')">
                    Create Transcript
                </button>
                <template v-if="isLoggedIn">
                    <el-dropdown>
                        <div
                            class="flex items-center space-x-2 text-white text-base hover:outline-none hover:ring-0 hover:border-none focus:outline-none cursor-pointer">
                            <el-icon class="w-6 h-6">
                                <User />
                            </el-icon>
                            <span class="text-lg font-medium">{{ username }}</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu class="!bg-indigo-600 border-none">
                                <el-dropdown-item
                                    class="!bg-indigo-600 !text-white !px-4 !py-2 !rounded-md hover:!bg-indigo-500 cursor-pointer"
                                    @click="handleLogout">
                                    Logout
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>

                    </el-dropdown>
                </template>
                <template v-else-if="!isLoggedIn && route.path !== '/login'">
                    <button class="text-indigo-600 hover:text-indigo-500" @click="$router.push('/login')">
                        Login
                    </button>
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import { ElIcon } from 'element-plus';
import { useUserStore } from '~/store/user'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const isLoggedIn = computed(() => userStore.isAuthenticated)
const username = computed(() => userStore.user.name)

const handleLogout = () => {

    userStore.handleLogout()
    alert('Logged out successfully');
    router.push({ path: '/login' });
};

</script>
