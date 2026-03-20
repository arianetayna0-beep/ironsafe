<template>
  <AppHeader />
    <div class="home">                                                               <!-- div principal que centraliza o conteúdo -->
    <section class="home__hero">                                                   <!-- seção com título, texto e imagem -->

      <div class="home__hero-texto">                                               <!-- lado esquerdo: título e descrição -->
        <h1>Sistema de Gestão de EPI</h1>                                         <!-- título principal da página -->
        <p>Gerencie os EPIs dos seus colaboradores de forma simples e segura.</p> <!-- texto de apresentação -->
      </div>                                                                       <!-- fecha o bloco de texto -->

      <div class="home__hero-imagem">                                             <!-- lado direito: imagem ilustrativa -->
        <img                                                                       <!-- tag de imagem -->
          src="../assets/hero.png"                                                 <!-- caminho da imagem hero -->
          alt="Ilustração de gestão de EPI"                                        <!-- texto se a imagem não carregar -->
          class="home__hero-img"                                                   <!-- classe CSS que estiliza a imagem -->
        />                                                                         <!-- tag img não tem fechamento -->
      </div>                                                                       <!-- fecha o bloco de imagem -->

    </section>                                                                     <!-- fecha a seção hero -->

    <!-- ========== CARDS DE RESUMO ========== -->
    <section class="home__cards">                                                  <!-- seção com os 4 cards de números -->

      <div class="card">                                                           <!-- card: total de EPIs -->
        <span class="card__icone">🪖</span>                                       <!-- ícone do card -->
        <span class="card__numero">124</span>                                     <!-- número em destaque -->
        <span class="card__label">Total de EPIs</span>                            <!-- legenda do número -->
      </div>                                                                       <!-- fecha o card -->

      <div class="card">                                                           <!-- card: colaboradores -->
        <span class="card__icone">👷</span>                                       <!-- ícone do card -->
        <span class="card__numero">48</span>                                      <!-- número em destaque -->
        <span class="card__label">Colaboradores</span>                            <!-- legenda do número -->
      </div>                                                                       <!-- fecha o card -->

      <div class="card">                                                           <!-- card: entregas realizadas -->
        <span class="card__icone">📦</span>                                       <!-- ícone do card -->
        <span class="card__numero">89</span>                                      <!-- número em destaque -->
        <span class="card__label">Entregas realizadas</span>                      <!-- legenda do número -->
      </div>                                                                       <!-- fecha o card -->

      <div class="card card--alerta">                                             <!-- card: EPIs vencendo (com destaque laranja) -->
        <span class="card__icone">⚠️</span>                                       <!-- ícone de alerta -->
        <span class="card__numero">7</span>                                       <!-- número em destaque -->
        <span class="card__label">EPIs vencendo</span>                            <!-- legenda do número -->
      </div>                                                                       <!-- fecha o card de alerta -->

    </section>                                                                     <!-- fecha a seção de cards -->

    <!-- ========== COMO USAR ========== -->
    <section class="home__instrucoes">                                            <!-- seção com os 4 passos de uso -->

      <h2 class="home__instrucoes-titulo">Como usar o sistema</h2>               <!-- título da seção -->

      <div class="home__passos">                                                  <!-- grade com os 4 passos -->

        <div class="passo">                                                        <!-- passo 1 -->
          <span class="passo__numero">1</span>                                    <!-- círculo com o número -->
          <h3>Cadastre os colaboradores</h3>                                      <!-- título do passo -->
          <p>Acesse o menu Colaboradores e registre cada funcionário com seus dados.</p> <!-- descrição -->
        </div>                                                                     <!-- fecha o passo 1 -->

        <div class="passo">                                                        <!-- passo 2 -->
          <span class="passo__numero">2</span>                                    <!-- círculo com o número -->
          <h3>Cadastre os EPIs</h3>                                               <!-- título do passo -->
          <p>Vá em Equipamentos e adicione os EPIs disponíveis com validade e quantidade.</p> <!-- descrição -->
        </div>                                                                     <!-- fecha o passo 2 -->

        <div class="passo">                                                        <!-- passo 3 -->
          <span class="passo__numero">3</span>                                    <!-- círculo com o número -->
          <h3>Registre as entregas</h3>                                           <!-- título do passo -->
          <p>Em Entregas, vincule o EPI ao colaborador e registre a data de entrega.</p> <!-- descrição -->
        </div>                                                                     <!-- fecha o passo 3 -->

        <div class="passo">                                                        <!-- passo 4 -->
          <span class="passo__numero">4</span>                                    <!-- círculo com o número -->
          <h3>Acompanhe os relatórios</h3>                                        <!-- título do passo -->
          <p>Monitore validades e histórico de entregas pelo menu Relatórios.</p> <!-- descrição -->
        </div>                                                                     <!-- fecha o passo 4 -->
        <img class="image-logo" src="../assets/logo.png" alt="Logo">
      </div>                                                                       <!-- fecha a grade de passos -->

    </section>                                                                     <!-- fecha a seção de instruções -->

  </div>                                                                           <!-- fecha a div principal -->

