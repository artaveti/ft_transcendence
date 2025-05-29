import { updateTextForElem } from "../../utils/languages.js";



export class Tournament {
	playerNumber: number;
	usernames: { [key: string]: string };
	tournamentOver: boolean;
	tournamentModal: any;
	tournamentMatchEndModal: any;
	playersTournament: HTMLElement | null;
	matchTournament: HTMLElement | null;
	winner: HTMLElement | null;
	matchIdModal: HTMLElement | null;
	timeElapsed: HTMLElement | null;
	pG: any;

	matchId: number;
	maxMatchNb: number;
	playerArray1: string[];
	playerArray2: { left?: string; right?: string };
	currentMatch: { left: string; right: string } | undefined;
	matchScore: { left: number; right: number }; // Add this property

	constructor(pNumber: number, usernames: { [key: string]: string }, pG: any) {
		this.playerNumber = pNumber;
		this.usernames = usernames;
		this.tournamentOver = false;

		this.playersTournament = document.getElementById('playersTournament');
		this.matchTournament = document.getElementById('matchTournament');
		this.winner = document.getElementById('matchWinner');
		this.matchIdModal = document.getElementById('matchId');
		this.timeElapsed = document.getElementById('matchTimeElapsed');

		this.pG = pG;

		this.matchId = 0;
		this.maxMatchNb = this.playerNumber - 1;

		this.playerArray1 =
			this.playerNumber === 4
				? ["p1", "p2", "p3", "p4"]
				: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
		this.playerArray1 = this.shuffleArray(this.playerArray1);

		this.playerArray2 = {};
		this.currentMatch = undefined;
		this.matchScore = { left: 0, right: 0 }; // Initialize matchScore
	}

    // Open Modals
openTournamentModal() {
  document.getElementById('tournamentModal')?.classList.remove('hidden');
}

openMatchEndModal() {
  document.getElementById('tournamentMatchEndModal')?.classList.remove('hidden');
}

// Close Modals
closeTournamentModal() {
  document.getElementById('tournamentModal')?.classList.add('hidden');
}

closeMatchEndModal() {
  document.getElementById('tournamentMatchEndModal')?.classList.add('hidden');
}

	getCurrentPlayers(): { left: string; right: string } | undefined {
		if (this.playerNumber === 4) {
			switch (this.matchId) {
				case 0:
					this.currentMatch = {
						left: this.playerArray1[0],
						right: this.playerArray1[1],
					};
					break;
				case 1:
					this.currentMatch = {
						left: this.playerArray1[2],
						right: this.playerArray1[3],
					};
					break;
				case 2:
					this.currentMatch = {
						left: this.playerArray2.left!,
						right: this.playerArray2.right!,
					};
					break;
				default:
					break;
			}

			if (this.matchTournament)
				this.matchTournament.textContent = (this.matchId + 1).toString();
			if (this.playersTournament && this.currentMatch)
				this.playersTournament.textContent =
					this.usernames[this.currentMatch.left] +
					" VS " +
					this.usernames[this.currentMatch.right];

			// this.tournamentModal.show();
            // this.pG.openTournamentModal();
            this.openTournamentModal();
			return this.currentMatch;
		}
	}

	setCurrentMatchWinner(side: "left" | "right"): void {
		if (this.playerNumber === 4 && this.currentMatch) {
			switch (this.matchId) {
				case 0:
					this.playerArray2.left = this.currentMatch[side];
					break;
				case 1:
					this.playerArray2.right = this.currentMatch[side];
					break;
				case 2:
					this.tournamentOver = true;

					break;
			}
		}

		if (!this.tournamentOver && this.currentMatch) {
			// Update matchScore
			this.matchScore[side] += 1;

			if (this.matchIdModal)
				this.matchIdModal.textContent = (this.matchId + 1).toString();
			if (this.winner)
				this.winner.textContent = this.usernames[this.currentMatch[side]];
			if (this.timeElapsed)
				this.timeElapsed.textContent = this.pG.timer.getTime();

	// Ensure tournament ends if matchId exceeds maxMatchNb
			if (this.matchId > this.maxMatchNb) {
				this.tournamentOver = true;
				console.log("Tournament is over.");
			}
            this.openMatchEndModal();
			console.log("Match ended. Winner: " + this.usernames[this.currentMatch[side]]);
			this.matchId++;
			console.log("Next match ID: " + this.matchId);
		}
	}

