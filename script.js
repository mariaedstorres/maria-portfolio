/* ================================================================
   MARIA EDUARDA — PORTFÓLIO PESSOAL
   script.js — Interatividade: dark mode, scroll reveal, navbar
   ================================================================
   
   ÍNDICE:
   1. Inicializar ícones Lucide
   2. Dark Mode (alternar tema)
   3. Navbar: efeito ao rolar + menu mobile
   4. Scroll Reveal (animações ao entrar na tela)
   5. Barra de progresso das skills (ativa quando visível)
   6. Smooth scroll (já tratdo pelo CSS, mas reforçado aqui)
================================================================ */


/* ================================================================
   1. INICIALIZAR ÍCONES LUCIDE
   Precisa rodar depois que o DOM carregar, senão os ícones
   ainda não existem na página.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Renderiza todos os ícones <i data-lucide="..."> na página
  if (window.lucide) {
    lucide.createIcons();
  }

  // Depois que os ícones carregam, inicia tudo
  initTheme();
  initNavbar();
  initScrollReveal();
  initSkillBars();

  console.log('✨ Portfólio da Maria Eduarda carregado com sucesso!');
});


/* ================================================================
   2. DARK MODE — salva a preferência do usuário no localStorage
================================================================ */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const html      = document.documentElement; // <html> tag

  // Verificar se o usuário já escolheu um tema antes
  // ou usar a preferência do sistema operacional
  const savedTheme  = localStorage.getItem('madu-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Aplicar tema salvo ou preferência do sistema
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    html.setAttribute('data-theme', 'dark');
  }

  if (!toggleBtn) return;

  // Evento de clique no botão de tema
  toggleBtn.addEventListener('click', function () {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme     = currentTheme === 'dark' ? 'light' : 'dark';

    // Aplicar novo tema
    html.setAttribute('data-theme', newTheme);

    // Salvar a escolha para a próxima visita
    localStorage.setItem('madu-theme', newTheme);

    // Animação de rotação no botão ao trocar tema
    toggleBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      toggleBtn.style.transform = '';
    }, 300);
  });
}


/* ================================================================
   3. NAVBAR — efeito de fundo ao rolar + menu mobile
================================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar || !hamburger || !navLinks) return;

  // ---------- Efeito ao rolar ----------
  // Adiciona classe 'scrolled' quando passa de 50px de scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---------- Menu Mobile (hamburguer) ----------
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');

    // Acessibilidade: indicar estado do menu
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animar o hamburguer → X ao abrir
    if (isOpen) {
      hamburger.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      hamburger.querySelectorAll('span')[1].style.opacity   = '0';
      hamburger.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      hamburger.querySelectorAll('span')[0].style.transform = '';
      hamburger.querySelectorAll('span')[1].style.opacity   = '';
      hamburger.querySelectorAll('span')[2].style.transform = '';
    }
  });

  // Fechar o menu quando um link é clicado (no mobile)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span')[0].style.transform = '';
      hamburger.querySelectorAll('span')[1].style.opacity   = '';
      hamburger.querySelectorAll('span')[2].style.transform = '';
    });
  });
}


/* ================================================================
   4. SCROLL REVEAL — animações ao entrar na viewport
   
   Como funciona:
   - Elementos com classes .reveal-up, .reveal-left, .reveal-right
     começam invisíveis (opacity: 0 + deslocados no CSS)
   - O IntersectionObserver "observa" cada elemento
   - Quando o elemento entra na tela, adiciona a classe .revealed
     que faz ele aparecer com transição suave
================================================================ */
function initScrollReveal() {
  // Seleciona todos os elementos para revelar
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Configuração do observer:
  // threshold: 0.1 = aciona quando 10% do elemento está visível
  const observerConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'  // Aciona um pouco antes de chegar na borda
  };

  // Função chamada quando o estado de visibilidade muda
  const revealCallback = function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Elemento está visível! Revelar com animação.
        entry.target.classList.add('revealed');

        // Para de observar depois de revelar (economiza recursos)
        observer.unobserve(entry.target);
      }
    });
  };

  // Criar e iniciar o observer
  const observer = new IntersectionObserver(revealCallback, observerConfig);

  // Observar cada elemento (com delay escalonado para efeito cascata)
  elements.forEach(function (el, index) {
    // Delay progressivo: 0ms, 100ms, 200ms, etc.
    const delay = (index % 4) * 100;  // Reinicia a cada 4 elementos
    el.style.transitionDelay = delay + 'ms';

    observer.observe(el);
  });
}


