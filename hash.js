const hash = {
  factorials: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800],
  twos: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
  threes: [1, 3, 9, 27, 81, 243, 729, 2187],
  P(n, k) {
    return this.factorials[n] / this.factorials[n - k]
  },
  getZ([p, o]) { 
    let n = p.length;
    let x = this.encode(p.slice());
    let y = (n == 6) ? this.bin2dec(o.slice()) : this.tern2dec(o.slice())
    let a = (n == 6) ? 64 : 2187;
    return a * x + y
  },
  getState(z) {
    let x = Math.floor(z / 2187);
    let y = z % 2187;
    return [this.decode(x), this.tern2dec(y)]
  },  
  encode(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (arr[j] > arr[i]) arr[j] = arr[j] - 1
      }
    }
    val = 0;
    let k;
    [n, k] = (n == 8) ? [8, 8] : [12, 6];
    for (let i = 0; i < k; i++) {     
      val += arr[i] * this.P(n - 1 - i, k - 1 - i);
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
  tern2dec(arr) {
    return 729 * arr[0] + 243 * arr[1] + 81 * arr[2] + 27 * arr[3] + 9 * arr[4] + 3 * arr[5] + 1 * arr[6];
  },
  dec2tern(num) {
    let output = [];
    for (i = 0; i < 7; i++) {
      let n = Math.floor(num / this.threes[6 - i]);
      output.push(n);
      num -= n * this.threes[6 - i]
    }
    let tot = output.reduce((tot, val) => tot + val);
    output.push((12 - tot) % 3)
    return output;
  },
  bin2dec(arr) {
    let n = arr.length;
    let val = 0;
    arr.forEach((e, i) => {
      val += e * this.twos[n - 1 - i]
    })
    return val
  },
}

module.exports = hash;