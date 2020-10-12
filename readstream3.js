const fs = require('fs')

let reader = fs.createReadStream('data.csv', {
  flag: 'a+',
  encoding: 'ascii',
  highWaterMark: 64
});

console.log(reader.read(4))