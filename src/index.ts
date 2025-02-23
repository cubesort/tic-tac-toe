// import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Cell = "X" | "O" | ""
type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
]
type Winner = Cell | "DRAW"

let boardState: Board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let currentMove: "X" | "O" = "X";
let winner: Winner;

function createCell(row: number, col: number, content: Cell = "") {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");

  cell.addEventListener("click", () => {
    if (winner) {
      return;
    }

    if (boardState[row][col] === "") {
      boardState[row][col] = currentMove
      currentMove = currentMove === "X" ? "O" : "X"

      winner = checkWinner()
      renderBoard()
    }
  })

  return cell;
}

function checkWinner(): Winner {
  // Check rows
  for (let i = 0; i < ROW_COUNT; i++) {
    const cells: Cell[] = []
    for (let j = 0; j < COL_COUNT; j++) {
      cells.push(boardState[i][j])
    }
    if (checkWinning(cells)) {
      return cells[0]
    }
  }

  // Check columns
  for (let j = 0; j < COL_COUNT; j++) {
    const cells: Cell[] = []
    for (let i = 0; i < ROW_COUNT; i++) {
      cells.push(boardState[i][j])
    }
    if (checkWinning(cells)) {
      return cells[0]
    }
  }

  // Check diagonal
  let cells: Cell[] = []
  for (let i = 0; i < ROW_COUNT; i++) {
    cells.push(boardState[i][i])
  }

  if (checkWinning(cells)) {
    return cells[0]
  }

  cells = []
  for (let j = 0; j < COL_COUNT; j++) {
    cells.push(boardState[ROW_COUNT - j - 1][j])
  }

  if (checkWinning(cells)) {
    return cells[0]
  }

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      if (boardState[i][j] === "") {
        return ""
      }
    }
  }

  return "DRAW"
}

function checkWinning(cells: Cell[]): boolean {
  return cells[0] !== "" && cells.every(cell => cell === cells[0])
}

function renderBoard() {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = winner ? `Winner: ${winner}` : `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    currentMove = "X";
    winner = "";
    renderBoard();
  });
  renderBoard();
}

init();
