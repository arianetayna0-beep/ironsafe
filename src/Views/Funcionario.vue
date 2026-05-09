<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Cadastro de Funcionários</h1>
      <p>Gerencie os colaboradores cadastrados no sistema.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
        </div>

        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo</label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="Digite o nome"
                required
              />
            </div>

            <div class="form-group">
              <label>CPF</label>
              <input
                v-model="form.cpf"
                type="text"
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Atualizar Dados' : 'Cadastrar Funcionário' }}
            </button>

            <button
              v-if="editandoId"
              type="button"
              @click="cancelarEdicao"
              class="btn btn-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="card-table">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="f in funcionarios" :key="f.id">
              <td>{{ f.nome }}</td>
              <td>{{ f.cpf }}</td>
              <td>{{ f.email }}</td>

              <td class="text-center">
                <button @click="prepararEdicao(f)" class="btn-action edit">
                  Editar
                </button>
                <button @click="excluir(f.id)" class="btn-action delete">
                  Excluir
                </button>
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

const funcionarios = ref([]);
const editandoId = ref(null);

const form = reactive({
  nome: "",
  cpf: "",
  email: ""
});

const carregar = async () => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome');

  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    funcionarios.value = data || [];
  }
};

const salvar = async () => {
  const payload = {
    nome: form.nome,
    cpf: form.cpf,
    email: form.email
  };

  if (editandoId.value) {
    const { error } = await supabase
      .from("funcionarios")
      .update(payload)
      .eq("id", editandoId.value);
    
    if (error) alert("Erro ao atualizar: " + error.message);
  } else {
    const { error } = await supabase
      .from('funcionarios')
      .insert([payload]);
    
    if (error) alert("Erro ao cadastrar: " + error.message);
  }

  cancelarEdicao();
  carregar();
};

const prepararEdicao = (f) => {
  editandoId.value = f.id;
  Object.assign(form, {
    nome: f.nome,
    cpf: f.cpf,
    email: f.email
  });
};

const excluir = async (id) => {
  if (confirm("Deseja realmente excluir este funcionário?")) {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq("id", id);

    if (error) alert("Erro ao excluir: " + error.message);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, {
    nome: "",
    cpf: "",
    email: ""
  });
};

onMounted(carregar);
</script>

<style scoped>
.layout-container {
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
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
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

.form-group input {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
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
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-primary { background: #2563eb; color: white; }
.btn-outline { background: #f1f5f9; color: #475569; }

.btn-action {
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.edit { background: #fef3c7; color: #92400e; }
.delete { background: #fee2e2; color: #b91c1c; }

@media (max-width: 600px) {
  .form-row { flex-direction: column; }
}
</style>