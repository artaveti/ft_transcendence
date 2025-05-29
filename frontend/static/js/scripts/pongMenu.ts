//@ts-ignore
import { BASE_URL } from "../index.js";
import { updateTexts } from "../utils/languages.js";
import { getText } from "../utils/languages.js";
import { updateTextForElem } from "../utils/languages.js";
import { authFetch } from "../utils/authFetch.js";

export let eventListeners: Record<string, EventListener> = {};




export const gamestyleModalHTML = `
  <div class="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl mx-auto p-8">
    <div class="modal-header mb-4 flex flex-col items-center">
      <h2 class="text-3xl font-extrabold text-center w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 
        text-transparent bg-clip-text tracking-wide leading-tight" data-translate="gamestyle">
        gamestyle
      </h2>
    </div>
    <div class="modal-body flex flex-col">
      <div class="flex justify-center gap-4 mt-4">
        <button
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
            hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
            font-semibold text-white"
          id="btnLegacy"
          data-translate="legacy"
        >
          Legacy
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
            hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
            font-semibold text-white"
          id="btnEnhanced"
          data-translate="enhanced"
        >
          Enhanced
        </button>
      </div>
      <div class="flex flex-col items-center mt-6">
        <p class="text-white text-center" id="gamestyleDescription"></p>
        <p class="text-white text-center" id="availableGamemodes"></p>
      </div>
      <p class="text-gray-400 text-sm text-center mt-8 italic self-center" data-translate="press_esc">
        Press ESC to apply chosen settings
      </p>
    </div>
  </div>
`;




export const gamemodeModalHTML = `
  <div class="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl mx-auto p-8">
    <div class="modal-header mb-4 flex flex-col items-center">
      <h2 class="text-3xl font-extrabold text-center w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 
        text-transparent bg-clip-text tracking-wide leading-tight" data-translate="gamemode">
        gamemode
      </h2>
    </div>
    <div class="modal-body flex flex-col">
      <div class="flex justify-center gap-4 mt-4">
        <button
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
            hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
            font-semibold text-white"
          id="btnPvp"
          data-translate="pvp"
        >
          PvP
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
            hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
            font-semibold text-white"
          id="btnAI"
          data-translate="vs ai"
        >
          Vs AI
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
            hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
            font-semibold text-white"
          id="btnTournament"
          data-translate="tournament"
        >
          Tournament
        </button>
      </div>
      <div class="flex flex-col items-center mt-6">
        <p class="text-white text-center mt-3" id="gamemodeDescription"></p>
        <p class="text-white text-center font-bold mt-1" id="disclaimer"></p>
        <div id="aiLevelsContainer"></div>
      </div>
      <p class="text-gray-400 text-sm text-center mt-8 italic self-center" data-translate="press_esc">
        Press ESC to apply chosen settings
      </p>
    </div>
  </div>
`;




export const playersContainerHTML = `
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl" id="leftPaddleName">Player 1</p>
		<input type="text" id="leftPaddleInput" maxlength="10" class="mt-3 p-2 text-center rounded-md bg-gray-800 text-white" placeholder="Enter username" data-translate="enter-username">
		<input type="color" id="leftPaddleColor" class="mt-3" value="#b3ecff">
	</div>
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl" id="rightPaddleName">Player 2</p>
		<input type="text" id="rightPaddleInput" maxlength="10" class="mt-3 p-2 text-center rounded-md bg-gray-800 text-white" placeholder="Enter username" data-translate="enter-username">
		<input type="color" id="rightPaddleColor" class="mt-3" value="#e09eff">
	</div>
`;



export const playerBoxHTML = `
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl" id="playerPaddleName">Player 1</p>
		<input type="text" id="playerPaddleInput" maxlength="10" class="mt-2 p-2 text-center rounded-md bg-gray-800 text-white" placeholder="Enter username" data-translate="enter-username">
		<input type="color" id="playerPaddleColor" class="mt-3" value="#b3ecff">
	</div>
`;

