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
              <td>{{ h.epis_novo?.nome || 'EPI não encontrado' }}</td>
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
    // Busca EPIs da epis_novo
    const { data: dEpis } = await supabase.from("epis_novo").select("*").order("nome");
    listaEpis.value = dEpis || [];

    // Busca Funcionários
    const { data: dFunc } = await supabase.from("funcionarios").select("*").order("nome");
    listaFuncionarios.value = dFunc || [];

    // Busca Histórico (com relação à epis_novo)
    const { data: dHist } = await supabase
      .from("entregas")
      .select("*, epis_novo(nome)")
      .order("created_at", { ascending: false });
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

    // 2. Diminui a quantidade na tabela 'epis_novo' manualmente
    const novaQtd = saldoDisponivel.value - form.qtd;
    const { error: errUpdate } = await supabase
      .from("epis_novo")
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
.layout-container { background: #f1f5f9; min-height: 100vh; padding: 2rem; font-family: sans-serif; }
.content { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
.card-form, .card-table { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: bold; color: #475569; }
.form-group input, .form-group select { padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 8px; }
.btn-primary { background: #3b82f6; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; }
.btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
.styled-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.styled-table th, .styled-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
.badge-qtd-out { background: #fee2e2; color: #991b1b; padding: 0.2rem 0.6rem; border-radius: 10px; font-weight: bold; }
.error-msg { color: #dc2626; font-weight: bold; margin-top: 1rem; }
</style>