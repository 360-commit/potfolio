/* ============================================
LONGTECH INNOVATION - Portfolio
JavaScript - Exceptional Effects & Interactivity
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
preloader.classList.add('hidden');
animateStats();
initParticles();
}, 1500);
});
// ===== Theme Toggle =====
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);
themeToggle.addEventListener('click', () => {
const currentTheme = document.documentElement.getAttribute('data-theme');
const newTheme = currentTheme === 'light' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
updateThemeIcon(newTheme);
animateThemeToggle();
});
function updateThemeIcon(theme) {
themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
function animateThemeToggle() {
themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
setTimeout(() => {
themeToggle.style.transform = '';
}, 400);
}
// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
menuToggle.classList.toggle('active');
navLinks.classList.toggle('active');
});
// Close menu on link click
navLinkItems.forEach(link => {
link.addEventListener('click', () => {
menuToggle.classList.remove('active');
navLinks.classList.remove('active');
});
});
// Close menu on outside click
document.addEventListener('click', (e) => {
if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
menuToggle.classList.remove('active');
navLinks.classList.remove('active');
}
});
// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
const currentScroll = window.pageYOffset;
if (currentScroll > 50) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
// Back to top button
if (currentScroll > 500) {
backToTop.classList.add('visible');
} else {
backToTop.classList.remove('visible');
}
lastScroll = currentScroll;
});
backToTop.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
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
if (link.getAttribute('href') === `#${sectionId}`) {
link.classList.add('active');
}
});
}
});
}
window.addEventListener('scroll', updateActiveNav);
// ===== Scroll Animations (AOS-like) =====
const animatedElements = document.querySelectorAll('[data-aos]');
const observerOptions = {
root: null,
rootMargin: '0px',
threshold: 0.15
};
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const delay = entry.target.getAttribute('data-delay') || 0;
setTimeout(() => {
entry.target.classList.add('animated');
}, parseInt(delay));
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
if (current < target) {
stat.textContent = Math.floor(current);
requestAnimationFrame(updateCounter);
} else {
stat.textContent = target;
}
};
// Trigger when visible
const statObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
updateCounter();
statObserver.unobserve(entry.target);
}
});
}, { threshold: 0.5 });
statObserver.observe(stat);
});
}
// ===== Portfolio Filter =====
filterBtns.forEach(btn => {
btn.addEventListener('click', () => {
// Update active button
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
fadeInStyle.textContent = `
@keyframes fadeIn {
from { opacity: 0; transform: scale(0.9); }
to { opacity: 1; transform: scale(1); }
}
`;
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
dot.addEventListener('click', () => {
goToSlide(parseInt(dot.getAttribute('data-slide')));
resetAutoSlide();
});
});
function autoSlide() {
autoSlideInterval = setInterval(() => {
currentSlide = (currentSlide + 1) % totalSlides;
goToSlide(currentSlide);
}, 5000);
}
function resetAutoSlide() {
clearInterval(autoSlideInterval);
autoSlide();
}
autoSlide();
// Touch/Swipe support for testimonials
let touchStartX = 0;
let touchEndX = 0;
testimonialTrack.addEventListener('touchstart', (e) => {
touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
testimonialTrack.addEventListener('touchend', (e) => {
touchEndX = e.changedTouches[0].screenX;
handleSwipe();
}, { passive: true });
function handleSwipe() {
const diff = touchStartX - touchEndX;
if (Math.abs(diff) > 50) {
if (diff > 0 && currentSlide < totalSlides - 1) {
goToSlide(currentSlide + 1);
} else if (diff < 0 && currentSlide > 0) {
goToSlide(currentSlide - 1);
}
resetAutoSlide();
}
// ===== Contact Form (Netlify Compatible) =====
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
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        showNotification('Failed to send message. Please try again.');
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    });

    setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }, 3000);
});
// Button animation
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalContent = submitBtn.innerHTML;
submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
submitBtn.disabled = true;
// Simulate form submission
setTimeout(() => {
submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
// Show success message
showNotification(`Thank you ${name}! Your message has been sent successfully. We'll get back to you soon.`);
contactForm.reset();
setTimeout(() => {
submitBtn.innerHTML = originalContent;
submitBtn.style.background = '';
submitBtn.disabled = false;
}, 3000);
}, 2000);
});
// ===== Newsletter Form =====
newsletterForm.addEventListener('submit', (e) => {
e.preventDefault();
const emailInput = newsletterForm.querySelector('input');
const email = emailInput.value;
const btn = newsletterForm.querySelector('button');
btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
setTimeout(() => {
btn.innerHTML = '<i class="fa-solid fa-check"></i>';
showNotification(`Subscribed successfully with ${email}! Welcome to our community.`);
emailInput.value = '';
setTimeout(() => {
btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
}, 2000);
}, 1500);
});
// ===== Notification System =====
function showNotification(message) {
const notification = document.createElement('div');
notification.className = 'notification';
notification.innerHTML = `
<i class="fa-solid fa-circle-check"></i>
<span>${message}</span>
<button class="notification-close"><i class="fa-solid fa-xmark"></i></button>
`;
// Add styles
Object.assign(notification.style, {
position: 'fixed',
bottom: '30px',
left: '50%',
transform: 'translateX(-50%) translateY(100px)',
background: 'var(--bg-card)',
color: 'var(--text-primary)',
padding: '16px 24px',
borderRadius: 'var(--radius-lg)',
boxShadow: 'var(--shadow-xl)',
border: '1px solid var(--primary)',
display: 'flex',
alignItems: 'center',
gap: '12px',
maxWidth: '500px',
zIndex: '10000',
fontSize: '0.9rem',
fontFamily: 'Inter, sans-serif',
transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
boxShadow: '0 8px 32px rgba(255, 107, 0, 0.3)'
});
document.body.appendChild(notification);
// Animate in
requestAnimationFrame(() => {
notification.style.transform = 'translateX(-50%) translateY(0)';
});
// Close button
const closeBtn = notification.querySelector('.notification-close');
closeBtn.style.background = 'none';
closeBtn.style.border = 'none';
closeBtn.style.color = 'var(--text-tertiary)';
closeBtn.style.cursor = 'pointer';
closeBtn.style.fontSize = '1.1rem';
closeBtn.style.padding = '4px';
function closeNotification() {
notification.style.transform = 'translateX(-50%) translateY(100px)';
setTimeout(() => notification.remove(), 400);
}
closeBtn.addEventListener('click', closeNotification);
// Auto close
setTimeout(closeNotification, 5000);
}
// ===== Particle System =====
let particles = [];
let animationId;
function initParticles() {
resizeCanvas();
createParticles();
animateParticles();
}
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
resizeCanvas();
});
function createParticles() {
particles = [];
const count = Math.min(Math.floor(window.innerWidth / 15), 80);
for (let i = 0; i < count; i++) {
particles.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
vx: (Math.random() - 0.5) * 0.5,
vy: (Math.random() - 0.5) * 0.5,
radius: Math.random() * 2 + 1,
opacity: Math.random() * 0.5 + 0.1
});
}
}
function animateParticles() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
const particleColor = isDark ? '255, 107, 0' : '255, 107, 0';
// Update and draw particles
particles.forEach((p, i) => {
p.x += p.vx;
p.y += p.vy;
// Wrap around edges
if (p.x < 0) p.x = canvas.width;
if (p.x > canvas.width) p.x = 0;
if (p.y < 0) p.y = canvas.height;
if (p.y > canvas.height) p.y = 0;
// Draw particle
ctx.beginPath();
ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
ctx.fill();
// Draw connections
for (let j = i + 1; j < particles.length; j++) {
const dx = p.x - particles[j].x;
const dy = p.y - particles[j].y;
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < 120) {
ctx.beginPath();
ctx.moveTo(p.x, p.y);
ctx.lineTo(particles[j].x, particles[j].y);
ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * (1 - distance / 120)})`;
ctx.lineWidth = 0.5;
ctx.stroke();
}
}
});
animationId = requestAnimationFrame(animateParticles);
}
// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
}
});
});
// ===== Tilt Effect on Service Cards =====
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
card.addEventListener('mousemove', (e) => {
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
const centerX = rect.width / 2;
const centerY = rect.height / 2;
const rotateX = (y - centerY) / 20;
const rotateY = (centerX - x) / 20;
card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
});
card.addEventListener('mouseleave', () => {
card.style.transform = '';
});
});
// ===== Typing Effect for Hero Badge =====
const heroBadge = document.querySelector('.hero-badge span');
if (heroBadge) {
const text = heroBadge.textContent;
heroBadge.textContent = '';
let charIndex = 0;
function typeText() {
if (charIndex < text.length) {
heroBadge.textContent += text.charAt(charIndex);
charIndex++;
setTimeout(typeText, 80);
}
}
setTimeout(typeText, 1800);
}
// ===== Parallax Effect on Scroll =====
window.addEventListener('scroll', () => {
const scrolled = window.pageYOffset;
const heroGraphic = document.querySelector('.hero-graphic');
if (heroGraphic && scrolled < window.innerHeight) {
heroGraphic.style.transform = `translateY(${scrolled * 0.3}px)`;
}
});
// ===== Current Year for Footer =====
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
yearSpan.textContent = new Date().getFullYear();
}
// ===== Input Focus Effects =====
document.querySelectorAll('.input-wrapper input, .input-wrapper textarea, .input-wrapper select').forEach(input => {
input.addEventListener('focus', () => {
input.closest('.input-wrapper').style.transform = 'scale(1.02)';
input.closest('.input-wrapper').style.transition = 'transform 0.2s ease';
});
input.addEventListener('blur', () => {
input.closest('.input-wrapper').style.transform = '';
});
});
// ===== Cursor Glow Effect (Desktop Only) =====
if (window.innerWidth > 768) {
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
position: fixed;
width: 300px;
height: 300px;
border-radius: 50%;
background: radial-gradient(circle, rgba(255, 107, 0, 0.08) 0%, transparent 70%);
pointer-events: none;
z-index: 0;
transition: transform 0.15s ease;
transform: translate(-50%, -50%);
`;
document.body.appendChild(cursorGlow);
document.addEventListener('mousemove', (e) => {
cursorGlow.style.left = e.clientX + 'px';
cursorGlow.style.top = e.clientY + 'px';
});
}
// ===== Page Visibility - Pause Particles =====
document.addEventListener('visibilitychange', () => {
if (document.hidden) {
cancelAnimationFrame(animationId);
} else {
animateParticles();
}
});
})();
