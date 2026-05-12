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
  background: #f5f5f5; /* Cinza claro neutro da imagem */
  min-height: 100vh; 
  font-family: 'Inter', sans-serif;
}

.card { 
  background: #ffffff; /* Branco puro */
  padding: 2rem; 
  border-radius: 12px; 
  width: 100%; 
  max-width: 900px; /* Aumentado para acomodar bem a tabela */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); 
  border: 1px solid #e0e0e0;
}

form { 
  display: flex; 
  flex-direction: column; 
  gap: 1.2rem; 
  margin-bottom: 2.5rem; 
}

input { 
  padding: 0.8rem 1rem; 
  border: 1px solid #ced4da; 
  border-radius: 8px; 
  background: #ffffff;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #f18f3c; /* Laranja no destaque */
}

.botoes-form { 
  display: flex; 
  gap: 12px; 
}

button { 
  cursor: pointer; 
  padding: 0.8rem 1.5rem; 
  border-radius: 8px; 
  border: none; 
  font-weight: 600; 
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

/* Botão Principal em Cinza Grafite */
.btn-salvar { 
  background: #6c757d; 
  color: white; 
  flex: 1; 
}

/* Botão Cancelar em Cinza mais suave */
.btn-cancelar { 
  background: #adb5bd; 
  color: white; 
}

/* Estilo da Tabela */
.tabela { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 1rem; 
}

.tabela th {
  color: #888888;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px;
  border-bottom: 2px solid #f2f2f2;
  text-align: left;
}

.tabela td { 
  border-bottom: 1px solid #f2f2f2; 
  padding: 14px 12px; 
  color: #333333;
  font-size: 0.95rem;
}

/* Botão Editar (Laranja Pastel) */
.btn-edit { 
  background: #ffcc80; 
  color: #855000; 
  margin-right: 5px; 
}

/* Botão Excluir (Cinza Grafite para manter o padrão) */
.btn-del { 
  background: #6c757d; 
  color: white; 
}

button:hover {
  opacity: 0.9;
}
</style>