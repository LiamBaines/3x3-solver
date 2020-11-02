class binaryHeap {
  constructor() {
    this.values = [];
    this.size = 0;
  };
  swap(a, b) {
    let tmp = this.values[a];
    this.values[a] = this.values[b];
    this.values[b] = tmp;
  }
  add(node) {
    //console.log(`Adding ${node.f} to ${this.values.map(node => node.f)}`)
    //add value to bottom of tree
    this.values.push(node);
    this.size++;
    //swap until it reaches top
    let childIndex = this.size - 1;
    while (true) {
      if (childIndex == 0) break;
      let parentIndex = Math.floor((childIndex - 1) / 2);
      if (this.values[childIndex].f < this.values[parentIndex].f) {
        this.swap(childIndex, parentIndex);
        childIndex = parentIndex;
      } else break;
    }
    //console.log(`Result: ${this.values.map(node => node.f)}`)
  };
  get min() {
    //console.log(`Getting min from ${this.values.map(node => node.f)}`)
    this.swap(0, this.size - 1);
    let min = this.values.pop();
    this.size--
    let p = 0; // parent index
    while (true) {
      let l = 2 * p + 1; // left child index
      let r = 2 * p + 2; // right child index
      // exit if there's no left child
      if (l > this.size - 1) {
        break;
      }
      // if there's only a left child, swap and then exit
      if (r > this.size - 1) {
        if (this.values[p].f > this.values[l].f) {
          this.swap(p, l);
        }
        break;
      }
      // check both children to see if need to swap
      let s = (this.values[l].f < this.values[r].f) ? l : r; // index of child with smaller h
      if (this.values[p].f > this.values[s].f) {
        this.swap(p, s)
        //break;
      }
      // need to change p here
      p = s;
    }
    //console.log(`Result: got ${min.f} from  ${this.values.map(node => node.f)}`)
    return min;
  }
}

module.exports = binaryHeap;