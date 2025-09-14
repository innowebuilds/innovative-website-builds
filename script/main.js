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

  // 🕒 Countdown Timer for Urgency Box
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

  // Set countdown 7 days from now
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  futureDate.setHours(23, 59, 0);
  startCountdown(futureDate.toISOString());

});



/* -----------------------------
   Particle Background (safe, self-contained)
   Appended after your DOMContentLoaded logic.
   ----------------------------- */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return; // safe guard

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  // initial size
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // particle settings
  let particlesArray = [];
  function getParticleCount() {
    // scale number of particles with area but keep reasonable limits
    const area = canvas.width * canvas.height;
    const base = Math.round(Math.max(40, Math.min(120, area / 12000)));
    return base;
  }

  class Particle {
    constructor(x, y, vx, vy, r) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.r = r;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // bounce
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = "#3093f0";
      ctx.fill();
      ctx.closePath();
    }
  }

  function initParticles() {
    particlesArray = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 0.8;
      const vy = (Math.random() - 0.5) * 0.8;
      particlesArray.push(new Particle(x, y, vx, vy, r));
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particlesArray.length; i++) {
      for (let j = i + 1; j < particlesArray.length; j++) {
        const a = particlesArray[i];
        const b = particlesArray[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(48,147,240,${0.15 * alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particlesArray) {
      p.update();
      p.draw();
    }

    connectParticles();

    requestAnimationFrame(animate);
  }

  // Optional: small mouse interaction (subtle repulsion)
  const mouse = { x: null, y: null, radius: 80 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // Gentle repulsion effect (keeps CPU low)
  function handleMouseRepel() {
    if (!mouse.x || !mouse.y) return;
    for (let p of particlesArray) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0.1) {
        const force = (mouse.radius - dist) / mouse.radius * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        // clamp velocity slightly
        p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
      }
    }
  }

  // update loop that includes mouse logic at a small interval
  function loopWithMouse() {
    handleMouseRepel();
    setTimeout(loopWithMouse, 120);
  }

  // init
  initParticles();
  animate();
  loopWithMouse();

})();
