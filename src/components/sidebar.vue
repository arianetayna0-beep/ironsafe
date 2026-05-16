<template>
  <div class="shell">
    <aside class="sidebar">
      <!-- Logo/Título do sistema -->
      <h1 class="logo">
        <img class="logo-img" src="../assets/logo.png" alt="logo do site">
      </h1>
      <!-- Menu de navegação -->
    <router-link to="/dashboard/cadastro">Cadastro de EPIs</router-link>
    <router-link to="/dashboard/funcionario">Cadastro de Funcionarios</router-link>
    <router-link to="/dashboard/relatorio">Relatório</router-link>
    <router-link to="/dashboard/entregas">Entregas</router-link>
    <button @click="logout">Sair</button>
    </aside>
    <main class="conteudo">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
const { supabase } = useSupabase()

const router = useRouter()


async function sair() {
  try {
    await supabase.auth.signOut()
    router.push('/login')
  }
  catch (err) {
    console.error('Erro ao fazer logout:', err)
  }
}

function logout() {
  router.push('/login')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.shell {
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: linear-gradient(135deg, #f18f3c 0%, #d16b27d4 100%);
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow-y: auto;
  padding: 20px 0;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 15px;
  flex-shrink: 0;
}

.logo-img{
  width: 20rem;
}


.logo i {
  font-size: 28px;
}

a, button {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 0;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  gap: 12px;
  font-weight: 500;
}

a:hover, button:hover {
  background-color: rgba(255, 255, 255, 0.12);
  padding-left: 24px;
}

a.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 3px solid #FFFFFF;
  padding-left: 17px;
  font-weight: 600;
}

button {
  margin-top: auto;
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  margin: auto 0 0 0;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.18);
}

.conteudo {
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  background-color: #f8f9fa;
}

/* Tablet */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .conteudo {
    margin-left: 240px;
    padding: 20px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    flex-direction: row;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
    padding: 10px 0;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .logo {
    display: none;
  }

  a, button {
    padding: 12px 15px;
    font-size: 14px;
    white-space: nowrap;
  }

  a:hover, button:hover {
    padding-left: 15px;
  }

  a.router-link-active {
    border-left: none;
    border-bottom: 3px solid #FFFFFF;
    padding-left: 15px;
  }

  .conteudo {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 15px;
  }

  button {
    border-top: none;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .conteudo {
    padding: 12px;
    margin-bottom: 55px;
  }

  a, button {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
