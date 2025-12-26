document.addEventListener('DOMContentLoaded', () => {
  // 1. Мобильное меню
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('nav a');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // 2. Плавный скролл
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    });
  });

  // 3. Эффект печатания (Typewriter Effect)
  const textElement = document.querySelector('.typing-text');
  const phrases = [
    'Java Developer',
    'Python Developer',
    'ya lublu standoff',
    'Yoon bratochek',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  let backSpeed = 50;
  let backDelay = 2000; // Пауза перед удалением

  function typeEffect() {
    if (!textElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      textElement.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      textElement.textContent = currentPhrase.substring(0, charIndex);
    }

    let delta = isDeleting ? backSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Закончили печатать фразу
      delta = backDelay; // Ждем перед удалением
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Закончили удалять фразу
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delta = 500; // Пауза перед началом новой фразы
    }

    setTimeout(typeEffect, delta);
  }

  // Запуск эффекта
  typeEffect();

  // 4. Копирование ников (тегов) по клику
  document.querySelectorAll('.tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      const textToCopy = tag.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        tag.classList.add('copied');
        setTimeout(() => tag.classList.remove('copied'), 1500);
      });
    });
  });

  // 5. Кнопка "Наверх"
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Digital Rain (Matrix Effect) - Monochrome Noir
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');

  let width, height;



  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  const fontSize = 14;
  let columns;
  let drops = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    columns = Math.floor(width / fontSize);
    // Re-initialize drops if needed, or just extend/truncate
    // For simplicity, we can preserve existing drops and add new ones if width increases
    const newDrops = [];
    for (let i = 0; i < columns; i++) {
      newDrops[i] = drops[i] || Math.random() * -100;
    }
    drops = newDrops;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawMatrix() {
    // Полупрозрачный черный фон для следа
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Случайный символ
      const text = chars[Math.floor(Math.random() * chars.length)];

      // Цвет: темно-серый, иногда белый
      const isWhite = Math.random() > 0.98;
      ctx.fillStyle = isWhite ? '#ffffff' : '#444444';

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // Сброс капли или падение
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();
});
