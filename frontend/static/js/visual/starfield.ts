let stars: HTMLElement[] = [];
let comets: HTMLElement[] = [];

export function createStarsAndComets(): void {
  const starField = document.getElementById('star-field');
  if (!starField) return;
  removeStarsAndComets();
  // Stars
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.classList.add('absolute', 'bg-white', 'rounded-full');
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.opacity = `${Math.random() * 0.5 + 0.2}`;
    star.style.animation = `drift ${Math.random() * 5 + 3}s ease-in-out infinite alternate`;
    starField.appendChild(star);
    stars.push(star);
  }
  // Comets
  for (let i = 0; i < 5; i++) {
    const comet = document.createElement('div');
    comet.classList.add('absolute', 'bg-white', 'rounded-full', 'opacity-80');
    comet.style.width = '2px';
    comet.style.height = '2px';
    comet.style.top = `${Math.random() * 80}%`;
    comet.style.left = `${Math.random() * 80}%`;
    comet.style.animation = `comet ${Math.random() * 15 + 10}s linear ${Math.random() * 20 + 10}s infinite`;
    starField.appendChild(comet);
    comets.push(comet);
  }
}

export function removeStarsAndComets(): void {
  stars.forEach(star => star.remove());
  comets.forEach(comet => comet.remove());
  stars = [];
  comets = [];
}
