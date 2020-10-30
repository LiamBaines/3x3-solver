const fs = require('fs')
let fd = fs.openSync('./pdb2.txt', 'r');
const pdb = require('./pdb2.txt')
const cube = require('./edgecube.js');
const hash = require ('./hash2.js')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b']

function check (pdbjsID, pdbtxtID, hashID, cubeID, subcubeID, lim, checks, mode) {
  const cube = require(`./${cubeID}.js`)
  const hash = require(`./${hashID}.js`)
  const pdb = require(`./${pdbjsID}.js`)
  const fd = fs.openSync(`./${pdbtxtID}.txt`, 'r');
  for (let i = 0; i < lim + 1; i++) {
    for (let j = 0; j < checks; j++) {
      if (cubeID == 'cornercube') cube.state = [[0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 0, 0, 0, 0, 0, 0, 0]]
      else cube.state = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
      let str = ''
      for (k = 0; k < i; k++) {
        let ran = Math.floor(Math.random() * 12)
        str = str.concat(t[ran])
      }
      let arr = str.split('');
      arr.forEach(trn => {
        cube.turn(trn)
      })
      let z = hash.getZ(cube[subcubeID]);
      let num = pdb.read(fd, z)
      let colourCode;
      let n = str.length;
      if (num > n) colourCode = 31;
      if (num == n) colourCode = 32;
      if (num < n) colourCode = 93;
      if (mode == 'all') {
        console.log('\u001b[' + colourCode + 'm' + `(${z}) ${str} => ${num}` + '\u001b[0m');
      } else {
        if (colourCode == 31) console.log('\u001b[' + colourCode + 'm' + `(${z}) ${str} => ${num}` + '\u001b[0m');
      }
    }
  }
}

function tally(pdbID, num) {
  const pdb = require(`./${pdbID}.js`)
  const fd = fs.openSync(`./${pdbID}.txt`, 'r');
  let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < num; i++) {
    let num = pdb.read(fd, i);
    if (num == 0) console.log(`pdb[${i}] == 0`)
    counts[num] = counts[num] + 1;
  }
  for (let i = 0; i < 20; i ++) {
    console.log(`Entries with d of ${i}: ${counts[i]}`)
  }
  console.log(`Total: ${counts.reduce((tot, val) => tot + val)}`)
}

// check (pdbID, hashID, cubeID, lim, checks, mode)
let config1 = ['pdb', 'pdb', 'hash', 'cornercube', 'state']
let config2 = ['pdb2', 'pdb2', 'hash2', 'edgecube','top']
let config3 = ['pdb2', 'pdb3', 'hash2', 'edgecube', 'bottom']

check(...config2, 10, 1, 'all')
//tally('pdb2', 42577920