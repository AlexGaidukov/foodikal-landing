// Foodikal: Minimal JS for navigation and interactivity

document.addEventListener('DOMContentLoaded', function () {
  // Language switcher functionality
  // Only use hardcoded translations for nav/hero on index.html, not for menu items
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.menu': 'Menu',
      'hero.headline': 'You work. We feed you.',
      'hero.subtitle': 'Everyone focuses on what they do best.',
      'hero.cta': 'View Menu',
      'menu.header': 'Our Menu',
    },
    sr: {
      'nav.home': 'Početna',
      'nav.menu': 'Meni',
      'hero.headline': 'Vi radite. Mi vas hranimo.',
      'hero.subtitle': 'Svi su fokusirani na ono što najbolje rade.',
      'hero.cta': 'Pogledaj meni',
      'menu.header': 'Naš Meni',
    },
    ru: {
      'nav.home': 'Главная',
      'nav.menu': 'Меню',
      'hero.headline': 'Вы работаете. Мы кормим.',
      'hero.subtitle': 'Каждый сосредоточен на том, что получается лучше всего.',
      'hero.cta': 'Посмотреть меню',
      'menu.header': 'Наше меню',
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
    // On menu.html, update the menu content
    if (typeof window.updateMenu === 'function') window.updateMenu(lang);
  }

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

  // Hamburger menu slide animation and close button
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.querySelector('.nav__close');

  function openNavMenu() {
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNavMenu() {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      openNavMenu();
    });
  }
  if (navClose) {
    navClose.addEventListener('click', (e) => {
      closeNavMenu();
    });
  }
  // Also close menu when clicking a nav link (optional, for better UX)
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      closeNavMenu();
    });
  });
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavMenu();
  });

  // Custom language dropdown
  const langCustom = document.querySelector('.lang-custom-select');
  if (langCustom) {
    const selected = langCustom.querySelector('.custom-select__selected');
    const dropdown = langCustom.querySelector('.custom-select__dropdown');
    const options = langCustom.querySelectorAll('.custom-select__option');

    // Open/close dropdown
    langCustom.addEventListener('click', function(e) {
      langCustom.classList.toggle('open');
    });
    // Close dropdown on blur (keyboard nav)
    langCustom.addEventListener('blur', function() {
      langCustom.classList.remove('open');
    });
    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
      if (!langCustom.contains(e.target)) {
        langCustom.classList.remove('open');
      }
    });
    // Option click
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        // Also update menu if available (menu.html only)
        if (typeof window.updateMenu === 'function') window.updateMenu(lang);
        selected.textContent = option.textContent;
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        langCustom.classList.remove('open');
      });
    });
    // Set initial active
    options[0].classList.add('active');
  }

  // Set default language
  setLanguage('en');

});
