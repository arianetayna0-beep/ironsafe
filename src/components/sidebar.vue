<template>
  <div class="shell">
    <aside class="sidebar">
      <!-- Logo/Título do sistema -->
      <h1 class="logo">
        <i class="fas fa-shield-alt"></i>
        Sistema EPI
      </h1>
      <nav class="menu">
        <RouterLink to="/app/funcionarios" class="menu-item" active-class="active">
          <i class="fas fa-users"></i>
          <span>Funcionários</span>
        </RouterLink>

        <RouterLink to="/app/cadastro" class="menu-item" active-class="active">
          <i class="fas fa-chart-bar"></i>
          <span>Cadastro</span>
        </RouterLink>

        <RouterLink to="/app/entregas" class="menu-item" active-class="active">
          <i class="fas fa-box"></i>
          <span>Entregas de EPI</span>
        </RouterLink>

        <RouterLink to="/app/relatorio" class="menu-item" active-class="active">
          <i class="fas fa-chart-bar"></i>
          <span>Relatório</span>
        </RouterLink>
      </nav>
      <button @click="sair" class="botao-sair">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sair</span>
      </button>
    </aside>
  </div>
  <main class="conteudo">
    <RouterView />
  </main>
  <div class="sidebar">
    <h2>Sistema EPI</h2>

    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/cadastro">Cadastro</router-link>
    <router-link to="/relatorio">Relatório</router-link>

    <button @click="logout">Sair</button>
  </div>
</template>

<script setup>
import { useSupabase } from '../composable/useSupabase'
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
  height: 100vh;
  background-color: #FFFFFF;
}

.sidebar {
  width: 250px;
  background-color: #d14e09;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo i {
  font-size: 28px;
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;

}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  border-left: 4px solid #FFFFFF;
  padding-left: 16px;

}

.menu-item i {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.botao-sair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  /* Fundo branco translúcido */
  color: #FFFFFF;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.botao-sair:hover {
  background-color: rgba(255, 255, 255, 0.2);

}


.botao-sair:active {
  transform: scale(0.98);
}

.botao-sair i {
  font-size: 18px;
}

.conteudo {
  flex-grow: 1;
  margin-left: 250px;
  padding: 30px;
  overflow-y: auto;
  background-color: #FFFFFF;
}

@media (max-width: 768px) {

  .sidebar {
    width: 200px;

  }

  .conteudo {
    margin-left: 200px;

    padding: 20px;

  }

  .logo {
    font-size: 20px;
    margin-bottom: 30px;
  }

  .menu-item {
    padding: 12px 15px;
    font-size: 14px;
  }
}


@media (max-width: 480px) {

  .sidebar {
    width: 100%;
    position: absolute;
    height: auto;
  }

  .conteudo {
    margin-left: 0;
    padding: 15px;
  }
}
</style>
