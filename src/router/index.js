// Importa o Vue Router e o composable
import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

// Define todas as rotas da aplicação com Code-Splitting automático
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../Views/Home.vue') // Dinâmico para aliviar o peso inicial
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
    component: () => import('../Views/Dashboard.vue'), // Transformado em dinâmico
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/funcionario' },
      { path: 'entregas', name: 'entregas', component: () => import('../Views/Entregas.vue') }, // Transformado em dinâmico
      { path: 'relatorio', name: 'relatorio', component: () => import('../Views/Relatorio.vue') },
      { path: 'cadastro', name: 'dashboard-cadastro', component: () => import('../Views/Cadastro.vue') },
      { path: 'funcionario', name: 'funcionario', component: () => import('../Views/Funcionario.vue') } // Transformado em dinâmico
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