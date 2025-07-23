// src/assets/js/custom.js

export function handleScrollHeader() {
  const scroll = window.scrollY;
  const topBox = document.getElementById('top');
  const header = document.querySelector('header');

  if (topBox && header) {
    const boxHeight = topBox.offsetHeight;
    const headerHeight = header.offsetHeight;

    if (scroll >= boxHeight - headerHeight) {
      header.classList.add('background-header');
    } else {
      header.classList.remove('background-header');
    }
  }
}

export function smoothScroll() {
  const links = document.querySelectorAll('.scroll-to-section a[href^="#"]:not([href="#"])');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });

        // Deactivate menu on mobile
        const menuTrigger = document.querySelector('.menu-trigger');
        const nav = document.querySelector('.header-area .nav');
        if (menuTrigger && nav && window.innerWidth < 991) {
          menuTrigger.classList.remove('active');
          nav.style.display = 'none';
        }

        // Update active link
        document.querySelectorAll('.scroll-to-section a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

export function mobileMenuToggle() {
  const menuTrigger = document.querySelector('.menu-trigger');
  const nav = document.querySelector('.header-area .nav');

  if (menuTrigger && nav) {
    menuTrigger.addEventListener('click', () => {
      menuTrigger.classList.toggle('active');
      if (nav.style.display === 'block') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'block';
      }
    });
  }
}

export function submenuBehavior() {
  const submenus = document.querySelectorAll('.submenu');

  submenus.forEach((submenu) => {
    submenu.addEventListener('click', () => {
      if (window.innerWidth < 767) {
        document.querySelectorAll('.submenu ul').forEach(ul => ul.classList.remove('active'));
        const childUl = submenu.querySelector('ul');
        if (childUl) {
          childUl.classList.toggle('active');
        }
      }
    });
  });
}

export default function initCustomScripts() {
  // Your custom jQuery logic (must load jQuery globally)
  console.log("Custom scripts initialized.");
}

