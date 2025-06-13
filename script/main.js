document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

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

  // Toggle between Informative and Ecommerce package
const toggle = document.getElementById('package-toggle');
const informative = document.getElementById('informative-package');
const ecommerce = document.getElementById('ecommerce-package');

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    informative.classList.remove('active');
    ecommerce.classList.add('active');
  } else {
    ecommerce.classList.remove('active');
    informative.classList.add('active');
  }
});

