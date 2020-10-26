const cube = require('./edgecube.js')
const hash = require('./hash2.js')
const pdb = require('./pdb2.js')
const queue = require ('./queue2.js')
const turnLabels = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b', 'X']
const t = {
  U: ['U', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  u: ['D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  D: ['D', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  d: ['L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
  L: ['U', 'u', 'D', 'd', 'L', 'R', 'r', 'F', 'f', 'B', 'b'],
  l: ['U', 'u', 'D', 'd', 'R', 'r', 'F', 'f', 'B', 'b'],
  R: ['U', 'u', 'D', 'd', 'R', 'F', 'f', 'B', 'b'],
  r: ['U', 'u', 'D', 'd', 'F', 'f', 'B', 'b'],
  F: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'B', 'b'],
  f: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'B', 'b'],
  B: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'B'],
  b: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r'],
  X: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
}

function execute(lim) {
  let P = pdb.initialise();
  let Q = queue.initialise();
  let turns = 0;
  let inserts = 0;
  let d = 0;
  let startTime = Date.now();
  while (d < lim) {
    let [z, lastIndex] = queue.read(Q)
    let last = turnLabels[lastIndex];
    let origState = hash.getState(z, 12);
    console.log(`origState = ${origState}`)
    d = pdb.read(P, z);
    if (d < lim) {
      t[last].forEach(trn => {
        let newStateFull = cube.turn(origState, trn)
        let newStateHalf = newStateFull.map(arr => arr.slice(0, 6))
        let Zf = hash.getZ(newStateFull, 12)
        let Zp = hash.getZ(newStateHalf, 6)
        console.log(`Zf = [${Zf}]`)
        console.log(`Zp = [${Zp}]`)
        if (pdb.read(P, Zf) === 0 && Zf !== 0) {
          pdb.write(P, Zp, d + 1)
          queue.push(Q, Zf, t.X.indexOf(trn))
          inserts++
        }
        turns++
      })
    }
  }
  let timeTaken = Date.now() - startTime;
  console.log(`Executed to depth ${lim} in ${timeTaken} ms (${Math.floor(turns/timeTaken)} turns/ms). ${turns} turns, ${inserts} inserts (${Math.floor(100*(turns - inserts)/turns)}% redundancy)`)
  for (n = 0; n < lim; n++) {
    for (nn = 0; nn < 4; nn++) {
      check (P, n)
    }
  }
}

function check(P, n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 12)
    state = cube.turn(state, t.X[ran])
    str = str.concat(t.X[ran])
  }
  let partialState = state.map(arr => arr.slice(0, 6))
  let z = hash.getZ(partialState)
  let num = pdb.read(P, z)
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

execute(1)