	shuffleArray(array: string[]): string[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}



export class Timer {
	pG: any;
	sec: number;
	min: number;
	interval: ReturnType<typeof setInterval> | null;

	timer: HTMLElement | null;
	lMinimizeLabel: HTMLElement | null;
	rMinimizeLabel: HTMLElement | null;

	minimizeDuration: number;
	minimizeCooldown: number;
	leftMinimizeCD: number;
	rightMinimizeCD: number;

	constructor(pongGame: any) {
		this.pG = pongGame;
		this.sec = 0;
		this.min = 0;
		this.interval = null;

		this.timer = document.getElementById('timer');
		this.lMinimizeLabel = document.getElementById('lMinimizeCD');
		this.rMinimizeLabel = document.getElementById('rMinimizeCD');

		if (this.pG.gamestyle !== "enhanced") {
			if (this.lMinimizeLabel) this.lMinimizeLabel.style.display = "none";
			if (this.rMinimizeLabel) this.rMinimizeLabel.style.display = "none";
		}

		this.minimizeDuration = 10;
		this.minimizeCooldown = 20;
		this.leftMinimizeCD = 0;
		this.rightMinimizeCD = 0;
	}

	start(): void {
		if (!this.interval) {
			this.interval = setInterval(() => {
				this.updateTime();
			}, 1000);
		}
	}

	stop(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	reset(): void {
		this.stop();
		this.sec = 0;
		this.min = 0;
		this.leftMinimizeCD = 0;
		this.rightMinimizeCD = 0;
		this.updateDisplay();
	}

	updateTime(): void {
		this.sec++;

		if (this.leftMinimizeCD > 0) {
			this.leftMinimizeCD--;
			if (this.leftMinimizeCD + this.minimizeDuration == this.minimizeCooldown) {
				this.pG.leftPad.stopMinimize();
			}
		}

		if (this.rightMinimizeCD > 0) {
			this.rightMinimizeCD--;
			if (this.rightMinimizeCD + this.minimizeDuration == this.minimizeCooldown) {
				this.pG.rightPad.stopMinimize();
			}
		}

		if (this.sec == 60) {
			this.min++;
			this.sec = 0;
		}

		this.updateDisplay();
	}

	updateDisplay(): void {
		if (this.timer)
			this.timer.textContent = this.getTime();

		if (this.lMinimizeLabel) {
			if (this.leftMinimizeCD > 0)
				this.lMinimizeLabel.textContent = this.leftMinimizeCD.toString().padStart(2, '0');
			else
				updateTextForElem(this.lMinimizeLabel, "ready");
		}

		if (this.rMinimizeLabel) {
			if (this.rightMinimizeCD > 0)
				this.rMinimizeLabel.textContent = this.rightMinimizeCD.toString().padStart(2, '0');
			else
				updateTextForElem(this.rMinimizeLabel, "ready");
		}
	}

	startMinimizeCD(placement: "left" | "right"): boolean {
		if (placement == "left") {
			if (this.leftMinimizeCD > 0)
				return false;
			this.leftMinimizeCD = this.minimizeCooldown;
			if (this.lMinimizeLabel)
				this.lMinimizeLabel.textContent = this.leftMinimizeCD.toString().padStart(2, '0');
			return true;
		}
		else if (placement == "right") {
			if (this.rightMinimizeCD > 0)
				return false;
			this.rightMinimizeCD = this.minimizeCooldown;
			if (this.rMinimizeLabel)
				this.rMinimizeLabel.textContent = this.rightMinimizeCD.toString().padStart(2, '0');
			return true;
		}
		return false;
	}

	getTime(): string {
		return this.min.toString().padStart(2, '0') + ":" + this.sec.toString().padStart(2, '0');
	}
}



export class Ball {
	x: number;
	y: number;
	size: number;
	color: string;
	speed: number;
	baseSpeed: number;
	dx: number;
	dy: number;
	maxY: number;
	maxX: number;
	pG: any;

