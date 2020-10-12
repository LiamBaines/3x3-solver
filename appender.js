const cube = require('./cornercube.js')
const hash = require('./hash.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];

// initialise pattern database
let pdb = [];
for (i = 0; i < 40320; i++) {
  let subArray = [];
  for (j = 0; j < 2187; j++) {
    subArray.push('')
  }
  pdb.push(subArray);
}
pdb[0][0] = 'X';

//fill pattern database
let queue = [[[[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]], '']] // = [[state, d]]
let turns = 0;
let inserts = 0;
let rte = '';

let lim = 7;
while (rte.length < lim) {
  let origState = queue[0][0]
  rte = queue[0][1]
  if (rte.length < lim) {
    t.forEach(trn => {
      let newState = cube.turn(origState, trn)
      let x = hash.lehmer(newState[0]);
      let y =  hash.ternary(newState[1]);
      if (pdb[x][y] == '') {
        if (x == 15120 && y == 162) console.log(rte, trn)
        pdb[x][y] = rte.concat(trn)
        queue.push([newState, rte.concat(trn)])
        inserts++ 
      }
      turns++
    })
    queue.shift()
  }
}

console.log(`turns: ${turns}`)
console.log(`inserts: ${inserts}`)