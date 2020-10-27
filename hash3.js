const hash = {
  factorials: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800],
  twos: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
  P(n, k) {
    return this.factorials[n] / this.factorials[n - k]
  },
  getZ([p, o], k) {
    let x = this.encode(p.slice(6), k);
    let y = this.bin2dec(o.slice(6), k);
    console.log(`z = 64 * ${x} + ${y}`)
    return 64 * x + y
  },
  getState(z, k) {
    console.log(`getState(${z}, ${k})`)
    let x = Math.floor(z / 64);
    let y = z % 2187
    return [this.decode(x, k), this.dec2bin(y, k)]
  },
  encode(arr, k) {
  console.log(`encoding ${arr}`)
    for (i = 0; i < k; i++) {
      for (j = i + 1; j < k; j++) {
        if (arr[j] > arr[i]) arr[j] = arr[j] - 1
      }
    }
    val = 0;
    for (i = 0; i < k; i++) {
      val += arr[i] * this.P(12 - 1 - i, k - 1 - i)
    }
    return val;
  },
  decode(num, k) {
    let arr = [];
    for (i = 0; i < k; i++) {
      let x = Math.floor(num / this.P(12 - 1 - i, k - 1 - i))
      arr.push(x);
      num -= x * this.P(12 - 1 - i, k - 1 - i)
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
    console.log(`getting dec of ${arr}`)
    return 32 * arr[0] + 16 * arr[1] + 8 * arr[2] + 4 * arr[3] + 2 * arr[4] + arr[5]
  },
  dec2bin(num, k) {
    let arr = [];
    for (i = 0; i < k; i++) {
      arr.push((num & this.twos[k - 1 - i]) >> (k - 1 - i))
    }
    return arr;
  }
}

module.exports = hash;