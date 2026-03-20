// Importa o Vue Router
import { createRouter, createWebHistory } from 'vue-router'

// Importa todos os componentes das páginas
import Home from  '../Views/Home.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import Relatorio from '../views/Relatorio.vue'

// Define todas as rotas da aplicação
const routes = [
  { 
    path: '/Home',           // URL Home
    component: Home    // Mostra o componente Home
  },
  { 
    path: '/Login',       // URL /Login
    component: Login   // Mostra o componente Login
  },
  { 
    path: '/Cadastro',     // URL /Cadastro
    component: Cadastro // Mostra o componente Cadastro
  },
  { 
    path: '/Relatorio',    // URL /Relatorios
    component: Relatorio // Mostra o componente Relatorios
  }
]

// Cria a instância do router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Exporta para usar em main.js
export default router