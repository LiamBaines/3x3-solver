const hash = require('./hash.js')
const fs = require('fs')
const pdb = fs.openSync('pdb.txt', 'r')
const pdb2 = fs.openSync('pdb2.txt', 'r')
const pdb3 = fs.openSync('pdb3.txt', 'r')
const cube = require('./cube.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];

function scramble(n) {
  let str = ''
  for (let i = 0; i < n; i++) {
    let trn = t[Math.floor(12 * Math.random())]
    str = str.concat(trn)
    cube.turn(trn)
  }
  console.log(`Scramble: ${str}`)
}

function solve() {
  let queue = [];
  let closed = [];
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
  queue.push(new Node('', [cube.corners, cube.edges], cube.h));
  while (!found) {
    let currentNode = queue[0];
    queue.forEach(node => {
      if (node.f < currentNode.f) {
        currentNode = node;
      }
    });
    t.forEach(trn => {
      [cube.corners, cube.edges] = currentNode.state;
      route = currentNode.route;
      cube.turn(trn);
      if (cube.h == 0) {
        console.log(`Route found! ${route.concat(trn)}`)
        console.log(`Nodes generated: ${queue.length + closed.length}`)
        found = true;
      }
      if (!queue.some(node => node.state.join(',') == currentNode.state.join(''))) {
        queue.push(new Node(route.concat(trn), cube.state, cube.h))
      }
    })
    closed.push(currentNode)
    queue.shift();
  }
}

scramble(4)
solve()