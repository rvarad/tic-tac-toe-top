"use strict"

let player1NameInput = document.querySelector('#player1NameInput');
let player1SymbolInput = document.querySelector('#player1SymbolInput');
let player1Submit = document.querySelector('#player1Submit');
let player2NameInput = document.querySelector('#player2NameInput');
let player2SymbolInput = document.querySelector('#player2SymbolInput');
let player2Submit = document.querySelector('#player2Submit');
let startGameBtn = document.querySelector('#startGame');
let gameBoard = document.querySelector('.game-board');
let resetButton = document.getElementById('resetButton');
let overlay = document.getElementById('overlay');
let modal = document.querySelector('.modal');

player1Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player1NameInput.value && player1SymbolInput.value) {
		gameControl.players[0] = Player(player1NameInput.value, player1SymbolInput.value);
		displayControl.disableInputs('player1');
		player1Submit.style.visibility = 'hidden';
		displayControl.displayPlayerSymbol(1);
		displayControl.displayOpponents();
	};
})

player2Submit.addEventListener('click', () => {
	event.preventDefault();
	if (player2NameInput.value && player2SymbolInput.value) {
		gameControl.players[1] = Player(player2NameInput.value, player2SymbolInput.value);
		displayControl.disableInputs('player2');
		player2Submit.style.visibility = 'hidden';
		displayControl.displayPlayerSymbol(2);
		displayControl.displayOpponents();
	};
})

startGameBtn.addEventListener('click', () => {
	if (!(gameBoard.innerHTML) && gameControl.players[0] && gameControl.players[1]) {
		boardControl.generateBoard();
		displayControl.displayCurrentPlayer();
		displayControl.highlightCurrentPlayer();
		startGameBtn.style.visibility = 'hidden';
		gameBoard.style.zIndex = '1';
		resetButton.style.visibility = 'visible';
	}
});

gameBoard.addEventListener('click', (e) => {
	if (e.target.classList.contains('empty')) {
		e.target.innerText = boardControl.getSymbol();
		e.target.classList.remove('empty');
		e.target.classList.add('filled');
		e.target.style.color = e.target.innerText === gameControl.players[0].playerSymbol ? 'var(--player1-color)' : 'var(--player2-color)';
		e.target.style.border = e.target.innerText === gameControl.players[0].playerSymbol ? '1.5px dashed var(--player1-color)' : '1.5px dashed var(--player2-color)';
		boardControl.setGameArray(Number(e.target.getAttribute('gameArray-index')));
		if (gameControl.getTurns() > 3) {
			let winner = gameControl.checkWinner().playerName;
			if (winner) {
				console.log(winner + ' wins');
				gameControl.endOfGame(1);
			} else if ((gameControl.getTurns() === 8) && !winner) {
				gameControl.endOfGame(0);
			} else {
				console.log('continue');
			};
		}
		gameControl.setTurns();
		displayControl.displayCurrentPlayer();
		displayControl.highlightCurrentPlayer();
	};
});

resetButton.addEventListener('click', () => { boardControl.resetBoard() })

const Player = (name, symbol) => {
	let playerName = name;
	let playerSymbol = symbol;
	return { playerName, playerSymbol }
};

