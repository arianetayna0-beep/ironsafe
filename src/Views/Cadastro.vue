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
.layout-container { background: #f1f5f9; min-height: 100vh; padding: 2rem; font-family: 'Inter', sans-serif; }
.content { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
.card-form, .card-table { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 600; color: #475569; font-size: 0.9rem; }
.form-group input, .form-group select { padding: 0.7rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
.btn { padding: 0.8rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover { background: #2563eb; }
.btn-outline { background: #f8fafc; border: 1px solid #cbd5e1; color: #64748b; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { text-align: left; padding: 1rem; background: #f8fafc; color: #64748b; font-size: 0.8rem; text-transform: uppercase; }
.styled-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
.badge-qtd { background: #dcfce7; color: #166534; padding: 0.3rem 0.7rem; border-radius: 20px; font-weight: bold; }
.badge-qtd-out { background: #fee2e2; color: #991b1b; padding: 0.3rem 0.7rem; border-radius: 20px; font-weight: bold; }
.btn-action { padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; border: none; margin: 0 0.2rem; }
.edit { background: #fef9c3; color: #854d0e; }
.delete { background: #fee2e2; color: #991b1b; }
</style>