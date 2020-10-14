const cube = { // corners only
  state: [[0, 1, 2, 3, 4, 5, 6, 7],   // permutation
          [0, 0, 0, 0, 0, 0, 0, 0]],  // orientation
  maps: {
    p: {
      U: [3, 0, 1, 2, 4, 5, 6, 7],
      u: [1, 2, 3, 0, 4, 5, 6, 7],
      D: [0, 1, 2, 3, 5, 6, 7, 4],
      d: [0, 1, 2, 3, 7, 4, 5, 6],
      R: [0, 1, 3, 7, 4, 5, 2, 6],
      r: [0, 1, 6, 2, 4, 5, 7, 3],
      L: [1, 5, 2, 3, 0, 4, 6, 7],
      l: [4, 0, 2, 3, 5, 1, 6, 7],
      F: [4, 1, 2, 0, 7, 5, 6, 3],
      f: [3, 1, 2, 7, 0, 5, 6, 4],
      B: [0, 2, 6, 3, 4, 1, 5, 7],
      b: [0, 5, 1, 3, 4, 6, 2, 7]
    },
    o: {
      U: [0, 0, 0, 0, 0, 0, 0, 0],
      u: [0, 0, 0, 0, 0, 0, 0, 0],
      D: [0, 0, 0, 0, 0, 0, 0, 0],
      d: [0, 0, 0, 0, 0, 0, 0, 0],
      R: [0, 0, 2, 1, 0, 0, 1, 2],
      r: [0, 0, 2, 1, 0, 0, 1, 2],
      L: [2, 1, 0, 0, 1, 2, 0, 0],
      l: [2, 1, 0, 0, 1, 2, 0, 0],
      F: [1, 0, 0, 2, 2, 0, 0, 1],
      f: [1, 0, 0, 2, 2, 0, 0, 1],
      B: [0, 2, 1, 0, 0, 1, 2, 0],
      b: [0, 2, 1, 0, 0, 1, 2, 0]
    }    
  },
  turn([p1, o1], dir) {
    this.count++
    let p = this.maps.p[dir];
    let o = this.maps.o[dir]; 
    let p2 = p.map(x => p1[x]);                 // re-order block permutations
    let o2 = o1.map((x, j) => (x + o[j]) % 3);  // adjust block orientations
    let o3 = p.map(x => o2[x]);                 // re-order block orientations
    return [p2, o3]
  }
}

module.exports = cube;

