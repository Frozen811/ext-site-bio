// Utility: Throttle function for performance
function throttle(func, wait) {
  let timeout;
  let lastRan;
  return function executedFunction(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if ((Date.now() - lastRan) >= wait) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastRan), 0));
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. PAGE TRANSITION (FADE-IN ON LOAD) ---
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // --- 0.1. PRELOADER LOGIC ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(() => preloader.remove(), 600);
    }, 1200);
  }

  // --- НОВАЯ ФИЧА: Печатная машинка для EXTREME ---
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    const textToType = "EXTREME";
    mainTitle.textContent = ""; // Очищаем текст перед печатью

    let charIndex = 0;
    function typeMainTitle() {
      if (charIndex < textToType.length) {
        mainTitle.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeMainTitle, 200); // Скорость печати (200мс)
      }
    }
    // Запускаем печать через 1.5 секунды (после прелоадера)
    setTimeout(typeMainTitle, 1500);
  }

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

  // 3. Эффект декодера (для подзаголовка Java Developer...)
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
          if (!char || Math.random() < 0.2) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
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
        setTimeout(next, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };
    // Запускаем чуть позже, после заголовка
    setTimeout(next, 2500);
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

  // 5. Кнопка "Наверх" с throttle для производительности
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  const handleScroll = throttle(() => {
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Digital Rain - Optimized with reduced complexity
  const canvas = document.getElementById('matrixCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    let width, height;

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

      const newDrops = [];
      const newColumnState = [];
      for (let i = 0; i < columns; i++) {
        newDrops[i] = drops[i] || Math.random() * -100;
        newColumnState[i] = columnState[i] || { active: false, word: '', index: 0 };
      }
      drops = newDrops;
      columnState = newColumnState;
    }

    const debouncedResize = throttle(resizeCanvas, 250);
    window.addEventListener('resize', debouncedResize, { passive: true });
    resizeCanvas();

    let lastTime = 0;
    const fps = 20; // Reduced from 24 for better performance
    const interval = 1000 / fps;

    let animationFrameId;
    
    function drawMatrix(currentTime) {
      animationFrameId = requestAnimationFrame(drawMatrix);
      if (!currentTime) currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;
      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        let text;
        let isSpecial = false;

        if (columnState[i] && columnState[i].active) {
          text = columnState[i].word[columnState[i].index];
          isSpecial = true;
          columnState[i].index++;
          if (columnState[i].index >= columnState[i].word.length) {
            columnState[i].active = false;
          }
        } else if (Math.random() < 0.001) { // Reduced frequency for performance
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

        if (isSpecial) {
          ctx.shadowBlur = 8; // Reduced from 10
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.shadowBlur = 0;
          const isWhite = Math.random() > 0.99;
          ctx.fillStyle = isWhite ? '#bbbbbb' : '#333333';
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.98) {
          drops[i] = 0;
          if (columnState[i]) columnState[i].active = false;
        }
        drops[i]++;
      }
    }
    
    // Pause animation when page is hidden for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(drawMatrix);
      }
    }, { passive: true });
    
    requestAnimationFrame(drawMatrix);
  }

  // --- 7. PAGE TRANSITIONS (SMOOTH NAVIGATION) ---
  // Intercept all internal links for smooth page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    // Skip anchor links (starting with #)
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
      return;
    }

    link.addEventListener('click', (e) => {
      // Check if it's an internal link (same origin or relative)
      const isInternal = href.startsWith('/') || 
                        href.startsWith('./') || 
                        href.startsWith('../') ||
                        href.includes(window.location.hostname) ||
                        !href.includes('://');

      if (isInternal) {
        e.preventDefault();
        
        // Add transitioning class to trigger fade-out
        document.body.classList.add('page-transitioning');
        
        // Wait for fade-out animation, then navigate
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // --- 8. SCROLL REVEAL ANIMATION (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optionally unobserve after reveal for performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // Slight offset from bottom
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

});

/* --- ЗАЩИТА ОТ КОПИРОВАНИЯ (Simplified for better UX) --- */
// Note: Aggressive blocking provides poor user experience and accessibility issues
// Keeping only context menu prevention
document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: false });