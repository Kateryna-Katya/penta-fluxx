document.addEventListener('DOMContentLoaded', () => {

  // 1. Инициализация иконок
  lucide.createIcons();

  // 2. Плавный скролл (Lenis)
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
  });
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 3. Мобильное Меню
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;

  // Функция переключения меню
  const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      burger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');

      if (isMenuOpen) {
          // Блокируем скролл страницы
          document.body.style.overflow = 'hidden';
          lenis.stop();

          // Анимация появления ссылок (stagger)
          gsap.to(mobileLinks, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              delay: 0.3,
              ease: 'power2.out'
          });
      } else {
          document.body.style.overflow = '';
          lenis.start();

          // Сброс анимации ссылок
          gsap.to(mobileLinks, {
              y: 20,
              opacity: 0,
              duration: 0.3
          });
      }
  };

  burger.addEventListener('click', toggleMenu);

  // Закрытие меню при клике на ссылку
  mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (isMenuOpen) toggleMenu();
      });
  });

  // 4. Анимации GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Hero Анимация (При загрузке)
  const tl = gsap.timeline();

  // Разбиваем заголовок на слова для анимации (если подключен SplitType, иначе просто fade)
  // Для простоты используем стандартную анимацию элементов
  tl.from('.hero__badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
    .from('.hero__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__btns', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__visual', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8')
    .from('.hero__floating-card', { x: 50, opacity: 0, stagger: 0.2 }, '-=1');

  // Анимация секций при скролле
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
      gsap.fromTo(section.children,
          { y: 50, opacity: 0 },
          {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                  trigger: section,
                  start: 'top 80%', // Анимация начнется, когда верх секции достигнет 80% высоты экрана
              }
          }
      );
  });

  // Эффект параллакса для карточек (Benefits)
  gsap.utils.toArray('.benefit-card').forEach((card, i) => {
      gsap.to(card, {
          y: -20,
          scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top top',
              scrub: 1.5
          }
      });
  });

  console.log('Penta-Fluxx System Initialized');
});