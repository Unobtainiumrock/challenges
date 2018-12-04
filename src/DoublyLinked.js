class Node {
  constructor(value) {
    this.left = null;
    this.right = null;
    this.value = value;
  }
}

class DoublyLinked {
  
  constructor(node) {
    this.head = null;
    this.tail = null;
  }

  addNode(nodeValue) {
    const node = new Node(nodeValue);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {

    }

  }

}