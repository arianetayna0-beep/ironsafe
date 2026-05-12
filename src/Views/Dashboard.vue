<template>
  <div class="dashboard">
    <sidebar />
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .dashboard {
    padding-bottom: 60px;
  }
}
</style>

<script setup>
import sidebar from '../components/sidebar.vue';
</script>

  