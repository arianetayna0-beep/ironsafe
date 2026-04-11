// Importa o Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import Home from "../Views/Home.vue"
import Cadastro from "../Views/Cadastro.vue"
import Login from "../Views/Login.vue"
import Relatorio from "../Views/Relatorio.vue"  
import { useSupabase } from '../composable/UseSupabase.js'
import { useRouter } from 'vue-router'
import sidebar from '../components/sidebar.vue'
 
 
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
    {
        path: '/sidebar',
        name: 'Sidebar',
        alias: '/Sidebar',
        component: () => import('../components/Sidebar.vue')
    },
]
 
// Cria a instância do router
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
// Exporta para usar em main.js
export default router
 
 