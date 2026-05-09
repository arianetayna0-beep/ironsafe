<template>
  <main class="pagina">
    <section class="card">
      <h1>{{ editandoId ? 'Editar Funcionário' : 'Cadastro de Funcionário' }}</h1>
      
      <form @submit.prevent="salvarFuncionario">
        <label for="nome">Nome do funcionário</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          placeholder="Digite o nome"
          required
        />
        <p v-if="erro" class="erro">{{ erro }}</p>
        
        <div class="botoes-form">
          <button type="submit" class="btn-salvar">
            {{ editandoId ? 'Atualizar' : 'Cadastrar' }}
          </button>
          <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>

      <hr />

      <!-- Tabela de Listagem para Testar Exclusão e Edição -->
      <table class="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in funcionarios" :key="f.id">
            <td>{{ f.nome }}</td>
            <td>
              <button @click="prepararEdicao(f)" class="btn-edit">Editar</button>
              <button @click="excluirFuncionario(f.id)" class="btn-del">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/UseSupabase'

const { supabase } = useSupabase()
const nome = ref('')
const erro = ref('')
const funcionarios = ref([])
const editandoId = ref(null) // Armazena o ID do funcionário que está sendo editado

// 1. Carregar lista
async function listar() {
  const { data } = await supabase.from('funcionarios').select('*').order('nome')
  funcionarios.value = data || []
}

// 2. Salvar (Cadastrar ou Alterar)
async function salvarFuncionario() {
  erro.value = ''
  if (nome.value.trim() === '') {
    erro.value = 'O nome é obrigatório.'
    return
  }

  try {
    if (editandoId.value) {
      // ALTERAR: Usa o .eq('id', ...) para saber quem mudar
      await supabase
        .from('funcionarios')
        .update({ nome: nome.value })
        .eq('id', editandoId.value)
    } else {
      // INSERIR NOVO
      await supabase.from('funcionarios').insert([{ nome: nome.value }])
    }
    
    nome.value = ''
    editandoId.value = null
    await listar() // Atualiza a lista na tela
  } catch (e) {
    erro.value = 'Erro ao salvar dados.'
  }
}

// 3. Preparar Edição (Preenche o campo com o nome atual)
function prepararEdicao(f) {
  nome.value = f.nome
  editandoId.value = f.id
}

// 4. Excluir
async function excluirFuncionario(id) {
  if (confirm('Deseja realmente excluir este funcionário?')) {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id) // CRITICO: precisa do ID para deletar a linha certa
    
    if (error) alert('Erro ao excluir')
    else await listar()
  }
}

function cancelarEdicao() {
  nome.value = ''
  editandoId.value = null
}

onMounted(listar)
</script>

<style scoped>
.pagina { padding: 2rem; display: flex; justify-content: center; background: #f4f7f6; min-height: 100vh; }
.card { background: white; padding: 2rem; border-radius: 8px; width: 100%; max-width: 500px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; }
.erro { color: red; font-size: 0.8rem; }
.botoes-form { display: flex; gap: 10px; }
button { cursor: pointer; padding: 0.6rem 1rem; border-radius: 4px; border: none; font-weight: bold; }
.btn-salvar { background: #28a745; color: white; flex: 1; }
.btn-cancelar { background: #6c757d; color: white; }
.tabela { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.tabela th, .tabela td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; }
.btn-edit { background: #ffc107; margin-right: 5px; }
.btn-del { background: #dc3545; color: white; }
</style>