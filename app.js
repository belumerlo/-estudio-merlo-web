(function () {
  'use strict';

  var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto != null) el.textContent = texto;
    return el;
  }

  function chips(lista, claseExtra) {
    var cont = crear('div', 'chips');
    (lista || []).forEach(function (t) { cont.appendChild(crear('span', 'chip' + (claseExtra ? ' ' + claseExtra : ''), t)); });
    return cont;
  }

  // ---------- Misiones ----------
  function pintarMisiones() {
    var lista = document.getElementById('lista-misiones');
    var misiones = window.MISIONES || [];
    var cumplidas = 0, enCurso = 0;

    misiones.forEach(function (m) {
      var cumplida = String(m.estado).toLowerCase() === 'cumplida';
      if (cumplida) cumplidas++; else enCurso++;

      var carta = crear('article', 'carta mision aparece');
      var cabeza = crear('div', 'mision-cabeza');
      cabeza.appendChild(crear('span', 'rubro', m.rubro));

      var insignia = crear('span', 'insignia ' + (cumplida ? 'insignia-cumplida' : 'insignia-curso'));
      if (cumplida) {
        insignia.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>';
        insignia.appendChild(document.createTextNode('Misión cumplida'));
      } else {
        var punto = crear('span', 'punto late');
        punto.setAttribute('aria-hidden', 'true');
        insignia.appendChild(punto);
        insignia.appendChild(document.createTextNode('En curso'));
      }
      cabeza.appendChild(insignia);

      carta.appendChild(cabeza);
      carta.appendChild(crear('h3', null, m.titulo));
      carta.appendChild(crear('p', null, m.descripcion));
      carta.appendChild(chips(m.etiquetas));
      lista.appendChild(carta);
    });

    var texto = cumplidas + (cumplidas === 1 ? ' misión cumplida' : ' misiones cumplidas');
    if (enCurso) texto += ' · ' + enCurso + ' en curso';
    document.getElementById('contador-misiones').textContent = texto;
  }

  // ---------- Jugadores ----------
  function pintarJugadores() {
    var lista = document.getElementById('lista-jugadores');
    (window.JUGADORES || []).forEach(function (j) {
      var carta = crear('article', 'carta jugador aparece');

      var lateral = crear('div', 'jugador-lateral');
      if (j.foto) {
        var img = crear('img', 'jugador-foto');
        img.src = j.foto;
        img.alt = j.nombre;
        img.loading = 'lazy';
        lateral.appendChild(img);
      } else {
        var avatar = crear('div', 'jugador-avatar');
        avatar.setAttribute('role', 'img');
        avatar.setAttribute('aria-label', j.nombre);
        var interior = crear('div', 'avatar-interior');
        interior.appendChild(crear('span', 'avatar-iniciales', j.iniciales));
        var p = crear('span', 'punto late');
        p.setAttribute('aria-hidden', 'true');
        interior.appendChild(p);
        avatar.appendChild(interior);
        lateral.appendChild(avatar);
      }
      lateral.appendChild(crear('span', 'jugador-clase', j.clase));

      var cuerpo = crear('div', 'jugador-cuerpo');
      cuerpo.appendChild(crear('h3', null, j.nombre));
      cuerpo.appendChild(crear('span', 'jugador-rol', j.rol));
      String(j.bio || '').split(/\n\s*\n/).forEach(function (parrafo) {
        if (parrafo.trim()) cuerpo.appendChild(crear('p', null, parrafo.trim()));
      });

      var exp = crear('div', 'grupo');
      exp.appendChild(crear('span', 'grupo-titulo', 'Experiencia'));
      exp.appendChild(chips(j.experiencia));
      cuerpo.appendChild(exp);

      var hab = crear('div', 'grupo');
      hab.appendChild(crear('span', 'grupo-titulo', 'Habilidades'));
      hab.appendChild(chips(j.habilidades, 'chip-fuerte'));
      cuerpo.appendChild(hab);

      carta.appendChild(lateral);
      carta.appendChild(cuerpo);
      lista.appendChild(carta);
    });
  }

  // ---------- Titular que se escribe solo ----------
  function maquinaDeEscribir() {
    var el = document.getElementById('palabra');
    var palabras = ['trabajo manual', 'planillas', 'papeles', 'tareas repetitivas', 'copiar y pegar'];
    if (reducirMovimiento) { el.textContent = palabras[0]; return; }
    var i = 0, letras = palabras[0].length, borrando = false, pausa = 0;
    setInterval(function () {
      var p = palabras[i];
      if (!borrando) {
        if (letras < p.length) letras++;
        else if (++pausa > 18) { pausa = 0; borrando = true; }
      } else {
        if (letras > 0) letras--;
        else { borrando = false; i = (i + 1) % palabras.length; }
      }
      el.textContent = palabras[i].slice(0, letras);
    }, 85);
  }

  // ---------- Calculadora ----------
  function calculadora() {
    var personas = document.getElementById('personas');
    var minutos = document.getElementById('minutos');
    var fmt = new Intl.NumberFormat('es-AR');
    function actualizar() {
      var p = Number(personas.value), m = Number(minutos.value);
      var horas = Math.round(p * m * 5 * 48 / 60);
      document.getElementById('personas-valor').textContent = p;
      document.getElementById('minutos-valor').textContent = m + ' min';
      document.getElementById('horas').textContent = fmt.format(horas);
      var j = Math.round(horas / 8);
      document.getElementById('jornadas').textContent = fmt.format(j) + (j === 1 ? ' jornada' : ' jornadas');
      document.getElementById('barra').style.width = Math.min(100, Math.round(horas / 57.6)) + '%';
    }
    personas.addEventListener('input', actualizar);
    minutos.addEventListener('input', actualizar);
    actualizar();
  }

  // ---------- Aparición al hacer scroll ----------
  function aparicion() {
    var elementos = document.querySelectorAll('.aparece');
    if (reducirMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (e) { e.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elementos.forEach(function (e) { obs.observe(e); });
  }

  // ---------- Red de nodos interactiva ----------
  function red() {
    var c = document.getElementById('red');
    var g = c.getContext('2d');
    var mouse = { x: -9999, y: -9999 };
    var puntos = [], w = 0, h = 0, dpr = 1;

    function dimensionar() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      var n = Math.min(110, Math.round(w * h / 13000));
      puntos = [];
      for (var i = 0; i < n; i++) {
        puntos.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 });
      }
    }

    function cuadro() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      if (mouse.x > -999) {
        var rg = g.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
        rg.addColorStop(0, 'rgba(96,165,250,0.16)');
        rg.addColorStop(1, 'rgba(96,165,250,0)');
        g.fillStyle = rg; g.fillRect(0, 0, w, h);
      }
      var i, j, p, d;
      for (i = 0; i < puntos.length; i++) {
        p = puntos[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140 && d > 0) { p.vx += dx / d * .06; p.vy += dy / d * .06; }
        p.vx *= .985; p.vy *= .985;
        if (Math.abs(p.vx) + Math.abs(p.vy) < .2) { p.vx += (Math.random() - .5) * .08; p.vy += (Math.random() - .5) * .08; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; } else if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; } else if (p.y > h) { p.y = h; p.vy *= -1; }
      }
      for (i = 0; i < puntos.length; i++) {
        var a = puntos[i];
        for (j = i + 1; j < puntos.length; j++) {
          var b = puntos[j];
          d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            g.strokeStyle = 'rgba(147,197,253,' + (0.22 * (1 - d / 130)) + ')';
            g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          }
        }
        var dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 220) {
          g.strokeStyle = 'rgba(96,165,250,' + (0.7 * (1 - dm / 220)) + ')';
          g.lineWidth = 1.2; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(mouse.x, mouse.y); g.stroke();
        }
        g.fillStyle = dm < 220 ? '#60A5FA' : 'rgba(199,205,216,0.55)';
        g.fillRect(a.x - 2, a.y - 2, 4, 4);
      }
      if (!reducirMovimiento) requestAnimationFrame(cuadro);
    }

    window.addEventListener('resize', dimensionar);
    window.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { mouse.x = e.clientX; mouse.y = e.clientY; } });
    document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    window.addEventListener('blur', function () { mouse.x = mouse.y = -9999; });
    dimensionar();
    cuadro();
  }

  document.getElementById('anio').textContent = new Date().getFullYear();
  pintarMisiones();
  pintarJugadores();
  maquinaDeEscribir();
  calculadora();
  aparicion();
  red();
})();
