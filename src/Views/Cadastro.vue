<template>
  <div class="layout-container">

    <header class="header-section">
      <h1>Cadastro de EPIs</h1>
      <p>Gerencie os Equipamentos de Proteção Individual cadastrados.</p>
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
              <input
                v-model="form.nome"
                type="text"
                placeholder="Ex: Capacete de Segurança"
                required
              />
            </div>

            <div class="form-group">
              <label>Quantidade</label>
              <input
                v-model="form.quantidade"
                type="number"
                placeholder="Ex: 50"
                required
              />
            </div>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Cadastrar EPI' }}
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
              <th>Equipamento</th>
              <th>Quantidade</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="e in epis" :key="e.id">
              <td>
                <span class="text-bold">{{ e.nome }}</span>
              </td>

              <td>
                <span class="badge-qtd">
                  {{ e.quantidade }}
                </span>
              </td>

              <td class="text-center">
                <button
                  @click="prepararEdicao(e)"
                  class="btn-action edit"
                >
                  Editar
                </button>

                <button
                  @click="excluir(e.id)"
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

const epis = ref([]);
const editandoId = ref(null);

const form = reactive({
  nome: "",
  quantidade: 0
});

const carregar = async () => {
  const { data, error } = await supabase
    .from("epis")
    .select("*")
    .order("nome");

  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    epis.value = data || [];
  }
};

const salvar = async () => {
  if (editandoId.value) {
    await supabase
      .from("epis")
      .update({
        nome: form.nome,
        quantidade: form.quantidade
      })
      .eq("id", editandoId.value);
  } else {
    await supabase
      .from("epis")
      .insert([
        {
          nome: form.nome,
          quantidade: form.quantidade
        }
      ]);
  }

  cancelarEdicao();
  carregar();
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;

  Object.assign(form, {
    nome: e.nome,
    quantidade: e.quantidade
  });
};

const excluir = async (id) => {
  if (confirm("Deseja excluir este equipamento?")) {
    await supabase
      .from("epis")
      .delete()
      .eq("id", id);

    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;

  Object.assign(form, {
    nome: "",
    quantidade: 0
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