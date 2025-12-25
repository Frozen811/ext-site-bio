  // Частицы
  function createParticles(){const t=document.getElementById("particles"),e=35;for(let o=0;o<e;o++){const e=document.createElement("div");e.classList.add("particle");const i=Math.random()*4+2,n=Math.random()*100,a=Math.random()*100,r=Math.random()*0.5+0.1,c=Math.random()*20+10,d=Math.random()*5;e.style.width=`${i}px`,e.style.height=`${i}px`,e.style.left=`${n}%`,e.style.top=`${a}%`,e.style.opacity=r,e.style.animation=`float ${c}s ease-in-out ${d}s infinite alternate`,t.appendChild(e)}const o=document.createElement("style");o.textContent=`@keyframes float{0%{transform:translate(0,0)}25%{transform:translate(10px,-15px)}50%{transform:translate(-5px,-10px)}75%{transform:translate(15px,5px)}100%{transform:translate(-5px,5px)}}`,document.head.appendChild(o)}

  // Анимация при скролле
  function animateOnScroll(){
    const elements = document.querySelectorAll(".role-card, .feature-item");
    const trigger = window.innerHeight / 1.15;
    elements.forEach(t=>{
      const top = t.getBoundingClientRect().top;
      if(top < trigger) {
        t.style.opacity="1";
        t.style.transform="translateY(0)";
      }
    });
  }

  // Init animation styles
  document.querySelectorAll(".role-card, .feature-item").forEach(t=>{
    t.style.opacity="0";
    t.style.transform="translateY(40px)";
    t.style.willChange="opacity, transform"; // Оптимизация для ПК
  });

  // Логика меню
  const menuToggle = document.getElementById('mobile-menu');
  const navList = document.getElementById('nav-list');
  const header = document.querySelector('header');

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.toggle('active');
    menuToggle.innerHTML = navList.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    // На мобилках делаем фон черным при открытии
    if (window.innerWidth <= 768) {
      header.style.background = navList.classList.contains('active') ? '#000' : '#000';
    }
  });

  // Скролл по якорям
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      navList.classList.remove('active');
      if(menuToggle.offsetParent !== null) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if(target) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    });
  });

  // Закрытие по клику вне
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('active') && !navList.contains(e.target) && !menuToggle.contains(e.target)) {
      navList.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Кнопка наверх + Хедер эффект
  const mybutton = document.getElementById("backToTop");
  window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
    animateOnScroll();
  };

  function topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  document.addEventListener("DOMContentLoaded", function(){
    createParticles();
    animateOnScroll();
  });

