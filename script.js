// Foodikal: Minimal JS for navigation and interactivity

document.addEventListener('DOMContentLoaded', function () {
  // Language switcher functionality
  // Only use hardcoded translations for nav/hero on index.html, not for menu items
  const translations = {
    en: {
      'modal.header': 'Contact your personal manager',
      'modal.btn1': 'Telegram',
      'modal.btn2': 'Viber',
      'modal.btn3': 'Call us',
      'modal.instructions': 'Or leave your details and we\u2019ll contact you.',
      'modal.leave': 'Leave your contact details',
      'modal.form.name': 'Name',
      'modal.form.contact': 'How should we contact you?',
      'modal.form.send': 'Send',
      'modal.form.thanks': 'Thank you! We will contact you soon.',
      'nav.home': 'Home',
      'nav.menu': 'Menu',
      'hero.headline': 'You work. We feed you.',
      'hero.subtitle': 'Everyone focuses on what they do best.',
      'hero.cta': 'View Menu',
      'order.cta': 'Make order',
      'menu.header': 'Dishes from Our Menu',
      'services.header': 'Our Services',
      'services.title1': 'Regular meals delivery for offices',
      'services.title2': 'Setting up the buffet in your place',
      'services.title3': 'Catering and banquets for events',
      'menu.item1.title': 'Finnish pancake with sweet cream and raspberry',
      'menu.item1.desc': 'Start your morning with a tender Finnish pancake topped with airy sweet cream and juicy raspberries.',
      'menu.item2.title': 'Okroshka with ham and kvass',
      'menu.item2.desc': 'Refreshing okroshka with flavorful sausage and classic kvass for a lively lunch.',
      'menu.item3.title': 'Pilaf with beef',
      'menu.item3.desc': 'Hearty pilaf with tender beef and spices — the perfect dinner after a long day.',
      'menu.item4.title': 'Achik-chuchuk Salad',
      'menu.item4.desc': 'Vibrant Achik-chuchuk salad of fresh tomatoes, onions, and greens makes the perfect side for any dish.',
    },
    sr: {
      'modal.header': 'Kontaktirajte svog ličnog menadžera',
      'modal.btn1': 'Telegram',
      'modal.btn2': 'Viber',
      'modal.btn3': 'Pozovi nas',
      'modal.instructions': 'Ili ostavite svoje podatke i kontaktiraćemo vas.',
      'modal.leave': 'Ostavite svoje podatke za kontakt',
      'modal.form.name': 'Ime',
      'modal.form.contact': 'Kako da vas kontaktiramo?',
      'modal.form.send': 'Pošalji',
      'modal.form.thanks': 'Hvala! Uskoro ćemo vam se javiti.',
      'nav.home': 'Početna',
      'nav.menu': 'Meni',
      'hero.headline': 'Vi radite. Mi vas hranimo.',
      'hero.subtitle': 'Svi su fokusirani na ono što najbolje rade.',
      'hero.cta': 'Meni',
      'order.cta': 'Napravi porudžbinu',
      'menu.header': 'Jela iz našeg menija',
      'services.header': 'Naše usluge',
      'services.title1': 'Redovna dostava obroka za kancelarije',
      'services.title2': 'Postavljanje švedskog stola na vašoj lokaciji',
      'services.title3': 'Ketering i banketi za događaje',
      'menu.item1.title': 'Finska palačinka sa šlagom i malinama',
      'menu.item1.desc': 'Započnite jutro nežnom finskom palačinkom sa vazdušastim kremom i sočnim malinama.',
      'menu.item2.title': 'Okroška sa kobasicom i kvasom',
      'menu.item2.desc': 'Osvežavajuća okroška sa ukusnom kobasicom i klasičnim kvasom za energičan ručak.',
      'menu.item3.title': 'Pilav sa govedinom',
      'menu.item3.desc': 'Zasićujući pilav sa nežnim goveđim mesom i začinima — idealna večera posle dugog dana.',
      'menu.item4.title': 'Ačučuk salata',
      'menu.item4.desc': 'Šarena Ačučuk salata od svežih paradajza, luka i zelenila — idealan prilog svakom jelu.',
    },
    ru: {
      'modal.header': 'Свяжитесь с персональным менеджером',
      'modal.btn1': 'Telegram',
      'modal.btn2': 'Viber',
      'modal.btn3': 'Позвонить',
      'modal.instructions': 'Или оставьте свои контакты — мы свяжемся с вами.',
      'modal.leave': 'Оставить контактные данные',
      'modal.form.name': 'Имя',
      'modal.form.contact': 'Как с вами связаться?',
      'modal.form.send': 'Отправить',
      'modal.form.thanks': 'Спасибо! Мы скоро свяжемся с вами.',
      'nav.home': 'Главная',
      'nav.menu': 'Меню',
      'hero.headline': 'Вы работаете. Мы кормим.',
      'hero.subtitle': 'Каждый сосредоточен на том, что получается лучше всего.',
      'hero.cta': 'Наше меню',
      'order.cta': 'Сделать заказ',
      'menu.header': 'Блюда из нашего меню',
      'services.header': 'Наши услуги',
      'services.title1': 'Регулярная доставка питания в офисы',
      'services.title2': 'Организация шведского стола в вашей локации',
      'services.title3': 'Кейтеринг и банкеты для мероприятий',
      'menu.item1.title': 'Финский блин с кремом и малиной',
      'menu.item1.desc': 'Начните утро с нежного финского блина с воздушным кремом и сочной малиной.',
      'menu.item2.title': 'Окрошка с колбасой и квасом',
      'menu.item2.desc': 'Освежающая окрошка с ароматной колбасой и классическим квасом для бодрого обеда.',
      'menu.item3.title': 'Плов с говядиной',
      'menu.item3.desc': 'Сытный плов с нежной говядиной и пряностями — идеальный ужин после долгого дня.',
      'menu.item4.title': 'Салат Ачучук',
      'menu.item4.desc': 'Яркий салат Ачучук из свежих томатов, лука и зелени станет отличным дополнением к любому блюду.',
    },
  };

  
  function setLanguage(lang) {
    updateModalLang(lang);
    updateModalText(lang);
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    // Update language switcher indicator
    const langCustom = document.querySelector('.lang-custom-select');
    if (langCustom) {
      const selected = langCustom.querySelector('.custom-select__selected');
      if (selected) {
        let code = lang.toUpperCase();
        selected.textContent = code;
      }
    }
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    if (typeof window.updateMenu === 'function') {
      window.updateMenu(lang);
    }
    localStorage.setItem('selectedLanguage', lang);
  }

  function renderMenu(lang) {
    const t = window.menuTranslations[lang];
    const sectionOrder = ['breakfast', 'soups', 'salads', 'main', 'sides', 'drinks'];
    const sectionIdMap = {
      breakfast: 'breakfast',
      soups: 'soups',
      salads: 'salads',
      main: 'main',
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
          itemDiv.innerHTML = `<strong>${dish.name}</strong>${dish.price ? `<span class='menu__price'>${dish.price}</span>` : ''}<em>${dish.desc}</em>`;
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

  // Modal logic
  const modal = document.getElementById('global-modal');
  const modalHeader = document.getElementById('modal-header');
  const modalButtons = document.getElementById('modal-buttons');
  const modalClose = document.querySelector('.modal-close');
  let currentLang = localStorage.getItem('selectedLanguage') || 'en';

  // Attach modal open to all Make order buttons
  function attachModalToOrderButtons() {
    const orderBtns = document.querySelectorAll('[data-i18n="order.cta"]');
    orderBtns.forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        openModal();
      };
    });
  }
  document.addEventListener('DOMContentLoaded', attachModalToOrderButtons);
  attachModalToOrderButtons();

  // Update modal text on language change
  function updateModalLang(lang) {
    currentLang = lang;
    updateModalText(lang);
  }
  window.updateModalLang = updateModalLang;

  if (modalClose) {
    modalClose.onclick = closeModal;
  }
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) closeModal();
    };
  }

  function updateModalText(lang) {
    if (!modalHeader || !modalButtons) return;
    const modalHeaderText = document.getElementById('modal-header-text');
    if (modalHeaderText) {
      modalHeaderText.textContent = translations[lang]['modal.header'];
    }
    modalButtons.innerHTML = '';
    // Button data: [textKey, href, target, eventCategory, eventLabel]
    const btnData = [
      {textKey: 'btn1', href: 'https://t.me/foodikal', target: '_blank', eventCategory: 'Contact', eventLabel: 'Telegram'},
      {textKey: 'btn2', href: 'viber://chat/?number=%2B381615736624', target: '_self', eventCategory: 'Contact', eventLabel: 'Viber'},
      {textKey: 'btn3', href: 'tel:+381615736624', target: '_self', eventCategory: 'Contact', eventLabel: 'Phone Call'}
    ];
    const iconPaths = [
      'img/icons/icon-telegram.png',
      'img/icons/icon-viber.png',
      'img/icons/icon-phone.png'
    ];
    btnData.forEach((btnInfo, idx) => {
      const a = document.createElement('a');
      a.className = 'modal-action-btn';
      // Add icon
      const icon = document.createElement('img');
      icon.src = iconPaths[idx];
      // Get label from translations (prefer window.menuTranslations if available)
      let label = btnInfo.textKey;
      if (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal[btnInfo.textKey]) {
        label = window.menuTranslations[lang].modal[btnInfo.textKey];
      } else if (translations[lang] && translations[lang][`modal.${btnInfo.textKey}`]) {
        label = translations[lang][`modal.${btnInfo.textKey}`];
      } else if (translations['en'] && translations['en'][`modal.${btnInfo.textKey}`]) {
        label = translations['en'][`modal.${btnInfo.textKey}`];
      }
      icon.alt = label + ' icon';
      icon.className = 'modal-action-btn__icon';
      a.appendChild(icon);
      // Add text
      const span = document.createElement('span');
      span.className = 'modal-action-btn__text';
      span.textContent = label;
      a.appendChild(span);
      a.href = btnInfo.href;
      a.target = btnInfo.target;
      a.rel = btnInfo.target === '_blank' ? 'noopener noreferrer' : '';
      
      // Add click event listener for Google Analytics
      a.addEventListener('click', function(e) {
        if (window.gtag) {
          let eventName = '';
          switch (btnInfo.eventLabel) {
            case 'Telegram':
              eventName = 'telegram_click';
              break;
            case 'Viber':
              eventName = 'viber_click';
              break;
            case 'Phone Call':
              eventName = 'call_click';
              break;
            default:
              eventName = 'contact_click';
          }
          gtag('event', eventName, {
            'event_category': btnInfo.eventCategory,
            'event_label': btnInfo.eventLabel,
            'value': 1
          });
        }
        // Allow default navigation to proceed
        return true;
      });
      
      modalButtons.appendChild(a);
    });
    // Add pressable email button
    const emailBtn = document.createElement('button');
    emailBtn.type = 'button';
    emailBtn.className = 'modal-action-btn modal-action-btn--email';
    emailBtn.style.userSelect = 'all';
    const emailSpan = document.createElement('span');
    emailSpan.className = 'modal-action-btn__text';
    emailSpan.textContent = 'foodikal@protonmail.com';
    emailBtn.appendChild(emailSpan);
    emailBtn.addEventListener('click', function() {
      const email = 'foodikal@protonmail.com';
      // Google Analytics event
      if (window.gtag) {
        gtag('event', 'email_copy', {
          'event_category': 'Contact',
          'event_label': 'Email Copy',
          'value': 1
        });
      }
      // Copy to clipboard
      navigator.clipboard.writeText(email).then(function() {
        // Show notification by replacing button content
        const original = emailBtn.innerHTML;
        emailBtn.innerHTML = '<span class="modal-action-btn__text">Email copied to clipboard</span>';
        emailBtn.disabled = true;
        setTimeout(function() {
          emailBtn.innerHTML = original;
          emailBtn.disabled = false;
        }, 600);
      });
    });
    modalButtons.appendChild(emailBtn);

    // Instruction text and collapsible contact form
    const instructionWrap = document.createElement('div');
    instructionWrap.className = 'modal-instructions';
    const instructionText = document.createElement('strong');
    let instructionLabel = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.instructions)
      ? window.menuTranslations[lang].modal.instructions
      : (translations[lang] && translations[lang]['modal.instructions'])
        ? translations[lang]['modal.instructions']
        : (translations['en'] && translations['en']['modal.instructions'])
          ? translations['en']['modal.instructions']
          : 'Or you can leave your information, so we will contact you';
    instructionText.textContent = instructionLabel;
    instructionWrap.appendChild(instructionText);
    modalButtons.appendChild(instructionWrap);

    // Leave contacts button
    const leaveBtn = document.createElement('button');
    leaveBtn.type = 'button';
    leaveBtn.className = 'modal-action-btn modal-leave-btn';
    const leaveSpan = document.createElement('span');
    leaveSpan.className = 'modal-action-btn__text';
    let leaveLabel = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.leave)
      ? window.menuTranslations[lang].modal.leave
      : (translations[lang] && translations[lang]['modal.leave'])
        ? translations[lang]['modal.leave']
        : (translations['en'] && translations['en']['modal.leave'])
          ? translations['en']['modal.leave']
          : 'Leave contacts';
    leaveSpan.textContent = leaveLabel;
    leaveBtn.appendChild(leaveSpan);
    modalButtons.appendChild(leaveBtn);

    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = 'modal-form';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'modal-input';
    nameInput.setAttribute('maxlength', '60');
    nameInput.placeholder = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.name)
      ? window.menuTranslations[lang].modal.name
      : (translations[lang] && translations[lang]['modal.form.name'])
        ? translations[lang]['modal.form.name']
        : (translations['en'] && translations['en']['modal.form.name'])
          ? translations['en']['modal.form.name']
          : 'Name';
    const contactInput = document.createElement('input');
    contactInput.type = 'text';
    contactInput.className = 'modal-input';
    contactInput.setAttribute('maxlength', '160');
    contactInput.placeholder = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.contact)
      ? window.menuTranslations[lang].modal.contact
      : (translations[lang] && translations[lang]['modal.form.contact'])
        ? translations[lang]['modal.form.contact']
        : (translations['en'] && translations['en']['modal.form.contact'])
          ? translations['en']['modal.form.contact']
          : 'How to contact';
    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'modal-action-btn';
    const sendSpan = document.createElement('span');
    sendSpan.className = 'modal-action-btn__text';
    sendSpan.textContent = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.send)
      ? window.menuTranslations[lang].modal.send
      : (translations[lang] && translations[lang]['modal.form.send'])
        ? translations[lang]['modal.form.send']
        : (translations['en'] && translations['en']['modal.form.send'])
          ? translations['en']['modal.form.send']
          : 'Send';
    sendBtn.appendChild(sendSpan);
    formContainer.appendChild(nameInput);
    formContainer.appendChild(contactInput);
    formContainer.appendChild(sendBtn);
    modalButtons.appendChild(formContainer);

    // Replace button with form
    leaveBtn.addEventListener('click', function() {
      // GA: leave contacts click
      if (window.gtag) {
        gtag('event', 'leave_contacts', {
          'event_category': 'Contact',
          'event_label': 'Leave Contacts',
          'value': 1
        });
      }
      // Animate button out, then show form
      leaveBtn.classList.add('fade-out');
      setTimeout(function() {
        leaveBtn.style.display = 'none';
        formContainer.classList.add('open');
        formContainer.classList.add('modal-fade-in');
      }, 180);
    });

    // Send handler
    sendBtn.addEventListener('click', function() {
      const name = nameInput.value.trim().slice(0, 60);
      const contact = contactInput.value.trim().slice(0, 160);
      if (!name || !contact) {
        [nameInput, contactInput].forEach((el) => {
          if (!el.value.trim()) {
            el.classList.add('modal-input--error');
            setTimeout(() => el.classList.remove('modal-input--error'), 800);
          }
        });
        return;
      }
      // GA: send contacts submit
      if (window.gtag) {
        gtag('event', 'send_contatcs', {
          'event_category': 'Contact',
          'event_label': 'Send Contacts',
          'value': 1
        });
      }

      fetch('https://contact-form-worker.x-gs-x.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact })
      }).catch(() => {});
      // Show thank you text, replacing inputs and send button
      const thanksText = (window.menuTranslations && window.menuTranslations[lang] && window.menuTranslations[lang].modal && window.menuTranslations[lang].modal.thanks)
        ? window.menuTranslations[lang].modal.thanks
        : (translations[lang] && translations[lang]['modal.form.thanks'])
          ? translations[lang]['modal.form.thanks']
          : (translations['en'] && translations['en']['modal.form.thanks'])
            ? translations['en']['modal.form.thanks']
            : 'Thank you! We will contact you soon.';
      formContainer.innerHTML = '';
      const thanksEl = document.createElement('div');
      thanksEl.className = 'modal-thanks';
      thanksEl.textContent = thanksText;
      thanksEl.classList.add('modal-fade-in');
      formContainer.appendChild(thanksEl);
    });
  }

  function openModal() {
    // Send Google Analytics event
    if (window.gtag) {
      gtag('event', 'open_contact_modal', {
        'event_category': 'engagement',
        'event_label': 'Contact Personal Manager',
        'value': 1
      });
    }
    
    updateModalText(currentLang);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Update URL with hash
    if (window.history.pushState) {
      window.history.pushState(null, null, '#order');
    } else {
      window.location.hash = 'order';
    }
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Remove the hash from URL
    if (window.history.pushState) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
  }
  if (modalClose) {
    modalClose.onclick = closeModal;
  }
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) closeModal();
    };
  }
  // Attach modal open to all Make order buttons
  function attachModalToOrderButtons() {
    const orderBtns = document.querySelectorAll('[data-i18n="order.cta"]');
    orderBtns.forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        openModal();
      };
    });
  }
  // Attach modal open to hero CTA button (after openModal is defined)
  var heroCtaBtn = document.getElementById('hero-cta-btn');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
  // Attach modal open to header order link
  var headerOrderLink = document.getElementById('header-order-link');
  if (headerOrderLink) {
    headerOrderLink.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
  document.addEventListener('DOMContentLoaded', attachModalToOrderButtons);
  attachModalToOrderButtons();
  // Update modal text on language change
  function updateModalLang(lang) {
    currentLang = lang;
    updateModalText(lang);
  }
  window.updateModalLang = updateModalLang;

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

  // Initialize modal functionality
  function initModal() {
    console.log('Initializing modal...');
    
    // Function to safely open modal
    function safeOpenModal() {
      try {
        if (typeof openModal === 'function') {
          openModal();
          console.log('Modal opened successfully');
          return true;
        } else {
          console.error('openModal function not found');
          return false;
        }
      } catch (error) {
        console.error('Error opening modal:', error);
        return false;
      }
    }

    // Check for #order hash and open modal if needed
    function checkHash() {
      console.log('Checking hash:', window.location.hash);
      if (window.location.hash === '#order') {
        console.log('Order hash detected, attempting to open modal...');
        // Try to open immediately, if that fails, try again after a short delay
        if (!safeOpenModal()) {
          setTimeout(safeOpenModal, 300);
        }
      }
    }

    // Set up hash change listener
    window.addEventListener('hashchange', checkHash);
    
    // Check hash on initial load (with a small delay to ensure everything is ready)
    setTimeout(checkHash, 100);
    
    // Expose debug functions
    window.debugModal = {
      open: safeOpenModal,
      close: closeModal,
      checkHash: checkHash
    };
    
    console.log('Modal initialization complete');
    console.log('Debug functions available at window.debugModal');
  }

  // Initialize modal after everything else is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
  } else {
    // DOM already loaded
    initModal();
  }
});

// Direct approach - add this at the very end of the file
window.addEventListener('load', function() {
  console.log('Page fully loaded, checking for hash...');
  if (window.location.hash === '#order') {
    console.log('Found #order hash, attempting to open modal...');
    // Try to find and click the order button
    const orderButtons = document.querySelectorAll('[data-i18n="order.cta"]');
    console.log('Found order buttons:', orderButtons.length);
    
    if (orderButtons.length > 0) {
      console.log('Clicking the first order button...');
      orderButtons[0].click();
    } else {
      console.error('No order buttons found on the page');
    }
  }
});
