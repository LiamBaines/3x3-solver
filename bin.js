const cube = require('./cornercube.js')
const hash = require('./hash.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];

// cube.state = cube.turn(cube.state, 'R');
// cube.state = cube.turn(cube.state, 'u');
// cube.state = cube.turn(cube.state, 'F');
// cube.state = cube.turn(cube.state, 'd');
// console.log(cube.state)
// console.log(hash.lehmer(cube.state[0]), hash.ternary(cube.state[1]))

cube.state = cube.turn(cube.state, 'U')
console.log(`[${cube.state[0].join(', ')}],   [${cube.state[1].join(', ')}]`)
cube.state = cube.turn(cube.state, 'R')
console.log(`[${cube.state[0].join(', ')}],   [${cube.state[1].join(', ')}]`)
cube.state = cube.turn(cube.state, 'r')
console.log(`[${cube.state[0].join(', ')}],   [${cube.state[1].join(', ')}]`)