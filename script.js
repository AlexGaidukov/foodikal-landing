// Foodical: Minimal JS for navigation and interactivity

document.addEventListener('DOMContentLoaded', function () {
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
