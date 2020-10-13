const cube = require('./cornercube.js')
const hash = require('./hash.js')
const t = {
  X: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'],
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
  b: ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r']
}

// initialise pattern database
let pdb = new Array(88179840)
pdb[0] = 'X';

// add first item to pattern database
let queue = [[0, 0, 'X']] // = [[z, d, last]]
let turns = 0;
let inserts = 0;
let D = 0;

//extend tree up to a given limit
function execute(lim) {
  //let startTime = Date.now()
  while (D < lim) {
    let origState = hash.getState(queue[0][0]);
    D = queue[0][1]
    let last = queue[0][2]
    if (D < lim) {
      t[last].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let z = hash.getZ(newState)
        if (pdb[z] === undefined) {
          pdb[z] = D + 1
          queue.push([z, D + 1, trn])
          inserts++ 
        }
        turns++
      })
      queue.shift()
    }
  }
  let endTime = Date.now()
  let timeTaken = endTime - startTime;
  console.log(`Executed to depth ${lim} in ${timeTaken} ms (${Math.floor(turns/timeTaken)} turns/ms). ${turns} turns, ${inserts} inserts (${Math.floor(100*(turns - inserts)/turns)}% redundancy)`)
  for (h = 0; h < 10; h++) {
    check(lim)
  }
}

function combine(n, sequence = '', last = 'X') {
  cube.state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  for (h = 0; h < sequence.length; h++) {
    cube.state = cube.turn(cube.state, sequence[h])
  }
  let z = hash.getZ(cube.state)
  let d = sequence.length;
  if (pdb[z] === undefined || pdb[z] > d) pdb[z] = d;
  if (sequence.length < n) {
    t[last].forEach(trn => {
      combine(n, sequence.concat(trn), trn)
    })
  }
}

function check(n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * 12)
    state = cube.turn(state, t.X[ran])
    str = str.concat(t.X[ran])
  }
  x = hash.encode(state[0])
  y =  hash.dec2tern(state[1])
  let z = 40320*x + y
  let num = pdb[z];
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

function executeCombine(n) {
  let startTime = Date.now()
  combine(n)
  for (h = 1; h < n + 1; h++) {
    check(h)
  }
  console.log(`Extended to depth ${n} in ${Date.now() - startTime}ms`)
}

executeCombine(8)
