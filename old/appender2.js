const cube = require('./edgecube.js')
const hash = require('./hash2.js')
const pdb = require('./pdb2.js') // writing to pdb3.txt
const queue = require ('./queue2.js')
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
  let maxD = 0;
  let P = pdb.initialise();
  let Q = queue.initialise();
  let turns = 0;
  let inserts = 1;
  let startTime = Date.now();
  while (inserts < lim) {
    let [origState, last, d] = queue.read(Q)
    if (d > maxD) {
      maxD = d;
      console.log(`Reached depth of ${maxD}`)
    } 
    if (inserts < lim && last.charCodeAt() !== 0) {
      t[last].forEach(trn => {
        cube.state = origState;
        cube.turn(trn)
        let Zp = hash.getZ(cube.bottom)
        let val = pdb.read(P, Zp)
        if (Zp !== 23442432 && (val === 0 || val > Zp)) {
          pdb.write(P, Zp, d + 1)
          queue.push(Q, cube.state, trn, d + 1)
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
  cube.state = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (let j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 12)
    cube.turn(t.X[ran])
    str = str.concat(t.X[ran])
  }
  let z = hash.getZ(cube.bottom)
  let num = pdb.read(P, z)
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

execute(42577920)
//execute(100, -1)