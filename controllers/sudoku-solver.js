class SudokuSolver {
  // The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.
  validate(puzzleString) {
    if (puzzleString.length != 81)
      return "Expected puzzle to be 81 characters long";
    if (/^[0-9\.]+$/.test(puzzleString) === false)
      return "Invalid characters in puzzle";
    return true;
  }

  validateCoordinateAndValue(coordinate, value) {
    if (/^[A-I][1-9]$/.test(coordinate) === false) return "Invalid coordinate";
    if (/[^1-9]/.test(value)) return "Invalid value";
    return true;
  }

  // The check functions should be validating against the current state of the board.
  checkRowPlacement(puzzleArr, row, col, value) {
    if (puzzleArr[row].indexOf(value) == -1) return true;
    else return false;
  }

  // The check functions should be validating against the current state of the board.
  checkColPlacement(puzzleArr, row, col, value) {
    for (let r = 0; r < 9; r++) {
      if (puzzleArr[r][col] == value) return false;
    }
    return true;
  }

  // The check functions should be validating against the current state of the board.
  checkRegionPlacement(puzzleArr, row, col, value) {
    let boxTopRow = parseInt(row / 3) * 3; // Returns index of top row of box (0, 3, or 6)
    let boxLeftColumn = parseInt(col / 3) * 3; // Returns index of left column of box (0, 3 or 6)
    for (let r = boxTopRow; r < boxTopRow + 3; r++) {
      for (let c = boxLeftColumn; c < boxLeftColumn + 3; c++) {
        if (puzzleArr[r][c] == value) return false;
      }
    }
    return true;
  }

  // The solve function should handle solving any given valid puzzle string
  solve(puzzleArr) {
    // Get the row and column of the next empty position
    const [row, col] = this.nextEmptyPosition(puzzleArr);

    // If there are no more empty positions, we successfully filled out the whole sudoku
    if (row === -1 && col === -1) {
      return puzzleArr.flat().join("");
    }

    // Let's try to place every possible digit to the current empty position
    for (let i = 1; i <= 9; i++) {
      i = i.toString();
      console.log("Trying to fill [" + row + "," + col + "] with value " + i);

      // If this digit fulfills the sudoku conditions, we place it on the current position
      if (this.checkAllPlacement(puzzleArr, row, col, i)) {
        puzzleArr[row][col] = i;

        // However, we have to check, whether the rest of the empty positions can be solved having this digit here
        let deeperResult = this.solve(puzzleArr);
        if (deeperResult !== false) return deeperResult;
        else puzzleArr[row][col] = ".";
      }
    }

    // We couldn't find a solution for this combination of digits, so we will go one step back
    return false;
  }

  // Function to generate puzzle Array from puzzle String
  createPuzzleArr(puzzleString) {
    if (this.validate(puzzleString) === true) {
      let puzzleArr = [[], [], [], [], [], [], [], [], []];
      let currentRow = -1;
      const numberArr = puzzleString.split("");
      for (let i = 0; i < numberArr.length; i++) {
        if (i % 9 === 0) {
          currentRow += 1;
        }
        puzzleArr[currentRow].push(numberArr[i]);
      }
      return puzzleArr;
    }
  }

  // Function to find next empty position in the puzzle
  nextEmptyPosition(puzzleArr) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzleArr[r][c] == ".") return [r, c];
      }
    }
    return [-1, -1];
  }

  // Aggregate function for checking row, column, and region validity
  checkAllPlacement(puzzleArr, row, col, value) {
    if (
      this.checkRowPlacement(puzzleArr, row, col, value) &&
      this.checkColPlacement(puzzleArr, row, col, value) &&
      this.checkRegionPlacement(puzzleArr, row, col, value)
    ) {
      return true;
    }
    return false;
  }
}

module.exports = SudokuSolver;
