const fs = require('fs')

const pdb = {
  initialise() {
    let buf = Buffer.alloc(42577920)
    fs.writeFileSync(`pdb3.txt`, buf)
    return fs.openSync('./pdb3.txt', 'r+')
  },
  read(fd, pos) {
    let buf = Buffer.alloc(1)
    fs.readSync(fd, buf, 0, 1, pos)
    return buf[0];
  },
  write(fd, pos, val) {
    //console.log(`Writing ${val} to ${pos}`)
    let buf = Buffer.from([val]);
    fs.writeSync(fd, buf, 0, 1, pos)
  }
}

module.exports = pdb;