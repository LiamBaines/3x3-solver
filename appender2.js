const cube = require('./edgecube.js')
const hash = require('./hash2.js')
const pdb = require('./pdb2.js')
const queue = require ('./queue2.js')
const fs = require('fs')
const turnLabels = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b', 'X']
// const t = {
//   U: ['U', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
//   u: ['D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
//   D: ['D', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
//   d: ['L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
//   L: ['U', 'u', 'D', 'd', 'L', 'R', 'r', 'F', 'f', 'B', 'b'],
//   l: ['U', 'u', 'D', 'd', 'R', 'r', 'F', 'f', 'B', 'b'],
//   R: ['U', 'u', 'D', 'd', 'R', 'F', 'f', 'B', 'b'],
//   r: ['U', 'u', 'D', 'd', 'F', 'f', 'B', 'b'],
//   F: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'B', 'b'],
//   f: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'B', 'b'],
//   B: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'B'],
//   b: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r'],
//   X: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
// }
const t = {
  U: ['U', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  u: ['L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  L: ['U', 'u', 'L', 'R', 'r', 'F', 'f', 'B', 'b'],
  l: ['U', 'u', 'R', 'r', 'F', 'f', 'B', 'b'],
  R: ['U', 'u', 'R', 'F', 'f', 'B', 'b'],
  r: ['U', 'u', 'F', 'f', 'B', 'b'],
  F: ['U', 'u', 'L', 'l', 'R', 'r', 'F', 'B', 'b'],
  f: ['U', 'u', 'L', 'l', 'R', 'r', 'B', 'b'],
  B: ['U', 'u', 'L', 'l', 'R', 'r', 'B'],
  b: ['U', 'u', 'L', 'l', 'R', 'r'],
  X: ['U', 'u', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
}

function execute(lim, checkNum) {
  let maxD = 0;
  let P = pdb.initialise();
  let Q = queue.initialise();
  let turns = 0;
  let inserts = 0;
  let startTime = Date.now();
  while (inserts < lim) {
    let [origState, last, d] = queue.read(Q)
    if (d > maxD) maxD = d;
    if (d < lim && last.charCodeAt() !== 0) {
      t[last].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let Zp = hash.getZ(newState, 6)
        if (pdb.read(P, Zp) === 0 && Zp !== 0) {
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
  for (ck = 0; ck < checkNum + 1; ck++) {
    check(P, ck)
    check(P, ck)
    check(P, ck)
    check(P, ck)
    check(P, ck)
  }
}

function check(P, n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 10)
    state = cube.turn(state, t.X[ran])
    str = str.concat(t.X[ran])
  }
  let partialState = state.map(arr => arr.slice(0, 6))
  let z = hash.getZ(partialState, 6)
  let num = pdb.read(P, z)
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

let fd = fs.openSync('./pdb2.txt', 'r+')
for (y = 0; y < 20; y++) {
  for (x = 0; x < 20; x++) {
    check(fd, y)
  }
}