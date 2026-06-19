/* ===================================================================
   GAUTHAM P SAJITH — PORTFOLIO SCRIPTS
   Handles: loader, particles, typing animation, theme toggle,
   mobile nav, scroll reveals, skill bars, back-to-top, contact form.
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. LOADING SCREEN
     Hide the loader once the page is ready (with a small minimum
     delay so the animation doesn't feel like a flicker).
  ----------------------------------------------------------- */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 600);
  });


  /* -----------------------------------------------------------
     2. STICKY HEADER ON SCROLL
     Adds a glass background to the header once the user scrolls
     past the hero, and highlights the active nav link.
  ----------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleHeaderScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  function handleActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleActiveLink();
  });


  /* -----------------------------------------------------------
     3. MOBILE NAV TOGGLE
  ----------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  // Close mobile menu after clicking a link
  navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });


  /* -----------------------------------------------------------
     4. DARK / LIGHT MODE TOGGLE
     Persists the user's preference in memory for this session.
     (No localStorage is used in this build; if you want the
     choice to persist across visits, store it in your own
     backend or a cookie set by your server.)
  ----------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
  });


  /* -----------------------------------------------------------
     5. TYPING ANIMATION (Hero role line)
     Cycles through the role titles, typing and deleting them.
  ----------------------------------------------------------- */
  const typedEl = document.getElementById('typedRole');
  const roles = [
    'Software Developer',
    'Java Developer',
    'Web Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedEl.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word before deleting
      speed = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }

  typeLoop();


  /* -----------------------------------------------------------
     6. ANIMATED BACKGROUND PARTICLES (Hero canvas)
     Lightweight canvas particle field — soft gold dots drifting
     slowly, connected by faint lines when close together.
  ----------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero').offsetHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.55)';
      ctx.fill();
    });

    // Draw connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  // Only animate particles if the user hasn't requested reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }


  /* -----------------------------------------------------------
     7. SCROLL REVEAL ANIMATIONS
     Uses IntersectionObserver to fade/slide elements into view
     as they enter the viewport. Also triggers skill bar fills.
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));

  // Animate skill progress bars when their group scrolls into view
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        const fill = bar.querySelector('.skill-fill');
        fill.style.width = `${level}%`;
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach((bar) => skillObserver.observe(bar));


  /* -----------------------------------------------------------
     8. BACK TO TOP BUTTON
  ----------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* -----------------------------------------------------------
     9. RESUME DOWNLOAD BUTTON
     Placeholder: replace the href with a real resume file path
     (e.g. "assets/Gautham_P_Sajith_Resume.pdf") once available.
  ----------------------------------------------------------- */
  const resumeBtn = document.getElementById('resumeBtn');

  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Add your resume file path to the "resumeBtn" link in index.html to enable this download.');
  });


  /* -----------------------------------------------------------
     10. CONTACT FORM HANDLING
     Front-end only validation + confirmation message.
     Connect this to a real backend or form service (e.g.
     Formspree, EmailJS) to actually send messages.
  ----------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formNote.textContent = 'Please fill in every field before sending.';
      return;
    }

    // Basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formNote.textContent = 'Please enter a valid email address.';
      return;
    }

    // Simulate a successful send (replace with real API call)
    formNote.textContent = `Thanks, ${name.split(' ')[0]} — your message has been noted. I'll reply soon.`;
    contactForm.reset();
  });

});