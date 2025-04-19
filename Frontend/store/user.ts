import { defineStore } from "pinia";

const userStore = defineStore("user", () => {
    const user = ref({
        name: "",
        email: "",
        token: "",
    })

    const handleLogin = async () => { }

    const handleLogout = async () => { }

    const handleRegister = async () => { }

    return {
        user,
        handleLogin,
        handleLogout,
        handleRegister
    }
})