export const fourPlayersContainerHTML = `
<div class="overflow-y-auto max-h-[60vh] w-full flex flex-col gap-2">
	<!-- Player 1 -->
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl mb-3" id="player1Name">player 1</p>
		<input 
			type="text" 
			id="player1Input" 
			maxlength="10" 
			class="p-2 mt-2 text-center rounded-md bg-gray-800 text-white placeholder-gray-400" 
			placeholder="Enter username" 
			data-translate="enter-username">
		<input 
			type="color" 
			id="player1Color" 
			class="mt-3" 
			value="#ff0000">
	</div>

	<!-- Player 2 -->
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl mb-3" id="player2Name">player 2</p>
		<input 
			type="text" 
			id="player2Input" 
			maxlength="10" 
			class="p-2 mt-2 text-center rounded-md bg-gray-800 text-white placeholder-gray-400" 
			placeholder="Enter username" 
			data-translate="enter-username">
		<input 
			type="color" 
			id="player2Color" 
			class="mt-3" 
			value="#00ff00">
	</div>

	<!-- Player 3 -->
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl mb-3" id="player3Name">player 3</p>
		<input 
			type="text" 
			id="player3Input" 
			maxlength="10" 
			class="p-2 mt-2 text-center rounded-md bg-gray-800 text-white placeholder-gray-400" 
			placeholder="Enter username" 
			data-translate="enter-username">
		<input 
			type="color" 
			id="player3Color" 
			class="mt-3" 
			value="#0000ff">
	</div>

	<!-- Player 4 -->
	<div class="glass mt-2 p-4 flex flex-col items-center">
		<p class="text-white text-xl mb-3" id="player4Name">...</p>
		<input 
			type="text" 
			id="player4Input" 
			maxlength="10" 
			class="p-2 mt-2 text-center rounded-md bg-gray-800 text-white placeholder-gray-400" 
			placeholder="Enter username" 
			data-translate="enter-username">
		<input 
			type="color" 
			id="player4Color" 
			class="mt-3" 
			value="#ff00ff">
	</div>
	  </div>
`;


   // ${fourPlayersContainerHTML}



export const aiLevelsHTML = `
  <div class="flex justify-center gap-4 mt-4">
    <button
      class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
             before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
             hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
             font-semibold text-white"
      id="btnEasy"
      data-translate="easy"
    >
      Easy
    </button>
    <button
      class="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md shadow-indigo-700/20 relative overflow-hidden
             before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-transparent before:pointer-events-none
             hover:shadow-lg hover:shadow-indigo-400/40 hover:from-gray-600 hover:to-gray-700 transition-all duration-200
             font-semibold text-white"
      id="btnHard"
      data-translate="hard"
    >
      Hard
    </button>
  </div>
`;



export function getPointsRangeHTML(objective = 5) {
	return `
		<div class="flex flex-col items-center mb-2">
			<div class="flex items-center justify-center space-x-2">
				<p class="text-white text-lg" data-translate="points-to-win"></p>
				<p class="text-white text-lg" id="rangeLabel"></p>
			</div>
			<input type="range" class="mt-2 w-3/4" min="1" max="10" value="${objective}" step="1" id="pongRangeInput">
		</div>
	`;
}

export function getSettingsModalHTML(keybinds : any) {
  const safeValue = (val : any) => (val !== "" ? val : "none");
  const keyChip = (id : any, value : any) =>
    `<span id="${id}" class="inline-block min-w-[4.5rem] px-3 py-1 bg-gradient-to-r from-gray-900 to-gray-800 border border-white/20 rounded-lg shadow-sm text-white font-mono text-base cursor-pointer hover:ring-2 hover:ring-cyan-400 transition">
      ${safeValue(value)}
    </span>`;

  return `
    <div class="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl mx-auto p-8">
      <div class="modal-header mb-4">
        <h2 class="text-3xl font-extrabold text-center w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text tracking-wide leading-tight" data-translate="keybinds-settings">
          keybind settings
        </h2>
      </div>
      <div class="modal-body flex flex-col items-center">
        <div class="w-full max-w-lg grid grid-cols-3 gap-x-6 gap-y-4 text-lg mb-6">
          <div></div>
          <div class="text-white text-center font-semibold" data-translate="left paddle">left paddle</div>
          <div class="text-white text-center font-semibold" data-translate="right paddle">right paddle</div>
          
          <div class="text-right text-white pr-2" data-translate="move-up">move up</div>
          <div class="flex justify-center">${keyChip("lUp", keybinds.lUp)}</div>
          <div class="flex justify-center">${keyChip("rUp", keybinds.rUp)}</div>
          
          <div class="text-right text-white pr-2" data-translate="move-down">move down</div>
          <div class="flex justify-center">${keyChip("lDown", keybinds.lDown)}</div>
          <div class="flex justify-center">${keyChip("rDown", keybinds.rDown)}</div>
        </div>
        <div class="w-full flex justify-center mt-2 gap-4">
          <button
            id="resetToDefault"
            class="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 shadow-md shadow-red-900/20 relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-red-400/10 before:to-transparent before:pointer-events-none
              hover:shadow-lg hover:shadow-red-500/40 hover:from-red-500 hover:to-red-700 transition-all duration-200
              font-semibold text-white"
          >
            Reset to Default
          </button>
          <button
            id="okSettingsModal"
            class="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 shadow-md shadow-indigo-900/40
              hover:shadow-lg hover:shadow-pink-500/30 hover:from-indigo-400 hover:to-pink-400
              transition-all duration-200 font-semibold text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  `;
}


