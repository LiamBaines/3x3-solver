const fs = require('fs')

const pdb = {
  initialise() {
    let buf = Buffer.alloc(42577920)
    fs.writeFileSync(`pdb2.txt`, buf)
    return fs.openSync('./pdb2.txt', 'r+')
  },
  read(fd, pos) {
    let buf = Buffer.alloc(1)
    fs.readSync(fd, buf, 0, 1, pos)
    return buf[0];
  },
  write(fd, pos, val) {
    let buf = Buffer.from([val]);
    fs.writeSync(fd, buf, 0, 1, pos)
  }
}

module.exports = pdb;