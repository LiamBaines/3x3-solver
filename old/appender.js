const cube = require('../cornercube.js')
const hash = require('../hash.js')
const pdb = require('./pdb.js')
const queue = require('./queue.js')
const fs = require('fs')
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

//extend tree up to a given limit
function execute(lim) {
  let P = pdb.initialise();
  let Q = queue.initialise()
  let turns = 0;
  let inserts = 0;
  let d = 0;
  let startTime = Date.now()
  while (d < lim) {
  //for (I = 0; I < 3; I++) {
    let [z, lastIndex] = queue.read(Q)
    //console.log(`Read ${z}, ${lastIndex} from queue`)
    let last = turnLabels[lastIndex]
    let origState = hash.getState(z);
    d = pdb.read(P, z)
    //console.log(`d of ${z} = ${d}`)
    if (d < lim) {
      t[last].forEach(trn => {
      //['U'].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let Z = hash.getZ(newState)
        if (pdb.read(P, Z) === 0 && Z !== 0) {
          pdb.write(P, Z, d + 1)
          queue.push(Q, Z, t.X.indexOf(trn))
          inserts++ 
        }
        turns++
      });
    }
  }
  let endTime = Date.now()
  let timeTaken = endTime - startTime;
  console.log(`Executed to depth ${lim} in ${timeTaken} ms (${Math.floor(turns/timeTaken)} turns/ms). ${turns} turns, ${inserts} inserts (${Math.floor(100*(turns - inserts)/turns)}% redundancy)`)
  for (n = 0; n < lim; n++) {
    for (nn = 0; nn < 4; nn++) {
      check(P, n)
    }
  }
  logMemoryUsage()
}

function check(P, n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 12)
    state = cube.turn(state, t.X[ran])
    str = str.concat(t.X[ran])
  }
  let z = hash.getZ(state)
  let num = pdb.read(P, z)
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

function logMemoryUsage() {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

for (i = 0; i < 100; i++) {
  check(14)
}