//change 


type PaddleColorSet = {
	p1: string;
	p2: string;
	p3: string;
	p4: string;
};

type UsernameSet = {
	p1: string;
	p2: string;
	p3: string;
	p4: string;
};

type KeybindSet = {
	lUp: string;
	lDown: string;
	lMini: string;
	rUp: string;
	rDown: string;
	rMini: string;
};

export class PongMenu {
	keysButton: HTMLElement;
	gamemodeButton: HTMLElement;
	gamestyleButton: HTMLElement;
	btnStartGame: HTMLAnchorElement;
	pointsRangeContainer: HTMLElement;
	settingsModal: any;
	settingsModalContent: HTMLElement;
	playersContainer: HTMLElement;
	currentGamemodeLabel: HTMLElement;
	currentGamestyleLabel: HTMLElement;
	toastNotification: HTMLElement;
	// toastBootstrap: any;
	toastBody: HTMLElement;
	toastValue: HTMLElement;
	boundKeyDownSettings: (e: KeyboardEvent) => void;
	//updatePlayersContainer: () => void;
	waitForKey: boolean;
	waitingKey: string;
	displayName: string;
	colors: PaddleColorSet;
	usernames: UsernameSet;
	keybinds: KeybindSet;
	aiDifficulty: string;
	gamemode: string;
	lastGamemode: string;
	gamestyle: string;
	objective: number;