</template>                                                                        <!-- fecha o template -->


<style scoped>                                                                     /* CSS só vale neste componente */
/* estilo do <div class="home"> */
.home {
  max-width: 1100px;                                                               /* largura máxima da página */
  margin: 0 auto;                                                                  /* centraliza na tela */
  padding: 2rem;                                                                   /* espaço interno */
}

/* estilo do <section class="home__hero"> */
.home__hero {
  display: flex;                                                                   /* texto e imagem lado a lado */
  align-items: center;                                                             /* centraliza verticalmente */
  gap: 2rem;                                                                       /* espaço entre texto e imagem */
  margin-bottom: 3rem;                                                             /* espaço abaixo da seção */
}

.home__hero-texto { flex: 1; }                                                    /* ocupa metade do espaço */
.home__hero-imagem { flex: 1; }                                                   /* ocupa metade do espaço */

/* estilo do <h1> dentro de .home__hero-texto */
.home__hero-texto h1 {
  font-size: 28px;                                                                 /* tamanho do título */
  color: #1E3A5F;                                                                  /* azul escuro institucional */
  margin-bottom: 1rem;                                                             /* espaço abaixo do título */
}

/* estilo do <p> dentro de .home__hero-texto */
.home__hero-texto p {
  font-size: 15px;                                                                 /* tamanho do texto */
  color: #555;                                                                     /* cinza médio */
  line-height: 1.7;                                                                /* espaço entre linhas */
}

/* estilo do <img class="home__hero-img"> */
.home__hero-img {
  width: 100%;                                                                     /* ocupa toda a largura do bloco */
  border-radius: 12px;                                                             /* cantos arredondados */
}

/* estilo do <section class="home__cards"> */
.home__cards {
  display: grid;                                                                   /* organiza os cards em grade */
  grid-template-columns: repeat(4, 1fr);                                           /* cria 4 colunas de tamanho igual */
  gap: 1.5rem;                                                                     /* espaço entre os cards */
  margin-bottom: 3rem;                                                             /* espaço abaixo da seção */
}

/* estilo do <div class="card"> */
.card {
  display: flex;                                                                   /* empilha os filhos */
  flex-direction: column;                                                          /* ícone, número e label um abaixo do outro */
  align-items: center;                                                             /* centraliza horizontalmente */
  padding: 1.5rem;                                                                 /* espaço interno do card */
  background: #ffffff;                                                             /* fundo branco */
  border: 1px solid #E2E8F0;                                                       /* borda cinza clara */
  border-radius: 12px;                                                             /* cantos arredondados */
}

/* estilo do <div class="card card--alerta"> */
.card--alerta {
  border-color: #F97316;                                                           /* troca a borda para laranja */
  background: #FFF7ED;                                                             /* fundo laranja bem claro */
}

/* estilo do <span class="card__icone"> */
.card__icone {
  font-size: 32px;                                                                 /* tamanho do emoji/ícone */
  margin-bottom: 8px;                                                              /* espaço abaixo do ícone */
}

/* estilo do <span class="card__numero"> */
.card__numero {
  font-size: 28px;                                                                 /* número grande em destaque */
  font-weight: 700;                                                                /* número em negrito */
  color: #1E3A5F;                                                                  /* azul escuro */
}

/* estilo do <span class="card__label"> */
.card__label {
  font-size: 13px;                                                                 /* texto pequeno */
  color: #555;                                                                     /* cinza médio */
  margin-top: 4px;                                                                 /* espaço acima do texto */
}


.home__instrucoes {
  margin-bottom: 3rem;                                                             /* espaço abaixo da seção */
}

