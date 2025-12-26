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

  // 3. Эффект декодера (Matrix Decoder Effect)
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 60); // Увеличил для замедления
        const end = start + Math.floor(Math.random() * 60);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          // Темно-серый для случайных символов
          output += `<span style="color: #444444;">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const textElement = document.querySelector('.typing-text');
  const phrases = [
    'Java Developer',
    'Python Developer',
    'ya lublu standoff',
    'Yoon bratochek',
  ];

  if (textElement) {
    const fx = new TextScramble(textElement);
    let counter = 0;
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 2500); // Пауза перед следующей фразой
      });
      counter = (counter + 1) % phrases.length;
    };
    next();
  }

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
