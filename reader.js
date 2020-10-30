const fs = require('fs')
const t = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b']

function check (pdbID, subCubeID, lim, checks, mode) {
  const cube = require(`./cube.js`)
  const hash = require(`./hash.js`)
  const pdb = fs.openSync(`./${pdbID}.txt`, 'r');
  for (let i = 0; i < lim + 1; i++) {
    for (let j = 0; j < checks; j++) {
      cube.corners = [[0, 1, 2, 3, 4, 5, 6, 7, 8], [0, 0, 0, 0, 0, 0, 0, 0]]
      cube.edges = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
      let str = ''
      for (k = 0; k < i; k++) {
        let ran = Math.floor(Math.random() * 12)
        str = str.concat(t[ran])
      }
      let arr = str.split('');
      arr.forEach(trn => {
        cube.turn(trn)
      })
      let z = hash.getZ(cube[subCubeID]);

      //read
      let buf = Buffer.alloc(1)
      fs.readSync(pdb, buf, 0, 1, z)
      num = buf[0];

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
let config1 = ['pdb', 'corners']
let config2 = ['pdb2', 'top']
let config3 = ['pdb3', 'bottom']

check(...config3, 10, 1, 'all')
//tally('pdb2', 42577920