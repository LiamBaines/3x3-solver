const cube = require('./cornercube.js')
const hash = require('./hash.js')
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

// initialise pattern database
let pdb = new Array(88179840)
pdb[0] = 0;

// add first item to pattern database
let queue = [[0, 'X']] // = [[z, d, last]]
//let queue = [[[[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]], 'X']]
let turns = 0;
let inserts = 0;
let d = 0;

//extend tree up to a given limit
function execute(lim) {
  let queue = [[0, 'X']]
  let queue = [[0, 0]]
  let startTime = Date.now()
  while (d < lim) {
    let z = queue[0][0]
    let origState = hash.getState(z);
    //let origState = queue[0][0]
    d = pdb[z]
    let last = queue[0][1]
    if (d < lim) {
      t[last].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let Z = hash.getZ(newState)
        if (pdb[Z] === undefined) {
          pdb[Z] = d + 1
          queue.push([Z, trn])
          //queue.push([newState, trn])
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
  for (h = 1; h < lim + 1; h++) {
    check(h)
  }
}

let tries = 0;
let insertsC = 0;

function combine(n, state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]], last = 'X', d = 0) {
  let z = hash.getZ(state)
  if (pdb[z] === undefined || pdb[z] > d) {
    pdb[z] = d;
    insertsC++
  } 
  tries++
  if (d < n) {
    t[last].forEach(trn => {
      let newState = cube.turn(state, trn)
      combine(n, newState, trn, d + 1)
      turns++
    })
  }
}

function check(n) {
  let state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  let str = ''
  let last = 'X'
  for (j = 0; j < n; j++) {
    let ran = Math.floor(Math.random() * t[last].length)
    state = cube.turn(state, t[last][ran])
    str = str.concat(t[last][ran])
    last = t[last][ran]
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
  let endTime = Date.now();
  for (h = 1; h < n + 1; h++) {
    check(h)
  }
  console.log(`Extended to depth ${n} (${turns} turns) in ${endTime - startTime}ms. Redundancy rate: ${Math.floor(100*((tries - insertsC)/tries))}%`)
}

execute(5)
