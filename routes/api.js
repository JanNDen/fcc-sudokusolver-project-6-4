"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/solve").post((req, res) => {
    // Fetch the variables
    const { puzzle } = req.body;
    if (!puzzle || puzzle == "")
      return res.json({ error: "Required field missing" });
    // Validate puzzle
    const validateString = solver.validate(puzzle);
    if (validateString !== true) return res.json({ error: validateString });

    // Create puzzle Array from String
    const puzzleArr = solver.createPuzzleArr(puzzle);

    // Compose the result
    // const result = [];
    // const compute = solver.solve(puzzleArr);
    // console.log(compute);
    // for (let row in compute) {
    //   result.push(compute[row].join(""));
    // }
    // const solution = result.join("");
    const solution = solver.solve(puzzleArr);
    console.log(solution);
    res.json({ solution });
  });

  app.route("/api/check").post((req, res) => {
    // Fetch the variables
    const { puzzle, coordinate, value } = req.body;

    // Validate puzzle
    const validateString = solver.validate(puzzle);
    if (validateString !== true) return res.json({ error: validateString });

    // Create puzzle Array from String
    const puzzleArr = solver.createPuzzleArr(puzzle);

    // Determine the row and column number 0-8
    const [rowName, colNumber] = coordinate.split("");
    const row = ["A", "B", "C", "D", "E", "F", "G", "H", "I"].indexOf(rowName);
    const col = colNumber - 1;

    // Check the validity of the Number in our Puzzle
    const rowResult = solver.checkRowPlacement(puzzleArr, row, col, value);
    const colResult = solver.checkColPlacement(puzzleArr, row, col, value);
    const regionResult = solver.checkRegionPlacement(
      puzzleArr,
      row,
      col,
      value
    );

    // Compose the result
    if (rowResult && colResult && regionResult) {
      res.json({ valid: true });
    } else {
      let resultArr = [];
      if (!rowResult) resultArr.push(["row"]);
      if (!colResult) resultArr.push(["col"]);
      if (!regionResult) resultArr.push(["region"]);
      res.json({ valid: false, resultArr });
    }
  });
};