	constructor() {
		this.keysButton = document.getElementById('btnKeys')!;
		this.gamemodeButton = document.getElementById('btnGamemode')!;
		this.gamestyleButton = document.getElementById('btnGamestyle')!;
		this.btnStartGame = document.getElementById('btnStartGame') as HTMLAnchorElement;
		this.pointsRangeContainer = document.getElementById('pointsRangeContainer')!;
		// this.settingsModal = new (window as any).bootstrap.Modal(document.getElementById('settingsModal')!);
		// this.settingsModal.classList.add('hidden');
		
if (this.settingsModal) {
    this.settingsModal.classList.add('hidden');
} else {
    console.error("Error: settingsModal element not found in DOM.");
}

		// this.settingsModal = document.getElementById('settingsModal')!;

		this.settingsModalContent = document.getElementById('settingsModalContent')!;
		this.playersContainer = document.getElementById('playersContainer')!;
		this.currentGamemodeLabel = document.getElementById('currentGamemodeLabel')!;
		this.currentGamestyleLabel = document.getElementById('currentGamestyleLabel')!;
		this.toastNotification = document.getElementById('liveToast')!;
		// this.toastBootstrap = (window as any).bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody')!;
		this.toastValue = document.getElementById('toastValue')!;
		this.boundKeyDownSettings = this.keyDownSettings.bind(this);
		//this.updatePlayersContainer = this.updatePlayersContainer.bind(this);
		this.waitForKey = false;
		this.waitingKey = "";
		this.displayName = "";

		// this.settingsModal.classList.add('hidden');
		if (this.settingsModal) {
    this.settingsModal.classList.add('hidden');
} else {
    console.error("Error: settingsModal element not found in DOM.");
}

	this.initializeOverlay();


		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#b3ecff", p2: "#e09eff", p3: "#266fff", p4: "#ff00ff"
		};
		localStorage.setItem('pongColors', JSON.stringify(this.colors));

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};
		localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp: 'KeyW', lDown: 'KeyS', lMini: 'KeyE',
			rUp: 'ArrowUp', rDown: 'ArrowDown', rMini: 'ArrowRight'
		};
		localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));

		const aiDifficultyString = localStorage.getItem('pongAIDifficulty');
		this.aiDifficulty = aiDifficultyString ? JSON.parse(aiDifficultyString) : "easy";
		localStorage.setItem('pongAIDifficulty', JSON.stringify(this.aiDifficulty));

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";
		this.lastGamemode = "pvp";
		localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));

		const gamestyleString = localStorage.getItem('pongGamestyle');
		this.gamestyle = gamestyleString ? JSON.parse(gamestyleString) : "enhanced";
		localStorage.setItem('pongGamestyle', JSON.stringify(this.gamestyle));

		this.btnStartGame.href =  "/pong";
		updateTextForElem(this.currentGamemodeLabel, this.gamemode);
		updateTextForElem(this.currentGamestyleLabel, this.gamestyle);

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;

		// 🔹 Add Event Listeners
	this.keysButton.addEventListener("click", () => this.showKeysConfig());
	this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());
	this.gamestyleButton.addEventListener("click", () => this.showGamestyleConfig());
	document.addEventListener("keydown", this.boundKeyDownSettings);

		this.initialize();
	}
	initializeOverlay() {
	const overlay = document.createElement('div');
	overlay.id = 'overlay';
	overlay.className = 'fixed inset-0 bg-black bg-opacity-50 hidden';
	document.body.appendChild(overlay);

// 	overlay.addEventListener('click', () => {
// 		// this.settingsModal.classList.add('hidden');
// 		if (this.settingsModal) {
//     this.settingsModal.classList.add('hidden');
// } else {
//     console.error("Error: settingsModal element not found in DOM.");
// }

overlay.addEventListener('click', () => {
    this.closeModal('settingsModal');
});



document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        this.closeModal('settingsModal');
    }
});

}

/////
async initialize(): Promise<void> {
	this.keysButton.addEventListener("click", () => this.showKeysConfig());
	this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());
	this.gamestyleButton.addEventListener("click", () => this.showGamestyleConfig());
	document.addEventListener("keydown", this.boundKeyDownSettings);
	//this.boundKeyDownSettings = this.keyDownSettings.bind(this) as EventListener;
	this.boundKeyDownSettings = (event: Event) => this.keyDownSettings(event as KeyboardEvent);

	//eventListeners["keydown"] = this.boundKeyDownSettings;
	await this.getLoggedUsername();
	this.updatePlayersContainer();
	this.setScoreRange();
}
///////////////////
async getLoggedUsername(): Promise<void> {
	const response = await authFetch(`${BASE_URL}/api/profile`);
	if (response.status === 200) {
		const responseData = await response.json();
		const user = responseData.user;
		this.displayName = user.username;
	}
}

