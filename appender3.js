const cube = require('./edgecube.js') // ok
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


function execute(lim) {
  let maxD = 0;
  let P = pdb.initialise();
  let Q = queue.initialise();
  console.log(`Initial Zp = ${hash.getZ(cube.state)}`)
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
        if (pdb.read(P, Zp) === 0 && Zp !== 0) { // Zp at the very beginning won't be 0 - but where did I set this?
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
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `(${z}) ${str} => ${num}` + '\u001b[0m')
}

function checkMulti(lim, checks) {
  let fd = fs.openSync('./pdb3.txt', 'r+')
  for (y = 0; y < lim; y++) {
    for (x = 0; x < checks; x++) {
      check(fd, y)
    }
  }
}


execute(1)
checkMulti(6, 5)