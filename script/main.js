document.addEventListener("DOMContentLoaded", () => {
  // 👁️ Fade-in sections
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => observer.observe(el));

  // 💬 Testimonial slider
  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;
  function showNextTestimonial() {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
  }
  if (testimonials.length > 1) {
    setInterval(showNextTestimonial, 5000);
  }

  // 📱 Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('show');
    });
  }

  // 💰 Package Toggle Logic
  const toggle = document.getElementById('package-toggle');
  const info = document.getElementById('informative-package');
  const eco = document.getElementById('ecommerce-package');
  if (toggle && info && eco) {
    toggle.addEventListener('change', () => {
      info.classList.toggle('active', !toggle.checked);
      eco.classList.toggle('active', toggle.checked);
    });
  }

  // 🕒 Countdown Timer
  function startCountdown(targetDateStr) {
    const countdown = document.getElementById("countdown-timer");
    if (!countdown) return;

    const targetDate = new Date(targetDateStr).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        countdown.innerText = "Offer ended";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      countdown.innerText = `${days}d ${hrs}h ${mins}m ${secs}s`;
    }, 1000);
  }

  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  futureDate.setHours(23, 59, 0);
  startCountdown(futureDate.toISOString());
});

/* 🌌 Particle Background Animation */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
  constructor(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#3093f0";
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  const numParticles = 80;
  for (let i = 0; i < numParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let dx = (Math.random() - 0.5) * 0.8;
    let dy = (Math.random() - 0.5) * 0.8;
    particlesArray.push(new Particle(x, y, dx, dy, size));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw connecting lines
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i; j < particlesArray.length; j++) {
      let dx = particlesArray[i].x - particlesArray[j].x;
      let dy = particlesArray[i].y - particlesArray[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(48,147,240,0.2)";
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();
