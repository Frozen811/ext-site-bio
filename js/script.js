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

  // --- 0. PRELOADER LOGIC ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(() => preloader.remove(), 600);
    }, 1200);
  }

  // --- 0.1. PAGE TRANSITION (FADE-IN ON LOAD) ---
  // Ensure body starts with opacity 0 (set in CSS), then fade in
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '1';
  }, 50);

  // 1. Мобильное меню
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('nav a');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isActive = menuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      // Update aria-expanded for accessibility
      menuBtn.setAttribute('aria-expanded', isActive.toString());
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
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

  // 3. Смена текста в подзаголовке (листинг профессий)
  const textElement = document.querySelector('.typing-text');
  const phrases = [
    'Java Developer',
    'Python Developer',
    'Crmp&Samp Developer',
    'I Use Arch Btw'
  ];

  if (textElement) {
    let counter = 0;
    
    // Устанавливаем начальный текст
    textElement.textContent = phrases[0];
    textElement.style.transition = 'opacity 0.4s ease';
    
    function changeText() {
      // Плавное исчезновение
      textElement.style.opacity = '0';
      
      setTimeout(() => {
        counter = (counter + 1) % phrases.length;
        textElement.textContent = phrases[counter];
        // Плавное появление
        textElement.style.opacity = '1';
      }, 400);
    }
    
    // Меняем текст каждые 3 секунды
    setInterval(changeText, 3000);
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

  // 6. Матрица отключена для чистого дизайна
  // Canvas скрыт через CSS (display: none)

  // --- 7. PAGE TRANSITIONS (SMOOTH NAVIGATION) ---
  // Intercept all internal links for smooth page transitions
  let isNavigating = false; // Prevent multiple simultaneous navigations
  
  document.querySelectorAll('a[href]').forEach(link => {
    // Skip anchor links (starting with #)
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
      return;
    }

    link.addEventListener('click', (e) => {
      // Prevent race condition - only one navigation at a time
      if (isNavigating) {
        e.preventDefault();
        return;
      }

      // Check if it's an internal link (same origin or relative)
      const isInternal = href.startsWith('/') || 
                        href.startsWith('./') || 
                        href.startsWith('../') ||
                        href.includes(window.location.hostname) ||
                        !href.includes('://');

      if (isInternal) {
        e.preventDefault();
        isNavigating = true;
        
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