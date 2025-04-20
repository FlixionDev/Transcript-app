<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Create your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit="handleSubmit">

                <div>
                    <label for="name" class="block text-sm/6 font-medium text-white">Full Name</label>
                    <div class="mt-2">
                        <input v-model="userForm.name" type="text" name="name" id="name" autocomplete="name"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
                    <div class="mt-2">
                        <input v-model="userForm.email" type="email" name="email" id="email" autocomplete="email"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="mobile" class="block text-sm/6 font-medium text-white">Mobile Number</label>
                    <div class="mt-2">
                        <input v-model="userForm.mob_no" type="number" name="mobile" id="mobile"
                            autocomplete="telephone"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
                    <div class="mt-2">
                        <input v-model="userForm.pass" type="password" name="confirmPassword" id="confirmPassword"
                            autocomplete="new-password"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Submit -->
                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Register
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <NuxtLink to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">
                    Login
                </NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const userForm = ref<{ name: string; email: string; mob_no: number | undefined; pass: string; }>({
    name: '',
    email: '',
    mob_no: undefined,
    pass: ''
})
const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (userForm.value.name === '' && userForm.value.email === '' && userForm.value.mob_no === undefined && userForm.value.pass === '') {
        alert('Please enter your name, email, mobile number and password');
        return
    }
    else if (userForm.value.name === '' && userForm.value.email !== '' && userForm.value.mob_no !== undefined && userForm.value.pass !== '') {
        alert('Please enter your name');
        return
    }
    else if (userForm.value.email === '' && userForm.value.mob_no !== undefined && userForm.value.pass !== '') {
        alert('Please enter your email');
        return
    }
    else if (userForm.value.mob_no === undefined && userForm.value.email !== '' && userForm.value.pass !== '') {
        alert('Please enter your mobile number');
        return
    }
    else if (userForm.value.pass === '' && userForm.value.email !== '' && userForm.value.mob_no !== undefined) {
        alert('Please enter your password');
        return
    }

    const res = await userStore.handleRegister(userForm.value);

    if (res.status === 200) {
        alert('Registration successful!');
        router.push('/login');
    } else {
        alert(res.message);
    }
}
</script>

<style lang="scss"></style>
