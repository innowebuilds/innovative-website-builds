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

  // Typing Animation
  const typedText = document.getElementById("typed-text");
  const phrases = ["Building Powerful, Modern Websites", "Optimized For Speed & Growth"];
  let currentPhrase = 0;
  let currentLetter = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[currentPhrase];
    typedText.textContent = current.slice(0, currentLetter);

    if (!isDeleting && currentLetter < current.length) {
      currentLetter++;
      setTimeout(type, 100);
    } else if (isDeleting && currentLetter > 0) {
      currentLetter--;
      setTimeout(type, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) currentPhrase = (currentPhrase + 1) % phrases.length;
      setTimeout(type, 1000);
    }
  }

  type();
});