updatePlayersContainer = (): void => {
	this.playersContainer.innerHTML = '';
	switch (this.gamemode) {
		case "pvp":
			this.playersContainer.innerHTML = playersContainerHTML;

			const leftPaddleUsernameLabel = document.getElementById('leftPaddleName') as HTMLElement;
			const leftPaddleInput = document.getElementById('leftPaddleInput') as HTMLInputElement;
			const leftPaddleColor = document.getElementById('leftPaddleColor') as HTMLInputElement;
			const rightPaddleUsernameLabel = document.getElementById('rightPaddleName') as HTMLElement;
			const rightPaddleInput = document.getElementById('rightPaddleInput') as HTMLInputElement;
			const rightPaddleColor = document.getElementById('rightPaddleColor') as HTMLInputElement;

			leftPaddleUsernameLabel.textContent = this.usernames.p1;
			rightPaddleUsernameLabel.textContent = this.usernames.p2;
			leftPaddleColor.value = this.colors.p1;
			rightPaddleColor.value = this.colors.p2;

			leftPaddleInput.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle", "p1"));
			leftPaddleInput.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle", "p1"));

			rightPaddleInput.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));
			rightPaddleInput.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));

			leftPaddleColor.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p1, "p1"));
			rightPaddleColor.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p2, "p2"));
			break;

		case "AI":
			this.playersContainer.innerHTML = playerBoxHTML;

			const playerPaddleName = document.getElementById('playerPaddleName') as HTMLElement;
			const playerPaddleInput = document.getElementById('playerPaddleInput') as HTMLInputElement;
			const playerPaddleColor = document.getElementById('playerPaddleColor') as HTMLInputElement;

			playerPaddleName.textContent = this.usernames.p1;
			playerPaddleColor.value = this.colors.p1;

			playerPaddleInput.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));
			playerPaddleInput.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));

			playerPaddleColor.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p1, "p1"));
			break;

		case "tournament":
			this.playersContainer.innerHTML = fourPlayersContainerHTML;

			const player1Name = document.getElementById('player1Name') as HTMLElement;
			const player1Input = document.getElementById('player1Input') as HTMLInputElement;
			const player1Color = document.getElementById('player1Color') as HTMLInputElement;

			const player2Name = document.getElementById('player2Name') as HTMLElement;
			const player2Input = document.getElementById('player2Input') as HTMLInputElement;
			const player2Color = document.getElementById('player2Color') as HTMLInputElement;

			const player3Name = document.getElementById('player3Name') as HTMLElement;
			const player3Input = document.getElementById('player3Input') as HTMLInputElement;
			const player3Color = document.getElementById('player3Color') as HTMLInputElement;

			const player4Name = document.getElementById('player4Name') as HTMLElement;
			const player4Input = document.getElementById('player4Input') as HTMLInputElement;
			const player4Color = document.getElementById('player4Color') as HTMLInputElement;

			player1Name.textContent = this.usernames.p1;
			player2Name.textContent = this.usernames.p2;
			player3Name.textContent = this.usernames.p3;
			player4Name.textContent = this.usernames.p4;

			player1Color.value = this.colors.p1;
			player2Color.value = this.colors.p2;
			player3Color.value = this.colors.p3;
			player4Color.value = this.colors.p4;

			
			if (this.displayName !== "") {
    player1Input.value = this.usernames.p1 = this.displayName;
    player1Input.placeholder = "Enter username"; 
    player1Name.textContent = this.usernames.p1;
    localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));
} else {
    player1Input.value = this.usernames.p1;
    player1Input.placeholder = "Enter username"; 
    player1Name.textContent = this.usernames.p1;
}
player1Input.addEventListener('keypress', (event) =>
    this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));
player1Input.addEventListener('blur', (event) =>
    this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));

			player2Input.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, player2Input, player2Name, "player 2", "p2"));
			player2Input.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, player2Input, player2Name, "player 2", "p2"));

			player3Input.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, player3Input, player3Name, "player 3", "p3"));
			player3Input.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, player3Input, player3Name, "player 3", "p3"));

			player4Input.addEventListener('keypress', (event) =>
				this.paddleInputHandle(event, player4Input, player4Name, "player 4", "p4"));
			player4Input.addEventListener('blur', (event) =>
				this.paddleInputHandle(event, player4Input, player4Name, "player 4", "p4"));

			player1Color.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p1, "p1"));
			player2Color.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p2, "p2"));
			player3Color.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p3, "p3"));
			player4Color.addEventListener('input', (event) =>
				this.colorInputHandle(event, this.usernames.p4, "p4"));
			break;

		default:
			break;
	}

	updateTexts();
}

	paddleInputHandle(
		event: KeyboardEvent | FocusEvent,
		playerInput: HTMLInputElement,
		playerLabel: HTMLElement,
		playerName: string,
		playerUsername: keyof UsernameSet
	): void {
		const isValid =
			(event.type === 'keypress' && (event as KeyboardEvent).key === 'Enter') ||
			event.type === 'blur';
	
		if (isValid && playerInput.value !== "") {
			this.usernames[playerUsername] = playerInput.value;
			playerInput.value = ""; // Clear the input box
			playerLabel.textContent = this.usernames[playerUsername];
			this.toastBody.textContent = `${playerName} ${getText("paddle-username-changed")}`;
			this.toastValue.textContent = this.usernames[playerUsername];
			// this.toastBootstrap.show();
			this.showToast();

			localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));
	
			const usernamesString = localStorage.getItem('pongUsernames');
			this.usernames = usernamesString ? JSON.parse(usernamesString) : {
				p1: "player1", p2: "player2", p3: "player3", p4: "player4"
			};
		}
	}
	//////////////////////////
	colorInputHandle(
		event: Event,
		name: string,
		player: keyof PaddleColorSet
	): void {
		const target = event.target as HTMLInputElement;
		this.colors[player] = target.value;
		this.toastBody.textContent = `${name} ${getText("color-changed")}`;
		this.toastValue.textContent = "";
		// this.toastBootstrap.show();
		this.showToast();

		localStorage.setItem('pongColors', JSON.stringify(this.colors));
	
		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#ff0000", p2: "#00ff00", p3: "#0000ff", p4: "#ff00ff"
		};
	}

	setScoreRange(): void {
	this.pointsRangeContainer.innerHTML = `
		<div class="flex flex-col items-center mb-2">
			<div class="flex items-center justify-center space-x-2">
				<p class="text-white text-lg" data-translate="points-to-win"></p>
				<p class="text-white text-lg" id="rangeLabel">${this.objective}</p>
			</div>
			<input 
				type="range" 
				class="mt-2 w-3/4" 
				min="1" max="10" 
				value="${this.objective}" 
				step="1" 
				id="pongRangeInput"
			>
		</div>
	`;

	const rangeInput = document.getElementById('pongRangeInput') as HTMLInputElement;
	const rangeLabel = document.getElementById('rangeLabel') as HTMLElement;

	rangeInput.addEventListener('input', (event: Event) => {
		const target = event.target as HTMLInputElement;
		this.objective = parseInt(target.value);
		rangeLabel.textContent = this.objective.toString();
		localStorage.setItem('pongObjective', JSON.stringify(this.objective));
	});

	updateTexts();
}

