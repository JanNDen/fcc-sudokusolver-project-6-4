const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

suite("UnitTests", () => {
  suiteSetup((done) => {
    solver = new Solver();
    done();
  });

  suite("Function validate()", () => {
    test("Valid Characters, length of 81", (done) => {
      const validInput =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.isTrue(solver.validate(validInput));
      done();
    });

    // Invalid characters or numbers are not accepted
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9" or "."") are not accepted', (done) => {
      const invalidChars =
        "..X..5.1.85.4....2432.HI...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const error = "Invalid characters in puzzle";
      assert.equal(solver.validate(invalidChars), error);
      done();
    });

    // Puzzles that are not 81 numbers/periods long show the message
    test("Shows an error for puzzles that are not 81 numbers long", (done) => {
      const shortStr = "83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const longStr =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...";
      const error = "Expected puzzle to be 81 characters long";
      assert.equal(solver.validate(shortStr), error);
      assert.equal(solver.validate(longStr), error);
      done();
    });
  });

  suite("Function checkRowPlacement()", () => {
    test("Valid placement for a row", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 0;
      const col = 0;
      const value = 3;
      assert.isTrue(
        solver.checkRowPlacement(solver.createPuzzleArr(input), row, col, value)
      );
      done();
    });

    test("Invalid placement for a row", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 0;
      const col = 0;
      const value = 9;
      assert.isFalse(
        solver.checkRowPlacement(solver.createPuzzleArr(input), row, col, value)
      );
      done();
    });
  });

  suite("Function checkColPlacement()", () => {
    test("Valid placement for a column", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 0;
      const col = 0;
      const value = 3;
      assert.isTrue(
        solver.checkColPlacement(solver.createPuzzleArr(input), row, col, value)
      );
      done();
    });

    test("Invalid placement for a column", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 0;
      const col = 0;
      const value = 9;
      assert.isTrue(
        solver.checkColPlacement(solver.createPuzzleArr(input), row, col, value)
      );
      done();
    });
  });

  suite("Function checkRegionPlacement()", () => {
    test("Valid placement for a region", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 4;
      const col = 4;
      const value = 3;
      assert.isTrue(
        solver.checkRegionPlacement(
          solver.createPuzzleArr(input),
          row,
          col,
          value
        )
      );
      done();
    });

    test("Invalid placement for a region", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const row = 4;
      const col = 4;
      const value = 7;
      assert.isFalse(
        solver.checkRegionPlacement(
          solver.createPuzzleArr(input),
          row,
          col,
          value
        )
      );
      done();
    });
  });

  suite("Function solvePuzzle()", () => {
    // Valid complete puzzles pass
    test("Valid puzzles pass", function (done) {
      let puzzleString = puzzlesAndSolutions[0][0];
      let solutionString = puzzlesAndSolutions[0][1];
      assert.equal(solver.solve(puzzleString), solutionString);
      done();
    });

    // Invalid complete puzzles fail
    test("Invalid puzzles fail", function (done) {
      const puzzle = "83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.solve(puzzle), "Puzzle cannot be solved");
      done();
    });

    // Returns the expected solution for a valid, incomplete puzzle
    test("Returns the expected solution for an incomplete puzzle", function (done) {
      let puzzle = puzzlesAndSolutions[0][0];
      let solutionString = puzzlesAndSolutions[0][1];
      assert.equal(solver.solve(puzzle), solutionString);

      done();
    });
  });
});
