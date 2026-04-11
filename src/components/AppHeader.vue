<template>
    <header class="header-content">
        <img src="../assets/logo.png" alt="Logo" class="logo">
        <div class="header-links">
            <router-link class="link" to="/">Início</router-link>
            <router-link class="link" to="/Sobre">Sobre</router-link>
        </div>
        <div class="buttons">
            <button class="login-button" @click="router.push('/Login')">Entrar</button>
            <button class="signup-button" @click="router.push('/cadastro')">Cadastrar-se</button>
            <i class="pi pi-align-justify" style="font-size: 2rem;"></i>
        </div>
    </header>
    <router-view />
</template>

<script>
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css';

export default {
    setup() {
        const router = useRouter();
        return { router };
    }
}
</script>

<style scoped>
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 5rem;
    background-color: white;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}

.logo {
    display: flex;
    width: 15rem;
    height: 10rem;
    align-items: center;
    justify-content: center;
}

.header-links {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.link {
    text-decoration: none;
    color: #333;
    font-weight: 400;
    font-size: 1.2rem;
}

.link:hover {
    color: rgb(253, 81, 0);
}

.buttons {
    display: flex;
    gap: 0.5rem;
}

.login-button,
.signup-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}
</style>