	top: number = 0;
	bottom: number = 0;
	left: number = 0;
	right: number = 0;

	constructor(size: number, color: string, baseSpeed: number, maxY: number, maxX: number, pongGame: any) {
		this.size = size;
		this.color = color;
		this.baseSpeed = baseSpeed;
		this.maxY = maxY;
		this.maxX = maxX;
		this.pG = pongGame;
		this.dx = baseSpeed;

		// These are initialized in resetPosition
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.dy = 0;

		this.resetPosition();
	}

	collisionDetect(pad: any): boolean {
		pad.top = pad.y;
		pad.bottom = pad.y + pad.height;
		pad.left = pad.x;
		pad.right = pad.x + pad.width;

		this.top = this.y;
		this.bottom = this.y + this.size;
		this.left = this.x;
		this.right = this.x + this.size;

		return (
			pad.left < this.right &&
			pad.top < this.bottom &&
			pad.right > this.left &&
			pad.bottom > this.top
		);
	}

	move(): void {
		this.x += this.dx;
		this.y += this.dy;

		const movesRight = this.dx > 0;

		if (this.y + this.size > this.maxY || this.y < 0) {
			this.dy *= -1;
		}

		const currentPad = movesRight ? this.pG.rightPad : this.pG.leftPad;

		if (this.collisionDetect(currentPad)) {
			this.dx *= -1;
			this.speed += 0.2;
			this.dx = this.dx > 0 ? this.speed : -this.speed;

			if (this.pG.gamestyle === "enhanced" && currentPad.direction !== "") {
				this.dy *= ((this.dy > 0 && currentPad.direction === "down") ||
							(this.dy < 0 && currentPad.direction === "up"))
							? 1.2 : -0.9;

				// Clamp dy
				if (this.dy > 0) {
					this.dy = Math.max(0.3, Math.min(this.dy, 4));
				} else {
					this.dy = Math.min(-0.3, Math.max(this.dy, -4));
				}
			}
		}

		if (this.x + this.size > this.maxX) {
			this.pG.scorePoint("left");
		} else if (this.x < 0) {
			this.pG.scorePoint("right");
		}
	}

	resetPosition(): void {
		this.x = this.maxX / 2;
		this.y = this.maxY / 2;
		this.speed = this.baseSpeed + 0.3;

		this.dx = Math.random() > 0.5 ? this.baseSpeed : -this.baseSpeed;
		this.dy = Math.random() > 0.5
			? Math.random() * 1.3 + 0.5
			: -(Math.random() * 1.3 + 0.5);
	}
}


export class Pad {
	x: number;
	y: number;
	width: number;
	height: number;
	placement: "left" | "right";
	color: string;
	dy: number;
	maxY: number;
	isAI: boolean;
	score: number;
	direction: string;
	pG: any; 
	isMinimized: boolean;
	refresh_rate: number;
	lastAIUpdate: number;
	predictedPosition: { y: number } | null;
	ball: {
		x: number;
		y: number;
		dx: number;
		dy: number;
		size: number;
	} | undefined;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		placement: "left" | "right",
		color: string,
		dy: number,
		maxY: number,
		isAI: boolean,
		pongGame: any 
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.placement = placement;
		this.color = color;
		this.dy = dy;
		this.maxY = maxY;
		this.isAI = isAI;
		this.ball = undefined;
		this.score = 0;
		this.direction = "";
		this.pG = pongGame;
		this.isMinimized = false;
		this.refresh_rate = 1000;
		this.lastAIUpdate = Date.now();
		this.predictedPosition = null;
	}

