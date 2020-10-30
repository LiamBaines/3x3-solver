const fs = require('fs');

const queue = {
  position: 0,
  length: 0,
  initialise() {
    let buf1 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    let buf2 = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    let buf3 = Buffer.from(['X'.charCodeAt()])
    let buf4 = Buffer.from([0])
    let buf = Buffer.concat([buf1, buf2, buf3, buf4])
    fs.writeFileSync(`queue2.txt`, buf);
    this.length += buf.length;
    return fs.openSync('./queue2.txt', 'r+')
  },
  read(fd) {
    let buf1 = Buffer.alloc(12)
    let buf2 = Buffer.alloc(12)
    let buf3 = Buffer.alloc(1)
    let buf4 = Buffer.alloc(1)
    fs.readSync(fd, buf1, 0, 12, this.position) // fd buffer offset length position
    fs.readSync(fd, buf2, 0, 12, this.position + 12)
    fs.readSync(fd, buf3, 0, 1, this.position + 24)
    fs.readSync(fd, buf4, 0, 1, this.position + 25)
    this.position += 26
    return [[[...buf1], [...buf2]], String.fromCharCode(buf3[0]), buf4[0]]
  },
  push(fd, [p, o], last, d) {
    let buf1 = Buffer.from(p)
    let buf2 = Buffer.from(o)
    let buf3 = Buffer.from([last.charCodeAt()])
    let buf4 = Buffer.from([d])
    let buf = Buffer.concat([buf1, buf2, buf3, buf4])
    fs.writeSync(fd, buf, 0, buf.length, this.length)
    this.length += buf.length;
  }
}

module.exports = queue;