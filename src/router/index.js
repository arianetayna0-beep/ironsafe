// Importa o Vue Router
import { createRouter, createWebHistory } from 'vue-router'
 
import Home from "../Views/Home.vue"
 
 
// Define todas as rotas da aplicação
const routes = [
  {
    path: '/',           // URL raiz
    name: 'Home',
    component: Home    // Mostra o componente Home
  },
   {
        path: '/cadastro',
        name: 'Cadastro',
        alias: '/Cadastro',
        component: () => import('../Views/Cadastro.vue')
    },
   {
        path: '/login',
        name: 'Login',
        alias: '/Login',
        component: () => import('../Views/Login.vue')
    },
  {
        path: '/epis',
        name: 'Relatorio',
        alias: '/Relatorio',
        component: () => import('../Views/Relatorio.vue')
    },
]
 
// Cria a instância do router
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
// Exporta para usar em main.js
export default router
 
 