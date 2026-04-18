// Importa o Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '../composable/useSupabase'
import { createApp } from 'vue'
import Home from "../Views/Home.vue"
import Cadastro from "../Views/Cadastro.vue"
import Login from "../Views/Login.vue"
import Relatorio from "../Views/Relatorio.vue"  
import Dashboard from "../Views/Dashboard.vue"
import Entregas from "../Views/Entregas.vue"
import Funcionario from "../Views/Funcionario.vue"
import sidebar from '../components/sidebar.vue'
 
const { supabase } = useSupabase()

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
        path: '/relatorio',
        name: 'Relatorio',
        alias: '/Relatorio',
        component: () => import('../Views/Relatorio.vue')
    },
    {
        path: '/sidebar',
        name: 'Sidebar',
        alias: '/Sidebar',
        component: () => import('../components/sidebar.vue')
    }, 
     {
        path: '/dashboard',
        name: 'dashboard',
        alias: '/Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
 
        children: [
            { path: '', redirect: '/dashboard/funcionario' },
            { path: 'entregas', name: 'entregas', component: Entregas },
            { path: 'relatorio', name: 'relatorio', component: Relatorio },
            { path: 'cadastro', name: 'dashboard-cadastro', component: Cadastro },
            { path: 'funcionario', name: 'funcionario', component: Funcionario }
        ]
    }
 

]
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const { data: { session } } = await supabase.auth.getSession()
 
    if (requiresAuth && !session) {
        return '/login'
    }
 
    return true
})
 
 
export default router



