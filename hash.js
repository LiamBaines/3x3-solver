const hash = {
  dec2bin(dec){
    return (dec >>> 0).toString(2);
  },  
  bin2dec(bin){
    return parseInt(bin, 2).toString(10);
  },
  factorials: [1, 1, 2, 6, 24, 120, 720, 5040, 40320],
  countOnes: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7], 
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
  lehmer(arr, n = 8) {
    let k = arr.length;
    let lehmer = [];
    let bitset = new Array(n);
    bitset.fill(0)
    bitset[arr[0]] = 1; 
    lehmer.push(arr[0]);
    for (i = 1; i < k; i++) {
      bitset[arr[i]] = 1;
      let num = this.bin2dec(bitset.join(''));
      num = num >> (n - arr[i]);
      lehmer.push(arr[i] - this.countOnes[num])
    };
    let val = 0;
    for (i = 0; i < k; i++) {
      val += this.P((n - 1 - i), (k - 1 - i)) * lehmer[i]
    }
    return val;
  },  
  ternary(arr) {
    return 729 * arr[0] + 243 * arr[1] + 81 * arr[2] + 27 * arr[3] + 9 * arr[4] + 3 * arr[5] + 1 * arr[6];
  }
}


module.exports = hash;