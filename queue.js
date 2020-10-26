const fs = require('fs');

const queue = {
  position: 0,
  length: 0,
  initialise() {
    let buf = Buffer.alloc(5);
    buf[4] = 12;
    fs.writeFileSync(`queue.txt`, buf);
    this.length += 5
    return fs.openSync('./queue.txt', 'r+')
  },
  read(fd) {
    let buf1 = Buffer.alloc(4)
    let buf2 = Buffer.alloc(1)
    fs.readSync(fd, buf1, 0, 4, this.position) // fd buffer offset length position
    fs.readSync(fd, buf2, 0, 1, this.position + 4)
    this.position += 5
    return [buf1.readInt32BE(), buf2.readUInt8()]
  },
  push(fd, z, last) {
    //console.log(`Pushing ${z}, ${last} to queue`)
    let buf1 = Buffer.alloc(4)
    let buf2 = Buffer.alloc(1)
    buf1.writeInt32BE(z);
    buf2.writeUInt8(last)
    fs.writeSync(fd, buf1, 0, 4, this.length)
    fs.writeSync(fd, buf2, 0, 1, this.length + 4)
    this.length += 5;
  }
}

module.exports = queue;