const fs = require('fs')
let fd = fs.openSync('./pdb2.txt', 'r');
const pdb = require('./pdb2.txt')
const cube = require('./edgecube.js');
const hash = require ('./hash2.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b']

function read(pos) {
  let buf = Buffer.alloc(1)
  fs.readSync(fd, buf, 0, 1, pos)
  return buf[0];
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
  let num = pdb.read(fd, z)
  let colourCode = (num == n) ? 32 : 93;
  console.log('\u001b[' + colourCode + 'm' + `${str} => ${num}` + '\u001b[0m')
}

console.log(check(2))