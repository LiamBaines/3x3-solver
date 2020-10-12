const fs = require('fs')
const es = require('event-stream');

let seen = new Set()

const cube = {
  corners: [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
  ],
  edges: [
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
    ['m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x']
  ],  
  cornerState(layout) {
    let l = layout
    const cornersArray = [
      [white, red, green],
      [white, green, orange],
      [white, orange, blue],
      [white, blue, red],
      [yellow, green, red],
      [yellow, orange, green],
      [yellow, blue, orange],
      [yellow, red, blue]
    ];
    const stateArray = [
      [l.top[0], l.front[0], l.left[2]],
      [l.top[6], l.left[0], l.back[2]],
      [l.top[8], l.back[0], l.right[2]],
      [l.top[2], l.right[0], l.front[2]],
      [l.bottom[6], l.left[8], l.front[6]],
      [l.bottom[0], l.back[8], l.left[6]],
      [l.bottom[2], l.right[8], l.back[6]],
      [l.bottom[8], l.front[8], l.right[6]]
    ]
    let cornerState = '';
    for (let i = 0; i < 8; i ++) {
      for (let j = 0; j < 8; j ++) {
        if (cornersArray[j].includes(stateArray[i][0]) && cornersArray[j].includes(stateArray[i][1]) && cornersArray[j].includes(stateArray[i][2])) {
          for (let k = 0; k < 3; k++) {
            if (stateArray[i][k] === white || stateArray[i][k] === yellow) {
              cornerState = cornerState.concat(cube.corners[k][j])
            }
          }
        }
      }
    }
    return cornerState;
  },
  edgeState(layout) {
    let count = 0;
    let l = layout
    const edgesArray = [
      [white, red],
      [white, green],
      [white, orange],
      [white, blue],
      [green, red],
      [green, orange],
      [blue, orange],
      [blue, red],
      [yellow, red],
      [yellow, green],
      [yellow, orange],
      [yellow, blue]
    ];
    const stateArray = [
      [l.top[1], l.front[1]],
      [l.top[3], l.left[1]],
      [l.top[7], l.back[1]],
      [l.top[5], l.right[1]],
      [l.left[5], l.front[3]],
      [l.left[3], l.back[5]],
      [l.right[5], l.back[3]],
      [l.right[3], l.front[5]],
      [l.bottom[7], l.front[7]],
      [l.bottom[3], l.left[7]],
      [l.bottom[1], l.back[7]],
      [l.bottom[5], l.right[7]]
    ];
    let edgeState = '';
    for (let i = 0; i < 12; i ++) {
      for (let j = 0; j < 12; j ++) {
        if (edgesArray[j].includes(stateArray[i][0]) && edgesArray[j].includes(stateArray[i][1])) {
          count++
          if (stateArray[i][0] !== white && stateArray[i][0] !== yellow) {
            if (stateArray[i][0] == blue || stateArray[i][0] == green) {
              edgeState = edgeState.concat(cube.edges[0][j])
            } else {
              edgeState = edgeState.concat(cube.edges[1][j])
            }
          } else {
            if (stateArray[i][0] == white || stateArray[i][0] == yellow) {
              edgeState = edgeState.concat(cube.edges[0][j])
            } else {
              edgeState = edgeState.concat(cube.edges[1][j])
            }
          }
        }
      }
    }
    return edgeState;
  },
  centreState(layout) {
    let l = layout
    let returnString = ''
    const centresArray = [
      ['#ff3133ff', '#ff7c0dff', '#f3f3f3ff', '#edd60eff', '#00a23aff', '#2563f3ff'], // red, orange, white, yellow, green, blue
      ['0', '1', '2', '3', '4', '5'] 
    ];
    const faces = ['front', 'back', 'top', 'bottom', 'left', 'right']
    for (let i = 0; i < 6; i++) {
      let col = centresArray[0].indexOf(l[faces[i]][4])
      returnString = returnString.concat(centresArray[1][col])
    }
    return returnString;
  },
  fullState(layout) {
    return this.cornerState(layout).concat(this.edgeState(layout), this.centreState(layout))
  },
  layout (coS, eS, ceS) {//   U/D,   L/R,   F/B
    //console.log('Getting layout of ', coS, '', eS, '', ceS)
    const co = {
      A: [white, green, red],
      I: [red, white, green],
      Q: [green, red, white],
      B: [white, green, orange],
      J: [orange, green, white],
      R: [green, white, orange],
      C: [white, blue, orange],
      K: [orange, white, blue],
      S: [blue, orange, white],
      D: [white, red, blue],
      L: [red, white, blue],
      T: [blue, red, white],
      E: [yellow, green, red],
      M: [green, yellow, red],
      U: [red, green, yellow],
      F: [yellow, green, orange],
      N: [orange, yellow, green],
      V: [green, orange, yellow],
      G: [yellow, blue, orange],
      O: [blue, yellow, orange],
      W: [orange, blue, yellow],
      H: [yellow, blue, red],
      P: [red, yellow, blue],
      X: [blue, red, yellow]
    };
    const e = {
      a: [white, red],
      m: [red, white],
      b: [white, green],
      n: [green, white],
      c: [white, orange],
      o: [orange, white],
      d: [white, blue],
      p: [blue, white],
      e: [green, red],
      q: [red, green],
      f: [green, orange],
      r: [orange, green],
      g: [blue, orange],
      s: [orange, blue],
      h: [blue, red],
      t: [red, blue],
      i: [yellow, red],
      u: [red, yellow],
      j: [yellow, green],
      v: [green, yellow],
      k: [yellow, orange],
      w: [orange, yellow],
      l: [yellow, blue],
      x: [blue, yellow]
    };
    const ce = {
      0: '#ff3133ff',  // red
      1: '#ff7c0dff',  // orange
      2: '#f3f3f3ff',  // white
      3: '#edd60eff',  // yellow
      4: '#00a23aff',  // green
      5: '#2563f3ff'   // blue
    }
    let returnObject = {//   U/D,   L/R,   F/B
      front: [co[coS[0]][2], e[eS[0]][1], co[coS[3]][2], e[eS[4]][1], ce[ceS[0]], e[eS[7]][1], co[coS[4]][2], e[eS[8]][1], co[coS[7]][2]],
      back: [co[coS[2]][2], e[eS[2]][1], co[coS[1]][2], e[eS[6]][1], ce[ceS[1]], e[eS[5]][1], co[coS[6]][2], e[eS[10]][1], co[coS[5]][2]],
      top: [co[coS[0]][0], e[eS[0]][0], co[coS[3]][0], e[eS[1]][0], ce[ceS[2]], e[eS[3]][0], co[coS[1]][0], e[eS[2]][0],  co[coS[2]][0]],
      bottom: [co[coS[5]][0], e[eS[10]][0], co[coS[6]][0], e[eS[9]][0], ce[ceS[3]], e[eS[11]][0], co[coS[4]][0], e[eS[8]][0], co[coS[7]][0]],
      left: [co[coS[1]][1], e[eS[1]][1], co[coS[0]][1], e[eS[5]][0], ce[ceS[4]], e[eS[4]][0], co[coS[5]][1], e[eS[9]][1], co[coS[4]][1]],
      right: [co[coS[3]][1], e[eS[3]][1], co[coS[2]][1], e[eS[7]][0], ce[ceS[5]], e[eS[6]][0], co[coS[7]][1], e[eS[11]][1], co[coS[6]][1]]
    }
    return returnObject
  },
  idToLayout (id) {
    console.log('idToLayout ', id)
    let coS = id.substring(0,8);
    let eS = id.substring(8,20);
    let ceS = id.substring(20);
    return this.layout(coS, eS, ceS)
  }
}

