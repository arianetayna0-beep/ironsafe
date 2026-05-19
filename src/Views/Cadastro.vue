<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Gerenciamento de EPIs</h1>
      <p>Cadastre produtos e defina o saldo inicial.</p>
    </header>

    <main class="content">
      <section class="card-form">
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
        <h3>Últimos EPIs Cadastrados</h3>
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
import { useSupabase } from "../composables/useSupabase";

const { supabase } = useSupabase();
const epis = ref([]);
const editandoId = ref(null);
const form = reactive({ nome: "", quantidade: 0 });

const carregar = async () => {
  const { data, error } = await supabase.from("epis").select("*").order("nome");
  if (error) {
    console.error("Erro ao carregar EPIs:", error);
    alert("Erro ao carregar EPIs: " + error.message);
    return;
  }
  epis.value = data || [];
};

const salvar = async () => {
  const dados = { nome: form.nome.trim(), quantidade: Number(form.quantidade) };
  if (!dados.nome) {
    return alert("Informe o nome do EPI antes de salvar.");
  }

  if (dados.quantidade < 0) {
    return alert("A quantidade não pode ser negativa.");
  }

  if (editandoId.value) {
    const { error } = await supabase.from("epis").update(dados).eq("id", editandoId.value);
    if (error) {
      console.error("Erro ao atualizar EPI:", error);
      return alert("Erro ao atualizar EPI: " + error.message);
    }
  } else {
    const { error } = await supabase.from("epis").insert([dados]);
    if (error) {
      console.error("Erro ao cadastrar EPI:", error);
      return alert("Erro ao cadastrar EPI: " + error.message);
    }
  }

  cancelar();
  await carregar();
  alert("Salvo!");
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  form.nome = e.nome;
  form.quantidade = e.quantidade;
};

const cancelar = () => {
  editandoId.value = null;
  form.nome = "";
  form.quantidade = 0;
};

const excluir = async (id) => {
  if (!confirm("Excluir?")) return;

  const { error } = await supabase.from("epis").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir EPI:", error);
    return alert("Erro ao excluir EPI: " + error.message);
  }

  await carregar();
};

onMounted(carregar);
</script>

<style scoped>
:root {
  --primary-orange: #f18f3c;
  --btn-edit: #ffcc80;
  --btn-dark: #6c757d;
  --bg-site: #f5f5f5;
  --text-main: #333333;
}

.layout-container {
  background: var(--bg-site);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 { color: var(--text-main); }
.header-section p { color: #475569; }

.content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.card-form, .card-table {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 24px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.main-form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: flex; gap: 20px; }
.form-group { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
.form-group input { padding: 12px; border: 1px solid #ced4da; border-radius: 10px; background: #ffffff; color: var(--text-main); }
.form-group input:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 3px rgba(241, 143, 60, 0.12); }

.action-bar { display: flex; gap: 12px; }

.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th, .styled-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }

.btn { padding: 10px 18px; border-radius: 10px; cursor: pointer; border: none; font-weight: 700; }
.btn-primary { background: var(--btn-dark, #6c757d); color: white; }
.btn-primary:hover { background: #525962; }
.btn-outline { background: #f8fafc; color: var(--text-main, #333333); border: 1px solid #d1d5db; }

.btn-action { padding: 6px 12px; margin: 0 4px; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; }
.btn-action.edit { background: var(--btn-edit, #ffcc80); color: #92400e; }
.btn-action.delete { background: var(--btn-dark, #6c757d); color: #ffffff; }

@media (max-width: 600px) { .form-row { flex-direction: column; } }
</style>