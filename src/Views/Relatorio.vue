<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Painel de Controle de EPIs</h1>
      <p>Gestão de inventário e rastreabilidade de entregas.</p>
    </header>

    <div v-if="loadingEstoque" class="info-banner">Sincronizando inventário...</div>

    <div class="dashboard-grid">
      <!-- Gráfico 01: Pizza -->
      <div class="card chart-card">
        <div class="card-header"><h3>Saúde do Inventário</h3></div>
        <div class="chart-box">
          <Pie 
            v-if="estoqueProcessado.length > 0" 
            :data="pieChartData" 
            :options="chartOptions" 
            :key="'pie-' + componentKey"
          />
          <div v-else class="placeholder">Carregando dados...</div>
        </div>
      </div>

      <!-- Gráfico 02: Barras -->
      <div class="card chart-card">
        <div class="card-header"><h3>Níveis Críticos</h3></div>
        <div class="chart-box">
          <Bar 
            v-if="estoqueProcessado.length > 0" 
            :data="barChartData" 
            :options="chartOptions" 
            :key="'bar-' + componentKey"
          />
          <div v-else class="placeholder">Analisando estoque...</div>
        </div>
      </div>
    </div>

    <!-- Filtros e Ações -->
    <div class="card filter-card">
      <div class="form-row">
        <div class="form-group">
          <label>Funcionário</label>
          <select v-model="filtros.funcionario_id">
            <option value="">Todos</option>
            <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
          </select>
        </div>
        <div class="form-group"><label>Início</label><input type="date" v-model="filtros.data_inicio" /></div>
        <div class="form-group"><label>Fim</label><input type="date" v-model="filtros.data_fim" /></div>
      </div>
      <div class="action-bar">
        <button class="btn btn-primary" @click="buscarTudo" :disabled="loading">🔄 Atualizar Tudo</button>
        <button class="btn btn-pdf" @click="exportarPDF" :disabled="entregas.length === 0">📄 Gerar Relatório PDF</button>
      </div>
    </div>

    <!-- Tabela -->
    <div class="card table-card">
      <div class="table-responsive">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Funcionário</th>
              <th>EPI</th>
              <th class="text-center">Qtd</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in entregas" :key="e.id">
              <td>{{ formatarData(e.created_at) }}</td>
              <td><strong>{{ e.funcionario || 'Não informado' }}</strong></td>
              <td>{{ e.epis?.nome || 'EPI não vinculado' }}</td>
              <td class="text-center">{{ e.quantidade_entregue }}</td>
              <td class="text-center">
                <div class="acoes-container">
                  <button @click="prepararEdicao(e)" class="btn-edit" title="Editar">Editar</button>
                  <button @click="excluirEntrega(e.id)" class="btn-del" title="Excluir">Excluir</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const { supabase } = useSupabase()
const entregas = ref([])
const funcionarios = ref([])
const estoqueProcessado = ref([])
const loading = ref(false)
const loadingEstoque = ref(false)
const componentKey = ref(0)
const filtros = ref({ funcionario_id: '', data_inicio: '', data_fim: '' })

// GRÁFICOS
const pieChartData = computed(() => {
  const data = estoqueProcessado.value
  return {
    labels: ['Estoque OK', 'Estoque Baixo', 'Esgotado'],
    datasets: [{
      backgroundColor: ['#0f172a', '#fbbf24', '#f18f3c'],
      borderColor: ['#0f172a', '#d16b27', '#a45100'],
      borderWidth: 2,
      data: [
        data.filter(i => i.quantidade >= 10).length,
        data.filter(i => i.quantidade < 10 && i.quantidade > 0).length,
        data.filter(i => i.quantidade <= 0).length
      ]
    }]
  }
})

