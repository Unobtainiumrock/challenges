import React, { Component } from 'react';
// import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


/**
 * 
 * TLDR
 * ====
 * we have a set amount of elements with their uniqely associated keys, so 
 * we only need to do a hash lookup to find the matching ID, overwrite the old ID's
 * name and value properties, and change the old ID's node property's
 * pointers to have the correct position in the doubly linked list.
 * 
 * Time Complexity
 * ===============
 * Hash lookup: O(1)
 * Doubly linked insertion: O(1)
 * Changing hash's match's node pointer's "left" and "right" values: Worst case 0(N),
 * since we have to compare each hash[node.left/right.value].value against the current value
 * 
 * 
 * What the cache Data Structures look like
 * ========================================
 * Hash
 * ----
 *  {
 *    id (person id): { value: Number, name: String, node: Object },
 *    id (person id): { value: Number, name: String, node: Object },
 *    id (person id): { value: Number, name: String, node: Object },
 *     ...,
 *  }
 * 
 * Node (These all get linked up into a doubly linked list)
 * ----
 *  {
 *    left: node,
 *    right node,
 *    value: Number (person id)
 *  }
 * 
 * 
 * Longer Explanation
 * ==================
 * 1) There's an organized table in descending order with static data.
 * 2) New data comes in via websocket 100-1000 times per second.
 * 3) The data coming in via websocket has the following structure:
 *    { 
 *      id: Number random number,
 *      value: Number random value,
 *      name: String random name
 *    }
 * 
 * 4) We have a "hash" instance variable on our component with the following structure:
 *    {
 *      id: { value: Number, name: String, node: Object },
 *      id: { value: Number, name: String, node: Object },
 *      id: { value: Number, name: String, node: Object },
 *      ...,
 *    }
 * 
 *  note: The "id" key is a random number here.
 * 
 * 5) When a new piece of information comes over the websocket, we check if the id of
 *    that information exists on our hash. If it does, we update the "value" and "name"
 *    properties for that specific location.
 * 
 * 6) We then change the pointers on our linked list so that it is in sorted order.
 *    We have the benefit of constant time O(1) lookup on the hash, and constant time O(1)
 *    insertion onto the linked list. It then comes down to worst case O(n) to find where the
 *    node actually belongs in the linked list.
 */

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.hash = {}
    this.idArray = [];
  }

  /**
   * Creates and initializes a connection to our websocket.
   */
  webSocketInit = () => {
    const clientSocket = new WebSocket('ws://localhost:7770');

    clientSocket.onopen = () => {
      clientSocket.send('init');
      this.webSocketOnMessage(clientSocket);
    }
  }

  /**
   * Sets up a listener for whenever a message comes through the websocket connection
   * and passes that to our cacheMessage method.
   * 
   * @param  {Object} clientSocket is the socket connection provided by the webSocketInit method.
   * 
   */
  webSocketOnMessage = (clientSocket) => {
    clientSocket.onmessage = (event) => {
      let message = null;
      try {
        message = JSON.parse(event.data);
        this.cacheMessage(message);
        // this.setState({[message.id]: { value: message.value, name: message.name } });
      } catch (error) {
        console.log('malformed message', error);
      }

    }
  }

  /**
   * This method populates the instance variables (hash and double linked list) on our class with data as it comes in. 
   * 
   * @param  {Object} message is an object received on each web socket message
   *                  properties: id, value, name.
   */
  cacheMessage = (message) => {
    const { id, value, name } = message;
    const node = this.hash[id].node;

    if (this.hash.hasOwnProperty(id)) {
      this.hash[id].value = value;
      this.hash[id].name = name;
    } else {
      this.hash[id] = { value, name }
    }

  }

  /**
   * Sorts the linked list in descending order by moving a node to its correct position.
   * 
   */
  moveNode = () => {
    
  }

  /**
   * This slows down the rate at which the data is DISPLAYED to the user on the front end,
   * since it's costly to call 100-1000 setState()'s per second. It still updates on the
   *  cache's instance variables (hash and doubly linked list) in live time.
   */
  throttle = () => {
    console.log(5);
  }



  /**
   * Populates the component's state with static data for the default render.
   */
  populateWithStaticData = () => {
    const staticData = {}

    for (let i = 99; i >= 0; i--) {
      staticData[i] = { value: i, name: 'Bob', node: null }
    }
    this.setState(staticData);
  }

  componentDidMount() {

    if (Object.keys(this.state).length === 0) {
      this.populateWithStaticData();
    }

    this.webSocketInit();
    this.throttle();
  }

  render() {
    const data = Object.values(this.state);
    const columns = [
      {
        Header: 'ID',
        accessor: 'value'
      }, {
        Header: 'Value',
        accessor: 'value'
      }, {
        Header: 'Name',
        accessor: 'name'
      }
    ]
    return (
      <ReactTable
        data={data}
        columns={columns}>
      </ReactTable>
    )
  }
}

export default App;
