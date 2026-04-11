<template>
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
</template>
 
<script setup>
import { useSupabase } from '../composable/UseSupabase.js'
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
 
        router.push('/sidebar')
    } finally {
        loading.value = false
    }
}
</script>
 
<style scoped>
.auth-page {
    max-width: px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #ccc;

}
 .container {
    background-image: url("../assets/login.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.input-group{
    display: flex;
    flex-direction: column;
    width: 20rem;
    height: 4rem;
    opacity: 0.5;
}

.input{
    width: 20rem;
    height: 2rem;
    border-radius: 0.5rem;
    border: 5px;
}

.login-button{
    width: 20rem;
    height: 2rem;
    border-radius: 0.5rem;
    background-color: rgb(83, 86, 87);
    border: none;
    color: white;
}

</style>


 