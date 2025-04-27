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
      'menu.header': 'Our Menu',
      'menu.item1.title': 'Breaded white fish with Tartar sauce',
      'menu.item1.desc': 'Tender white fish fillet, breaded and fried to golden perfection. Served with creamy homemade tartar sauce.',
      'menu.item2.title': 'Chicken sausages with Potato Wedges',
      'menu.item2.desc': 'Juicy chicken sausages served with crispy golden potato wedges.',
      'menu.item3.title': 'Pasta with chicken and spinach',
      'menu.item3.desc': 'Tender pasta tossed with juicy chicken, fresh spinach, and a creamy sauce.',
      'menu.item4.title': 'Cole Slaw',
      'menu.item4.desc': 'Classic coleslaw salad made with fresh cabbage, carrots, and a creamy dressing.',
    },
    sr: {
      'nav.home': 'Početna',
      'nav.menu': 'Meni',
      'hero.headline': 'Jedite hrabro. Jedite Foodikal.',
      'hero.subtitle': 'Svez, moderan pristup jelovnicima. Minimalno. Uticajno. Ukusno.',
      'hero.cta': 'Pogledaj meni',
      'menu.header': 'Naš Meni',
      'menu.item1.title': 'Bela riba u pohu sa tartar sosom',
      'menu.item1.desc': 'Filet bele ribe u hrskavoj pohovanoj korici, pržen do zlatne boje. Posluženo sa domaćim tartar sosom.',
      'menu.item2.title': 'Pileće kobasice sa krompir pireom',
      'menu.item2.desc': 'Sočne pileće kobasice sa hrskavim krompirom.',
      'menu.item3.title': 'Pasta sa piletinom i spanaćem',
      'menu.item3.desc': 'Nežna pasta sa sočnom piletinom, svežim spanaćem i kremastim sosom.',
      'menu.item4.title': 'Kolslo salata',
      'menu.item4.desc': 'Klasična kolslo salata od svežeg kupusa, šargarepe i kremastog preljeva.',
    },
    ru: {
      'nav.home': 'Главная',
      'nav.menu': 'Меню',
      'hero.headline': 'Ешь смело. Ешь Foodikal.',
      'hero.subtitle': 'Свежий, современный взгляд на меню. Минимализм. Впечатляюще. Вкусно.',
      'hero.cta': 'Посмотреть меню',
      'menu.header': 'Наше меню',
      'menu.item1.title': 'Рыба в панировке с соусом Тар-Тар',
      'menu.item1.desc': 'Нежное филе белой рыбы в хрустящей панировке, обжаренное до золотистой корочки. Подается с домашним соусом тартар.',
      'menu.item2.title': 'Колбаски куриные с картофельными дольками',
      'menu.item2.desc': 'Сочные куриные колбаски с хрустящими картофельными дольками.',
      'menu.item3.title': 'Паста с лососем',
      'menu.item3.desc': 'Паста с лососем в нежном сливочном соусе.',
      'menu.item4.title': 'Коул-слоу',
      'menu.item4.desc': 'Классический салат коул-слоу из свежей капусты, моркови и сливочной заправки.',
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
