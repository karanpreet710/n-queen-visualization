document.addEventListener("DOMContentLoaded", () => {
  let boardSize = 4; // Change this value to adjust the board size
  let width = 20;
  let height = 25;
  let cnt=0;
  const downloadButton = document.getElementById("downloadButton");
  const noSol = document.getElementById("noSol");
  downloadButton.addEventListener("click", () => {
    html2canvas(document.querySelector(".solution-container")).then((canvas) => {
      const link = document.createElement("a");
      link.download = "n-queen-solutions.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
  renderBoard(Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    ),width,height);
  let animationSpeed = 2000;
  function delay() {
      return new Promise((resolve) => setTimeout(resolve, animationSpeed));
    }

    function createLine(x1, y1, x2, y2) {
      const lineContainer = document.getElementById("lineContainer");
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "red");
      line.setAttribute("stroke-width", "4");
      lineContainer.appendChild(line);
      const cross1Part1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cross1Part1.setAttribute("x1", x1 - 10);
      cross1Part1.setAttribute("y1", y1 - 10);
      cross1Part1.setAttribute("x2", x1 + 10);
      cross1Part1.setAttribute("y2", y1 + 10);
      cross1Part1.setAttribute("stroke", "red");
      cross1Part1.setAttribute("stroke-width", "4");
      lineContainer.appendChild(cross1Part1);

      const cross1Part2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cross1Part2.setAttribute("x1", x1 + 10);
      cross1Part2.setAttribute("y1", y1 - 10);
      cross1Part2.setAttribute("x2", x1 - 10);
      cross1Part2.setAttribute("y2", y1 + 10);
      cross1Part2.setAttribute("stroke", "red");
      cross1Part2.setAttribute("stroke-width", "4");
      lineContainer.appendChild(cross1Part2);

      const cross2Part1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cross2Part1.setAttribute("x1", x2 - 10);
      cross2Part1.setAttribute("y1", y2 - 10);
      cross2Part1.setAttribute("x2", x2 + 10);
      cross2Part1.setAttribute("y2", y2 + 10);
      cross2Part1.setAttribute("stroke", "red");
      cross2Part1.setAttribute("stroke-width", "4");
      lineContainer.appendChild(cross2Part1);

      const cross2Part2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cross2Part2.setAttribute("x1", x2 + 10);
      cross2Part2.setAttribute("y1", y2 - 10);
      cross2Part2.setAttribute("x2", x2 - 10);
      cross2Part2.setAttribute("y2", y2 + 10);
      cross2Part2.setAttribute("stroke", "red");
      cross2Part2.setAttribute("stroke-width", "4");
      lineContainer.appendChild(cross2Part2);
    }

    function removeLines() {
      const lineContainer = document.getElementById("lineContainer");
      while (lineContainer.firstChild) {
        lineContainer.removeChild(lineContainer.firstChild);
      }
    }
  // Function to solve N-Queen problem using backtracking
  async function solveNQueen() {
    let board = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    );

    function isSafe(row, col) {
      // Check if there is a queen in the same column
      const conflictingQueens = [];
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) {
          conflictingQueens.push([i, col]);
          return conflictingQueens;
        }
      }

      // Check if there is a queen in the upper-left diagonal
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) {
          conflictingQueens.push([i, j]);
          return conflictingQueens;
        }
      }

      // Check if there is a queen in the upper-right diagonal
      for (let i = row, j = col; i >= 0 && j < boardSize; i--, j++) {
        if (board[i][j] === 1) {
          conflictingQueens.push([i, j]);
          return conflictingQueens;
        }
      }

      return conflictingQueens;
    }

    const solutionContainer = document.querySelector(".solution-container");
    solutionContainer.innerHTML="";
    async function solve(row) {
      if (row === boardSize) {
        cnt++;
        const solution = Array.from({ length: boardSize }, () =>
          Array.from({ length: boardSize }, () => 0)
        );
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            solution[i][j] = board[i][j];
          }
        }
        const boardContainer = renderSolution(solution,width,height);
        solutionContainer.appendChild(boardContainer);
        return;
      }

      for (let col = 0; col < boardSize; col++) {
        const arr = isSafe(row,col);
        if (arr.length===0) {
          board[row][col] = 1;
          renderBoard(board,width,height);
          await delay();
          await solve(row + 1);
          board[row][col] = 0;
          renderBoard(board,width,height);
          await delay();
        }
        else
        {
          board[row][col]=1;
          renderBoard(board,width,height);
          const currentCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
          const currentCellRect = currentCell.getBoundingClientRect();
          const conflictingRow=arr[0][0];
          const conflictingCol=arr[0][1];
          const conflictingCell = document.querySelector(`[data-row="${conflictingRow}"][data-col="${conflictingCol}"]`);
          const conflictingCellRect = conflictingCell.getBoundingClientRect();
          const x1 = currentCellRect.left + currentCellRect.width / 2 + window.scrollX;
          const y1 = currentCellRect.top + currentCellRect.height / 2 + window.scrollY;
          const x2 = conflictingCellRect.left + conflictingCellRect.width / 2 + window.scrollX;
          const y2 = conflictingCellRect.top + conflictingCellRect.height / 2 + window.scrollY;
          createLine(x1, y1, x2, y2);
          await delay();
          removeLines();
          board[row][col] = 0;
          renderBoard(board,width,height);
          await delay();
        }
      }
    }
    await solve(0);
    if(cnt===0){
      noSol.removeAttribute("hidden");
    }
    else
    {
      downloadButton.removeAttribute("hidden");
    }
    cnt=0;
    startAnim.disabled = false;
    nvalue.disabled = false;
  }

  // Function to render the board with queens
  function renderBoard(board,width,height) {
    const boardContainer = document.querySelector(".board");
    boardContainer.innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
      let cnt=0;
      if(row%2!==0){
        cnt++;
      }
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        if(row===0){
          cell.classList.add("top");
        }
        if(row===boardSize-1){
          cell.classList.add("bottom");
        }
        if(col===0){
          cell.classList.add("left");
        }
        if(col===boardSize-1){
          cell.classList.add("right");
        }
        if(cnt%2===0){
          cell.classList.add("white");
        }
        else{
          cell.classList.add("black");
        }
        cell.style.width = `${width}%`; // Set the cell width dynamically
        cell.style.height = `${height}%`
        if (board[row][col] === 1) {
          const queenImage = document.createElement("img");
          queenImage.src = "queen-image.png"; // Replace with the actual path to the image file
          queenImage.alt = "Queen";
          queenImage.style.width = `${width*5}px`;
          queenImage.style.height = `${height*4}px`;
          queenImage.classList.add('queen');
          cell.appendChild(queenImage);
        }
        boardContainer.appendChild(cell);
        cnt++;
      }
    }
  }

  function renderSolution(board,width,height) {
    const boardContainer = document.createElement("div");
    boardContainer.innerHTML = "";
    boardContainer.classList.add("board");
    for (let row = 0; row < boardSize; row++) {
      let cnt=0;
      if(row%2!==0){
        cnt++;
      }
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        if(row===0){
          cell.classList.add("top");
        }
        if(row===boardSize-1){
          cell.classList.add("bottom");
        }
        if(col===0){
          cell.classList.add("left");
        }
        if(col===boardSize-1){
          cell.classList.add("right");
        }
        if(cnt%2===0){
          cell.classList.add("white");
        }
        else{
          cell.classList.add("black");
        }
        cell.style.width = `${width}%`; // Set the cell width dynamically
        cell.style.height = `${height}%`
        if (board[row][col] === 1) {
          const queenImage = document.createElement("img");
          queenImage.src = "queen-image.png"; // Replace with the actual path to the image file
          queenImage.alt = "Queen";
          queenImage.style.width = `${width*5}px`;
          queenImage.style.height = `${height*4}px`;
          queenImage.classList.add('queen');
          cell.appendChild(queenImage);
        }
        boardContainer.appendChild(cell);
        cnt++;
      }
    }
    return boardContainer;
  }

  const speedSlider = document.getElementById("speedSlider");
  const allRanges = document.querySelectorAll(".range-wrap");
  allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });

  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }
  speedSlider.addEventListener("input", function() {
    animationSpeed = this.value;
  });
  const startAnim = document.getElementById("startAnim");
  const nvalue = document.getElementById("nvalue");
  nvalue.onchange = function(){
    downloadButton.setAttribute("hidden","");
    noSol.setAttribute("hidden","");
    boardSize=parseInt(nvalue.value);
    let board = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    );
    let step = boardSize-4;
    width=20-step*2;
    height=25-step*3;
    if(boardSize===9){
      height=12;
    }
    else if(boardSize===10){
      height=12;
      width=9;
    }
    else if(boardSize===3){
      height=33;
      width=30;
    }
    else if(boardSize===2){
      height=50;
      width=35;
    }
    else if(boardSize===1){
      height=90;
      width=60;
    }
    renderBoard(board,width,height);
  }
  startAnim.onclick = function(){
    startAnim.disabled = true;
    nvalue.disabled = true;
    downloadButton.setAttribute("hidden","");
    noSol.setAttribute("hidden","");
    solveNQueen();
  }
});