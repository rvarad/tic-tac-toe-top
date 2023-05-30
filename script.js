const DEFAULTTURN = "xPlayer";
let turn = "";
let player1;
let player2;

let player1NameInput = document.querySelector('#player1NameInput');
let player1SymbolInput = document.querySelector('#player1SymbolInput');
let player1Submit = document.querySelector('#player1Submit');

player1Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player1NameInput.value && player1SymbolInput.value) {		
		game.players[0] = player(player1NameInput.value, player1SymbolInput.value);
	}
	player1 = game.players[0];
	if (player1 && player2) {
		startGameBtn.style.display = 'inline-block';
		player1NameInput.disabled = true;
		player1SymbolInput.disabled = true;
		player2NameInput.disabled = true;
		player2SymbolInput.disabled = true;
		player1Submit.style.display = 'none';
		player2Submit.style.display = 'none';
	}
})
let player2NameInput = document.querySelector('#player2NameInput');
let player2SymbolInput = document.querySelector('#player2SymbolInput');
let player2Submit = document.querySelector('#player2Submit');

player2Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player2NameInput.value && player2SymbolInput.value) {
		game.players[1] = player(player2NameInput.value, player2SymbolInput.value);
	}
	player2 = game.players[1];
	if (player1 && player2) {
		startGameBtn.style.display = 'inline-block';
		player1NameInput.disabled = true;
		player1SymbolInput.disabled = true;
		player2NameInput.disabled = true;
		player2SymbolInput.disabled = true;
		player1Submit.style.display = 'none';
		player2Submit.style.display = 'none';
	}
})

let startGameBtn = document.querySelector('#startGame');

startGameBtn.addEventListener('click', () => {
	if (!(gameBoard.innerHTML)) {
		game.generateBoard();
		game.turns = 0;
		game.gameArray = ["", "", "",
						  "", "", "",
						  "", "", ""];
		startGameBtn.style.display = 'none';
		gameBoard.style.zIndex = '1';
	}
});

let gameBoard = document.querySelector('.game-board');

const game = (() => {
	const generateBoard = function () {
		gameBoard.style.display = 'grid';
		gameBoard.style.gridTemplateRows = 'repeat(3, 1fr)';
		gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
		for (let i = 1; i <= 9; i++) {
			let boardCell = document.createElement('div');
			gameBoard.appendChild(boardCell);
			boardCell.classList.add('board-cell');
			boardCell.classList.add('empty');
			boardCell.setAttribute("id", `c${i}`);
			boardCell.setAttribute("gameArray-index", `${i - 1}`);
		}
	}
	let turns;
	let gameArray;
	let players = [];
	let winningSetArray = [[0, 1, 2], [3, 4, 5],
						   [6, 7, 8], [0, 3, 6],
						   [1, 4, 7], [2, 5, 8],
						   [0, 4, 8], [2, 4, 6]];
	const checkWinner = function (player) {
		return (winningSetArray.some((combination) => {
			return (combination.every((index) => {
				return (game.gameArray[index] === player.playerSymbol);
			}))
		}));
	}
	return { generateBoard, turns, gameArray , players, checkWinner};
})();

function player(name, symbol) {
	let playerName = name;
	let playerSymbol = symbol;
	let playerArray = [];
	return { playerName, playerSymbol, playerArray }
}


const addSymbol = () => {
	let playerTurn = checkTurn();
	if (playerTurn === 'player1') {
		// console.log(playerTurn);
		return player1.playerSymbol;
	} else if (playerTurn === 'player2') {
		// console.log(playerTurn);
		return player2.playerSymbol;
	}
}

gameBoard.addEventListener('click', (e) => {
	if (e.target.classList.contains('empty')) {
		e.target.innerText = addSymbol();
		e.target.classList.remove('empty');
		e.target.classList.add('filled');
		game.gameArray[Number(e.target.getAttribute('gameArray-index'))] = e.target.innerText;
		game.turns++;
		player1.playerArray = game.gameArray.map((e,i) => e === player1.playerSymbol ? i : '').filter(String);
		player2.playerArray = game.gameArray.map((e,i) => e === player2.playerSymbol ? i : '').filter(String);
	}
	if (game.turns > 4) {
		if (game.checkWinner(player1)) {
			console.log('player 1 wins');
			return;
		} else if (game.checkWinner(player2)) {
			console.log('player 2 wins');
			return;
		} else {
			console.log('continue')
		}
	}
});

function checkTurn() {
	if (game.turns % 2 === 0) {
		return ('player1');
	} else {
		return ('player2');
	}
};

// function checkWinner () {
	// player1.getPlayerArray() = [];
	// player2.getPlayerArray() = [];
// }