resetKeybinds(): void {
    // Reset to default keybinds
    this.keybinds = {
        lUp: 'KeyW',
        lDown: 'KeyS',
        lMini: 'KeyE',
        rUp: 'ArrowUp',
        rDown: 'ArrowDown',
        rMini: 'ArrowRight'
    };

    // Save to LocalStorage
    localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));

    // Update the UI
    (document.getElementById('lUp') as HTMLElement).textContent = "KeyW";
    (document.getElementById('lDown') as HTMLElement).textContent = "KeyS";
    (document.getElementById('lMini') as HTMLElement).textContent = "KeyE";
    (document.getElementById('rUp') as HTMLElement).textContent = "ArrowUp";
    (document.getElementById('rDown') as HTMLElement).textContent = "ArrowDown";
    (document.getElementById('rMini') as HTMLElement).textContent = "ArrowRight";

    // Show Toast
    this.toastBody.textContent = "Keybinds reset to default!";
    this.toastValue.textContent = "";
    this.showToast();
}

showKeysConfig(): void {
    // Get the HTML content for the keys configuration
    const content = getSettingsModalHTML(this.keybinds);
    
    // Inject it into the modal content
    this.settingsModalContent.innerHTML = content;
    document.getElementById("okSettingsModal")?.addEventListener("click", () => {
		this.closeModal("settingsModal");
	});
	
    // Open the modal
    this.openModal('settingsModal');

    // Add event listeners to the buttons
    const keys = ["lUp", "lDown", "lMini", "rUp", "rDown", "rMini"];
    keys.forEach((key) => {
        document.getElementById(key)?.addEventListener("click", (event) => 
            this.changeKeybind(event, key as keyof KeybindSet, document.getElementById(key)!)
        );
    });
 // Add the event listener for the reset button
 document.getElementById("resetToDefault")?.addEventListener("click", () => this.resetKeybinds());

    // ✅ Close modal on OK button click
	document.getElementById("okSettingsModal")?.addEventListener("click", () => {
		this.closeModal("settingsModal");
	});

		this.openModal('settingsModal');

		updateTexts();
	}
	

	showGamemodeConfig(): void {
		this.settingsModalContent.innerHTML = gamemodeModalHTML;
	
		const btnPvp = document.getElementById('btnPvp') as HTMLButtonElement;
		const btnAI = document.getElementById('btnAI') as HTMLButtonElement;
		const btnTournament = document.getElementById('btnTournament') as HTMLButtonElement;
		const pDescription = document.getElementById('gamemodeDescription') as HTMLElement;
		const aiLevelsContainer = document.getElementById('aiLevelsContainer') as HTMLElement;
	
		btnPvp.addEventListener("click", (event) => this.selectGamemode(event, "pvp"));
		btnAI.addEventListener("click", (event) => this.selectGamemode(event, "AI"));
		btnTournament.addEventListener("click", (event) => this.selectGamemode(event, "tournament"));
	

		
		switch (this.gamemode) {
			case "pvp":
				updateTextForElem(pDescription, "pvp-desc");
				break;
	
			case "AI":
				updateTextForElem(pDescription, "AI-desc");
	
				aiLevelsContainer.innerHTML = aiLevelsHTML;
	
				const btnEasy = document.getElementById('btnEasy') as HTMLButtonElement;
				const btnHard = document.getElementById('btnHard') as HTMLButtonElement;
	
				btnEasy.addEventListener("click", (event) => this.selectAIDifficulty(event, "easy"));
				btnHard.addEventListener("click", (event) => this.selectAIDifficulty(event, "hard"));
	
				const difficulties: Record<string, HTMLElement> = {
					easy: btnEasy,
					hard: btnHard,
				};
	
				this.applySelectedSetting("pongAIDifficulty", difficulties);
				updateTexts();
				break;
	
			case "tournament":
				updateTextForElem(pDescription, "tournament-desc");
				break;
	
			default:
				break;
		}
	
	
		localStorage.setItem("pongGamemode", JSON.stringify(this.gamemode));
		// this.settingsModal.show();
	// this.settingsModal.classList.remove('hidden');

		const gamemodes: Record<string, HTMLElement> = {
			pvp: btnPvp,
			AI: btnAI,
			tournament: btnTournament,
		};
	
		this.applySelectedSetting("pongGamemode", gamemodes);
		this.openModal('settingsModal');

		// this.openModal();
		updateTexts();
	}


openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal) {
        overlay?.classList.remove('hidden');
        modal.classList.remove('hidden');
    } else {
        console.error(`❌ Modal with ID "${modalId}" not found.`);
    }
}

closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal) {
        modal.classList.add('hidden');
        overlay?.classList.add('hidden');
    } else {
        console.error(`❌ Modal with ID "${modalId}" not found.`);
    }
}


	//////////
	showGamestyleConfig(): void {
		this.settingsModalContent.innerHTML = gamestyleModalHTML;
	
		const btnLegacy = document.getElementById('btnLegacy') as HTMLButtonElement;
		const btnEnhanced = document.getElementById('btnEnhanced') as HTMLButtonElement;
		// const btn3D = document.getElementById('btn3D') as HTMLButtonElement;
	
		const gamestyleDescription = document.getElementById('gamestyleDescription') as HTMLElement;
		const availableGamemodes = document.getElementById('availableGamemodes') as HTMLElement;
	
		btnLegacy.addEventListener("click", (event) => this.selectGamestyle(event, "legacy"));
		btnEnhanced.addEventListener("click", (event) => this.selectGamestyle(event, "enhanced"));
		// btn3D.addEventListener("click", (event) => this.selectGamestyle(event, "3D"));
	
		switch (this.gamestyle) {
			case "legacy":
				updateTextForElem(gamestyleDescription, "legacy-desc");
				updateTextForElem(availableGamemodes, "available-gamemodes-all");
				break;
	
			case "enhanced":
				updateTextForElem(gamestyleDescription, "enhanced-desc");
				updateTextForElem(availableGamemodes, "available-gamemodes-all");
				break;
	
			// case "3D":
			// 	updateTextForElem(gamestyleDescription, "3D-desc");
			// 	updateTextForElem(availableGamemodes, "available-gamemodes-pvp");
			// 	break;
	
			default:
				break;
		}
	
		localStorage.setItem("pongGamestyle", JSON.stringify(this.gamestyle));
		// this.settingsModal.show();
	// this.settingsModal.classList.remove('hidden');
	// Open modal with a custom method
	// this.openModal();
	this.openModal('settingsModal');

		const gamestyles: Record<string, HTMLElement> = {
			legacy: btnLegacy,
			enhanced: btnEnhanced,
			// "3D": btn3D,
		};
	
		this.applySelectedSetting("pongGamestyle", gamestyles);
		updateTexts();
	}
	

