<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Sign in to your account
            </h2>

        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit="handleSubmit">
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
                    <div class="mt-2">
                        <input v-model="userForm.email" type="email" name="email" id="email" autocomplete="email"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div class="">
                        <label for="password" class="block text-sm/6 font-medium text-white">Password</label>

                    </div>
                    <div class="mt-2">
                        <input v-model="userForm.pass" type="password" name="password" id="password"
                            autocomplete="current-password"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Sign in
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?
                {{ ' ' }}
                <NuxtLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Register</NuxtLink>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const userForm = ref<{ email: string; pass: string; }>({
    email: '',
    pass: ''
})
const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (userForm.value.email === '' && userForm.value.pass === '') {
        alert('Please enter your email and password');
        return
    }
    else if (userForm.value.email === '' && userForm.value.pass !== '') {
        alert('Please enter your email');
        return
    }
    else if (userForm.value.pass === '' && userForm.value.email !== '') {
        alert('Please enter your password');
        return
    }

    const res = await userStore.handleLogin({ email: userForm.value.email, pass: userForm.value.pass });

    alert(res.message);

    if (res.status === 200) {
        router.push({ path: "/" });
    }

}

</script>
