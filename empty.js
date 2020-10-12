const fs = require('fs');

fs.writeFile('corners.csv', 'ABCDEFGH,0,', (err) => {
  if (err) throw err;
  console.log('corners.csv cleared');
});