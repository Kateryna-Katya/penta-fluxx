// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {

  // 1. Инициализация иконок Lucide
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

  // Интеграция Lenis с GSAP ScrollTrigger (на будущее)
  gsap.registerPlugin(ScrollTrigger);

  // 3. Простое мобильное меню (пока базовое переключение)
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if(burger && nav) {
      burger.addEventListener('click', () => {
          // В реальной разработке здесь будет класс .is-open
          // Для демо просто логируем или делаем простой тогл,
          // но так как стилей для мобильного меню (overlay) пока нет,
          // оставим заглушку для следующего этапа.
          console.log('Toggle menu');
      });
  }
});