selectGamemode(event: Event, gamemode: string): void {
	updateTextForElem(this.toastBody, "chosen-gamemode");
//	this.toastValue.textContent = getText(gamemode);
this.toastValue.textContent = getText(gamemode) ?? null;

	// this.toastBootstrap.show();
this.showToast();

	this.gamemode = gamemode;
	localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));
	updateTextForElem(this.currentGamemodeLabel, this.gamemode);

	this.showGamemodeConfig();
	this.updatePlayersContainer();
}
showToast = () => {
    this.toastNotification.classList.remove('hidden');
    setTimeout(() => {
        this.toastNotification.classList.add('hidden');
    }, 3000); // 3 seconds display time
};

selectGamestyle(event: Event, gamestyle: string): void {
	updateTextForElem(this.toastBody, "chosen-game-style");
	//this.toastValue.textContent = getText(gamestyle);
	this.toastValue.textContent = getText(gamestyle) ?? null;

	// this.toastBootstrap.show();
     this.showToast();

	this.gamestyle = gamestyle;
	this.btnStartGame.href =  "/pong";

	localStorage.setItem('pongGamestyle', JSON.stringify(this.gamestyle));
	localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));

	updateTextForElem(this.currentGamestyleLabel, this.gamestyle);
	this.showGamestyleConfig();
	this.updatePlayersContainer();
}

selectAIDifficulty(event: Event, difficulty: string): void {
	updateTextForElem(this.toastBody, "chosen-AI");
	//this.toastValue.textContent = getText(difficulty);
	this.toastValue.textContent = getText(difficulty) ?? "";

	// this.toastBootstrap.show();
this.showToast();

	this.aiDifficulty = difficulty;
	localStorage.setItem('pongAIDifficulty', JSON.stringify(this.aiDifficulty));

	this.showGamemodeConfig();
}

changeKeybind(event: Event, key: keyof KeybindSet, btn: HTMLElement): void {
	btn.textContent = "...";
	this.waitForKey = true;
	this.waitingKey = key;
}

/////

keyDownSettings = (event: KeyboardEvent): void => {
	const preventKeys = ["Space", "ArrowUp", "ArrowDown"];
	if (preventKeys.includes(event.code)) {
		event.preventDefault();
	}

	if (this.waitForKey) {
		// Clear any existing assignment
		for (const k in this.keybinds) {
			if (this.keybinds[k as keyof KeybindSet] === event.code) {
				this.keybinds[k as keyof KeybindSet] = "";
			}
		}

		let keyLabel: string;

		switch (this.waitingKey) {
			case "lUp":
			//	keyLabel = getText("lpad-move-up");
			keyLabel = getText("lpad-move-up") ?? "";

				this.keybinds.lUp = event.code;
				break;
			case "lDown":
			//	keyLabel = getText("lpad-move-down");
			keyLabel = getText("lpad-move-down") ?? "";

				this.keybinds.lDown = event.code;
				break;
			case "lMini":
				keyLabel = getText("lpad-minimize") ?? "";
				this.keybinds.lMini = event.code;
				break;
			case "rUp":
				keyLabel = getText("rpad-move-up") ?? "";
				this.keybinds.rUp = event.code;
				break;
			case "rDown":
				keyLabel = getText("rpad-move-down") ?? "";
				this.keybinds.rDown = event.code;
				break;
			case "rMini":
				keyLabel = getText("rpad-minimize") ?? "";
				this.keybinds.rMini = event.code;
				break;

			default:
				return;
		}

		updateTextForElem(this.toastBody, "changed-key");
		this.toastValue.textContent = `${keyLabel} -> ${event.code}`;
		this.waitForKey = false;
		// this.toastBootstrap.show();
		this.showToast();

		localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));
		this.showKeysConfig();
	}
}


applySelectedSetting(
	settingType: string,
	elementMapping: Record<string, HTMLElement>
): void {
	const selectedSetting = localStorage.getItem(settingType)?.replace(/"/g, '');

	Object.keys(elementMapping).forEach((setting) => {
		if (setting === selectedSetting) {
			elementMapping[setting].classList.add("selected");
		} else {
			elementMapping[setting].classList.remove("selected");
		}
	});
}
}

