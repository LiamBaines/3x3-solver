const hash = {
  // dec2bin(dec){
  //   return (dec >>> 0).toString(2);
  // },  
  // bin2dec(bin){
  //   return parseInt(bin, 2).toString(10);
  // },
  factorials: [1, 1, 2, 6, 24, 120, 720, 5040, 40320],
  threes: [1, 3, 9, 27, 81, 243, 729, 2187],
  //countOnes: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7], 
  // 362880, 36288000, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000]
  
  // function countOnes(num){
  //   let arr = num.toString().split('').map(char => parseInt(char))
  //   let count = 0;
  //   for (j = 0; j < arr.length; j++) {
  //     if (arr[j] == 1) count++
  //   }
  //   return count;
  // }
  P(n, k) {
    return this.factorials[n] / this.factorials[n - k]
  },
  encode(arr) {
    let n = arr.length;
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        if (arr[j] > arr[i]) arr[j] = arr[j] - 1
      }
    }
    val = 0;
    for (i = 0; i < n; i++) {
      val += arr[i] * this.factorials[n - 1 - i]
    }
    return val;
  },
  decode(num, n = 8) {
    let arr = [];
    for (i = 0; i < n; i++) {
      let x = Math.floor(num / this.factorials[n - 1 - i])
      arr.push(x)
      num -= x * this.factorials[n - 1 - i]
    }
    for (i = n - 1; i >= 0; i--) {
      for (j = i + 1; j < n; j++) {
        if (arr[j] >= arr[i]) {
          arr[j] = arr[j] + 1
        }
      }
    }
    return arr;
  },
  dec2tern(arr) {
    return 729 * arr[0] + 243 * arr[1] + 81 * arr[2] + 27 * arr[3] + 9 * arr[4] + 3 * arr[5] + 1 * arr[6];
  },
  tern2dec(num) {
    let output = [];
    for (i = 0; i < 7; i++) {
      let n = Math.floor(num / this.threes[6 - i]);
      output.push(n);
      num -= n * this.threes[6 - i]
    }
    let tot = output.reduce((tot, val) => tot + val);
    output.push((12 - tot) % 3)
    return output;
  }
}

module.exports = hash;