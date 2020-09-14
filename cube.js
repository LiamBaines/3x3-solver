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
  facing() {

  },
  rotation() {

  },
  cornerState(layout) {
    let l = layout
    let cornersArray = [
      [white, red, green],
      [white, orange, green],
      [white, orange, blue],
      [white, blue, red],
      [yellow, red, green],
      [yellow, orange, green],
      [yellow, orange, blue],
      [yellow, blue, red]
    ];
    let stateArray = [
      [l.top[0], l.left[2], l.front[0]],
      [l.top[6], l.left[0], l.back[2]],
      [l.top[8], l.right[2], l.back[0]],
      [l.top[2], l.right[0], l.front[2]],
      [l.bottom[6], l.left[8], l.front[6]],
      [l.bottom[0], l.left[6], l.back[8]],
      [l.bottom[2], l.right[8], l.back[6]],
      [l.bottom[8], l.right[6], l.front[8]]
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
    let edgesArray = [
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
    let stateArray = [
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
  turn() {

  },
  get solution() {

  }
}