const fs = require('fs');
const { pipeline } = require('stream');

let reader = fs.createReadStream('./data.csv', {
  flag: 'a+',
  encoding: 'ascii',
  highWaterMark: 16
});

reader.on('data', (chunk) => { 
  //writer.write(chunk)
  reader.pipe(writer)
});

reader.on('readable', () => {
  let chunk;
  console.log('File ready to read.');
  while (null !== (chunk = reader.read(4))) {
    console.log(chunk);
  }
})

reader.on('end', () => {
  console.log('ended')
})

let writer = fs.createWriteStream('data2.csv', {
  flags: 'w'
});


async function add(solutions) {
  return new Promise(resolve => {
    fs.appendFile('data.csv', solutions, function (err) {
        console.log('Appended.')
        console.log('Readable: ', reader.readable)
        resolve('Appended.');
      });
  });
}

await function(){add('D,4,')};
//setTimeout(function(){console.log(reader.isPaused())}, 1000)
