import { defineStore } from "pinia";
import { apiPrefix } from "./transcribe";

export const useUserStore = defineStore("user", () => {

    const user = ref<{ name: string; email: string; token: string }>({
        name: "",
        email: "",
        token: "",
    });

    const initializeUser = () => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            user.value = {
                name: JSON.parse(storedUser).name,
                email: JSON.parse(storedUser).email,
                token: storedToken,
            };
        }
    };

    const isAuthenticated = computed(() => !!user.value?.token)

    const handleLogin = async ({ email, pass }: { email: string; pass: string }) => {
        const data = await fetch(`${apiPrefix}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, pass }),
        })

        const res = await data.json();

        if (res.status === 200) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify({ name: res.name, email: res.email }));
            user.value = { name: res.name, email: res.email, token: res.token };
        }

        return res;

    }

    const handleRegister = async ({ email, name, mob_no, pass }: { email: string; name: string; mob_no: number | undefined; pass: string }) => {

        const data = await fetch(`${apiPrefix}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, mob_no, pass }),
        })

        const res = await data.json();

        return res;
    }

    const handleLogout = async () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        user.value = { name: "", email: "", token: "" };

    }

    initializeUser()

    return {
        user,
        isAuthenticated,
        handleLogin,
        handleLogout,
        handleRegister
    }
})
