// Foodikal: Minimal JS for navigation and interactivity

document.addEventListener('DOMContentLoaded', function () {
  // Language switcher functionality
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.menu': 'Menu',
      'hero.headline': 'Eat Bold. Eat Foodikal.',
      'hero.subtitle': 'A fresh, modern take on food menus. Minimal. Impactful. Delicious.',
      'hero.cta': 'View Menu',
    },
    sr: {
      'nav.home': 'Početna',
      'nav.menu': 'Meni',
      'hero.headline': 'Jedite hrabro. Jedite Foodikal.',
      'hero.subtitle': 'Svez, moderan pristup jelovnicima. Minimalno. Uticajno. Ukusno.',
      'hero.cta': 'Pogledaj meni',
    },
    ru: {
      'nav.home': 'Главная',
      'nav.menu': 'Меню',
      'hero.headline': 'Ешь смело. Ешь Foodikal.',
      'hero.subtitle': 'Свежий, современный взгляд на меню. Минимализм. Впечатляюще. Вкусно.',
      'hero.cta': 'Посмотреть меню',
    },
  };

  function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    // Optional: highlight active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  // Set default language
  setLanguage('en');

  // Hamburger menu toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Close menu' : 'Open menu');
  });

  // Close nav on link click (mobile)
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  });
});