/* estilo do <h2 class="home__instrucoes-titulo"> */
.home__instrucoes-titulo {
  font-size: 22px;                                                                 /* tamanho do título da seção */
  color: #1E3A5F;                                                                  /* azul escuro */
  margin-bottom: 1.5rem;                                                           /* espaço abaixo do título */
  text-align: center;                                                              /* centraliza o texto */
}

/* estilo do <div class="home__passos"> */
.home__passos {
  display: grid;                                                                   /* organiza os passos em grade */
  grid-template-columns: repeat(4, 1fr);                                           /* 4 colunas de tamanho igual */
  gap: 1.5rem;                                                                     /* espaço entre os passos */
}

/* estilo do <div class="passo"> */
.passo {
  padding: 1.5rem;                                                                 /* espaço interno */
  background: #F8FAFC;                                                             /* fundo cinza claro */
  border-radius: 12px;                                                             /* cantos arredondados */
  border-left: 4px solid #F97316;                                                  /* barra laranja à esquerda */
  border-radius: 0 12px 12px 0;                                                    /* arredonda só os cantos da direita */
}

/* estilo do <span class="passo__numero"> */
.passo__numero {
  display: inline-block;                                                           /* permite definir largura e altura */
  width: 28px;                                                                     /* largura do círculo */
  height: 28px;                                                                    /* altura do círculo */
  border-radius: 50%;                                                              /* transforma em círculo */
  background: #F97316;                                                             /* fundo laranja */
  color: #fff;                                                                     /* número branco */
  text-align: center;                                                              /* centraliza o número */
  line-height: 28px;                                                               /* alinha o número verticalmente */
  font-weight: 700;                                                                /* número em negrito */
  font-size: 14px;                                                                 /* tamanho do número */
  margin-bottom: 10px;                                                             /* espaço abaixo do círculo */
}

/* estilo do <h3> dentro de .passo */
.passo h3 {
  font-size: 15px;                                                                 /* tamanho do título do passo */
  color: #1E3A5F;                                                                  /* azul escuro */
  margin: 0 0 6px;                                                                 /* espaço abaixo do título */
}

/* estilo do <p> dentro de .passo */
.passo p {
  font-size: 13px;                                                                 /* tamanho do texto do passo */
  color: #555;                                                                     /* cinza médio */
  line-height: 1.5;                                                                /* espaço entre linhas */
}

.footer {
  display: flex;                                                                   /* blocos lado a lado */
  justify-content: space-between;                                                  /* espaço entre os blocos */
  align-items: flex-start;                                                         /* alinha os blocos pelo topo */
  flex-wrap: wrap;                                                                 /* quebra linha em telas pequenas */
  gap: 2rem;                                                                       /* espaço entre os blocos */
  padding: 2rem;                                                                   /* espaço interno do footer */
  background: #1E3A5F;                                                             /* fundo azul escuro */
  color: #ffffff;                                                                  /* texto branco */
}

/* estilo dos <h4> dentro do footer */
.footer h4 {
  font-size: 14px;                                                                 /* tamanho do título do bloco */
  margin: 0 0 10px;                                                                /* espaço abaixo do título */
  color: #F97316;                                                                  /* laranja para destaque */
}

/* estilo dos <p> e <a> dentro do footer */
.footer p,
.footer a {
  font-size: 13px;                                                                 /* tamanho do texto e links */
  color: #cbd5e1;                                                                  /* cinza claro */
  text-decoration: none;                                                           /* remove sublinhado dos links */
  margin: 0;                                                                       /* remove margem padrão */
}

/* estilo do <a> ao passar o mouse */
.footer a:hover {
  color: #F97316;                                                                  /* laranja ao passar o mouse */
}

/* estilo do <div class="footer__redes-links"> */
.footer__redes-links {
  display: flex;                                                                   /* links das redes em linha */
  gap: 12px;                                                                       /* espaço entre cada link */
}

/* estilo do <div class="footer__copy"> */
.footer__copy {
  width: 100%;                                                                     /* ocupa a linha inteira */
  text-align: center;                                                              /* centraliza o texto */
  border-top: 1px solid #2d4f7c;                                                   /* linha separadora acima */
  padding-top: 1rem;                                                               /* espaço acima do texto */
}                                                                      /* fecha o bloco de estilo */
</style>                                                               



<script>
import AppHeader from '../components/AppHeader.vue';
import { useRouter } from 'vue-router';
</script>
          