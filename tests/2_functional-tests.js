const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

// Variables setup
const solveDir = "/api/solve";
const checkDir = "/api/check";
const validPuzzle =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const validSolution =
  "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
const invalidLengthPuzzle = "..9..5.1.85.4....2432......1";
const invalidCharsPuzzle =
  "abc..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const notSolvablePuzzle =
  "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

// Tests

suite("Functional Tests", () => {
  suite("POST to /api/solve", () => {
    test("Solvable puzzle posted returns completed puzzle", (done) => {
      const puzzle = validPuzzle;
      chai
        .request(server)
        .post(solveDir)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, validSolution);
          done();
        });
    });

    test("Puzzle Field Missing", (done) => {
      chai
        .request(server)
        .post(solveDir)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Invalid Characters in Puzzle", (done) => {
      const puzzle = invalidCharsPuzzle;
      chai
        .request(server)
        .post(solveDir)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle incorrect length", (done) => {
      const puzzle = invalidLengthPuzzle;
      chai
        .request(server)
        .post(solveDir)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Puzzle Cannot be Solved", (done) => {
      const puzzle = notSolvablePuzzle;
      chai
        .request(server)
        .post(solveDir)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST to /api/check", () => {
    test("All fields filled in correctly, valid placement", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "A1";
      const value = "7";
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test("All fields filled in correctly, invalid placement, single conflict", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "A2";
      const value = "1";
      const status = { valid: false, conflict: ["row"] };
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, status.conflict);
          done();
        });
    });

    test("All fields filled in correctly, invalid placement, multiple conflicts", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "A1";
      const value = "1";
      const status = { valid: false, conflict: ["row", "column"] };
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, status.conflict);
          done();
        });
    });

    test("All fields filled in correctly, invalid placement, all conflicts", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "A1";
      const value = "5";
      const status = { valid: false, conflict: ["row", "column", "region"] };
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, status.conflict);
          done();
        });
    });

    test("Required Field(s) Missing", (done) => {
      const puzzle = validPuzzle;
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Invalid Characters in Puzzle", (done) => {
      const puzzle = invalidCharsPuzzle;
      const coordinate = "A1";
      const value = "1";
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle incorrect length", (done) => {
      const puzzle = invalidLengthPuzzle;
      const coordinate = "A1";
      const value = "1";
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Coordinate Out of Bounds", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "K1";
      const value = "1";
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Invalid Value", (done) => {
      const puzzle = validPuzzle;
      const coordinate = "A1";
      const value = "X";
      chai
        .request(server)
        .post(checkDir)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