const barChartData = computed(() => {
  const criticos = [...estoqueProcessado.value].sort((a,b) => a.quantidade - b.quantidade).slice(0,5)
  return {
    labels: criticos.map(i => i.nome_epi),
    datasets: [{
      label: 'Qtd Atual',
      backgroundColor: '#fbbf24',
      borderColor: '#0f172a',
      borderWidth: 1,
      borderRadius: 16,
      maxBarThickness: 40,
      barPercentage: 0.65,
      categoryPercentage: 0.75,
      hoverBackgroundColor: '#d16b27',
      data: criticos.map(i => i.quantidade)
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1400, easing: 'easeOutQuart' },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#334155',
        boxWidth: 14,
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#fbbf24',
      bodyColor: '#f8fafc',
      borderColor: '#f18f3c',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10
    }
  },
  layout: {
    padding: { top: 12, right: 12, left: 12, bottom: 12 }
  },
  cutout: '60%',
  scales: {
    x: {
      ticks: { color: '#475569', font: { size: 12 } },
      grid: { display: false },
      border: { color: 'rgba(15, 23, 42, 0.16)' }
    },
    y: {
      ticks: { color: '#475569', font: { size: 12 }, beginAtZero: true },
      grid: { color: 'rgba(15, 23, 42, 0.08)' },
      border: { color: 'rgba(15, 23, 42, 0.16)' }
    }
  }
}

// LOGICA DE DADOS
async function carregarEstoqueEfetivo() {
  loadingEstoque.value = true
  try {
    const [resEstoque, resEpis] = await Promise.all([
      supabase.from('estoque').select('*'),
      supabase.from('epis').select('id, nome')
    ])
    const episMap = Object.fromEntries(resEpis.data.map(item => [item.id, item.nome]))
    estoqueProcessado.value = resEstoque.data.map(item => ({
      ...item,
      nome_epi: episMap[item.epi_id] || episMap[item.id_epi] || 'EPI Desconhecido'
    }))
    componentKey.value++
  } catch (err) {
    console.error("Erro estoque:", err)
  } finally {
    loadingEstoque.value = false
  }
}

async function buscarEntregas() {
  loading.value = true
  let query = supabase.from('entregas').select('*, funcionarios(nome), epis(nome, ca)').order('data_entrega', { ascending: false })
  if (filtros.value.funcionario_id) query = query.eq('funcionario_id', filtros.value.funcionario_id)
  if (filtros.value.data_inicio) query = query.gte('data_entrega', filtros.value.data_inicio)
  if (filtros.value.data_fim) query = query.lte('data_entrega', filtros.value.data_fim)
  const { data } = await query
  entregas.value = data || []
  loading.value = false
}

// FUNÇÃO PDF
function exportarPDF() {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Relatório de Entregas de EPIs', 14, 20)
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 28)

  autoTable(doc, {
    startY: 35,
    head: [['Data', 'Funcionário', 'EPI / CA', 'Qtd', 'Assinatura']],
    body: entregas.value.map(e => [
      formatarData(e.data_entrega),
      e.funcionarios?.nome || 'N/A',
      `${e.epis?.nome || 'N/A'} (CA: ${e.epis?.ca || '-'})`,
      e.quantidade,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }
  })

  doc.save(`relatorio-epis-${filtros.value.data_inicio || 'geral'}.pdf`)
}

async function carregarFuncionarios() {
  const { data } = await supabase.from('funcionarios').select('id, nome').order('nome')
  funcionarios.value = data || []
}

const buscarTudo = () => { carregarEstoqueEfetivo(); buscarEntregas(); }
const formatarData = (d) => d ? new Date(d).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '—'

onMounted(() => { carregarFuncionarios(); buscarTudo(); })
</script>
<style scoped>
:root {
  --primary-orange: #f18f3c;
  --btn-edit: #ffcc80;
  --btn-dark: #334155;
  --bg-site: #edf2f7;
  --text-main: #111827;
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background: var(--bg-site);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-section { margin-bottom: 20px; }
.header-section h1 { font-size: 1.8rem; color: var(--text-main); margin: 0; }
.header-section p { margin-top: 6px; color: #475569; }

.info-banner { background: #f9f4ec; color: #6a3a11; padding: 12px 14px; border-radius: 12px; margin-bottom: 18px; font-size: 0.95rem; text-align: center; border: 1px solid #f4d4b1; }

.card { background: white; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 30px; }
.chart-box { height: 360px; position: relative; }

.filter-card { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; font-weight: 600; color: #475569; }
input, select { padding: 1rem 1.1rem; border: 1px solid #d1d5db; border-radius: 14px; color: #111111; background: #f8fafc; }
input:focus, select:focus { outline: none; border-color: var(--primary-orange); box-shadow: 0 0 0 4px rgba(241, 143, 60, 0.12); }

.action-bar { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 12px; }
.btn { padding: 14px 26px; border-radius: 14px; border: none; cursor: pointer; font-weight: 700; transition: transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease; }
.btn:disabled { background: #e2e8f0; cursor: not-allowed; color: #94a3b8; }

.btn-primary { background: var(--btn-dark); color: #ffffff; border-radius: 14px; padding: 14px 26px; box-shadow: 0 18px 44px rgba(15,23,42,0.12); }
.btn-primary:hover { background: #1e293b; transform: translateY(-1px); }

.btn-pdf { background: var(--primary-orange); color: #111111; border-radius: 14px; padding: 14px 26px; box-shadow: 0 18px 44px rgba(241,143,60,0.18); }
.btn-pdf:hover { opacity: 0.95; transform: translateY(-1px); }

.table-responsive { overflow-x: auto; }
.styled-table { width: 100%; min-width: 720px; border-collapse: separate; border-spacing: 0; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08); }
.styled-table thead { background: #f8fafc; }
.styled-table th { padding: 16px 20px; text-align: left; font-size: 0.8rem; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #e2e8f0; }
.styled-table td { padding: 16px 20px; border-top: 1px solid #f1f5f9; font-size: 0.92rem; color: #111111; }
tbody tr:nth-child(even) { background: #fafafa; }

.acoes-container { display: inline-flex; gap: 10px; justify-content: center; }
.btn-edit { padding: 10px 16px; border-radius: 12px; border: none; font-weight: 700; background: var(--btn-edit); color: #92400e; transition: background-color 0.2s ease, transform 0.2s ease; }
.btn-edit:hover { opacity: 0.95; }
.btn-del { padding: 10px 16px; border-radius: 12px; border: none; font-weight: 700; background: var(--btn-dark); color: #ffffff; transition: background-color 0.2s ease, transform 0.2s ease; }
.btn-del:hover { background: #1e293b; transform: translateY(-1px); }
.text-center { text-align: center; }
.placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; }

@media (max-width: 720px) { .styled-table { min-width: 0; } }

</style>
