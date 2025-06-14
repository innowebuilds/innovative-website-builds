document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    observer.observe(el);
  });

  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;

  function showNextTestimonial() {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
  }

  setInterval(showNextTestimonial, 5000);

  document.getElementById('mobile-toggle').addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('show');
  });

  // Pricing toggle logic
  const toggle = document.getElementById('package-toggle');
  const info = document.getElementById('informative-package');
  const eco = document.getElementById('ecommerce-package');

  if (toggle && info && eco) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        info.classList.remove('active');
        eco.classList.add('active');
      } else {
        eco.classList.remove('active');
        info.classList.add('active');
      }
    });
  }
});
