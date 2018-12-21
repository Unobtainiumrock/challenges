import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

/**
 * 
 * TLDR
 * ====
 * We have a set amount of elements with their uniquely associated ID, so 
 * we only need to do a hash lookup to find the matching ID from a websocket msg,
 * overwrite the old ID's name and value properties, and change the old ID's node property's
 * pointers to have the correct position in the doubly linked list.
 * 
 * Time Complexity
 * ===============
 * Hash lookup for exisiting key's associated data: O(1)
 * Changing hash's match's node pointer's "left" and "right" values: Worst case 0(N),
 * since we have to compare each hash[node.left/right.id].value against the current value
 * 
 * 
 * What the cache Data Structures look like
 * ========================================
 * Hash used for lookups.
 * ----
 *  {
 *    id (person id): { value: Number, name: String, node: Object },
 *    id (person id): { value: Number, name: String, node: Object },
 *    id (person id): { value: Number, name: String, node: Object },
 *     ...,
 *  }
 */

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cache: null,
      table: {
        data: null,
        columns: [
          {
            Header: 'ID',
            accessor: 'id'
          }, {
            Header: 'Value',
            accessor: 'value'
          }, {
            Header: 'Name',
            accessor: 'name'
          }
        ]
      }
    }
    // This is separate from state as an instance variable. We map this to the state at defined periods.
    this.cache = new Map();
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
   * and passes that to our updateCache method.
   * 
   * @param  {Object} clientSocket is the socket connection provided by the webSocketInit method.
   * 
   */
  webSocketOnMessage = (clientSocket) => {
    clientSocket.onmessage = (event) => {
      let message = null;
      try {
        message = JSON.parse(event.data);
        this.updateCache(message);
        this.setState({ [message.id]: { value: message.value, name: message.name } });
      } catch (error) {
        console.log('malformed message', error);
      }
    }
  }


  initalizeAndMapCacheToState = () => {
    for (let i = 99; i >= 0; i--) {
      this.cache.set(i, { value: i, name: "Bob" });
    }
    this.setState({ cache: this.cache });
  }

  mapCacheToTable = (cache, data) => {
    if (!data.length) {
      Array.from(this.state.cache.entries()).forEach(e => {
        cache.push({
          value: e[1].value,
          name: e[1].name,
          id: e[0]
        })
      });
    }
  }

  componentWillMount() {
    if (!this.state.cache) {
      this.initializeAndMapCacheToState();
    }
  }

  componentDidMount() {
    // this.webSocketInit();
  }

  render() {

    // const data = [];

    // Array.from(this.state.cache.entries()).forEach(e => {
    //   console.log(`{
    //     value: ${e[1].value},
    //     name: ${e[1].name},
    //     id: ${e[0]}
    //   }`);
    // })
    // note: the id's and values will initially match
    // const columns = [
    //   {
    //     Header: 'ID',
    //     accessor: 'id'
    //   }, {
    //     Header: 'Value',
    //     accessor: 'value'
    //   }, {
    //     Header: 'Name',
    //     accessor: 'name'
    //   }
    // ]

    return (
      <ReactTable
        data={this.state.table.data}
        columns={this.state.table.columns}>
      </ReactTable>
    )
  }
}

export default App;
