const fs = require('fs')
let fd = fs.openSync('./pdb.txt', 'r');
const cube = require('./cornercube.js');
const hash = require ('./hash.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b']

function read(pos) {
  let buf = Buffer.alloc(1)
  fs.readSync(fd, buf, 0, 1, pos)
  return buf[0];
}

function check(n) {
  cube.state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]];
  for (c = 0; c < n; c++) {
    cube.state = cube.turn(cube.state, t[Math.floor(Math.random() * 12)])
  }
  return [n, read(hash.getZ(cube.state))]
}