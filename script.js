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
      'order.cta': 'Make order',
      'menu.header': 'Dishes from Our Menu',
      'menu.item1.title': 'Breaded white fish with Tartar sauce',
      'menu.item1.desc': 'Tender white fish fillet, breaded and fried to golden perfection. Served with creamy homemade tartar sauce.',
      'menu.item2.title': 'Chicken sausages with Potato Wedges',
      'menu.item2.desc': 'Juicy chicken sausages served with crispy golden potato wedges and a side of fresh herbs.',
      'menu.item3.title': 'Pasta with chicken and spinach',
      'menu.item3.desc': 'Tender pasta tossed with juicy chicken, fresh spinach, and a creamy sauce.',
      'menu.item4.title': 'Cole Slaw',
      'menu.item4.desc': 'Classic coleslaw salad made with fresh cabbage, carrots, and a creamy dressing.',
    },
    sr: {
      'nav.home': 'Početna',
      'nav.menu': 'Meni',
      'hero.headline': 'Vi radite. Mi vas hranimo.',
      'hero.subtitle': 'Svi su fokusirani na ono što najbolje rade.',
      'hero.cta': 'Pogledaj meni',
      'order.cta': 'Napravi porudžbinu',
      'menu.header': 'Jela iz našeg menija',
      'menu.item1.title': 'Bela riba pohovana sa tartar sosom',
      'menu.item1.desc': 'Belo riblje file pohovano i prženo do zlatne boje. Služi se sa domaćim tartar sosom.',
      'menu.item2.title': 'Pileće kobasice sa krompirima',
      'menu.item2.desc': 'Sočne pileće kobasice sa hrskavim krompirima i svežim začinskim biljem.',
      'menu.item3.title': 'Pasta sa piletinom i spanaćem',
      'menu.item3.desc': 'Pasta sa sočnom piletinom, svežim spanaćem i kremastim sosom.',
      'menu.item4.title': 'Koleraba salata',
      'menu.item4.desc': 'Klasična salata od kupusa, šargarepe i kremastog preliva.',
    },
    ru: {
      'nav.home': 'Главная',
      'nav.menu': 'Меню',
      'hero.headline': 'Вы работаете. Мы кормим.',
      'hero.subtitle': 'Каждый сосредоточен на том, что получается лучше всего.',
      'hero.cta': 'Посмотреть меню',
      'order.cta': 'Сделать заказ',
      'menu.header': 'Блюда из нашего меню',
      'menu.item1.title': 'Белая рыба в панировке с соусом Тартар',
      'menu.item1.desc': 'Нежное филе белой рыбы, панированное и обжаренное до золотистой корочки. Подается с домашним соусом тартар.',
      'menu.item2.title': 'Куриные колбаски с картофелем',
      'menu.item2.desc': 'Сочные куриные колбаски с хрустящим картофелем и свежей зеленью.',
      'menu.item3.title': 'Паста с курицей и шпинатом',
      'menu.item3.desc': 'Паста с нежной курицей, свежим шпинатом и сливочным соусом.',
      'menu.item4.title': 'Коул-слоу',
      'menu.item4.desc': 'Классический салат из свежей капусты, моркови и сливочной заправки.',
    },
  };

  function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
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
    if (typeof window.updateMenu === 'function') {
      window.updateMenu(lang);
    }
  }

  function renderMenu(lang) {
    const t = window.menuTranslations[lang];
    const sectionOrder = ['breakfast', 'soups', 'salads', 'main', 'sides', 'drinks'];
    const sectionIdMap = {
      breakfast: 'breakfast',
      soups: 'soups',
      salads: 'salads',
      main: 'main-course',
      sides: 'sides',
      drinks: 'drinks',
    };
    sectionOrder.forEach(section => {
      const sectionEl = document.getElementById(sectionIdMap[section]);
      if (!sectionEl) return;
      const grid = sectionEl.querySelector('.menu__grid');
      grid.innerHTML = "";
      const dishes = t.dishes[section] || [];
      if (!Array.isArray(dishes) || dishes.length === 0) return;
      const colCount = dishes.length < 9 ? 2 : 3;
      const colLength = Math.ceil(dishes.length / colCount);
      for (let c = 0; c < colCount; c++) {
        const colDishes = dishes.slice(c * colLength, (c + 1) * colLength);
        const colDiv = document.createElement('div');
        colDiv.className = 'menu__column';
        colDishes.forEach(dish => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'menu__item';
          itemDiv.setAttribute('data-menu-item', '');
          itemDiv.innerHTML = `<strong>${dish.name}</strong><br><em>${dish.desc}</em>`;
          colDiv.appendChild(itemDiv);
        });
        grid.appendChild(colDiv);
      }
    });
  }

  function updateMenuAndCategories(lang) {
    const t = window.menuTranslations[lang];
    document.querySelectorAll('[data-menu-category]').forEach((el) => {
      const key = el.getAttribute('data-menu-category');
      if (t.categories[key]) el.innerText = t.categories[key];
    });
    renderMenu(lang);
  }

  window.updateMenu = updateMenuAndCategories;

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
        localStorage.setItem('selectedLanguage', lang);
        selected.textContent = option.textContent;
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        // Always close the dropdown after selection, with a short delay to avoid race with toggle
        setTimeout(() => langCustom.classList.remove('open'), 50);
      });
    });
    // Set initial active based on saved language
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    options.forEach(opt => {
      const isActive = opt.getAttribute('data-lang') === savedLang;
      opt.classList.toggle('active', isActive);
      if (isActive) selected.textContent = opt.textContent;
    });
  }

  // Set default language from localStorage if available
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  setLanguage(savedLang);

  // Ensure menu is updated on load with the correct language
  if (typeof window.updateMenu === 'function') {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    window.updateMenu(savedLang);
  }
});
