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