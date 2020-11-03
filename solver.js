const cube = require('./cube.js')
let binaryHeap = require('./heap.js')
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

function scramble(n) {
  cube.reset()
  let str = ''
  for (let i = 0; i < n; i++) {
    let trn = t.X[Math.floor(12 * Math.random())]
    str = str.concat(trn)
    cube.turn(trn)
  }
  console.log(`Scramble: ${str} (n = ${n}, h = ${cube.h})`)
}

function solve() {
  let startTime = Date.now()
  let heap = new binaryHeap();
  let open = {};
  let closed = {};
  let turns = 0;
  let route = '';
  let found = false;
  class Node {
    constructor(route, state, h) {
      this.route = route;
      this.state = state;
      this.h = h;
      this.f = route.length + h;
    }
  };
  heap.add(new Node('', [cube.corners, cube.edges], cube.h));
  open[cube.id] = 0 + cube.h;
  while (!found) {
    // get minimum node
    let currentNode = heap.min;
    [cube.corners, cube.edges] = currentNode.state;
    let origId = cube.id;
    delete open[origId];
    //console.log(`currentNode = ${currentNode.route} (${currentNode.f})`)
    let last = (currentNode.route == '') ? 'X' : currentNode.route[currentNode.route.length - 1];
    for (let trn of t[last]) {
      turns++
      [cube.corners, cube.edges] = currentNode.state;
      route = currentNode.route;
      cube.turn(trn);
      let successor = new Node(route.concat(trn), cube.state, cube.h)
      if (cube.h == 0) {
        console.log(`\u001b[32mRoute found! ${route.concat(trn)}\u001b[0m`);
        found = true;
      }
      // if this id is in open with a lower f, skip
      if (open[cube.id] && open[cube.id] < successor.f) {
        continue;
      }
      // if this id is in closed with a lower f, skip
      if (closed[cube.id] && closed[cube.id] < successor.f) {
        continue;
      }
      // else, add the node to the open list
      else {
        heap.add(successor)
        open[cube.id] = successor.f
      }
    }
    closed[origId] = currentNode.f
  }
}

scramble(10)
solve()


