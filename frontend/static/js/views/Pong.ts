import AbstractView from "./AbstractView.js";
import { PongGame, eventListeners }  from "../scripts/pong/pong.js";
 import { initCursorClickEffect } from "../visual/effects.js";

export default class Pong extends AbstractView {
private pongGame!: PongGame; 

  constructor() {
    super();
    this.setTitle("Pong Game");
  }

 async getHtml(): Promise<string> {
  return `
   <!-- Main Pong Game Interface -->
<div class="min-h-screen flex items-center justify-center pong-page">
  
  <!-- Toast Notification -->
 <div class="fixed top-5 right-5 bg-gray-800 text-white p-3 rounded-lg hidden" id="liveToast">
  <p id="toastBody" class="text-white text-center"></p>
  <button 
    type="button" 
    class="text-white ml-4 hover:bg-gray-600 rounded px-2" 
    aria-label="Close"
    onclick="document.getElementById('liveToast').classList.add('hidden')">
    ✖️
  </button>
</div>

  <!-- Pause Modal -->
  <div id="pauseModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-5 rounded-lg">
      <h2 class="text-2xl text-center mb-4" style="color: #222;">Game Paused</h2>
      <p class="text-center" style="color: #222;">Press escape to continue</p>
    </div>
  </div>

  <!-- End Game Modal -->
  <div id="endgameModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-5 rounded-lg">
      <h2 class="text-2xl text-center mb-4" id="endgameModalWinner">Winner: </h2>
      <p class="text-center" id="endgameModalScore">Score: </p>
      <p class="text-center" id="endgameModalTime">Time: </p>
      <button id="playAgainButton" class="bg-indigo-600 text-white py-2 px-4 mt-3 rounded-lg hover:bg-indigo-700">
        Play Again
      </button>
    </div>
  </div>

  <!-- Pong Game Container -->
  <div class="flex flex-col items-center pong-interface-container">

    <!-- Title and Info -->
    <div class="text-center mb-4">
      <p class="text-white text-4xl" animated-letters data-translate="pong">pong</p>
      <hr class="border-white w-[400px] my-4">
      <div class="flex justify-between text-white mb-3">
        <div class="flex items-center">
          <img src="/static/assets/UI/icons/score.svg" width="32px" class="mr-3" />
          <p id="objectiveLabel" class="text-3xl">00</p>
        </div>
        <div class="flex items-center">
          <img src="/static/assets/UI/icons/time.svg" width="32px" class="mr-3" />
          <p id="timer" class="text-3xl">00:00</p>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div class="w-full flex flex-col items-center mb-3" id="gameContainer">
      <canvas class="squarer-glass border border-white" id="canvas" width="800" height="400"></canvas>
      <button id="btnStart" class="bg-indigo-600 text-white py-2 px-4 mt-3 rounded-lg hover:bg-indigo-700" data-translate="start-game">
        Start Game
      </button>
    </div>

    <!-- Player Boxes -->
    <div class="grid grid-cols-2 gap-5 text-white pong-player-box-container">
      <!-- Left Player -->
      <div class="flex flex-col items-center justify-end p-3 bg-gray-800 rounded-lg pong-player-box">
        <p class="text-2xl" id="leftScore">0</p>
        <div id="colorBoxLeft" class="border border-white mb-3 w-24 h-5"></div>
        <p class="text-lg" id="pMinimize1" data-translate="minimize"></p>
        <p class="text-md" id="lMinimizeCD" data-translate="ready"></p>
        <p class="text-2xl mt-1" id="leftPaddleName">Player 1</p>
      </div>

      <!-- Right Player -->
      <div class="flex flex-col items-center justify-start p-3 bg-gray-800 rounded-lg pong-player-box">
        <p class="text-2xl" id="rightScore">0</p>
        <div id="colorBoxRight" class="border border-white mb-3 w-24 h-5"></div>
        <p class="text-lg" id="pMinimize2" data-translate="minimize"></p>
        <p class="text-md" id="rMinimizeCD" data-translate="ready"></p>
        <p class="text-2xl mt-1" id="rightPaddleName">Player 2</p>
      </div>
    </div>

    <!-- Navigation Button -->
    <div class="flex justify-center mt-5">
      <a 
        role="button" 
        class="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center" 
        href="/pongMenu" 
        data-link>
        <img src="static/assets/UI/icons/left_arrow.svg" alt="return button" id="left-arrow">
      </a>
    </div>
  </div>
</div>

<!-- Mobile Not Available Message -->
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white games-page-mobile hidden">
  <div class="p-5 glass">
    <p class="text-center" data-translate="games-not-available-mobile">
      Games are not available on mobile.
    </p>
  </div>
  <div class="flex justify-center mt-5">
    <a 
      role="button" 
      class="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center" 
      href="/" 
      data-link>
      <img src="static/assets/UI/icons/left_arrow.svg" alt="return button" id="left-arrow">
    </a>
  </div>
<!-- Tournament Modal -->
<div id="tournamentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
  <div class="bg-gray-800 p-5 rounded-lg text-white max-w-sm w-full">
    <h2 class="text-2xl mb-3" id="playersTournament">Tournament Match</h2>
    <p id="matchTournament" class="mb-3">Match: 1</p>
<button class="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700" id="closeTournament">
  Close
</button>


  </div>
</div>

<!-- Match End Modal -->
<!-- Add this somewhere inside your HTML, like under the endgameModal -->
<p id="matchEndLabel" class="text-xl text-center hidden">You won the game!</p>

<div id="tournamentMatchEndModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
  <div class="bg-gray-800 p-5 rounded-lg text-white max-w-sm w-full">
    <h2 class="text-2xl mb-3" id="matchWinner">Winner: Player 1</h2>
    <p id="matchId" class="mb-2">Match ID: 1</p>
    <p id="matchTimeElapsed" class="mb-3">Time Elapsed: 00:00</p>
  <button class="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700" id="closeTournament">
  Close
</button>

  </div>
</div>


    `;
  }
loadJS() {
  // Initialize the Pong game
  this.pongGame = new PongGame();

  //cursor click effect added
    setTimeout(() => {
    initCursorClickEffect();
  }, 200);
  
  // Wait for DOM content to be fully loaded
  setTimeout(() => {
    console.log("Attaching event listeners...");

    // Type-safe casting
    const closeTournamentButton = document.getElementById('closeTournament') as HTMLButtonElement;
    // const closeMatchEndButton = document.getElementById('closeMatchEndModal') as HTMLButtonElement;
    const closeMatchEndButton = document.querySelector('#tournamentMatchEndModal button') as HTMLButtonElement;

    // const nextMatchButton = document.getElementById('nextMatchButton') as HTMLButtonElement;
    const playAgainButton = document.getElementById('playAgainButton') as HTMLButtonElement;

    // Attach listeners safely
    if (closeTournamentButton) {
      closeTournamentButton.addEventListener('click', () => {
        console.log("Closing Tournament Modal");
        this.pongGame.tournament?.closeTournamentModal();
        document.getElementById('tournamentModal')?.classList.add('hidden');
      });
    } else {
      console.warn("closeTournamentButton not found in the DOM.");
    }

   if (closeMatchEndButton) {
  closeMatchEndButton.addEventListener('click', () => {
    console.log("Closing Match End Modal");
    this.pongGame.tournament?.closeMatchEndModal();
    document.getElementById('tournamentMatchEndModal')?.classList.add('hidden');
  });
} else {
  console.warn("Close button not found inside Match End Modal.");
}


    // if (nextMatchButton) {
    //   nextMatchButton.addEventListener('click', () => {
    //     console.log("Starting next tournament match");
    //     this.pongGame.initTournamentMatch();
    //     document.getElementById('endgameModal')?.classList.add('hidden');
    //   });
    // } else {
    //   console.warn("nextMatchButton not found in the DOM.");
    // }

    if (playAgainButton) {
      playAgainButton.addEventListener('click', () => {
        console.log("Restarting the game");
        this.pongGame.resetGame();
        document.getElementById('endgameModal')?.classList.add('hidden');
      });
    } else {
      console.warn("playAgainButton not found in the DOM.");
    }

  }, 200); // Delay to make sure buttons are in the DOM
}


stopJS(){
		this.pongGame.stopGameLoop();
	}

}
