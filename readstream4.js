const { log } = require('console');
const { resolve } = require('path');

fs = require('fs')
split = require('split')
let seen = new Set()

reader = fs.createReadStream('data.csv', {
    flag: 'a+',
    encoding: 'ascii',
    highWaterMark: 64
  })
  .pipe(split())
  .on('data', (chunk) => {
    console.log('Added chunk ' + chunk)
  })
  .on('end', () => {
    console.log('Stream ended.')
  })

async function add(data, file) {
  console.log(`Adding ${data} to ${file}.`)
    return new Promise(resolve => {
      fs.appendFile(file, data, function (err) {
        resolve('Appended.');
      });
    });
}

async function addMultiple(arr) {
  for await (const element of arr) {
    add(element, 'data.csv')
  }
}

addMultiple(['B,2,', 'C,3,'])

//add('A,1','data.csv')

// async function stream() {
//   fs.createReadStream('./data.csv')
//   .pipe(split())
//   .on('data', async function() {
//     for await (chunk) {
//       console.log(chunk);
//     }
//   })
// }

//  async function async(input) {
//    return new Promise(resolve => {
//    console.log('Waiting to return ' + input);
//    setTimeout(() => {resolve(input)}, 1000)})
//  }

// async function asyncLog(input) {
//   return new Promise(resolve => {
//     let val = await async(input);
//     resolve(val)
//   })
// }

//asyncLog();
//