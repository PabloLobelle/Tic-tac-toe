import "./App.css";
import { useState } from "react";
import confetti from "canvas-confetti";

const TURNS = {
	X: "✕",
	O: "𐤏",
};

// eslint-disable-next-line react/prop-types
const Square = ({ children, isSelected, updateBoard, index }) => {
	const className = `square ${isSelected ? "is-selected" : ""}`;
	const handleClick = () => {
		updateBoard(index);
	};
	return (
		<div onClick={handleClick} className={className}>
			{children}
		</div>
	);
};

const WINNER_COMBOS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function App() {
	const [player, setPlayer] = useState(() => {
		const playerFromStorage = window.localStorage.getItem("player");
		return playerFromStorage ? JSON.parse(playerFromStorage) : [0, 0];
	});
	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem("board");

		return boardFromStorage
			? JSON.parse(boardFromStorage)
			: Array(9).fill(null);
	});

	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem("turn");
		return turnFromStorage ?? TURNS.X;
	});

	const [winner, setWinner] = useState(null);

	const checkWinner = (boardToCheck) => {
		for (const combo of WINNER_COMBOS) {
			const [a, b, c] = combo;
			if (
				boardToCheck[a] &&
				boardToCheck[a] === boardToCheck[b] &&
				boardToCheck[a] === boardToCheck[c]
			) {
				return boardToCheck[a];
			}
		}
		return null;
	};

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);
		window.localStorage.removeItem("board");
		window.localStorage.removeItem("turn");
	};

	const resetCount = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);
		setPlayer(Array(2).fill(0));
		window.localStorage.removeItem("board");
		window.localStorage.removeItem("turn");
		window.localStorage.removeItem("player");
	};

	const checkEndGame = (newBoard) => {
		return newBoard.every((square) => square !== null);
	};

	const updateBoard = (index) => {
		if (board[index] || winner) return;
		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);

		const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
		setTurn(newTurn);

		window.localStorage.setItem("board", JSON.stringify(newBoard));
		window.localStorage.setItem("turn", newTurn);

		const newWinner = checkWinner(newBoard);
		if (newWinner) {
			confetti();
			setWinner(newWinner);
			if (newWinner === TURNS.X) {
				player[0]++;
			} else {
				player[1]++;
			}
			const newPlayer = player;
			setPlayer(newPlayer);
			window.localStorage.setItem("player", JSON.stringify(newPlayer));
		} else if (checkEndGame(newBoard)) {
			setWinner(false);
		}
	};

	return (
		<main className="board">
			<h1>Tic tac toe</h1>

			<button onClick={resetCount}>Empezar de nuevo</button>
			<section className="game">
				{board.map((_, index) => {
					return (
						<Square key={index} index={index} updateBoard={updateBoard}>
							{board[index]}
						</Square>
					);
				})}
			</section>
			<section className="turn">
				<Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
				<Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
			</section>
			<div className="marcador">
				<h2>Jugador 1: {player[0]}</h2>
				<h2>Jugador 2: {player[1]}</h2>
			</div>

			{winner !== null && (
				<section className="winner">
					<div className="text">
						<h2>{winner === false ? "empate" : "gano:"}</h2>
						<header className="win">
							{winner && <Square>{winner}</Square>}
						</header>
						<footer>
							<button onClick={resetGame}>¿Otra partida?</button>
						</footer>
					</div>
				</section>
			)}
		</main>
	);
}

export default App;
