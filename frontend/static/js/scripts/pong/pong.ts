import { Ball, Pad, Tournament, Timer } from "./objects.js";
	import { BASE_URL } from '../../index.js';
	import { updateTextForElem } from "../../utils/languages.js";
	import { authFetch } from "../../utils/authFetch.js";
	


	export let eventListeners: { [key: string]: EventListener } = {};
	
	export class PongGame {
		cvs: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		startButton: HTMLElement;
		objectiveLabel: HTMLElement;
		endgameModalWinner: HTMLElement;
		endgameModalScore: HTMLElement;
		endgameModalTime: HTMLElement;
		endgameModalPlayAgain: HTMLElement;
		// tournamentModalNextMatch: HTMLElement;
		pauseModal: any;
		endgameModal: any;
		matchScore: HTMLElement;
		modalColorBox1: HTMLElement;
		modalColorBox2: HTMLElement;
		colorBoxLeft: HTMLElement;
		colorBoxRight: HTMLElement;
		matchEndLabel: HTMLElement;
		leftScore: HTMLElement;
		rightScore: HTMLElement;
		leftPaddleName: HTMLElement;
		rightPaddleName: HTMLElement;
		toastNotification: HTMLElement;
		toastBody: HTMLElement;
	
		pWidth: number = 12;
		pHeight: number = 80;
		bSize: number = 12;
		pSpeed: number = 1.6;
		bSpeed: number = 1.1;
	
		gameStarted: boolean = false;
		gameOver: boolean = false;
		paused: boolean = false;
		totalTime: number = 0;
	
		tournament: Tournament | undefined;
		currentMatch: any;
	
		gamemode: string;
		gamestyle: string;
		usernames: { [key: string]: string };
		colors: { [key: string]: string };
		aiDifficulty: string;
		keybinds: { [key: string]: string };
		objective: number;
	
		leftPad!: Pad;
		rightPad!: Pad;
		ball!: Ball;
		timer: Timer;
		interval: ReturnType<typeof setInterval> | null = null;
		boundPongHandleKeyDown: EventListener;
		boundPongHandleKeyUp: EventListener;
	
		constructor() {
			this.cvs = document.getElementById('canvas') as HTMLCanvasElement;
			this.ctx = this.cvs.getContext('2d')!;
	
			this.startButton = document.getElementById('btnStart')!;
			this.objectiveLabel = document.getElementById('objectiveLabel')!;
			this.endgameModalWinner = document.getElementById('endgameModalWinner')!;
			this.endgameModalScore = document.getElementById('endgameModalScore')!;
			this.endgameModalTime = document.getElementById('endgameModalTime')!;
			this.endgameModalPlayAgain = document.getElementById('playAgainButton')!;
			// this.tournamentModalNextMatch = document.getElementById('nextMatchButton')!;

			this.matchScore = document.getElementById('matchScore')!;
			this.modalColorBox1 = document.getElementById('colorBoxLeft')!;
			this.modalColorBox2 = document.getElementById('colorBoxRight')!;

			this.colorBoxLeft = document.getElementById('colorBoxLeft')!;
			this.colorBoxRight = document.getElementById('colorBoxRight')!;
			this.matchEndLabel = document.getElementById('matchEndLabel')!;
			this.leftScore = document.getElementById("leftScore")!;
			this.rightScore = document.getElementById("rightScore")!;
			this.leftPaddleName = document.getElementById('leftPaddleName')!;
			this.rightPaddleName = document.getElementById('rightPaddleName')!;
			this.toastNotification = document.getElementById('liveToast')!;
			this.toastBody = document.getElementById('toastBody')!;
	
			const gamemodeString = localStorage.getItem('pongGamemode');
			this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";
	
			const gamestyleString = localStorage.getItem('pongGamestyle');
			this.gamestyle = gamestyleString ? JSON.parse(gamestyleString) : "enhanced";
	
			if (this.gamestyle !== "enhanced") {
				(document.getElementById("pMinimize1")! as HTMLElement).style.display = "none";
				(document.getElementById("pMinimize2")! as HTMLElement).style.display = "none";
			}
	
			const usernamesString = localStorage.getItem('pongUsernames');
			this.usernames = usernamesString ? JSON.parse(usernamesString) : {
				p1: "player1", p2: "player2", p3: "player3", p4: "player4"
			};
	
			this.leftPaddleName.textContent = this.usernames.p1;
			this.rightPaddleName.textContent = this.gamemode !== "AI" ? this.usernames.p2 : "AI";
	
			const colorsString = localStorage.getItem('pongColors');
			this.colors = colorsString ? JSON.parse(colorsString) : {
				p1: "#ff0000", p2: "#00ff00", p3: "#266fff", p4: "#ff00ff"
			};
	
			const aiDifficultyString = localStorage.getItem('pongAIDifficulty');
			this.aiDifficulty = aiDifficultyString ? JSON.parse(aiDifficultyString) : "easy";
			localStorage.setItem('pongAIDifficulty', JSON.stringify(this.aiDifficulty));
	
			const keybindsString = localStorage.getItem('pongKeybinds');
			this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
				lUp: 'KeyW', lDown: 'KeyS', lMini: 'KeyE',
				rUp: 'ArrowUp', rDown: 'ArrowDown', rMini: 'ArrowRight'
			};
	
			const objectiveString = localStorage.getItem('pongObjective');
			this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
			this.objectiveLabel.textContent = this.objective.toString();
	
			this.boundPongHandleKeyDown = (e: Event) => this.handleKeyDown(e as KeyboardEvent);
      		this.boundPongHandleKeyUp = (e: Event) => this.handleKeyUp(e as KeyboardEvent);
		
	
			this.startButton.addEventListener("click", () => this.startGame());
			this.endgameModalPlayAgain.addEventListener("click", () => this.resetGame());
			// this.tournamentModalNextMatch.addEventListener("click", () => this.initTournamentMatch());
	
			document.addEventListener("keydown", this.boundPongHandleKeyDown);
			eventListeners["keydown"] = this.boundPongHandleKeyDown;
	
			document.addEventListener("keyup", this.boundPongHandleKeyUp);
			eventListeners["keyup"] = this.boundPongHandleKeyUp;
	
			this.timer = new Timer(this);
	
			if (this.gamemode === "tournament") {
				this.setupTournament();
			} else {
				this.setupGame();
			}
		}

        showPauseModal() {
  const modal = document.getElementById('pauseModal') as HTMLElement;
  modal.classList.remove('hidden');
  // Pause the timer and game loop
  this.timer.stop();
  this.stopInterval();
}

