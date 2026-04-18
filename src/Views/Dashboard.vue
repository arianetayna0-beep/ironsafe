<template>
  <div class="dashboard">
    <sidebar />
    <h1>Dashboard</h1>
    <p class="sub">Bem-vinda ao sistema de controle de EPIs 👷‍♀️</p>

    <div class="cards">
      <div class="card">
        <h3>Funcionários</h3>
        <p>25</p>
      </div>

      <div class="card">
        <h3>EPIs Entregues</h3>
        <p>120</p>
      </div>

      <div class="card">
        <h3>Em Estoque</h3>
        <p>80</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}


/* título */
h1 {
  margin-bottom: 5px;
}


.sub {
  color: #666;
  margin-bottom: 20px;
}


/* cards */
.cards {
  display: flex;
  gap: 20px;
}


.card {
  background: white;
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}


.card h3 {
  margin: 0;
  color: #ff6600;
}


.card p {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style>

<script setup>
import sidebar from '../components/sidebar.vue';
</script>

  