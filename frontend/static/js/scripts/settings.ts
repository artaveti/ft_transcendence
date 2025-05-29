import { setLanguage } from '../utils/languages.js';
import { createStarsAndComets, removeStarsAndComets } from '../visual/starfield.js';
import { animateLetters  } from '../visual/effects.js';
//@ts-ignore
import { ids, BIG_TEXT, DEFAULT_TEXT } from '../index.js';
export function settings(): void {
  // Radios
  const graphicsOnRadio = document.getElementById("graphics-on-radio") as HTMLInputElement | null;
  const graphicsOffRadio = document.getElementById("graphics-off-radio") as HTMLInputElement | null;
  const gradientsContainer = document.querySelector('.gradients-container') as HTMLElement | null;
  const videoBackground = document.getElementById('video-background') as HTMLElement | null;
  const languageSwitcher = document.getElementById('languageSwitcher') as HTMLSelectElement | null;
  const bigTextCheckbox = document.getElementById('big-text-checkbox') as HTMLInputElement | null;

  function updateGraphicsUI(setting: string): void {
    if (gradientsContainer) gradientsContainer.style.display = (setting === 'on') ? 'block' : 'none';
    if (videoBackground) videoBackground.style.display = 'none';
    if (setting === 'on') {
      createStarsAndComets();
    } else {
      removeStarsAndComets();
    }
  }

  // Attach radio events (null-checked)
  if (graphicsOnRadio) {
    graphicsOnRadio.addEventListener("change", () => {
      if (graphicsOnRadio.checked) {
        localStorage.setItem('graphics', 'on');
        updateGraphicsUI('on');
      }
    });
  }
  if (graphicsOffRadio) {
    graphicsOffRadio.addEventListener("change", () => {
      if (graphicsOffRadio.checked) {
        localStorage.setItem('graphics', 'off');
        updateGraphicsUI('off');
      }
    });
  }

  // --- Apply stored setting to UI on load ---
  const storedSetting = localStorage.getItem('graphics') || 'on';
  if (graphicsOnRadio && graphicsOffRadio) {
    if (storedSetting === 'on') {
      graphicsOnRadio.checked = true;
      updateGraphicsUI('on');
    } else {
      graphicsOffRadio.checked = true;
      updateGraphicsUI('off');
    }
  }

  // ---- Language switcher ----
  if (languageSwitcher) {
    languageSwitcher.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLSelectElement;
      if (target) {
        setLanguage(target.value);
        localStorage.setItem('language', target.value);
      }
    });
    languageSwitcher.value = localStorage.getItem('language') ?? 'en';
  }

  // ---- Big text toggle ----
  if (bigTextCheckbox) {
    bigTextCheckbox.addEventListener('change', () => {
      if (bigTextCheckbox.checked) {
        document.documentElement.style.fontSize = BIG_TEXT;
        localStorage.setItem('bigText', 'on');
      } else {
        document.documentElement.style.fontSize = DEFAULT_TEXT;
        localStorage.setItem('bigText', 'off');
      }
    });
    if (localStorage.getItem('bigText') === 'on') {
      bigTextCheckbox.checked = true;
      document.documentElement.style.fontSize = BIG_TEXT;
    }
  }
  animateLetters();

}
