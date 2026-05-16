<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Entrega de EPI</h1>
      <p>Puxe a lista de funcionários e epis para registrar a saída.</p>
    </header>

    <main class="content">
      <!-- FORMULÁRIO -->
      <section class="card-form">
        <form @submit.prevent="registrarEntrega" class="main-form">
          <div class="form-row">
            
            <!-- Selecionar Funcionário -->
            <div class="form-group">
              <label>Funcionário</label>
              <select v-model="form.funcionario" required>
                <option value="">Selecione o funcionário...</option>
                <option v-for="f in listaFuncionarios" :key="f.id" :value="f.nome">
                  {{ f.nome }}
                </option>
              </select>
            </div>

            <!-- Selecionar EPI -->
            <div class="form-group">
              <label>EPI (Saldo atual)</label>
              <select v-model="form.epi_id" required>
                <option value="">Selecione o equipamento...</option>
                <option v-for="e in listaEpis" :key="e.id" :value="e.id">
                  {{ e.nome }} — (Estoque: {{ e.quantidade }})
                </option>
              </select>
            </div>

            <!-- Quantidade -->
            <div class="form-group">
              <label>Qtd. a Entregar</label>
              <input v-model="form.qtd" type="number" min="1" :max="saldoDisponivel" required />
            </div>
          </div>

          <div class="action-bar">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="!form.epi_id || form.qtd > saldoDisponivel"
            >
              Confirmar Entrega
            </button>
          </div>
          <p v-if="form.epi_id && form.qtd > saldoDisponivel" class="error-msg">
            Quantidade indisponível no estoque!
          </p>
        </form>
      </section>

      <!-- HISTÓRICO -->
      <section class="card-table">
        <h3>Últimas Entregas Realizadas</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Funcionário</th>
              <th>EPI</th>
              <th>Qtd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in historico" :key="h.id">
              <td>{{ new Date(h.created_at).toLocaleDateString() }}</td>
              <td>{{ h.funcionario }}</td>
              <td>{{ h.epis?.nome || 'EPI não encontrado' }}</td>
              <td><span class="badge-qtd-out">{{ h.quantidade_entregue }}</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useSupabase } from "../composables/UseSupabase";

const { supabase } = useSupabase();

// --- ESTADOS ---
const listaEpis = ref([]);
const listaFuncionarios = ref([]);
const historico = ref([]);
const form = reactive({
  funcionario: "",
  epi_id: "",
  qtd: 1
});

// --- COMPUTADA PARA SALDO ---
const saldoDisponivel = computed(() => {
  const selecionado = listaEpis.value.find(e => e.id === form.epi_id);
  return selecionado ? selecionado.quantidade : 0;
});

// --- CARREGAR DADOS ---
const carregarTudo = async () => {
  try {
    // Busca EPIs da tabela epis
    const { data: dEpis, error: errEpis } = await supabase.from("epis").select("*").order("nome");
    if (errEpis) throw errEpis;
    listaEpis.value = dEpis || [];

    // Busca Funcionários
    const { data: dFunc } = await supabase.from("funcionarios").select("*").order("nome");
    listaFuncionarios.value = dFunc || [];

    // Busca Histórico (com relação à tabela epis)
    const { data: dHist, error: errHist } = await supabase
      .from("entregas")
      .select("*, epis(nome)")
      .order("created_at", { ascending: false });
    if (errHist) throw errHist;
    historico.value = dHist || [];

  } catch (e) {
    console.error("Erro na carga:", e);
  }
};

// --- REGISTRAR E BAIXAR ESTOQUE ---
const registrarEntrega = async () => {
  try {
    // 1. Salva a entrega na tabela 'entregas'
    const { error: errInsert } = await supabase.from("entregas").insert([{
      funcionario: form.funcionario,
      epi_id: form.epi_id,
      quantidade_entregue: form.qtd
    }]);

    if (errInsert) throw errInsert;

    // 2. Diminui a quantidade na tabela 'epis' manualmente
    const novaQtd = saldoDisponivel.value - form.qtd;
    const { error: errUpdate } = await supabase
      .from("epis")
      .update({ quantidade: novaQtd })
      .eq("id", form.epi_id);

    if (errUpdate) throw errUpdate;

    // 3. Limpa e atualiza
    alert("Entrega confirmada e estoque atualizado!");
    form.funcionario = "";
    form.epi_id = "";
    form.qtd = 1;
    await carregarTudo();

  } catch (err) {
    alert("Erro na entrega: " + err.message);
  }
};

onMounted(carregarTudo);
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

.header-section h1 {
  color: var(--text-main);
}

.header-section p {
  color: #475569;
}

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

.main-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  background: #ffffff;
  color: var(--text-main);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-orange);
  box-shadow: 0 0 0 3px rgba(241, 143, 60, 0.12);
}

.action-bar {
  display: flex;
  gap: 12px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th, .styled-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.btn {
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  font-weight: 700;
}

.btn-primary { background: var(--btn-dark); color: white; }
.btn-primary:hover { background: #525962; }
.btn-outline { background: #f8fafc; color: var(--text-main); border: 1px solid #d1d5db; }

.btn-action {
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.btn-action.edit { background: var(--btn-edit); color: #92400e; }
.btn-action.delete { background: var(--btn-dark); color: #ffffff; }

@media (max-width: 600px) {
  .form-row { flex-direction: column; }
}
</style>