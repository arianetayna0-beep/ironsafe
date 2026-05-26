<template>
  <div class="home-content">
    <AppHeader/>

    <section class="hero">
      <div class="overlay">
        <div class="hero-text">
          <p class="subtitle">A plataforma completa para</p>
          <h1>
            empresas gerenciarem<br>
            <span>EPIs, funcionários e estoque</span><br>
            com segurança e eficiência.
          </h1>

          <div class="line"></div>

          <p class="description">
            Controle seu estoque, acompanhe entregas e mantenha sua equipe protegida com praticidade e organização.
          </p>

          <div class="info-card">
            <div class="icon">🏢</div>
            <div>
              <strong>Solução exclusiva para empresas</strong>
              <p>e gestão de estoque setorial.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-top">
        <div class="footer-logo">
          <img src="../assets/logo.png" alt="IronSafe Logo">
          <div>
            <p>Sistema de gerenciamento de EPIs</p>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon">✉</div>
          <div>
            <strong>E-mail</strong>
            <p>contato@ironsafe.com</p>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon">📞</div>
          <div>
            <strong>Telefone</strong>
            <p>(12) 99999-9999</p>
          </div>
        </div>
      </div>

      <div class="copyright">
        © 2026 IRONSAFE. Todos os direitos reservados.
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue"
</script>

<style scoped>
.home-content {
  min-height: 100vh;
  background: black;
}

.hero {
  height: 84vh;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.60),
      rgba(0, 0, 0, 0.80)
    ),
    url("../assets/homesite.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.overlay {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px; 
}

.hero-text {
  max-width: 580px; /* Garante que o texto fique na esquerda e não cubra o centro da foto */
  color: white;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

h1 {
  font-size: 2.6rem; 
  line-height: 1.25;
  font-weight: 800;
  margin-bottom: 20px;
}

span {
  color: #f18f3c;
}

.line {
  width: 60px; 
  height: 4px;
  background: #f18f3c;
  margin: 25px 0;
}

.description {
  font-size: 1.05rem; 
  line-height: 1.6;
  margin-bottom: 35px;
  color: #e2e8f0;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 24px;
  max-width: 420px; 
  width: 100%;
  border: 1px solid rgba(241, 143, 60, 0.4);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.info-card strong {
  font-size: 0.95rem;
}

.info-card p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 2px;
}

.icon {
  font-size: 32px;
}

/* FOOTER */
.footer {
  background: #111827;
  padding: 40px 20px;
  color: white;
}

.footer-top {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; 
  gap: 30px;
}

.footer-logo img {
  width: 200px;
}

.footer-logo p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 5px;
}

.contact-item {
  display: flex;
  gap: 15px;
  align-items: center;
}

.contact-item strong {
  font-size: 0.95rem;
}

.contact-item p {
  font-size: 0.9rem;
  color: #94a3b8;
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #f18f3c;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #f18f3c;
}

.copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 25px;
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
}

/* ================= RESPONSIVIDADE ================= */

@media (max-width: 968px) {
  .hero {
    background-position: 35% center; 
  }

  .overlay {
    padding: 0 30px;
  }

  .hero-text {
    max-width: 480px; 
  }

  h1 {
    font-size: 2.2rem;
  }

  .footer-top {
    justify-content: center;
    text-align: center;
    flex-direction: column; 
  }

  .contact-item {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 576px) {
  .hero {
    height: auto;
    min-height: 90vh;
    padding: 80px 0 40px 0; 
  }

  .overlay {
    padding: 0 20px;
  }

  .hero-text {
    max-width: 100%;
    text-align: center; 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .subtitle {
    font-size: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    line-height: 1.3;
  }

  .line {
    margin: 15px 0;
  }

  .description {
    font-size: 0.95rem;
  }

  .info-card {
    max-width: 100%;
    text-align: left; 
  }
}
</style>