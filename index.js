'use strict';

window.addEventListener('DOMContentLoaded', () => {
  /* Dark - Theme */
  const THEME_KEY = 'theme';
  const root = document.documentElement;
  const btn = document.querySelector('.container-theme button');
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const initial = (() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return media && media.matches ? 'dark' : 'light';
  })();

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  setTheme(initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
  if (!localStorage.getItem(THEME_KEY) && media && media.addEventListener) {
    media.addEventListener('change', (e) => setTheme(e.matches ? 'light' : 'dark'));
  }

  /* API */
  const titles = document.querySelectorAll('.title');
  const alives = document.querySelectorAll('.alive');
  const imgs = document.querySelectorAll('.img');
  const locations = document.querySelectorAll('.location');
  const firsts = document.querySelectorAll('.firts');

  async function loadPage(page = 1) {
    try {
      const resp = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await resp.json();
      const personajes = data.results;

      for (let i = 0; i < titles.length; i++) {
        const personaje = personajes[i];
        if (!personaje) {
          titles[i].textContent = '';
          alives[i].textContent = '';
          imgs[i].innerHTML = '';
          locations[i].textContent = '';
          firsts[i].textContent = '';
          continue;
        }

        titles[i].textContent = personaje.name;
        alives[i].textContent = personaje.status;
        imgs[i].innerHTML = `<img src="${personaje.image}" alt="${personaje.name}" width="100%" height="100%">`;
        locations[i].textContent = personaje.location.name;

        try {
          const primerEpisodioURL = personaje.episode[0];
          const respuestaEpisodio = await fetch(primerEpisodioURL);
          const datosEpisodio = await respuestaEpisodio.json();
          firsts[i].textContent = datosEpisodio.name;
        } catch {
          firsts[i].textContent = '';
        }
      }
    } catch (error) {
      console.error('Error al cargar los personajes:', error);
    }
  }

  // Inicial: página 1
  loadPage(1);

  const pageLinks = document.querySelectorAll('.pages a');
  pageLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageText = link.textContent.trim();
      const pageNum = Number(pageText);
      if (!Number.isNaN(pageNum)) {
        pageLinks.forEach(l => l.setAttribute('aria-current', 'false'));
        link.setAttribute('aria-current', 'page');

        loadPage(pageNum);
      }
    });
  });
});