export const animateLetters = (): void => {
  // Find ALL animated headings
  const texts = document.querySelectorAll("[animated-letters]");
  texts.forEach((text) => {
    const visible = text.querySelector(".animated-text") as HTMLElement | null;
    const ghost = text.querySelector(".ghost-span") as HTMLElement | null;
    if (!visible || !ghost) return;

    const initialText = ghost.textContent || visible.textContent || "";
    ghost.textContent = initialText;
    visible.textContent = initialText;

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let interval: ReturnType<typeof setInterval> | null = null;
    let iteration = 0;

    interval = setInterval(() => {
      visible.textContent = initialText
        .split("")
        .map((letter, index) => {
          if (index < Math.floor(iteration)) {
            return initialText[index];
          }
          if (/\s|\W/.test(letter)) {
            return letter;
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= initialText.length) {
        if (interval !== null) {
          clearInterval(interval);
          visible.textContent = initialText;
        }
      }
      iteration += 1 / 3;
    }, 30);
  });
};




// Background interactive bubble
export const initInteractiveBubble = (): void => {
	const interBubble = document.querySelector('.interactive') as HTMLElement | null;
	if (!interBubble) return;

	let curX: number = window.innerWidth / 2;
	let curY: number = window.innerHeight / 2;
	let tgX: number = 0;
	let tgY: number = 0;

	function move(): void {
		const easingFactor = 30;

		curX += (tgX - curX) / easingFactor;
		curY += (tgY - curY) / easingFactor;

		if (interBubble) {
			interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
		}

		requestAnimationFrame(move);
	}

	window.addEventListener('mousemove', (event: MouseEvent) => {
		tgX = event.clientX;
		tgY = event.clientY;
	});

	move();
};

// Background noise animation
export const moveNoise = (): void => {
	const noiseElement = document.querySelector('.background-noise') as HTMLElement | null;
	if (!noiseElement) return;

	const randomX: number = Math.floor(Math.random() * window.innerWidth);
	const randomY: number = Math.floor(Math.random() * window.innerHeight);

	noiseElement.style.backgroundPosition = `${randomX}px ${randomY}px`;
};

// Init load transition
export const initLoadTransition = (): void => {
	const upperRect = document.getElementById("upper-transition-rectangle") as HTMLElement | null;
	const lowerRect = document.getElementById("lower-transition-rectangle") as HTMLElement | null;

	if (!upperRect || !lowerRect) return;

	upperRect.addEventListener("animationend", () => {
		upperRect.style.display = "none";
	});

	lowerRect.addEventListener("animationend", () => {
		lowerRect.style.display = "none";
	});
};

// Load transition
export const loadTransition = (): void => {
	const upperRect = document.getElementById("upper-transition-rectangle") as HTMLElement | null;
	const lowerRect = document.getElementById("lower-transition-rectangle") as HTMLElement | null;

	if (!upperRect || !lowerRect) return;

	upperRect.style.display = "block";
	upperRect.style.top = "0";

	lowerRect.style.display = "block";
	lowerRect.style.top = "50%";
};

export const initCursorClickEffect = (): void => {
	const body = document.querySelector('body') as HTMLElement | null;

	// Ждём, пока canvas появится в DOM
	const waitForCanvas = setInterval(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;

		if (canvas) {
			clearInterval(waitForCanvas);

			canvas.addEventListener('click', (event: MouseEvent) => {
				for (let i = 0; i < 50; i++) {
					const spark = document.createElement('div');
					spark.className = 'spark';

					spark.style.top = `${event.clientY}px`;
					spark.style.left = `${event.clientX}px`;

					// Рандомные координаты для анимации
					const randomX: number = (Math.random() - 0.5) * window.innerWidth / 3;
					const randomY: number = (Math.random() - 0.5) * window.innerHeight / 3;

					spark.style.setProperty('--randomX', `${randomX}px`);
					spark.style.setProperty('--randomY', `${randomY}px`);

					// Рандомный цвет из палитры
					const colors = ['#ff6b6b', '#ffb830', '#4ecdc4', '#1a535c', '#ffe66d', '#ff7f50', '#ff6347'];
					spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

					// Продолжительность анимации
					const duration: number = Math.random() * 1.5 + 0.5;
					spark.style.animation = `animate ${duration}s ease-out forwards`;

					body?.appendChild(spark);

					setTimeout(() => {
						spark.remove();
					}, 2000);
				}
			});
		}
	}, 100);
};
