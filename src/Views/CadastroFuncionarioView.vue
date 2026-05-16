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
.pagina {
  padding: 2.5rem 1rem;
  display: flex;
  justify-content: center;
  background: #edf2f7;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
}

input {
  padding: 0.8rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f8fafc;
  color: #1f2937;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #f18f3c;
  box-shadow: 0 0 0 3px rgba(241, 143, 60, 0.12);
}

.botoes-form {
  display: flex;
  gap: 12px;
}

button {
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s, transform 0.2s ease;
}

.btn-salvar {
  background: #334155;
  color: white;
  flex: 1;
}

.btn-salvar:hover {
  transform: translateY(-1px);
}

.btn-cancelar {
  background: #f8fafc;
  color: #1f2937;
  border: 1px solid #d1d5db;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.tabela th {
  color: #64748b;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
}

.tabela td {
  border-bottom: 1px solid #e2e8f0;
  padding: 14px 12px;
  color: #1f2937;
  font-size: 0.95rem;
}

.btn-edit {
  background: #ffcc80;
  color: #92400e;
  margin-right: 5px;
}

.btn-del {
  background: #334155;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
