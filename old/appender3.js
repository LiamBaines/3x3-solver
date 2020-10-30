const cube = require('../edgecube.js') // ok
const hash = require('./hash3.js') // ok
const pdb = require('./pdb3.js') // ok
const queue = require ('./queue2.js') // ok
const fs = require('fs') // ok
const t = {
  D: ['D', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  d: ['L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  L: ['D', 'd', 'L', 'R', 'r', 'F', 'f', 'B', 'b'],
  l: ['D', 'd', 'R', 'r', 'F', 'f', 'B', 'b'],
  R: ['D', 'd', 'R', 'F', 'f', 'B', 'b'],
  r: ['D', 'd', 'F', 'f', 'B', 'b'],
  F: ['D', 'd', 'L', 'l', 'R', 'r', 'F', 'B', 'b'],
  f: ['D', 'd', 'L', 'l', 'R', 'r', 'B', 'b'],
  B: ['D', 'd', 'L', 'l', 'R', 'r', 'B'],
  b: ['D', 'd', 'L', 'l', 'R', 'r'],
  X: ['D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
}


function execute(lim, checks) {
  let maxD = 0;
  let P = pdb.initialise();
  let Q = queue.initialise();
  let turns = 0;
  let inserts = 1;
  let startTime = Date.now();
  while (inserts < lim) {
    let [origState, last, d] = queue.read(Q)
    if (d > maxD) maxD = d;
    if (d < lim && last.charCodeAt() !== 0) {
      t[last].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let Zp = hash.getZ(newState, 6)
        let val = pdb.read(P, Zp)
        if (Zp !== 23442432 && (val === 0 || val > Zp)) {
          pdb.write(P, Zp, d + 1)
          queue.push(Q, newState, trn, d + 1)
          inserts++
        }
        turns++
      })
    }
  }
  let timeTaken = Date.now() - startTime;
  console.log(`Executed to depth ${maxD} in ${timeTaken} ms (${Math.floor(turns/timeTaken)} turns/ms). ${turns} turns, ${inserts} inserts (${Math.floor(100*(turns - inserts)/turns)}% redundancy)`)
  checkMulti(maxD, checks)
}

function check(P, n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 10)
    state = cube.turn(state, t.X[ran])
    str = str.concat(t.X[ran])
  }
  let z = hash.getZ(state, 6)
  let num = pdb.read(P, z)
  let colourCode;
  if (num > n) colourCode = 31;
  if (num == n) colourCode = 32;
  if (num < n) colourCode = 93;
  console.log('\u001b[' + colourCode + 'm' + `(${z}) ${str} => ${num}` + '\u001b[0m');
}

function checkMulti(lim, checks) {
  let fd = fs.openSync('./pdb3.txt', 'r+')
  for (y = 0; y < lim; y++) {
    for (x = 0; x < checks; x++) {
      check(fd, y)
    }
  }
}

function checkSpecific(str) {
  let fd = fs.openSync('./pdb3.txt', 'r+')
  cube.state = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  let arr = str.split('');
  arr.forEach(trn => {
    cube.state = cube.turn(cube.state, trn)
  })
  let z = hash.getZ(cube.state, 6)
  let num = pdb.read(fd, z)
  let colourCode;
  let n = str.length;
  if (num > n) colourCode = 31;
  if (num == n) colourCode = 32;
  if (num < n) colourCode = 93;
  console.log('\u001b[' + colourCode + 'm' + `(${z}) ${str} => ${num}` + '\u001b[0m');
}


execute(42577920, 10)