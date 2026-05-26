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
import { useSupabase } from "../composables/useSupabase";
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
      email: form.email,
      senha: form.senha
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
    email: f.email,
    senha: f.senha || ''
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
    email: "",
    senha: ""
  });
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


.layout-container{
  width:100%;
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

.header-section h1{
font-size:2.8rem;
color:white;
margin:0;
text-shadow:0 4px 15px rgba(0,0,0,.45);
}

.header-section p{
margin-top:10px;
color:white;
font-size:1.1rem;
text-shadow:0 2px 10px rgba(0,0,0,.45);
}

.content {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin:0 auto;
}


.card-form,
.card-table{
   width:100%;
}


.card-form,
.card-table {
    background: rgba(255,255,255,0.35);

    border-radius: 16px;

    border: 1px solid rgba(255,255,255,0.55);

    padding: 24px;

    box-shadow: 0 18px 40px rgba(0,0,0,0.12);

    backdrop-filter: blur(10px);
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

.form-group input {
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  background: #ffffff;
  color: var(--text-main);
}

.form-group input:focus {
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