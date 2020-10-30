const hash = require('./hash.js')
const fs = require('fs')
const pdb = fs.openSync('pdb.txt', 'r')
const pdb2 = fs.openSync('pdb2.txt', 'r')
const pdb3 = fs.openSync('pdb3.txt', 'r')

const cube = {
  corners: [[0, 1, 2, 3, 4, 5, 6, 7],
            [0, 0, 0, 0, 0, 0, 0, 0]],
  edges: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  get state() {
    return [this.corners, this.edges]
  },
  get top() {
    let p = [0, 0, 0, 0, 0, 0];
    let o = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 12; i++) {
      let x = this.edges[0][i]
      if (x < 6) {
        p[x] = i;
        o[x] = this.edges[1][i]
      }
    }
    return [p, o]
  },
  get bottom() {
    let p = [0, 0, 0, 0, 0, 0];
    let o = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 12; i++) {
      let x = this.edges[0][i]
      if (x > 5) {
        p[x - 6] = i;
        o[x - 6] = this.edges[1][i]
      }
    }
    return [p, o]
  },     
  maps: {
    corners: {
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
    edges: {
      p: {
        U: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
        u: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
        D: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
        d: [0, 1, 2, 3, 4, 5, 6, 7, 11, 8, 9, 10],
        R: [0, 1, 2, 7, 4, 5, 3, 11, 8, 9, 10, 6],
        r: [0, 1, 2, 6, 4, 5, 11, 3, 8, 9, 10, 7],
        L: [0, 5, 2, 3, 1, 9, 6, 7, 8, 4, 10, 11],
        l: [0, 4, 2, 3, 9, 1, 6, 7, 8, 5, 10, 11],
        F: [4, 1, 2, 3, 8, 5, 6, 0, 7, 9, 10, 11],
        f: [7, 1, 2, 3, 0, 5, 6, 8, 4, 9, 10, 11],
        B: [0, 1, 6, 3, 4, 2, 10, 7, 8, 9, 5, 11],
        b: [0, 1, 5, 3, 4, 10, 2, 7, 8, 9, 6, 11]
      },
      o: {
        U: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        u: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        D: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        r: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        l: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        F: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
        f: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
        B: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
        b: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0]
      },
    }
  },
  turn(dir) {
    //corners
    let p1 = this.corners[0];
    let o1 = this.corners[1]; 
    let p = this.maps.corners.p[dir];
    let o = this.maps.corners.o[dir];
    let p2 = p.map(x => p1[x]);                 // re-order block permutations
    let o2 = o1.map((x, j) => (x + o[j]) % 3);  // adjust block orientations
    let o3 = p.map(x => o2[x]);
    this.corners = [p2, o3];              // re-order block orientations
    //edges
    p1 = this.edges[0];
    o1 = this.edges[1];
    p = this.maps.edges.p[dir];
    o = this.maps.edges.o[dir];
    p2 = p.map(x => p1[x]);
    o2 = o1.map((x, j) => ((x + o[j]) % 2));
    o3 = p.map(x => o2[x]);
    this.edges = [p2, o3]
  },
  get z() {
    return [hash.getZ(this.corners), hash.getZ(this.top), hash.getZ(this.bottom)]
  },
  get h() {
    let z = this.z;
    let arr = [pdb, pdb2,pdb3]
    let vals = [];
    arr.forEach((fd, i) => {
      let buf = Buffer.alloc(1)
      fs.readSync(fd, buf, 0, 1, z[i])
      vals[i] = buf[0]
    })
    return Math.max(...vals)
  }
}

module.exports = cube;