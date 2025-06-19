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

  // 🚀 About Section Slider (Transform-based)
  const aboutSlider = document.getElementById("about-slider");
  const aboutSlides = aboutSlider?.querySelectorAll(".about-slide") || [];
  let aboutIndex = 0;

  function showAboutSlide(index) {
    if (!aboutSlider) return;
    aboutSlider.style.transform = `translateX(-${index * 100}%)`;
  }

  if (aboutSlides.length > 1) {
    showAboutSlide(aboutIndex);
    setInterval(() => {
      aboutIndex = (aboutIndex + 1) % aboutSlides.length;
      showAboutSlide(aboutIndex);
    }, 4000);
  }
});
