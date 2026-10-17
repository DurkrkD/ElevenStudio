/* Eleven Studio · interações e conteúdo do painel (sem bibliotecas), usado em todas as páginas.
   O conteúdo editável fica em content/*.json e é editado pelo painel em /admin. */
(function () {
  'use strict';

  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var desktop = window.matchMedia('(min-width: 960px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header ganha fundo ao rolar ---------- */
  var ticking = false;
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    var onDesktop = function (e) { if (e.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);
  }

  /* ---------- Ano atual no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Entrada suave dos elementos ao rolar ---------- */
  var observer = null;
  var revealStarted = false;
  function reveal(root) {
    var items = (root || document).querySelectorAll('[data-reveal]:not(.is-in)');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    items.forEach(function (el) { observer.observe(el); });
  }
  function startReveal() {
    if (revealStarted) return;
    revealStarted = true;
    reveal(document);
  }

  /* ---------- Lightbox: ampliar imagens (página de referências) ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox-img');
    var lbCap = lb.querySelector('.lightbox-caption');
    var lastTrigger = null;
    var canDialog = typeof lb.showModal === 'function';

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.ref-zoom');
      if (!trigger) return;
      var img = trigger.querySelector('img');
      var src = img.currentSrc || img.src;
      if (!canDialog) { window.open(src, '_blank', 'noopener'); return; }
      lastTrigger = trigger;
      lbImg.src = src;
      lbImg.alt = img.alt;
      lbImg.width = img.naturalWidth || img.width;
      lbImg.height = img.naturalHeight || img.height;
      lbCap.textContent = trigger.getAttribute('data-caption') || '';
      lb.showModal();
      body.classList.add('lightbox-open');
      lb.querySelector('.lightbox-close').focus();
    });
    lb.querySelector('.lightbox-close').addEventListener('click', function () { lb.close(); });
    // Clique fora da imagem (no fundo escuro) fecha
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === lb.querySelector('.lightbox-figure')) lb.close();
    });
    // Esc fecha nativamente; ao fechar, devolve o foco para a imagem clicada
    lb.addEventListener('close', function () {
      body.classList.remove('lightbox-open');
      if (lastTrigger) lastTrigger.focus();
    });
  }

  /* =========================================================
     Conteúdo do painel
     ========================================================= */
  var ICONS = ['logo', 'post', 'reel', 'menu', 'cal', 'chat', 'bolt', 'gem', 'globe'];
  var CATS = { logo: 'Logo', post: 'Post', video: 'Vídeo', cardapio: 'Cardápio' };
  var SKIES = ['sunrise', 'day', 'sunset', 'moon'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, size, cls) {
    if (ICONS.indexOf(name) < 0 && ['wa', 'arrow', 'check', 'quote', 'ig', 'play'].indexOf(name) < 0) name = 'post';
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' width="' + size + '" height="' + size +
      '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function list(a) { return Array.isArray(a) ? a.filter(function (x) { return x != null && x !== ''; }) : []; }
  function delay(ms) { return ' style="--d:' + ms + 'ms"'; }

  var WA = '';
  function waLink(label, cls, size) {
    return '<a class="btn ' + cls + '" href="' + esc(WA) + '" target="_blank" rel="noopener">' +
      icon('wa', size || 20) + ' ' + label + '</a>';
  }

  function setText(key, value) {
    if (typeof value !== 'string' || !value.trim()) return;
    document.querySelectorAll('[data-cms-text="' + key + '"]').forEach(function (el) { el.textContent = value; });
  }
  function fill(name, html) {
    var el = document.querySelector('[data-cms-list="' + name + '"]');
    if (!el) return null;
    el.innerHTML = html;
    if (revealStarted) reveal(el);
    return el;
  }

  /* --- Contato: WhatsApp e Instagram em todas as páginas --- */
  function applyGeral(g) {
    var num = String(g.whatsapp_numero || '').replace(/\D/g, '');
    if (num) {
      WA = 'https://wa.me/' + num + (g.whatsapp_mensagem ? '?text=' + encodeURIComponent(g.whatsapp_mensagem) : '');
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { a.href = WA; });
    } else {
      var first = document.querySelector('a[href^="https://wa.me/"]');
      WA = first ? first.href : '';
    }
    setText('geral.whatsapp_exibicao', g.whatsapp_exibicao);
    var ig = String(g.instagram_usuario || '').replace(/^@/, '').trim();
    if (ig) {
      document.querySelectorAll('a[data-cms="instagram"]').forEach(function (a) { a.href = 'https://instagram.com/' + ig; });
      setText('geral.instagram', '@' + ig);
    }
  }

  /* --- Página inicial --- */
  function applyInicio(d) {
    setText('inicio.titulo', d.titulo);
    setText('inicio.titulo_destaque', d.titulo_destaque);
    setText('inicio.subtitulo', d.subtitulo);
  }
  function homeServicos(d) {
    var grid = document.querySelector('[data-cms-list="home-servicos"]');
    var items = list(d.servicos);
    if (!grid || !items.length) return;
    grid.querySelectorAll('.svc-card:not(.svc-card--cta)').forEach(function (el) { el.remove(); });
    var html = items.map(function (s, i) {
      return '<a class="card svc-card" href="servicos.html#' + esc(s.id) + '" data-reveal' + delay((i % 3) * 60) + '>' +
        '<span class="ico-box">' + icon(s.icone, 26) + '</span>' +
        '<h3>' + esc(s.titulo) + '</h3><p>' + esc(s.resumo) + '</p>' +
        '<span class="link-arrow">Saiba mais ' + icon('arrow', 18) + '</span></a>';
    }).join('');
    grid.insertAdjacentHTML('afterbegin', html);
    if (revealStarted) reveal(grid);
  }
  function applyDepoimentos(d) {
    var section = document.querySelector('[data-cms-section="depoimentos"]');
    var items = list(d.depoimentos).filter(function (q) { return q.texto && q.nome; });
    if (!section) return;
    section.hidden = !items.length;
    if (!items.length) return;
    fill('depoimentos', items.map(function (q, i) {
      var initials = String(q.nome).trim().split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join('').toUpperCase();
      var avatar = q.foto
        ? '<img src="' + esc(q.foto) + '" alt="Foto de ' + esc(q.nome) + '" loading="lazy" width="88" height="88">'
        : '<span aria-hidden="true">' + esc(initials) + '</span>';
      return '<figure class="card quote" data-reveal' + delay((i % 3) * 80) + '>' +
        '<span class="quote-mark">' + icon('quote', 24) + '</span>' +
        '<blockquote>“' + esc(q.texto) + '”</blockquote>' +
        '<footer><span class="avatar">' + avatar + '</span><span><cite>' + esc(q.nome) + '</cite>' +
        (q.empresa ? '<small>' + esc(q.empresa) + '</small>' : '') + '</span></footer></figure>';
    }).join(''));
  }

  /* --- Serviços --- */
  function applyServicos(d) {
    var items = list(d.servicos);
    if (!items.length) return;
    fill('servicos', items.map(function (s, i) {
      var n = i + 1;
      return '<article class="card svc-item" id="' + esc(s.id) + '" data-reveal>' +
        '<div><div class="svc-item-head"><span class="ico-box">' + icon(s.icone, 26) + '</span><span>' + (n < 10 ? '0' + n : n) + '</span></div>' +
        '<h2>' + esc(s.titulo) + '</h2><p class="desc">' + esc(s.descricao) + '</p></div>' +
        '<div class="svc-item-side"><ul class="svc-includes" aria-label="O que está incluso">' +
        list(s.inclusos).map(function (x) { return '<li>' + icon('check', 18) + esc(x) + '</li>'; }).join('') + '</ul>' +
        (s.ideal_para ? '<p class="svc-for"><strong>Ideal para:</strong> ' + esc(s.ideal_para) + '</p>' : '') +
        waLink('Solicitar orçamento', 'btn-dark') + '</div></article>';
    }).join(''));
    // Se a página abriu com #ancora (ex.: servicos.html#reels), rola até ela depois de montar
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }

  /* --- Pacotes e preços --- */
  function applyPrecos(d) {
    var pacotes = list(d.pacotes);
    if (pacotes.length) {
      fill('pacotes', pacotes.map(function (p, i) {
        var feat = !!p.destaque;
        return '<article class="card plan' + (feat ? ' plan--featured dark' : '') + '" data-reveal' + delay(i * 80) + '>' +
          (feat && p.selo ? '<span class="plan-badge">' + esc(p.selo) + '</span>' : '') +
          '<h2>' + esc(p.nome) + '</h2><p class="plan-for">' + esc(p.para_quem) + '</p>' +
          '<p class="plan-price"><small>a partir de</small><strong><sup>R$</sup>' + esc(p.preco) + '</strong><span>/mês</span></p>' +
          '<ul class="plan-list">' + list(p.itens).map(function (x) { return '<li>' + icon('check', 18) + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn ' + (feat ? 'btn-light' : 'btn-outline') + ' btn-block" href="' + esc(WA) + '" target="_blank" rel="noopener">Quero o ' + esc(p.nome) + '</a>' +
          '</article>';
      }).join(''));
    }
    var avulsos = list(d.avulsos);
    var extrasSection = document.querySelector('[data-cms-section="avulsos"]');
    if (extrasSection) extrasSection.hidden = !avulsos.length;
    if (avulsos.length) {
      fill('avulsos', avulsos.map(function (e, i) {
        return '<article class="card extra" data-reveal' + delay(i * 60) + '>' +
          '<span class="ico-box">' + icon(e.icone, 22) + '</span><h3>' + esc(e.nome) + '</h3><p>' + esc(e.descricao) + '</p>' +
          '<div class="extra-price"><strong>R$ ' + esc(e.preco) + '</strong>' +
          '<a class="btn btn-outline btn-sm" href="' + esc(WA) + '" target="_blank" rel="noopener">Solicitar</a></div></article>';
      }).join(''));
    }
    setText('precos.observacao', d.observacao);
  }

  /* --- Portfólio: trabalhos para clientes (painel). A seção só aparece quando houver trabalhos. --- */
  function applyPortfolio(d) {
    var items = list(d.trabalhos).filter(function (w) { return w.imagem && w.titulo; });
    var section = document.querySelector('[data-cms-section="portfolio"]');
    var filters = document.querySelector('[data-cms-filters]');
    if (section) section.hidden = !items.length;
    if (!items.length) {
      fill('portfolio', '');
      return;
    }
    fill('portfolio', items.map(function (w, i) {
      var cat = CATS[w.categoria] ? w.categoria : 'post';
      return '<figure class="work" data-cat="' + cat + '" data-reveal' + delay((i % 3) * 60) + '>' +
        '<div class="work-media ph-' + SKIES[i % SKIES.length] + '"><img src="' + esc(w.imagem) + '" alt="' + esc(w.titulo) + ' (' + CATS[cat] + ')" loading="lazy" width="1080" height="1350"></div>' +
        '<figcaption><p class="work-cat">' + CATS[cat] + '</p><h3>' + esc(w.titulo) + '</h3>' +
        (w.descricao ? '<p class="work-desc">' + esc(w.descricao) + '</p>' : '') + '</figcaption></figure>';
    }).join(''));
    if (!filters) return;
    var present = Object.keys(CATS).filter(function (c) { return items.some(function (w) { return w.categoria === c; }); });
    filters.hidden = present.length < 2;
    filters.innerHTML = '<button class="filter" type="button" data-filter="todos" aria-pressed="true">Todos</button>' +
      present.map(function (c) {
        return '<button class="filter" type="button" data-filter="' + c + '" aria-pressed="false">' + CATS[c] + '</button>';
      }).join('');
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;
    var cat = btn.getAttribute('data-filter');
    document.querySelectorAll('.filter').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    document.querySelectorAll('.work[data-cat]').forEach(function (w) {
      var show = cat === 'todos' || w.getAttribute('data-cat') === cat;
      w.hidden = !show;
      if (show) w.classList.add('is-in');
    });
  });

  /* --- Sobre --- */
  function applySobre(d) {
    var photo = document.querySelector('[data-cms-photo="sobre"]');
    if (photo && d.foto) {
      photo.innerHTML = '<img src="' + esc(d.foto) + '" alt="' + esc(d.assinatura || 'Fundador da Eleven Studio') + '" loading="lazy" width="1000" height="1250">';
    }
    setText('sobre.titulo', d.titulo);
    setText('sobre.assinatura', d.assinatura);
    var ps = list(d.paragrafos);
    if (ps.length) {
      fill('sobre.paragrafos', ps.map(function (p, i) {
        return '<p data-reveal' + delay(140 + i * 40) + '>' + esc(p) + '</p>';
      }).join(''));
    }
    var vs = list(d.valores);
    if (vs.length) {
      fill('sobre.valores', vs.map(function (v, i) {
        return '<article class="card value" data-reveal' + delay(i * 80) + '>' +
          '<span class="ico-box">' + icon(v.icone, 26) + '</span><h3>' + esc(v.titulo) + '</h3><p>' + esc(v.texto) + '</p></article>';
      }).join(''));
    }
  }

  /* --- Carregamento --- */
  function load(name) {
    return fetch('content/' + name + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
  }
  function safe(fn) {
    return function (data) { try { fn(data); } catch (err) { if (window.console) console.warn('Conteúdo:', err); } };
  }

  var tasks = [
    load('geral').then(safe(applyGeral))
  ];
  if (page === 'portfolio') tasks.push(load('portfolio').then(safe(applyPortfolio)));
  if (page === 'inicio') {
    tasks.push(load('inicio').then(safe(applyInicio)));
    tasks.push(load('servicos').then(safe(homeServicos)));
    tasks.push(load('depoimentos').then(safe(applyDepoimentos)));
  }
  if (page === 'servicos') tasks.push(load('servicos').then(safe(applyServicos)));
  if (page === 'precos') tasks.push(load('precos').then(safe(applyPrecos)));
  if (page === 'sobre') tasks.push(load('sobre').then(safe(applySobre)));

  // Os botões de WhatsApp montados pelo painel precisam do link pronto antes
  if (!WA) {
    var firstWa = document.querySelector('a[href^="https://wa.me/"]');
    WA = firstWa ? firstWa.href : '';
  }

  // Mostra a página quando o conteúdo chegar (ou em no máximo 1,5 s, se a internet estiver lenta)
  var settle = Promise.all(tasks.map(function (t) { return t.catch(function () {}); }));
  settle.then(startReveal);
  setTimeout(startReveal, 1500);
})();
