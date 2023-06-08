"use strict"
// let turn = "";
let player1;
let player2;

let player1NameInput = document.querySelector('#player1NameInput');
let player1SymbolInput = document.querySelector('#player1SymbolInput');
let player1Submit = document.querySelector('#player1Submit');
let player2NameInput = document.querySelector('#player2NameInput');
let player2SymbolInput = document.querySelector('#player2SymbolInput');
let player2Submit = document.querySelector('#player2Submit');
let startGameBtn = document.querySelector('#startGame');
let gameBoard = document.querySelector('.game-board');

player1Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player1NameInput.value && player1SymbolInput.value) {
		gameControl.players[0] = Player(player1NameInput.value, player1SymbolInput.value);
	}
	player1 = gameControl.players[0];
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

player2Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player2NameInput.value && player2SymbolInput.value) {
		gameControl.players[1] = Player(player2NameInput.value, player2SymbolInput.value);
	}
	player2 = gameControl.players[1];
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

startGameBtn.addEventListener('click', () => {
	if (!(gameBoard.innerHTML)) {
		boardControl.generateBoard();
		startGameBtn.style.display = 'none';
		gameBoard.style.zIndex = '1';
	}
});

gameBoard.addEventListener('click', (e) => {
	if (e.target.classList.contains('empty')) {
		e.target.innerText = boardControl.getSymbol();
		e.target.classList.remove('empty');
		e.target.classList.add('filled');
		boardControl.setGameArray(Number(e.target.getAttribute('gameArray-index')));
		if (gameControl.getTurns() > 3) {
			let winner = gameControl.checkWinner()
			if (winner) {
				console.log(winner + 'wins');
				return;
			} else {
				console.log('continue');
			};
		}
		gameControl.incrementTurns();
	};
});

const Player = (name, symbol) => {
	let playerName = name;
	let playerSymbol = symbol;
	return { playerName, playerSymbol }
};

const boardControl = (() => {
	let gameArray = ["", "", "", "", "", "", "", "", ""];
	const generateBoard = () => {
		gameBoard.style.display = 'grid';
		gameBoard.style.gridTemplateRows = 'repeat(3, 1fr)';
		gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
		for (let i = 1; i <= 9; i++) {
			let boardCell = document.createElement('div');
			gameBoard.appendChild(boardCell);
			boardCell.classList.add('board-cell');
			boardCell.classList.add('empty');
			boardCell.setAttribute("gameArray-index", `${i - 1}`);
		};
	};
	const getSymbol = () => {
		return gameControl.currentPlayer().playerSymbol;
	}
	const setGameArray = (index) => {
		gameArray[index] = String((document.querySelectorAll('.board-cell'))[index].textContent);
	};
	const getGameArray = () => {
		return gameArray;
	};
	const resetBoard = () => {
		document.querySelectorAll('.board-cell').forEach((cell) => {
			cell.textContent = "";
			cell.classList.add('empty');
			cell.classList.remove('filled');
			turns = 0;
		})
		for (let i = 0; i < gameArray.length; i++) {
			setGameArray(i);
		};
	}
	return { generateBoard, getSymbol, setGameArray, getGameArray, resetBoard }
})();

const gameControl = (() => {
	let turns = 0;
	let players = [];
	const winningSetArray = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	const getTurns = () => {
		return turns;
	}
	const incrementTurns = () => {
		turns = turns + 1;
	};
	const currentPlayer = () => {
		return turns % 2 === 0 ? player1 : player2
	}
	const checkWinner = () => {
		let outcome = (winningSetArray.some((combination) => {
			return (combination.every((index) => {
				return (boardControl.getGameArray()[index] === currentPlayer().playerSymbol);
			}));
		}));
		if (outcome) {
			return (currentPlayer());
		} else {
			return false;
		};
	}
	return { players, getTurns, incrementTurns, currentPlayer, checkWinner }
})();
