const cube = require('./cube.js')
const hash = require('./hash.js')
// //const pdb = require('./pdb2.js')
// const queue = require('./queue.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];
const fs = require('fs')
const bitset = require('bitset')

// cube.state = cube.turn(cube.state, 'R');
// cube.state = cube.turn(cube.state, 'u');
// cube.state = cube.turn(cube.state, 'F');
// cube.state = cube.turn(cube.state, 'd');
// console.log(cube.state)
// console.log(hash.lehmer(cube.state[0]), hash.ternary(cube.state[1]))

function sequence(str) {
  cube.state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
  let arr = str.split('')
  arr.forEach(trn => {
    cube.state = cube.turn(cube.state, trn)
  })
  return cube.state;
}

function check(n) {
  for (let i = 0; i < n + 1; i++) {
    let state = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]
    for (j = 0; j < i; j++) {
      let ran = Math.floor(Math.random() * t.all[ran])
      state = cube.turn(state, t.all[ran])
    }
    console.log(hash.encode(state[0]), hash.dec2tern(state[1]))
  }
}

function write() {
  let arr = [];
  for (i = 0; i < 1000; i++) {
    arr.push(i)
  }
  let buf = Buffer.from(arr)
  fs.writeFileSync(`./bin2.js`, buf)
}

function read() {
  const fd = fs.openSync('./bin2.js', 'r')
  let buf = Buffer.alloc(1)
  fs.readSync(fd, buf, 0, 1, 108)
  console.log(parseInt(buf[0]))
}

function toBytes(num) {
  let arr = [];
  for (i = 0; i < 3; i ++) {
    let x = Math.floor(num / Math.pow(1024, i));
    arr.unshift(x)
    num -= x * Math.pow(1024, i) 
  }
  return arr;
}

let twos = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
let dec = 3;

function dec2bin(num) {
  let arr = [];
  for (i = 0; i < 12; i++) {
    arr.push((num & twos[12 - 1 - i]) >> (12 - 1 - i))
  }
  return arr;
}

function factorial(x) {
  if (x == 0) {
    return 1
  } else {
    return x * factorial(x - 1)
  }
}

console.log(cube.h)
