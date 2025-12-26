document.addEventListener('DOMContentLoaded', () => {
  // 1. Мобильное меню
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('nav a');

  if (menuBtn && navMenu) {
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
  }

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

  // 3. Эффект декодера (Улучшенная версия: Волна слева направо)
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

        // ГЛАВНОЕ ИЗМЕНЕНИЕ: Задержка зависит от индекса (i)
        // Это создает эффект волны слева направо
        const start = Math.floor(Math.random() * 15) + (i * 4);
        const end = start + Math.floor(Math.random() * 20) + 20;

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
          // Шанс смены символа (0.2 делает перебор мягче и не таким дерганым)
          if (!char || Math.random() < 0.2) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          // Темно-серый цвет для "шифра"
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

  const textElement = document.querySelector('.typing-text'); // Убедись, что класс совпадает с HTML
  const phrases = [
    'Java Developer',
    'Python Developer',
    'ya lublu standoff',
    'Yoon bratochek',
  ];

  // Запуск анимации текста
  if (textElement) {
    const fx = new TextScramble(textElement);
    let counter = 0;
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 3000); // Пауза 3 секунды, чтобы успеть прочитать
      });
      counter = (counter + 1) % phrases.length;
    };
    // Небольшая задержка перед первым запуском
    setTimeout(next, 1000);
  }

  // 4. Копирование ников
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
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Digital Rain (Оптимизированный)
  const canvas = document.getElementById('matrixCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    // Символы: Катакана + Латиница + Цифры
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = katakana + latin + nums;

    const specialWords = ['EXTR3ME', 'JAVA', 'YOON', 'CODE'];

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

      // Сохраняем капли при ресайзе, чтобы дождь не начинался заново
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
    const fps = 24; // Чуть повысил FPS для плавности дождя
    const interval = 1000 / fps;

    function drawMatrix(currentTime) {
      requestAnimationFrame(drawMatrix);

      if (!currentTime) currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;
      lastTime = currentTime - (deltaTime % interval);

      // Плавное затухание следа
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        let text;
        let isSpecial = false;

        // Логика "пасхалок" (слов)
        if (columnState[i] && columnState[i].active) {
          text = columnState[i].word[columnState[i].index];
          isSpecial = true;
          columnState[i].index++;
          if (columnState[i].index >= columnState[i].word.length) {
            columnState[i].active = false;
          }
        } else if (Math.random() < 0.002) { // Редкий шанс появления слова
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

        // Отрисовка
        if (isSpecial) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.shadowBlur = 0;
          const isWhite = Math.random() > 0.99; // Очень редкие белые блики
          ctx.fillStyle = isWhite ? '#bbbbbb' : '#333333'; // Основной цвет темнее для контраста
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.98) {
          drops[i] = 0;
          if (columnState[i]) columnState[i].active = false;
        }

        drops[i]++;
      }
    }
    requestAnimationFrame(drawMatrix);
  }
});