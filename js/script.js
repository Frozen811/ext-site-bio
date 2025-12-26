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



  const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const special = '@#$%^&*()_+-=[]{}|;:,.<>?';
  const chars = katakana + latin + nums + special;

  const specialWords = ['EXTR3ME', 'YOON'];

  const fontSize = 14;
  let columns;
  let drops = [];
  let columnState = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    columns = Math.floor(width / fontSize);

    const newDrops = [];
    const newColumnState = [];
    for (let i = 0; i < columns; i++) {
      newDrops[i] = drops[i] || Math.random() * -100;
      newColumnState[i] = columnState[i] || { active: false, word: '', index: 0 };
    }
    drops = newDrops;
    columnState = newColumnState;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let lastTime = 0;
  const fps = 20; // Ограничение кадров в секунду для замедления
  const interval = 1000 / fps;

  function drawMatrix(currentTime) {
    requestAnimationFrame(drawMatrix);

    if (!currentTime) currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime < interval) return;

    lastTime = currentTime - (deltaTime % interval);

    // Полупрозрачный черный фон для следа
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      let text;
      let isSpecial = false;

      // Логика для специальных слов (ников)
      if (columnState[i] && columnState[i].active) {
        text = columnState[i].word[columnState[i].index];
        isSpecial = true;
        columnState[i].index++;
        if (columnState[i].index >= columnState[i].word.length) {
          columnState[i].active = false;
        }
      } else if (Math.random() < 0.005) { // Шанс появления ника
        const word = specialWords[Math.floor(Math.random() * specialWords.length)];
        columnState[i].active = true;
        columnState[i].word = word;
        columnState[i].index = 0;
        text = columnState[i].word[columnState[i].index];
        isSpecial = true;
        columnState[i].index++;
      } else {
        text = chars[Math.floor(Math.random() * chars.length)];
      }

      // Цвет и эффекты
      if (isSpecial) {
        ctx.shadowBlur = 15; // Свечение
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        const isWhite = Math.random() > 0.98;
        ctx.fillStyle = isWhite ? '#ffffff' : '#444444';
      }

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // Сброс капли или падение
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
        // Сбрасываем состояние слова при ресете капли
        if (columnState[i]) columnState[i].active = false;
      }

      drops[i]++;
    }
  }

  requestAnimationFrame(drawMatrix);
});
