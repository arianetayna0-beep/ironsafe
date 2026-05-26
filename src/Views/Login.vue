<template>
    <div class="background">
        <div class = "container">
            <main class="auth-page">
                <form @submit.prevent="fazerLogin">
                    <div class="input-group">
                        <label for="email">Email:</label>
                        <input class="input" type="email" id="email" v-model="email" required />
                    </div>
                    <div class="input-group">
                        <label for="password">Senha:</label>
                        <input class="input" type="password" id="password" v-model="password" required />
                    </div>
                    <button class="login-button" type="submit" :disabled="loading">Entrar</button>
                    <p v-if="erro" class="error">{{ erro }}</p>
                </form>
            </main>
        </div>
    </div>
</template>
 
<script setup>
import { useSupabase } from '../composables/useSupabase.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
 
const { supabase } = useSupabase()
const router = useRouter()
 
const email = ref('')
const password = ref('')
const loading = ref(false)
const erro = ref('')
 
async function fazerLogin() {
    erro.value = ''
    loading.value = true
 
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
 
        if (error) {
            erro.value = 'Falha no login. Verifique suas credenciais.'
            return
        }
 
        router.push('/dashboard')
    } finally {
        loading.value = false
    }
}
</script>
 
<style scoped>
.auth-page {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    padding: 32px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
}

.background {
    background-image: url(../assets/login.jpg);
    background-size: cover;
    background-position: center;
}

.img-login {
    width: 100%;
    height: 100vh;
    object-fit: cover;
}

.container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    margin-bottom: 16px;
}

.input {
    width: 100%;
    height: 2.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    padding: 0 12px;
}

.login-button {
    width: 100%;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: rgb(83, 86, 87);
    border: none;
    color: white;
}

</style>


 