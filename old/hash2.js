const hash = {
  factorials: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800],
  twos: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
  P(n, k) {
    return this.factorials[n] / this.factorials[n - k]
  },
  getZ([p, o]) {
    let n = p.length;
    let x = this.encode(p.slice(0, n));
    let y = this.bin2dec(o.slice(0, n));
    return 64 * x + y
  },
  getState(z) {
    let x = Math.floor(z / 64);
    let y = z % 2187
    return [this.decode(x), this.dec2bin(y)]
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
      val += arr[i] * this.P(12 - 1 - i, n - 1 - i)
    }
    return val;
  },
  decode(num) {
    let arr = [];
    for (i = 0; i < 6; i++) {
      let x = Math.floor(num / this.P(12 - 1 - i, 6 - 1 - i))
      arr.push(x);
      num -= x * this.P(12 - 1 - i, 6 - 1 - i)
    }
    for (i = k - 1; i >=0; i--) {
      for (j = i + 1; j < k; j++) {
        if (arr[j] >= arr[i]) {
          arr[j] = arr[j] + 1
        }
      }
    }
    return arr;
  },
  bin2dec(arr) {
    let n = arr.length;
    let val = 0;
    arr.forEach((e, i) => {
      val += e * this.twos[n - 1 - i]
    })
    return val
  },
  dec2bin(num) {
    let arr = [];
    for (i = 0; i < 6; i++) {
      arr.push((num & this.twos[6 - 1 - i]) >> (6 - 1 - i))
    }
    return arr;
  }
}

module.exports = hash;