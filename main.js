// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій розсуд
// 3. Додати функцію рандому, котра буде видавати випадкову фігуру
// 4. Центрування фігури, коли вона з'являється
// 5. Додати функцію рандомних кольорів для кожної нової фігури

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
	'I',
	'O',
	'L',
	'J',
	'S',
	'Z',
	'T',
	'D'
];

const TETROMINOES = {
	'I': [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'O': [
		[1, 1],
		[1, 1]
	],
	'L': [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'J': [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'S': [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'Z': [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'T': [
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'D': [
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0]
	]
};

let playField;
let tetromino;

function convertPositionToIndex(row, column) {
	return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayfield() {
	for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
		const div = document.createElement('div');
		document.querySelector('.tetris').append(div);
	}

	playField = new Array(PLAYFIELD_ROWS).fill(0)
		.map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}


function generateTetromino() {
	const indexTetro = Math.floor(Math.random() * TETROMINO_NAMES.length);
	const nameTetro = TETROMINO_NAMES[indexTetro];
	const matrixTetro = TETROMINOES[nameTetro];
	const colorTetro = getRandomColor();

	const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);
	const rowTetro = 1;

	tetromino = {
		name: nameTetro,
		matrix: matrixTetro,
		row: rowTetro,
		column: columnTetro,
		color: colorTetro
	}
}

generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll('.tetris div');


function drawPlayField() {
	for (let row = 0; row < PLAYFIELD_ROWS; row++) {
		for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
			//if(!playField[row][column]){continue};
			const name = playField[row][column];
			const cellIndex = convertPositionToIndex(row, column);
			cells[cellIndex].classList.add(name);
		}
	}
}

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function drawTetromino() {
	const name = tetromino.name;
	const tetrominoMatrixSize = tetromino.matrix.length;

	for (let row = 0; row < tetrominoMatrixSize; row++) {
		for (let column = 0; column < tetrominoMatrixSize; column++) {
			if (!tetromino.matrix[row][column]) { continue; };
			const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
			cells[cellIndex].style.backgroundColor = tetromino.color;
			cells[cellIndex].classList.add(name);
		}
	}
}

drawTetromino();

function draw() {
	cells.forEach(function (cell) { cell.removeAttribute('class'); cell.removeAttribute('style') });
	drawPlayField();
	drawTetromino();
}
document.addEventListener('keydown', onKeyDown)

function onKeyDown(event) {
	switch (event.key) {
		case 'ArrowDown':
			moveTetrominoDown();
			break;
		case 'ArrowLeft':
			moveTetrominoLeft();
			break;
		case 'ArrowRight':
			moveTetrominoRight();
			break;
		case 'ArrowUp':
			rotateTetromino();
	}
	draw();
}

function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
	}
}

function moveTetrominoLeft() {
	tetromino.column -= 1;
	if (isValid()) {
		tetromino.column += 1;
	}
}

function moveTetrominoRight() {
	tetromino.column += 1;
	if (isValid()) {
		tetromino.column -= 1;
	}
}

function isValid() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (!tetromino.matrix[row][column]) { continue; }
			//if(tetromino.matrix[row][column] == 0) {continue;}
			if (isOutsideOfGameBoard(row, column)) { return true; }
			if (hasCollisions(row, column)) { return true; }
		}
	}
}

function isOutsideOfGameBoard(row, column) {
	return tetromino.column + column < 0 ||
		tetromino.column + column >= PLAYFIELD_COLUMNS ||
		tetromino.row + row >= playField.length;
}

function hasCollisions(row, column) {
	return playField[tetromino.row + row][tetromino.column + column];
}
function placeTetromino() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (!tetromino.matrix[row][column]) { continue; }

			playField[tetromino.row + row][tetromino.column + column] = tetromino.name;
		}
	}
	const filledRows = findFilledRows();
	removeFillRows(filledRows);
	generateTetromino();
}

function removeFillRows(filledRows) {
	filledRows.forEach(row => {
		dropRowsAbove(row);
	})
}

function dropRowsAbove(rowDelete) {
	for (let row = rowDelete; row > 0; row--) {
		playField[row] = playField[row - 1];
	}
	playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
	const filledRows = [];
	for (let row = 0; row < PLAYFIELD_ROWS; row++) {
		let filledColumns = 0;
		for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
			if (playField[row][column] != 0) {
				filledColumns++;
			}
		}
		if (PLAYFIELD_COLUMNS == filledColumns) {
			filledRows.push(row);
		}
	}
	return filledRows;
}

function rotateTetromino() {
	const oldMatrix = tetromino.matrix;
	const rotatedMatrix = rotateMatrix(tetromino.matrix);
	tetromino.matrix = rotatedMatrix;
	if (isValid()) {
		tetromino.matrix = oldMatrix;
	}
}

function rotateMatrix(matrixTetromino) {
	const N = matrixTetromino.length;
	const rotateMatrix = [];
	for (let i = 0; i < N; i++) {
		rotateMatrix[i] = [];
		for (let j = 0; j < N; j++) {
			rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
		}
	}
	return rotateMatrix;
}