const displayControl = (() => {
	const disableInputs = (player) => {
		let inputFeilds = document.querySelectorAll(`#${player}Info input`);
		inputFeilds.forEach(feild => {
			feild.disabled = true;
		});
		inputFeilds[1].style.visibility = 'hidden';
	};
	const displayPlayerSymbol = (i) => {
		let symbolFeild = document.getElementById(`player${i}DispSymb`);
		symbolFeild.style.visibility = 'visible';
		symbolFeild.innerText = gameControl.players[i - 1].playerSymbol;
	};
	const displayOpponents = () => {
		let opponents = document.getElementById('opponent')
		if (gameControl.players[0] && gameControl.players[1]) {
			opponents.textContent = `${gameControl.players[0].playerName} vs ${gameControl.players[1].playerName}`;
		} else if (gameControl.players[0]) {
			opponents.textContent = `${gameControl.players[0].playerName} vs ____________`;
		} else if (gameControl.players[1]) {
			opponents.textContent = `____________ vs ${gameControl.players[1].playerName}`;
		} else {
			return;
		};
	};
	const displayCurrentPlayer = () => {
		let turn = document.getElementById('turn');
		let player1Turn = document.getElementById('player1Turn');
		player1Turn.textContent = gameControl.players[0].playerName;
		let player2Turn = document.getElementById('player2Turn');
		player2Turn.textContent = gameControl.players[1].playerName;
		turn.style.visibility = 'visible';
		if (gameControl.currentPlayer() === gameControl.players[0]) {
			player1Turn.style.display = 'inline';
			player2Turn.style.display = 'none';
		} else {
			player2Turn.style.display = 'inline';
			player1Turn.style.display = 'none';
		}
	};
	const highlightCurrentPlayer = () => {
		if (gameControl.currentPlayer() === gameControl.players[0]) {
			document.getElementById('player1Info').style.boxShadow = '0px 0px 10px 10px var(--player1-color)'
			document.getElementById('player2Info').style.boxShadow = '0px 0px 5px 2px var(--highlight-gray)';
		} else {
			document.getElementById('player2Info').style.boxShadow = '0px 0px 10px 10px var(--player2-color)';
			document.getElementById('player1Info').style.boxShadow = '0px 0px 5px 2px var(--highlight-gray)';
		};
	};
	const resetFeilds = () => {
		gameBoard.innerHTML = '';
		gameBoard.style.zIndex = '0';
		document.querySelectorAll('input').forEach(input => {
			input.value = '';
			input.disabled = false;
			input.style.visibility = 'visible';
		})
		document.querySelectorAll('.player-display-symbol').forEach(feild => {
			feild.style.visibility = 'hidden';
		})
		document.querySelectorAll('.submit-player').forEach(button => {
			button.style.visibility = 'visible';
		});
		startGameBtn.style.visibility = 'visible';
		resetButton.style.visibility = 'hidden';
		document.querySelectorAll('.player-info').forEach(feild => {
			feild.style.boxShadow = '0px 0px 5px 2px var(--highlight-gray)';
		});
		gameControl.players = [];
		document.getElementById('opponent').textContent = '';
		document.getElementById('turn').textContent = '';
	};
	const enableModal = (player) => {
		overlay.style.display = 'block';
		modal.style.visibility = 'visible';
		if (player) {
			modal.style.boxShadow = player === gameControl.players[0].playerName ? '0px 0px 10px 10px var(--player1-color)' : '0px 0px 10px 10px var(--player2-color)';
			document.getElementById('winner').textContent = `${player} Wins!`;
		} else {
			modal.style.boxShadow = '0px 0px 10px 5px var(--highlight-gray)';
			document.getElementById('winner').textContent = 'Draw!';
		};
		document.getElementById('replay').addEventListener('click', () => {
			boardControl.resetBoard();
			overlay.style.display = 'none';
			modal.style.visibility = 'hidden';
		});
		document.getElementById('quit').addEventListener('click', () => {
			resetFeilds();
			overlay.style.display = 'none';
			modal.style.visibility = 'hidden';
		})
	};
	return { disableInputs, displayPlayerSymbol, displayOpponents, displayCurrentPlayer, highlightCurrentPlayer, enableModal }
})();

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
		let resetButton = document.createElement('button');
		resetButton.textContent = 'Reset';
		resetButton.setAttribute("id", 'resetButton');
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
			gameControl.setTurns(0);
			displayControl.displayCurrentPlayer();
			displayControl.highlightCurrentPlayer();
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
	const setTurns = (t) => {
		if (t === 0) {
			turns = 0;
		} else {
			turns = turns + 1;
		};
	};
	const currentPlayer = () => {
		return turns % 2 === 0 ? players[0] : players[1]
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
	const endOfGame = (code) => {
		switch (code) {
			case 1:
				displayControl.enableModal(checkWinner().playerName);
				break;
			case 0:
				displayControl.enableModal();

			default:
				break;
		}
	}
	return { players, getTurns, setTurns, currentPlayer, checkWinner, endOfGame }
})();
