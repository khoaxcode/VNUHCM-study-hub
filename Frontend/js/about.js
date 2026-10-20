(() => {
  const people = document.querySelectorAll('.about-person');
  if (!people.length) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('about-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .55 });
  people.forEach(person => { person.classList.add('about-awaiting'); observer.observe(person); });
})();
