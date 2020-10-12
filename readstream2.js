const fs = require('fs');
const { resolve } = require('path');

async function init(name, data) {
  return new Promise(resolve => {
    initFile(name, data)
    .then(() => initStream(name))
    .then((object) => {resolve(object)})
  })
}

async function initFile(name, data) {
  return new Promise(resolve => {
    fs.writeFile(name, data, (err) => {
      if (err) throw err;
      console.log(`${name} has been created.`);
      resolve('Initialised.')
    });
  })
}

async function initStream(name) {
  return new Promise(resolve => {
    reader = fs.createReadStream(name, {
      flag: 'a+',
      encoding: 'ascii',
      highWaterMark: 64
    });
    console.log(`${name} is streaming`);
    // reader.on('data', (chunk) => {
    //   console.log(`data event: ${chunk}. Readable? ${reader.readable}. Flowing? ${reader.readableFlowing}. Paused? ${reader.isPaused()}`)
    //   reader.pause()
    // })
    reader.on('end', () => {
      console.log('Stream ended.')
    })
    reader.on('readable', () => {cl
      console.log('Readable.')
      let chunk;
      //Use a loop to make sure we read all currently available data
      while (null !== (chunk = reader.read())) {
        console.log(`readable event: ${chunk}`);
      }
    });
    resolve(reader)});
}

async function add(file, solutions) {
  console.log(`Appending ${solutions}. Readable? ${reader.readable}. Flowing? ${reader.readableFlowing}. Paused? ${reader.isPaused()}`)
  return new Promise(resolve => {
    fs.appendFile(file, solutions, function (err) {
        resolve('Appended.');
      });
  });
}

async function readFunc (reader, n) {
  console.log('Readable? ' + reader.readable)
  let val = await reader.read(n, n+3)
  console.log(val)
  return new Promise(resolve => {
    resolve(val)
  })
}

async function execute () {
  let reader = await init('data.csv','A,1,');
  await add('data.csv', 'B,2,');
  console.log(reader.readable)
  await add('data.csv', 'C,3,');
  console.log(reader.readable)
}

execute()