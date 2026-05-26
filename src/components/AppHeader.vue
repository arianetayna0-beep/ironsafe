<template>
  <header class="header-content">
    <img src="../assets/logo.png" alt="Logo" class="logo">

    <nav class="header-links">
      <router-link class="link active" to="/">
        Início
      </router-link>
    </nav>

    <div class="buttons">
      <button class="login-button" @click="router.push('/login')">
        Entrar
        <i class="pi pi-sign-in"></i>
      </button>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'

export default {
  setup() {
    const router = useRouter()

    return {
      router
    }
  }
}
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px; 
  height: 80px;    
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
  position: relative;
  z-index: 999;
}

.logo {
  width: 160px; 
  height: auto;
}

.header-links {
  display: flex;
  gap: 40px;
}

.link {
  text-decoration: none;
  color: #222;
  font-size: 1.1rem; 
  font-weight: 500;
  padding-bottom: 6px;
  position: relative;
  transition: color 0.2s ease;
}

.link:hover {
  color: #f18f3c;
}

.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 3px;
  background: #f18f3c;
  border-radius: 20px;
}

.buttons {
  display: flex;
}

.login-button {
  background: #f18f3c;
  color: white;
  border: none;
  padding: 10px 24px; 
  border-radius: 8px;
  font-size: 1.05rem; 
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(241, 143, 60, .3);
  transition: .3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  background: #df7d2d;
  box-shadow: 0 6px 20px rgba(241, 143, 60, .4);
}

.login-button i {
  font-size: 0.95rem;
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .header-content {
    padding: 0 24px;
    height: 75px;
  }

  .logo {
    width: 140px;
  }

  .header-links {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 16px;
  }

  .header-links {
    display: none; 
  }

  .logo {
    width: 130px;
  }

  .login-button {
    padding: 8px 16px;
    font-size: 0.95rem;
  }
}
</style>