let white = '#f3f3f3ff'
let yellow = '#edd60eff'
let red = '#ff3133ff'
let orange = '#ff7c0dff'
let blue = '#2563f3ff'
let green = '#00a23aff'
let turnsArray = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b']

let layout = {
  front: [red, red, red, red, red, red, red, red, red],
  back: [orange, orange, orange, orange, orange, orange, orange, orange, orange],
  top: [white, white, white, white, white, white, white, white, white],
  bottom: [yellow, yellow, yellow, yellow, yellow, yellow, yellow, yellow, yellow],
  left: [green, green, green, green, green, green, green, green, green],
  right: [blue, blue, blue, blue, blue, blue, blue, blue, blue]
};

function turn(l, turns) {
  let n = turns.length;
  let maps = {
    R: [0, 1, 35, 3, 4, 32, 6, 7, 29, 20, 10, 11, 23, 13, 14, 26, 16, 17, 18, 19, 8, 21, 22, 5, 24, 25, 2, 27, 28, 9, 30, 31, 12, 33, 34, 15, 36, 37, 38, 39, 40, 41, 42, 43, 44, 51, 48, 45, 52, 49, 46, 53, 50, 47],
    r: [0, 1, 26, 3, 4, 23, 6, 7, 20, 29, 10, 11, 32, 13, 14, 35, 16, 17, 18, 19, 9, 21, 22, 12, 24, 25, 15, 27, 28, 8, 30, 31, 5, 33, 34, 2, 36, 37, 38, 39, 40, 41, 42, 43, 44, 47, 50, 53, 46, 49, 52, 45, 48, 51],
    L: [24, 1, 2, 21, 4, 5, 18, 7, 8, 9, 10, 27, 12, 13, 30, 15, 16, 33, 11, 19, 20, 14, 22, 23, 17, 25, 26, 6, 28, 29, 3, 31, 32, 0, 34, 35, 42, 39, 36, 43, 40, 37, 44, 41, 38, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    l: [33, 1, 2, 30, 4, 5, 27, 7, 8, 9, 10, 18, 12, 13, 21, 15, 16, 24, 6, 19, 20, 3, 22, 23, 0, 25, 26, 11, 28, 29, 14, 31, 32, 17, 34, 35, 38, 41, 44, 37, 40, 43, 36, 39, 42, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    F: [6, 3, 0, 7, 4, 1, 8, 5, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 44, 41, 38, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 51, 48, 45, 36, 37, 33, 39, 40, 34, 42, 43, 35, 18, 46, 47, 19, 49, 50, 20, 52, 53],
    f: [2, 5, 8, 1, 4, 7, 0, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 45, 48, 51, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 38, 41, 44, 36, 37, 20, 39, 40, 19, 42, 43, 18, 35, 46, 47, 34, 49, 50, 33, 52, 53],
    B: [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 12, 9, 16, 13, 10, 17, 14, 11, 18, 19, 20, 21, 22, 23, 47, 50, 53, 36, 39, 42, 30, 31, 32, 33, 34, 35, 26, 37, 38, 25, 40, 41, 24, 43, 44, 45, 46, 29, 48, 49, 28, 51, 52, 27],
    b: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 14, 17, 10, 13, 16, 9, 12, 15, 18, 19, 20, 21, 22, 23, 42, 39, 36, 53, 50, 47, 30, 31, 32, 33, 34, 35, 27, 37, 38, 28, 40, 41, 29, 43, 44, 45, 46, 24, 48, 49, 25, 51, 52, 26],
    U: [45, 46, 47, 3, 4, 5, 6, 7, 8, 36, 37, 38, 12, 13, 14, 15, 16, 17, 20, 23, 26, 19, 22, 25, 18, 21, 24, 27, 28, 29, 30, 31, 32, 33, 34, 35, 0, 1, 2, 39, 40, 41, 42, 43, 44, 9, 10, 11, 48, 49, 50, 51, 52, 53],
    u: [36, 37, 38, 3, 4, 5, 6, 7, 8, 45, 46, 47, 12, 13, 14, 15, 16, 17, 24, 21, 18, 25, 22, 19, 26, 23, 20, 27, 28, 29, 30, 31, 32, 33, 34, 35, 9, 10, 11, 39, 40, 41, 42, 43, 44, 0, 1, 2, 48, 49, 50, 51, 52, 53],
    D: [0, 1, 2, 3, 4, 5, 42, 43, 44, 9, 10, 11, 12, 13, 14, 51, 52, 53, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 32, 35, 28, 31, 34, 27, 30, 33, 36, 37, 38, 39, 40, 41, 15, 16, 17, 45, 46, 47, 48, 49, 50, 6, 7, 8],  
    d: [0, 1, 2, 3, 4, 5, 51, 52, 53, 9, 10, 11, 12, 13, 14, 42, 43, 44, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 30, 27, 34, 31, 28, 35, 32, 29, 36, 37, 38, 39, 40, 41, 6, 7, 8, 45, 46, 47, 48, 49, 50, 15, 16, 17],
    X: [33, 34, 35, 30, 31, 32, 27, 28, 29, 20, 19, 18, 23, 22, 21, 26, 25, 24, 6, 7, 8, 3, 4, 5, 0, 1, 2, 11, 10, 9, 14, 13, 12, 17, 16, 15, 38, 41, 44, 37, 40, 43, 36, 39, 42, 51, 48, 45, 52, 49, 46, 53, 50, 47],
    x: [24, 25, 26, 21, 22, 23, 18, 19, 20, 29, 28, 27, 32, 31, 30, 35, 34, 33, 11, 10, 9, 14, 13, 12, 17, 16, 15, 6, 7, 8, 3, 4, 5, 0, 1, 2, 42, 39, 36, 43, 40, 37, 44, 41, 38, 47, 50, 53, 46, 49, 52, 45, 48, 51],
    Y: [45, 46, 47, 48, 49, 50, 51, 52, 53, 36, 37, 38, 39, 40, 41, 42, 43, 44, 20, 23, 26, 19, 22, 25, 18, 21, 24, 33, 30, 27, 34, 31, 28, 35, 32, 29, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    y: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 24, 21, 18, 25, 22, 19, 26, 23, 20, 29, 32, 35, 28, 31, 34, 27, 30, 33, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    Z: [6, 3, 0, 7, 4, 1, 8, 5, 2, 11, 14, 17, 10, 13, 16, 9, 12, 15, 44, 41, 38, 43, 40, 37, 42, 39, 36, 53, 50, 47, 52, 49, 46, 51, 48, 45, 27, 30, 33, 28, 31, 34, 29, 32, 35, 18, 21, 24, 19, 22, 25, 20, 23, 26],
    z: [2, 5, 8, 1, 4, 7, 0, 3, 6, 15, 12, 9, 16, 13, 10, 17, 14, 11, 45, 48, 51, 46, 49, 52, 47, 50, 53, 36, 39, 42, 37, 40, 43, 38, 41, 44, 26, 23, 20, 25, 22, 19, 24, 21, 18, 35, 32, 29, 34, 31, 28, 33, 30, 27]
  }
  for (let i = 0; i < n; i ++) {
    let stickerArray = l.front.concat(l.back, l.top, l.bottom, l.left, l.right);
    let mapArray = maps[turns[i]];
    let r = mapArray.map(element => stickerArray[element]);
    l = {
      front: [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]],
      back: [r[9], r[10], r[11], r[12], r[13], r[14], r[15], r[16], r[17]],
      top: [r[18], r[19], r[20], r[21], r[22], r[23], r[24], r[25], r[26]],
      bottom: [r[27], r[28], r[29], r[30], r[31], r[32], r[33], r[34], r[35]],
      left: [r[36], r[37], r[38], r[39], r[40], r[41], r[42], r[43], r[44]],
      right: [r[45], r[46], r[47], r[48], r[49], r[50], r[51], r[52], r[53]],
    }
  }
    return l;
};

let count = 0;

const LineByLineReader = require('line-by-line'),
reader = new LineByLineReader('corners.csv');

reader.on('error', function (err) {
      // 'err' contains error object
});

reader.on('line', async function (line) {
  // pause emitting of lines...
  reader.pause();
  await f(line.slice(0,8), line.slice(9), 'U');
  await f(line.slice(0,8), line.slice(9), 'u');
  await f(line.slice(0,8), line.slice(9), 'D');
  await f(line.slice(0,8), line.slice(9), 'd');
  await f(line.slice(0,8), line.slice(9), 'R');
  await f(line.slice(0,8), line.slice(9), 'r');
  await f(line.slice(0,8), line.slice(9), 'L');
  await f(line.slice(0,8), line.slice(9), 'l');
  await f(line.slice(0,8), line.slice(9), 'F');
  await f(line.slice(0,8), line.slice(9), 'f');
  await f(line.slice(0,8), line.slice(9), 'B');
  await f(line.slice(0,8), line.slice(9), 'b');
  console.log(line)
  // ...do your asynchronous line processing..
  // ...and continue emitting lines.
  reader.resume();
});

reader.on('end', function () {
  console.log('All lines read.')
      // All lines are read, file is closed now.
});

async function f(state, depth, inputTurn) {
  count++
  //console.log('f running')
  let promise = new Promise((resolve, reject) => {
    //console.log(`turn = ${inputTurn}, state = ${state}`)
    let L = cube.layout(state, 'abcdefghijkl', '012345').valueOf()
    let add = cube.cornerState(turn(L, inputTurn, false)).valueOf();
    //console.log(add)
    if (!seen.has(add)) {
      fs.appendFile('corners.csv', `\n${add},${parseInt(depth) + 1},`, function (err) {
        resolve('Appended.');
    });
    };
    seen.add(add)
  });
  let result = await promise; // wait until the promise resolves (*)
  //console.log(result); // "done!"
}