const cube = require('./cube.js')
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
const goal = [[[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 1, 2, 3, 4, 5,  6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]];

class Node {
  constructor(state, last, h) {
    this.state = state;
    this.last = last;
    this.h = h;
  };
}

function getSuccessors(node) {
  let arr = [];
  for (trn of t[node.last]) {
    [cube.corners, cube.edges] = node.state;
    cube.turn(trn);
    arr.push(new Node(cube.state, trn, cube.h))
  }
  // sort successors with lowest h first
  arr.sort((a, b) => (a.h > b.h) ? 1 : -1);
  return arr;
}

function match(arr1, arr2) {
  // console.log(`Match array 1: ${arr1}`)
  // console.log(`Match array 2: ${arr2}`)
  for (let i in arr1) {
    if (typeof arr1[i] == 'object') {
      if (!match(arr1[i], arr2[i])) return false;
    }
    else if (arr1[i] != arr2[i]) return false;
  }
  return true;
}

function search(path, g, bound) {
  let currentNode = path[path.length - 1];
  let f = g + currentNode.h;
  if (f > bound) return f;
  if (match(currentNode.state, goal)) {
    return 'FOUND';
  }
  let min = Infinity;
  let successors = getSuccessors(currentNode);
  for (let successor of successors) {
    // don't extend successor if already in path
    if (!path.some(node => match(node.state, successor.state))) {
      path.push(successor);
      let T = search(path, g + 1, bound);
      if (T === 'FOUND') return 'FOUND';
      if (T < min) min = T;
      path.pop();
    }
  }
  return min;
}

function IDAstar(root) {
  let start = Date.now();
  let bound = root.h;
  let path = [root];
  while (true) {
    let T = search(path, 0, bound);
    if (T == 'FOUND') {
      let mins = Math.floor((Date.now() - start)/(1000*60))
      return `\u001b[32mRoute found in ${mins} mins: ${path.slice(1).map(node => node.last).join('')} (${path.length - 1})\u001b[0m`;
    }
    if (T == Infinity) return `\u001b[31mNo route found.\u001b[0m`;
    bound = T;
  }
}

function scramble(n) {
  cube.reset();
  let str = ''
  for (let i = 0; i < n; i++) {
    let ran = Math.floor(12 * Math.random());
    let trn = t.X[ran];
    cube.turn(trn);
    str = str.concat(trn)
  }
  console.log(`scramble(${n}) => ${str} (${cube.h})`)
  return new Node(cube.state.slice(), 'X', cube.h);
}

for (let i = 0; i < 100; i++) {
  let orig = scramble(i);
  console.log(IDAstar(orig));
}
