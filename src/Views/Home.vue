<template>
  <div class="home-content">
    <AppHeader />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
</script>

<style scoped>
.home-content {
    min-height: 100vh;
    width: 100%;
    background-image: url('../assets/homesite.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-color: #000;
}
</style>