/* ================================================================
   5. BARRAS DE SKILL — anima quando ficam visíveis na tela
   
   As barras começam com transform: scaleX(0) no CSS.
   Quando entram na viewport, a animação CSS dispara automaticamente
   via @keyframes grow-bar, mas precisamos "ativar" o observer
   para que o animation-play-state mude.
================================================================ */
function initSkillBars() {
  const skillSection = document.querySelector('.skills');
  if (!skillSection) return;  // Segurança: se a seção não existir, para

  const bars = document.querySelectorAll('.pill-fill');

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Adiciona uma pequena pausa e então dispara a animação
        setTimeout(function () {
          bars.forEach(function (bar) {
            bar.style.animationPlayState = 'running';
          });
        }, 200);

        // Para de observar a seção (não precisa mais)
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Pausar as animações inicialmente (para não rodar antes de ver)
  bars.forEach(function (bar) {
    bar.style.animationPlayState = 'paused';
  });

  barObserver.observe(skillSection);
}


/* ================================================================
   6. HIGHLIGHT DE NAVEGAÇÃO ATIVO
   Marca o link da navbar correspondente à seção atual
================================================================ */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    let currentSectionId = '';

    // Descobrir qual seção está visível no centro da tela
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Atualizar classe ativa nos links
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  });
})();


/* ================================================================
   7. CURSOR PERSONALIZADO (opcional — efeito decorativo)
   Um ponto rosa segue o cursor — pode remover se não gostar!
================================================================ */
(function initCustomCursor() {
  // Criar o elemento do cursor
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: #e8b4c8;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  // Criar o anel externo do cursor
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position: fixed;
    width: 32px;
    height: 32px;
    border: 1.5px solid #e8b4c8;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    opacity: 0;
  `;
  document.body.appendChild(ring);

  // Só mostrar em desktops (não em touch)
  if (window.matchMedia('(pointer: fine)').matches) {
    // Mover cursor com o mouse
    document.addEventListener('mousemove', function (e) {
      cursor.style.left   = e.clientX + 'px';
      cursor.style.top    = e.clientY + 'px';
      cursor.style.opacity = '1';

      ring.style.left    = e.clientX + 'px';
      ring.style.top     = e.clientY + 'px';
      ring.style.opacity = '0.6';
    });

    // Efeito de "pressionar" ao clicar
    document.addEventListener('mousedown', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      ring.style.width  = '24px';
      ring.style.height = '24px';
    });

    document.addEventListener('mouseup', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.width  = '32px';
      ring.style.height = '32px';
    });

    // Expandir anel ao passar em links e botões
    const interactiveEls = document.querySelectorAll('a, button, .project-card, .beyond-card, .quote-card');
    interactiveEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width  = '48px';
        ring.style.height = '48px';
        ring.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.opacity = '0.6';
      });
    });
  }
})();


/* ================================================================
   8. EASTER EGG — mensagem no console para outros devs curiosos :)
================================================================ */
console.log('%c🌸 Oi, dev curioso(a)!', 'font-size: 18px; color: #e8b4c8; font-weight: bold;');
console.log('%cEsse site foi feito com muito carinho pela Maria Eduarda. ✨', 'font-size: 13px; color: #9e8a94;');
console.log('%cSe quiser conversar sobre código ou oportunidades, dá um oi no LinkedIn!', 'font-size: 12px; color: #b8a8b2;');