hidePauseModal() {
  const modal = document.getElementById('pauseModal') as HTMLElement;
  modal.classList.add('hidden');
  // Resume the timer and game loop
  this.timer.start();
  this.startGameLoop();
}

showEndGameModal() {
  const modal = document.getElementById('endgameModal') as HTMLElement;
  modal.classList.remove('hidden');
}

hideEndGameModal() {
  const modal = document.getElementById('endgameModal') as HTMLElement;
  modal.classList.add('hidden');
}

showToast(message: string) {
  this.toastBody.textContent = message;

  this.toastNotification.classList.remove('hidden');
  this.toastNotification.classList.add('fade-in');

  // Automatically hide after 3 seconds
  setTimeout(() => {
    // Optional: Add a fade-out effect
    this.toastNotification.classList.add('fade-out');

    // Wait for fade-out transition to complete before hiding
    setTimeout(() => {
      this.toastNotification.classList.add('hidden');
      this.toastNotification.classList.remove('fade-in', 'fade-out');
    }, 500); // This should match your CSS transition duration
  }, 3000);
}

		setupGame(): void {
			this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2,
				this.pWidth, this.pHeight, "left", this.colors.p1, this.pSpeed, this.cvs.height,
				false, this);
	
			this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2,
				this.pWidth, this.pHeight, "right", this.gamemode === "AI" ? "#FFF" : this.colors.p2, this.pSpeed, this.cvs.height,
				this.gamemode === "AI", this);
			this.ball = new Ball(this.bSize, "#FFF", this.bSpeed, this.cvs.height, this.cvs.width, this);
			this.colorBoxLeft.style.backgroundColor = this.colors.p1;
			this.colorBoxRight.style.backgroundColor = this.gamemode === "AI" ? "#FFF" : this.colors.p2;
	
			if (this.gamemode === "AI") {
				this.rightPad.ball = this.ball;
			}
		}
	
		setupTournament(): void {
			this.tournament = new Tournament(4, this.usernames, this);
			this.initTournamentMatch();
		}
	
		winMatch(side: "left" | "right"): void {
			console.log("Match won by:", side);
			this.stopGameLoop();
			this.totalTime += (this.timer.min * 60) + this.timer.sec;
			this.gameOver = true;
			if (this.matchScore)
				this.matchScore.textContent = `${this.leftPad.score}-${this.rightPad.score}`;
			this.tournament!.setCurrentMatchWinner(side);
		
			if (this.tournament!.tournamentOver) {
				console.log("Tournament is over. Ending tournament...");
				this.endTournament(side);
			} else {
				console.log("Tournament continues. Preparing next match...");
				this.initTournamentMatch();
			}
		}
	
	initTournamentMatch(): void {
		console.log("Current Match:", this.currentMatch);
		console.log("Left Paddle:", this.leftPad);
		console.log("Right Paddle:", this.rightPad);
		console.log("Ball:", this.ball);
		console.log("Context:", this.ctx);

		this.currentMatch = this.tournament!.getCurrentPlayers();
		
		if (this.currentMatch) {
			this.leftPaddleName.textContent = this.usernames[this.currentMatch.left];
			this.rightPaddleName.textContent = this.usernames[this.currentMatch.right];
		}
		
		this.leftPaddleName.textContent = this.usernames[this.currentMatch.left];
		this.rightPaddleName.textContent = this.usernames[this.currentMatch.right];
		
		this.modalColorBox1 = document.getElementById('colorBox1')!;
		this.modalColorBox2 = document.getElementById('colorBox2')!;
		this.colorBoxLeft.style.backgroundColor = this.colors[this.currentMatch.left];
		this.colorBoxRight.style.backgroundColor = this.colors[this.currentMatch.right];
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2,
			this.pWidth, this.pHeight, "left", this.colors[this.currentMatch.left], this.pSpeed, this.cvs.height,
			false, this);

		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2,
			this.pWidth, this.pHeight, "right", this.colors[this.currentMatch.right], this.pSpeed, this.cvs.height,
			false, this);

		this.ball = new Ball(this.bSize, "#FFF", this.bSpeed, this.cvs.height, this.cvs.width, this);
		this.leftScore.textContent = "0";
		this.rightScore.textContent = "0";
		this.gameStarted = false;
		this.startButton.style.display = "block";
	(this.startButton as HTMLButtonElement).disabled = false;
		this.timer.reset();

		// Debugging logs:
		console.log("Current Match:", this.currentMatch);
		console.log("Left Paddle:", this.leftPad);
		console.log("Right Paddle:", this.rightPad);
		console.log("Ball:", this.ball);
		console.log("Context:", this.ctx);
	
		if (!this.ctx)
			console.error("❌ Canvas context is null. Initialization failed.");

		if (!this.leftPad || !this.rightPad) 
			console.error("❌ Paddles not initialized correctly.");
		if (!this.ball) 
			console.error("❌ Ball not initialized correctly.");
	}

	resetGame(): void {
		if (this.gamemode == "tournament") {
			this.totalTime = 0;
			this.setupTournament();
		} else {
			this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
			this.setupGame();
			this.leftScore.textContent = "0";
			this.rightScore.textContent = "0";
			this.gameStarted = false;
			this.startButton.style.display = "block";
			(this.startButton as HTMLButtonElement).disabled = false;
			this.timer.reset();
		}
	}

	startGame(): void {
		(this.startButton as HTMLButtonElement).disabled = true;
		this.startButton.style.display = "none";
		this.gameStarted = true;
		this.gameOver = false;
		this.timer.start();
		this.startGameLoop();
	}

	endTournament(side: "left" | "right"): void {
		updateTextForElem(this.matchEndLabel, "won-the-tournament");
		const winnerName = this.usernames[this.currentMatch[side]];
		const winnerColor = this.colors[this.currentMatch[side]];
		this.endgameModalWinner.textContent = `Winner: ${winnerName}`;
		this.endgameModalScore.textContent = `Score: ${this.leftPad.score} - ${this.rightPad.score}`;
		this.endgameModalTime.textContent = `Time: ${this.timer.getTime()}`;
		// Always use high-contrast text color
	
		this.endgameModalWinner.style.color = getContrastColor(winnerColor);
	
		const colorBlock = document.getElementById('winnerColorBlock') as HTMLElement;
		if (colorBlock) {
			colorBlock.style.backgroundColor = winnerColor;
			colorBlock.style.border = '2px solid #222'; 
		}
		this.endgameModalScore.style.color = '#222'; // always dark text
		this.endgameModalScore.style.background = '#fff';
		this.endgameModalScore.style.padding = '2px 8px';
		this.endgameModalScore.style.borderRadius = '4px';
		this.endgameModalScore.style.display = 'inline-block';
		this.endgameModalTime.style.color = '#222'; // always dark text
		this.endgameModalTime.style.background = '#fff';
		this.endgameModalTime.style.padding = '2px 8px';
		this.endgameModalTime.style.borderRadius = '4px';
		this.endgameModalTime.style.display = 'inline-block';

		this.sendMatchData(this.usernames[this.currentMatch[side]]);
		this.showEndGameModal();

	}

	endGame(winner: string): void {
		this.stopGameLoop();
		this.gameOver = true;
		this.sendMatchData(winner);
		if (this.matchEndLabel) {
			updateTextForElem(this.matchEndLabel, "won-the-game");
			this.matchEndLabel.classList.remove('hidden');
		} else {
			this.showToast(`Game Over! Winner: ${winner}`);
		}
		let winnerColor = "#fff";
		if (winner === this.usernames.p1) winnerColor = this.colors.p1;
		else if (winner === this.usernames.p2) winnerColor = this.colors.p2;
		else if (winner === "AI") winnerColor = "#fff";
		// If winner color is white or AI, force black text for visibility
		const isWhite = winnerColor.toLowerCase() === "#fff" || winnerColor.toLowerCase() === "#ffffff";
		this.endgameModalWinner.textContent = `Winner: ${winner}`;
		this.endgameModalScore.textContent = `Score: ${this.leftPad.score} - ${this.rightPad.score}`;
		this.endgameModalTime.textContent = `Time: ${this.timer.getTime()}`;
		this.endgameModalWinner.style.color = isWhite ? '#222' : getContrastColor(winnerColor);
		// Set color block
		const colorBlock = document.getElementById('winnerColorBlock') as HTMLElement;
		if (colorBlock) {
			colorBlock.style.backgroundColor = winnerColor;
			colorBlock.style.border = '2px solid #fff'; // white border for contrast
		}
		// Make score and time visible with high contrast
		this.endgameModalScore.style.color = '#222'; // always dark text
		this.endgameModalScore.style.background = '#fff';
		this.endgameModalScore.style.padding = '2px 8px';
		this.endgameModalScore.style.borderRadius = '4px';
		this.endgameModalScore.style.display = 'inline-block';
		this.endgameModalTime.style.color = '#222'; // always dark text
		this.endgameModalTime.style.background = '#fff';
		this.endgameModalTime.style.padding = '2px 8px';
		this.endgameModalTime.style.borderRadius = '4px';
		this.endgameModalTime.style.display = 'inline-block';
		this.showEndGameModal();
	}

	async sendMatchData(winner: string): Promise<void> {
		const date = new Date();
		let matchData;
		let response;
		switch (this.gamemode) {
			case "pvp":
				matchData = {
					player_one: this.usernames.p1,
					player_two: this.usernames.p2,
					winner,
					match_score: `${this.leftPad.score}-${this.rightPad.score}`,
					match_duration: ((this.timer.min * 60) + this.timer.sec),
					//match_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
					//match_date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
					match_date: `${date.toISOString()}`,
					user: localStorage.getItem('user_id')
				};
				response = await authFetch(`${BASE_URL}/api/record_PvPong_match`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(matchData)
				});
				break;
			case "AI":
				matchData = {
					player_one: this.usernames.p1,
					ai_level: this.aiDifficulty,
					winner,
					match_score: `${this.leftPad.score}-${this.rightPad.score}`,
					match_duration: ((this.timer.min * 60) + this.timer.sec),
					//match_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
					//match_date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
					match_date: `${date.toISOString()}`,
					user: localStorage.getItem('user_id')
				};
				response = await authFetch(`${BASE_URL}/api/record_AIpong_match`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(matchData)
				});
				break;
			case "tournament":
				matchData = {
					//date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
					//date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
					date: `${date.toISOString()}`,
					player_one: this.usernames.p1,
					player_two: this.usernames.p2,
					player_three: this.usernames.p3,
					player_four: this.usernames.p4,
					winner,
					duration: this.totalTime,
					user: localStorage.getItem('user_id')
				};
				response = await authFetch(`${BASE_URL}/api/record_tournament`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(matchData)
				});
				break;
			default:
				return;
		}

		if (response.status > 300) 
			console.log("Could not save game in user history. Is user logged ?")
		 else if (response.status < 300) 
			updateTextForElem(this.toastBody, "game-saved");
	}

	pauseGame(): void {
    const pauseModal = document.getElementById('pauseModal');
    if (this.gameStarted && !this.gameOver) {
        if (!this.paused) {
            this.stopInterval();
            this.showPauseModal();
            // Add ESC listener to close pause modal
            const escListener = (event: KeyboardEvent) => {
                if (event.code === 'Escape') {
                    this.hidePauseModal();
                    this.startGameLoop();
                    this.paused = false;
                    document.removeEventListener('keydown', escListener);
                }
            };
            document.addEventListener('keydown', escListener);
        } else {
            this.startGameLoop();
            this.hidePauseModal();
        }
        this.paused = !this.paused;
    }
}

	drawRect(x: number, y: number, w: number, h: number, color: string): void {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, w, h);
	}

	drawSquare(x: number, y: number, size: number, color: string): void {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, size, size);
	}

	drawNet(): void {
		for (let i = 5; i <= this.cvs.height; i += 20) {
			this.drawRect(this.cvs.width / 2 - 5, i, 10, 10, "#bfbfbf");
		}
	}

	scorePoint = (pad: "left" | "right"): void => {
		if (pad === "left") {
			this.leftPad.score++;
			this.leftScore.textContent = this.leftPad.score.toString();
			if (this.leftPad.score >= this.objective) {
				if (this.gamemode === "tournament")
					this.winMatch(pad);
				else
					this.endGame(this.usernames.p1);
			}
		} else if (pad === "right") {
			this.rightPad.score++;
			this.rightScore.textContent = this.rightPad.score.toString();
			if (this.rightPad.score >= this.objective) {
				if (this.gamemode === "tournament")
					this.winMatch(pad);
				else if (this.gamemode === "AI")
					this.endGame("AI");
				else
					this.endGame(this.usernames.p2);
			}
		}
		this.ball.resetPosition();
	};

	private drawObjects = (): void => {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

        this.drawNet();
        this.drawRect(this.leftPad.x, this.leftPad.y,
                      this.leftPad.width, this.leftPad.height, this.leftPad.color);
        this.drawRect(this.rightPad.x, this.rightPad.y,
                      this.rightPad.width, this.rightPad.height, this.rightPad.color);
        this.drawSquare(this.ball.x, this.ball.y, this.ball.size, this.ball.color);

        if (!this.gameOver) requestAnimationFrame(this.drawObjects);
    };

	update(): void {
		this.leftPad.move();
		this.rightPad.move();
		this.ball.move();
	}

	startGameLoop(): void {
		if (!this.interval) {
			this.interval = setInterval(() => {
				this.update();
			}, 5);
		}
		requestAnimationFrame(this.drawObjects);
	}

	stopInterval(): void {
		clearInterval(this.interval!);
		this.interval = null;
	}

	handleKeyDown = (event: KeyboardEvent): void => {
		if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
			event.preventDefault();
		}
		if (!this.paused && this.gameStarted) {
			switch (event.code) {
				case this.keybinds.lUp:
					this.leftPad.direction = "up";
					break;
				case this.keybinds.lDown:
					this.leftPad.direction = "down";
					break;
				case this.keybinds.lMini:
					if (this.gamestyle === "enhanced") this.leftPad.useMinimize();
					break;
				case this.keybinds.rUp:
					this.rightPad.direction = "up";
					break;
				case this.keybinds.rDown:
					this.rightPad.direction = "down";
					break;
				case this.keybinds.rMini:
					if (this.gamestyle === "enhanced" && this.gamemode !== "AI") this.rightPad.useMinimize();
					break;
			}
		}
		if (event.code === 'Escape') {
			this.pauseGame();
		}
	};

	handleKeyUp = (event: KeyboardEvent): void => {
		if (!this.paused && this.gameStarted) {
			switch (event.code) {
				case this.keybinds.lUp:
					if (this.leftPad.direction === "up") this.leftPad.direction = "";
					break;
				case this.keybinds.lDown:
					if (this.leftPad.direction === "down") this.leftPad.direction = "";
					break;
				case this.keybinds.rUp:
					if (this.rightPad.direction === "up") this.rightPad.direction = "";
					break;
				case this.keybinds.rDown:
					if (this.rightPad.direction === "down") this.rightPad.direction = "";
					break;
			}
		}
	};
	stopGameLoop(): void {
		this.timer.stop();
		this.stopInterval();
		this.gameOver = true;
	}
}

// Utility function for contrast color (black or white)
function getContrastColor(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    // Parse r,g,b
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);
    // Calculate luminance
    let luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.5 ? '#222' : '#fff';
}