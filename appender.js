const cube = require('./cornercube.js')
const hash = require('./hash.js')
const fs = require('fs')
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
function execute(lim, batchSize) {
  let pdb = new Array(88179840)
  pdb[0] = 0;
  let turns = 0;
  let inserts = 0;
  let d = 0;
  let filesWritten = 0;
  let filesRead = 0;
  let queueFilling = true;
  let queue = [0, 'X']
  let overflow = []
  let startTime = Date.now()
  while (d < lim) {
    if (queue.length == 0) {
      queue = fs.readFileSync(`./queue/queue${filesRead}.js`, 'utf-8').split(',').map(x => (x.length == 1) ? x : parseInt(x))
      fs.unlinkSync(`./queue/queue${filesRead}.js`)
      filesRead++
    }
    let z = queue[0]
    let origState = hash.getState(z);
    d = pdb[z]
    let last = queue[1]
    if (d < lim) {
      t[last].forEach(trn => {
        let newState = cube.turn(origState, trn)
        let Z = hash.getZ(newState)
        if (pdb[Z] === undefined) {
          pdb[Z] = d + 1;
          if (queue.length < (batchSize * 2) && queueFilling == true) {
            queue.push(Z, trn)
          }
          if (overflow.length > (batchSize * 2)) {
            let buf = Buffer.from(overflow.splice(0, batchSize * 2).toString(), 'utf-8')
            fs.writeFileSync(`./queue/queue${filesWritten}.js`, buf)
            buf = null;
            filesWritten++
            queueFilling = false;
          }
          overflow.push(Z, trn);
          inserts++ 
          }
          turns++
        });
      queue.shift()
      queue.shift()
    }
  }
  let endTime = Date.now()
  let timeTaken = endTime - startTime;
  console.log(`Executed to depth ${lim} in ${timeTaken} ms (${Math.floor(turns/timeTaken)} turns/ms). ${turns} turns, ${inserts} inserts (${Math.floor(100*(turns - inserts)/turns)}% redundancy)`)
  console.log(`Files written: ${filesWritten}, queue: ${queue.length}, overflow: ${overflow.length}`)
  check(pdb, lim)
  for (i = filesRead; i < filesWritten; i++) {
    fs.unlinkSync(`./queue/queue${i}.js`)
  }
}

function check(arr, n) {
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
  let num = arr[z];
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

execute(7, 10000)
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
