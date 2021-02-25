const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("UnitTests", () => {
  // Suite setup
  suiteSetup((done) => {
    solver = new Solver();
    done();
  });

  // Variables setup
  const validPuzzle =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const validSolution =
    "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
  const invalidLengthPuzzle = "..9..5.1.85.4....2432......1";
  const invalidCharsPuzzle =
    "abc..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

  // Tests

  suite("Function validate()", () => {
    test("Valid Characters, length of 81", (done) => {
      assert.isTrue(solver.validate(validPuzzle));
      done();
    });

    test('Invalid characters (anything other than "1-9" or "."") are not accepted', (done) => {
      assert.equal(
        solver.validate(invalidCharsPuzzle),
        "Invalid characters in puzzle"
      );
      done();
    });

    test("Shows an error for puzzles that are not 81 numbers long", (done) => {
      assert.equal(
        solver.validate(invalidLengthPuzzle),
        "Expected puzzle to be 81 characters long"
      );
      done();
    });
  });

  suite("Function checkRowPlacement()", () => {
    test("Valid placement for a row", (done) => {
      const row = 0;
      const col = 0;
      const value = 3;
      assert.isTrue(
        solver.checkRowPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });

    test("Invalid placement for a row", (done) => {
      const row = 0;
      const col = 0;
      const value = 9;
      assert.isFalse(
        solver.checkRowPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });
  });

  suite("Function checkColPlacement()", () => {
    test("Valid placement for a column", (done) => {
      const row = 0;
      const col = 0;
      const value = 3;
      assert.isTrue(
        solver.checkColPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });

    test("Invalid placement for a column", (done) => {
      const row = 0;
      const col = 0;
      const value = 8;
      assert.isFalse(
        solver.checkColPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });
  });

  suite("Function checkRegionPlacement()", () => {
    test("Valid placement for a region", (done) => {
      const row = 0;
      const col = 0;
      const value = 1;
      assert.isTrue(
        solver.checkRegionPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });

    test("Invalid placement for a region", (done) => {
      const row = 0;
      const col = 0;
      const value = 8;
      assert.isFalse(
        solver.checkRegionPlacement(
          solver.createPuzzleArr(validPuzzle),
          row,
          col,
          value
        )
      );
      done();
    });
  });

  suite("Function solve()", () => {
    test("Valid puzzles pass", function (done) {
      assert.equal(
        solver.solve(solver.createPuzzleArr(validSolution)),
        validSolution
      );
      done();
    });

    test("Invalid puzzles fail", function (done) {
      assert.equal(
        solver.solve(solver.createPuzzleArr(invalidLengthPuzzle)),
        "Puzzle cannot be solved"
      );
      done();
    });

    test("Returns the expected solution for an incomplete puzzle", function (done) {
      assert.equal(
        solver.solve(solver.createPuzzleArr(validPuzzle)),
        validSolution
      );
      done();
    });
  });
});
