document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК ---

  // Иконки
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Плавный скролл (с проверкой на наличие библиотеки)
  let lenis;
  if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true
      });
      function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  }

  // GSAP
  if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  }

  // --- 2. МОБИЛЬНОЕ МЕНЮ ---

  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;

  const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      burger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');

      if (isMenuOpen) {
          if(lenis) lenis.stop();
          document.body.style.overflow = 'hidden';

          gsap.to(mobileLinks, {
              y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out'
          });
      } else {
          if(lenis) lenis.start();
          document.body.style.overflow = '';

          gsap.to(mobileLinks, {
              y: 20, opacity: 0, duration: 0.3
          });
      }
  };

  if(burger) burger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', () => { if(isMenuOpen) toggleMenu(); }));


  // --- 3. АНИМАЦИИ (SCROLL TRIGGER) ---

  // Hero Анимация
  const tl = gsap.timeline();
  tl.from('.hero__badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
    .from('.hero__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__btns', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__visual', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8');

  // Секции
  document.querySelectorAll('.section').forEach(section => {
      gsap.fromTo(section.children,
          { y: 50, opacity: 0 },
          {
              y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 85%' }
          }
      );
  });


  // --- 4. КОНТАКТНАЯ ФОРМА (ВАЛИДАЦИЯ + КАПЧА) ---

  const form = document.getElementById('contactForm');
  if (form) {
      // Генерация капчи
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const captchaResult = num1 + num2;
      const captchaLabel = document.getElementById('captchaLabel');
      const captchaInput = document.getElementById('captcha');

      captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

      // Валидация телефона (только цифры и +)
      const phoneInput = document.getElementById('phone');
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9+ ]/g, '');
      });

      // Отправка формы
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Сброс ошибок
          form.querySelectorAll('input').forEach(inp => inp.classList.remove('error'));

          // Проверки
          const name = document.getElementById('name');
          const email = document.getElementById('email');
          const privacy = document.getElementById('privacy');

          // 1. Имя
          if (!name.value.trim()) {
              name.classList.add('error');
              isValid = false;
          }
          // 2. Email (простой regex)
          if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              email.classList.add('error');
              isValid = false;
          }
          // 3. Телефон
          if (phoneInput.value.length < 5) {
              phoneInput.classList.add('error');
              isValid = false;
          }
          // 4. Капча
          if (parseInt(captchaInput.value) !== captchaResult) {
              captchaInput.classList.add('error');
              isValid = false;
          }
          // 5. Чекбокс
          if (!privacy.checked) {
              // Можно добавить стиль ошибки для чекбокса, но браузер сам подскажет
              isValid = false;
              alert('Пожалуйста, подтвердите согласие с политикой.');
          }

          if (isValid) {
              // Имитация AJAX
              const btn = form.querySelector('.btn--submit');
              btn.classList.add('is-loading');

              setTimeout(() => {
                  btn.classList.remove('is-loading');
                  document.getElementById('formSuccess').classList.add('is-visible');
                  form.reset();
                  // Сброс капчи для повторной отправки (опционально)
              }, 1500);
          }
      });
  }

  // --- 5. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookiePopup');
  const cookieAccept = document.getElementById('cookieAccept');

  if (!localStorage.getItem('pentaCookieConsent')) {
      setTimeout(() => {
          cookiePopup.classList.add('is-active');
      }, 2000);
  }

  cookieAccept.addEventListener('click', () => {
      localStorage.setItem('pentaCookieConsent', 'true');
      cookiePopup.classList.remove('is-active');
  });

  console.log('Penta-Fluxx System Fully Operational');
});