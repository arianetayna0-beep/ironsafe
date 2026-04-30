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

            <div class="form-group">
              <label>Senha</label>
              <input
                v-model="form.senha"
                type="password"
                placeholder="Digite a senha"
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
                <button
                  @click="prepararEdicao(f)"
                  class="btn-action edit"
                >
                  Editar
                </button>

                <button
                  @click="excluir(f.id)"
                  class="btn-action delete"
                >
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
  email: "",
  senha: ""
});

const carregar = async () => {
  const { data, error } = await supabase
    .from("funcionarios")
    .select("*")
    .order("nome");

  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    funcionarios.value = data || [];
  }
};

const salvar = async () => {
  if (editandoId.value) {
    await supabase
      .from("funcionarios")
      .update({
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha
      })
      .eq("id", editandoId.value);
  } else {
    await supabase
      .from("funcionarios")
      .insert([
        {
          nome: form.nome,
          cpf: form.cpf,
          email: form.email,
          senha: form.senha
        }
      ]);
  }

  cancelarEdicao();
  carregar();
};

const prepararEdicao = (f) => {
  editandoId.value = f.id;

  Object.assign(form, {
    nome: f.nome,
    cpf: f.cpf,
    email: f.email,
    senha: f.senha || ""
  });
};

const excluir = async (id) => {
  if (confirm("Deseja realmente excluir este funcionário?")) {
    await supabase
      .from("funcionarios")
      .delete()
      .eq("id", id);

    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;

  Object.assign(form, {
    nome: "",
    cpf: "",
    email: "",
    senha: ""
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
  justify-content: flex-start;
  width: 100%;
  height: auto;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card-form,
.card-table {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid #e2e8f0;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-bar {
  display: flex;
  gap: 12px;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }

  .action-bar {
    flex-direction: column;
  }
}

</style>