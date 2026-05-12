<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Gerenciamento de EPIs</h1>
      <p>Cadastre produtos e defina o saldo inicial.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome do EPI</label>
              <input v-model="form.nome" type="text" required placeholder="Ex: Capacete" />
            </div>
            <div class="form-group">
              <label>Quantidade em Estoque</label>
              <input v-model="form.quantidade" type="number" min="0" required />
            </div>
          </div>
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Cadastrar' }}
            </button>
            <button v-if="editandoId" @click="cancelar" type="button" class="btn btn-outline">Cancelar</button>
          </div>
        </form>
      </section>

      <section class="card-table">
        <table class="styled-table">
          <thead>
            <tr>
              <th>EPI</th>
              <th>Quantidade</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in epis" :key="e.id">
              <td class="text-bold">{{ e.nome }}</td>
              <td><span class="badge-qtd">{{ e.quantidade }}</span></td>
              <td class="text-center">
                <button @click="prepararEdicao(e)" class="btn-action edit">Editar</button>
                <button @click="excluir(e.id)" class="btn-action delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useSupabase } from "../composables/UseSupabase";

const { supabase } = useSupabase();
const epis = ref([]);
const editandoId = ref(null);
const form = reactive({ nome: "", quantidade: 0 });

const carregar = async () => {
  const { data, error } = await supabase.from("epis_novo").select("*").order("nome");
  if (!error) epis.value = data;
};

const salvar = async () => {
  try {
    const dados = { nome: form.nome, quantidade: Number(form.quantidade) };
    if (editandoId.value) {
      await supabase.from("epis_novo").update(dados).eq("id", editandoId.value);
    } else {
      await supabase.from("epis_novo").insert([dados]);
    }
    cancelar();
    await carregar();
    alert("Salvo!");
  } catch (e) { alert("Erro ao salvar"); }
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  form.nome = e.nome;
  form.quantidade = e.quantidade;
};

const cancelar = () => {
  editandoId.value = null;
  form.nome = ""; form.quantidade = 0;
};

const excluir = async (id) => {
  if (confirm("Excluir?")) {
    await supabase.from("epis_novo").delete().eq("id", id);
    carregar();
  }
};

onMounted(carregar);
</script>

<style>
:root {
  --primary-orange: #f18f3c;
  --btn-edit: #ffcc80;      /* Laranja claro da foto */
  --btn-dark: #6c757d;      /* Cinza neutro da foto */
  --bg-site: #f5f5f5;       /* Fundo cinza claro neutro */
  --text-main: #333333;
}

.layout-container {
  background: var(--bg-site);
  min-height: 100vh;
  padding: 2.5rem 1rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
}

.content {
  width: min(100%, 1000px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Cards em Branco Puro */
.card-form,
.card-table {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.card-header h3 {
  margin: 0 0 1.5rem;
  color: var(--text-main);
  font-size: 1.25rem;
  text-align: center;
}

/* Inputs com Fundo Branco */
.form-group input,
.form-group select {
  padding: 0.8rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-main);
  background: #ffffff;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-orange);
}

/* Botão de Cadastro em Cinza Neutro */
.btn-primary {
  background: var(--btn-dark);
  color: #ffffff;
  height: 3.2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

/* Tabela Limpa */
.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th {
  text-align: left;
  padding: 1rem;
  color: #888888;
  font-size: 0.75rem;
  text-transform: uppercase;
  border-bottom: 2px solid #f2f2f2;
}

.styled-table td {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f2f2f2;
  color: var(--text-main);
}

/* Botões de Ação Idênticos à Foto */
.btn-action {
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.edit { 
  background: var(--btn-edit); 
  color: #855000; 
}

.delete { 
  background: var(--btn-dark); 
  color: #ffffff; 
}

.btn-action:hover {
  opacity: 0.9;
}
</style>