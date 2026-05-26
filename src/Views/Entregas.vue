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
              <select v-model="form.funcionario_id" required>
                <option value="">Selecione o funcionário...</option>
                <option v-for="f in listaFuncionarios" :key="f.id" :value="f.id">
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
              <td>{{ h.funcionarios?.nome || 'Não informado' }}</td>
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
import { useSupabase } from "../composables/useSupabase";

const { supabase } = useSupabase();

// --- ESTADOS ---
const listaEpis = ref([]);
const listaFuncionarios = ref([]);
const historico = ref([]);
const form = reactive({
  funcionario_id: "",
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

    // Busca Histórico (com relação às tabelas de relacionamento)
    const { data: dHist, error: errHist } = await supabase
      .from("entregas")
      .select("*, epis(nome), funcionarios(nome)")
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
      funcionario_id: form.funcionario_id,
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
    form.funcionario_id = "";
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


.layout-container{
  max-width:1200px;
  margin:0 auto;
  padding:30px;

  min-height:100vh;

  display:flex;
  flex-direction:column;

  position:relative;
  z-index:1;

  font-family:'Inter',sans-serif;
}

.layout-container::before{
content:"";

position:fixed;
inset:0;

background:
linear-gradient(
rgba(12,30,50,.55),
rgba(12,30,50,.35)
),
url("../assets/login.jpg");

background-size:cover;
background-position:center;
background-repeat:no-repeat;

z-index:-1;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  color: white;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.6);
}

.header-section p {
  color: white;
  text-shadow: 1px 1px 8px rgba(0,0,0,0.6);
}

.content{
 width:100%;

 display:flex;
 flex-direction:column;

 gap:30px;
}


.card-form,
.card-table{
    width:100%;

    background:rgba(255,255,255,.28);

    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.45);

    border-radius:20px;

    box-shadow:0 10px 35px rgba(0,0,0,.15);

    padding:24px;
}

.main-form {
  display:flex;
  flex-direction:column;
  gap:20px;
}

.form-row {
  display:flex;
  gap:20px;
}

.form-group {
  flex:1;

  display:flex;
  flex-direction:column;

  gap:8px;
}

.form-group label {
  font-size:.85rem;
  font-weight:600;
  color:var(--text-main);
}

.form-group input,
.form-group select {
  padding:12px;

  border:1px solid #ced4da;

  border-radius:10px;

  background:#ffffff;

  color:var(--text-main);
}

.form-group input:focus,
.form-group select:focus {
  outline:none;

  border-color:var(--primary-orange);

  box-shadow:0 0 0 3px rgba(241,143,60,.12);
}

.action-bar{
display:flex;
gap:12px;
}

.styled-table{
width:100%;
border-collapse:collapse;
}

.styled-table th,
.styled-table td{
padding:12px;
text-align:left;
border-bottom:1px solid #e2e8f0;
}

.btn{
padding:10px 18px;
border-radius:10px;
cursor:pointer;
border:none;
font-weight:700;
}

.btn-primary{
background:var(--btn-dark);
color:white;
}

.btn-primary:hover{
background:#525962;
}

.error-msg{
color:red;
font-size:14px;
margin-top:10px;
}

.badge-qtd-out{
background:#6c757d;
color:white;
padding:4px 10px;
border-radius:10px;
font-size:14px;
}

@media(max-width:600px){
.form-row{
flex-direction:column;
}
}
</style>
