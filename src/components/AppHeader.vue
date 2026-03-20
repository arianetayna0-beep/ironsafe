<template>
    <header class="header-content">
        <img src="../assets/logo.png" alt="Logo" class="logo">
        <div class="header-links">
            <router-link class="link" to="/">Home </router-link>
            <router-link class="link" to="/Login">Login</router-link>
            <router-link class="link" to="/Cadastro">Cadastro </router-link>
            <router-link class="link" to="/Relatorio">Relatorio</router-link>
        </div>
    </header>
    <img class="background" src="../assets/homesite.png" alt="Background">
    <router-view />
</template>

<script>
export default {
    name: 'AppHeader'
}
</script>

<style scoped>
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 5rem;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}

.background {
    height: 28rem;
    width: 100%;
}

.logo {
    display: flex;
    width: 15rem;
    height: 10rem;
    align-items: center;
    justify-content: center;
}

.header-links{
    display: flex;
    gap: 1rem;
    align-items: center;
}

.link{
    text-decoration: none;
    color: #333;
    font-weight: 400;
    font-size: 1.2rem;
}

.link:hover {
    color: rgb(253, 81, 0);
}
</style>