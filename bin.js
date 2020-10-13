const cube = require('./cornercube.js')
const hash = require('./hash.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];

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

console.log('\u001b[' + 93 + 'm' + 'hello stack' + '\u001b[0m')
for (i = 0; i < 1000; i++) {
  let foo = i*Math.random()
}
