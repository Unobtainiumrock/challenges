class Node {
  constructor(id) {
    this.left = null;
    this.right = null;
    this.id = id;
  }
}

class DoublyLinkedList {

  constructor() {
    this.head = null;
    this.tail = null;
    this.Cache = {};
    this.initializeCache();
  }

  /**
   * A simple method for building an initial arbitrary linked list of ID's ordered 99 through 0.
   * 
   * @param  {Number} nodeValue
   */
  _addNode(nodeValue) {
    const node = new Node(nodeValue);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.right = node;
      node.left = this.tail;
      this.tail = node;
    }
    return node;
  }

}

export default DoublyLinkedList