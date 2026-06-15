// Importa o Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '../composables/useSupabase'
import Home from "../Views/Home.vue"
import Dashboard from "../Views/Dashboard.vue"
import Entregas from "../Views/Entregas.vue"
import Funcionario from "../Views/Funcionario.vue"

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
        path: '/dashboard',
        alias: '/Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
 
        children: [
            { path: '', redirect: '/dashboard/funcionario' },
            { path: 'entregas', name: 'entregas', component: Entregas },
            { path: 'relatorio', name: 'relatorio', component: () => import('../Views/Relatorio.vue') },
            { path: 'cadastro', name: 'dashboard-cadastro', component: () => import('../Views/Cadastro.vue') },
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