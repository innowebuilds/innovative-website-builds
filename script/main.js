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

  // 📱 Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('show');
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