	useMinimize(): void {
		if (this.pG.timer.startMinimizeCD(this.placement)) {
			const target = this.placement === "left" ? this.pG.rightPad : this.pG.leftPad;
			target.height /= 2;
			target.isMinimized = true;
			target.y += target.height / 2;
		}
	}

	stopMinimize(): void {
		const target = this.placement === "left" ? this.pG.rightPad : this.pG.leftPad;
		target.y -= target.height / 2;
		target.height *= 2;
		target.isMinimized = false;
	}

	move(): void {
		if (!this.isAI) {
			if (this.direction === "up" && this.y > 0) {
				this.y -= this.dy;
			} else if (this.direction === "down" && this.y < this.maxY - this.height) {
				this.y += this.dy;
			}
		} else {
			this.checkMinimize();
			if (
				this.ball &&
				((this.placement === "left" && this.ball.dx > 0) ||
					(this.placement === "right" && this.ball.dx < 0))
			) {
				this.goMid();
			} else {
				this.AiPredictPaddle();
			}
		}
		this.paddleEdgeCollision();
	}

	checkMinimize(): void {
		const cvsPortion = this.pG.cvs.width / 5;
		if (
			this.pG.timer.rightMinimizeCD === 0 &&
			this.ball &&
			this.ball.dx < 0 &&
			this.ball.x < cvsPortion &&
			this.pG.gamestyle === "enhanced"
		) {
			this.useMinimize();
		}
	}

	AiPredictPaddle(): void {
		const currentTime = Date.now();
		if (currentTime - this.lastAIUpdate >= this.refresh_rate) {
			this.lastAIUpdate = currentTime;
			if (this.ball && this.ball.dx > 0) {
				this.predictedPosition = this.predictBallPosition();
			}
		}

		if (this.predictedPosition && this.ball && this.ball.dx > 0) {
			let targetY: number;
			if (this.pG.rightPad.isMinimized) {
				targetY = this.predictedPosition.y - this.height / 2;
			} else {
				const paddleThird = this.height / 3;
				targetY =
					this.ball.dy > 0
						? this.predictedPosition.y - paddleThird
						: this.predictedPosition.y - 2 * paddleThird;
			}

			if (this.y < targetY - 1) {
				this.y += this.dy;
			} else if (this.y > targetY + 1) {
				this.y -= this.dy;
			}
		}
	}

	predictBallPosition(): { y: number } | null {
		if (!this.ball) return null;

		let futureX = this.ball.x;
		let futureY = this.ball.y;
		let velocityX = this.ball.dx;
		let velocityY = this.ball.dy;
		const paddleX = this.x;

		if (this.pG.aiDifficulty === "easy") {
			const framesAhead = 60;
			for (let i = 0; i < framesAhead; i++) {
				futureX += velocityX;
				futureY += velocityY;
				if (futureX >= paddleX) return { y: futureY };
				if (
					futureY + this.ball.size / 2 >= this.pG.cvs.height ||
					futureY - this.ball.size / 2 <= 0
				) {
					velocityY *= -1;
				}
			}
			return { y: futureY };
		} else {
			while (futureX < paddleX) {
				futureX += velocityX;
				futureY += velocityY;
				if (
					futureY + this.ball.size / 2 >= this.pG.cvs.height ||
					futureY - this.ball.size / 2 <= 0
				) {
					velocityY *= -1;
				}
			}
			return { y: futureY };
		}
	}

	paddleEdgeCollision(): void {
		if (this.y < 0) {
			this.y = 0;
		} else if (this.y + this.height > this.maxY) {
			this.y = this.maxY - this.height;
		}
	}

	goMid(): void {
		const middleY = (this.maxY - this.height) / 2;
		const moveSpeed = this.dy;

		if (Math.abs(this.y - middleY) > moveSpeed) {
			this.y += this.y < middleY ? moveSpeed : -moveSpeed;
		} else {
			this.y = middleY;
		}
	}
}
