/* ============================================
   LONGTECH INNOVATION - Portfolio
   JavaScript - Verified & Netlify Compatible
   ============================================ */
(function () {
    'use strict';

    // ===== DOM Elements =====
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const dots = document.querySelectorAll('.dot');
    const testimonialTrack = document.querySelector('.testimonial-track');
    const statNumbers = document.querySelectorAll('.stat-number');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // ===== Preloader =====
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
            animateStats();
            initParticles();
        }, 1500);
    });

    // ===== Theme Toggle =====
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => { themeToggle.style.transform = ''; }, 400);
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // ===== Mobile Menu =====
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ===== Navbar Scroll & Back to Top =====
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        if (backToTop) backToTop.classList.toggle('visible', window.pageYOffset > 500);
    });

    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== Active Navigation Link =====
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ===== Scroll Animations =====
    const animatedElements = document.querySelectorAll('[data-aos]');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => entry.target.classList.add('animated'), parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedElements.forEach(el => observer.observe(el));

    // ===== Counter Animation =====
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) { stat.textContent = Math.floor(current); requestAnimationFrame(updateCounter); }
                else { stat.textContent = target; }
            };
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) { updateCounter(); statObserver.unobserve(entry.target); } });
            }, { threshold: 0.5 });
            statObserver.observe(stat);
        });
    }

    // ===== Portfolio Filter =====
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeIn keyframe dynamically
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`;
    document.head.appendChild(fadeInStyle);

    // ===== Testimonial Slider =====
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => { goToSlide(parseInt(dot.getAttribute('data-slide'))); resetAutoSlide(); });
    });

    function autoSlide() { autoSlideInterval = setInterval(() => { currentSlide = (currentSlide + 1) % totalSlides; goToSlide(currentSlide); }, 5000); }
    function resetAutoSlide() { clearInterval(autoSlideInterval); autoSlide(); }
    autoSlide();

    // Touch support
    let touchStartX = 0, touchEndX = 0;
    testimonialTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    testimonialTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
            else if (diff < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
            resetAutoSlide();
        }
    }, { passive: true });

    // ===== Contact Form (Netlify Compatible) =====
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Message sent successfully! We will respond shortly.');
                    contactForm.reset();
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
                } else throw new Error('Submission failed');
            })
            .catch(() => {
                showNotification('Failed to send message. Please try again.');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            });
            setTimeout(() => { submitBtn.innerHTML = originalContent; submitBtn.disabled = false; }, 3000);
        });
    }

    // ===== Newsletter Form (Brevo API) =====
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    const originalBtn = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value.trim() })
      });
      const data = await res.json();
      
      if (data.success) {
        showNotification(data.message || 'Subscribed successfully!');
        emailInput.value = '';
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showNotification('Failed to subscribe. Please try again.');
    } finally {
      btn.innerHTML = originalBtn;
      btn.disabled = false;
    }
  });
}

    // ===== Notification System =====
    function showNotification(message) {
        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%) translateY(100px)',
            background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '16px 24px', borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(255, 107, 0, 0.3)', border: '1px solid var(--primary)',
            display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '500px', zIndex: '10000',
            fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', transition: 'transform 0.4s ease'
        });
        notification.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--primary)"></i><span>${message}</span><button style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:1.1rem"><i class="fa-solid fa-xmark"></i></button>`;
        document.body.appendChild(notification);
        requestAnimationFrame(() => { notification.style.transform = 'translateX(-50%) translateY(0)'; });
        const closeBtn = notification.querySelector('button');
        const close = () => { notification.style.transform = 'translateX(-50%) translateY(100px)'; setTimeout(() => notification.remove(), 400); };
        closeBtn.addEventListener('click', close);
        setTimeout(close, 5000);
    }

    // ===== Particle System =====
    let particles = [], animationId;
    function initParticles() {
        resizeCanvas(); createParticles(); animateParticles();
    }
    function resizeCanvas() { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
    window.addEventListener('resize', resizeCanvas);
    function createParticles() {
        if (!canvas) return;
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 15), 80);
        for (let i = 0; i < count; i++) {
            particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, radius: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.1 });
        }
    }
    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const c = isDark ? '255, 107, 0' : '255, 107, 0';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c}, ${p.opacity})`; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x, dy = p.y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${c}, ${0.1 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
            }
        });
        animationId = requestAnimationFrame(animateParticles);
    }

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== 3D Tilt Effect =====
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ===== Typing Effect =====
    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) {
        const text = heroBadge.textContent; heroBadge.textContent = ''; let i = 0;
        setTimeout(function type() { if (i < text.length) { heroBadge.textContent += text.charAt(i); i++; setTimeout(type, 80); } }, 1800);
    }

    // ===== Parallax =====
    window.addEventListener('scroll', () => {
        const graphic = document.querySelector('.hero-graphic');
        if (graphic && window.pageYOffset < window.innerHeight) graphic.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
    });

    // ===== Footer Year =====
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ===== Input Focus =====
    document.querySelectorAll('.input-wrapper input, .input-wrapper textarea, .input-wrapper select').forEach(input => {
        input.addEventListener('focus', () => { input.closest('.input-wrapper').style.transform = 'scale(1.02)'; input.closest('.input-wrapper').style.transition = 'transform 0.2s ease'; });
        input.addEventListener('blur', () => { input.closest('.input-wrapper').style.transform = ''; });
    });

    // ===== Cursor Glow =====
    if (window.innerWidth > 768) {
        const glow = document.createElement('div');
        glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,107,0,0.08)0%,transparent 70%);pointer-events:none;z-index:0;transition:transform 0.15s ease;transform:translate(-50%,-50%);';
        document.body.appendChild(glow);
        document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
    }

    // ===== Page Visibility =====
    document.addEventListener('visibilitychange', () => { document.hidden ? cancelAnimationFrame(animationId) : animateParticles(); });

})();
