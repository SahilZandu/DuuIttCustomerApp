import {io} from 'socket.io-client';
import {rootStore} from '../stores/rootStore';

let Source_Url = 'https://duuitt.hashsoft.io/'; // Replace with your server URL

class WSServices {
  // Initialize the WebSocket connection
  initailizeSocket = async () => {
    const {token} = rootStore.commonStore;
    try {
      this.socket = io(Source_Url, {
        auth: {
          token: token,
        },
        // transports: ['websocket'],
        reconnection: true, // Enable reconnection
        reconnectionAttempts: Infinity, // Unlimited reconnection attempts
        reconnectionDelay: 1000, // Delay before attempting to reconnect
        reconnectionDelayMax: 5000, // Maximum delay for reconnection attempts
        // timeout: 200000, // Connection timeout
      });

      console.log('Initializing socket...', this.socket);

      // Connection established
      this.socket.on('connect', () => {
        console.log('=== Socket connected ===');
      });

      // Handle disconnection
      this.socket.on('disconnect', () => {
        console.log('=== Socket disconnected ===');
      });

      // Handle connection errors
      this.socket.on('connect_error', error => {
        console.log('=== Socket connection error ===', error);
      });

      // Other error handling
      this.socket.on('error', error => {
        console.log('=== Socket error ===', error);
      });
    } catch (error) {
      console.log('=== Socket initialization failed ===', error);
    }
  };

  // Emit events to the server
  emit(event, data = {}) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
      console.log(`Emitted event: ${event} with data:`, data);
    } else {
      console.log(`Socket is not connected, cannot emit event: ${event}`);
    }
  }

  // Listen for events from the server
  on(event, cb) {
    if (this.socket) {
      this.socket.on(event, cb); // Correcting to use 'on' for listening
      console.log(`Listening for event: ${event}`);
    } else {
      console.log(`Socket is not connected, cannot listen to event: ${event}`);
    }
  }

  off(event, cb) {
    if (this.socket) {
      this.socket.off(event, cb); // Correcting to use 'on' for listening
      console.log(`Listening for event: ${event}`);
    } else {
      console.log(`Socket is not connected, cannot listen to event: ${event}`);
    }
  }

  // Remove a specific event listener
  removeListener(listenerName) {
    if (this.socket) {
      this.socket.removeListener(listenerName);
      console.log(`Removed listener: ${listenerName}`);
    } else {
      console.log(
        `Socket is not connected, cannot remove listener: ${listenerName}`,
      );
    }
  }
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('=== Socket disconnected ===11');
    } else {
      console.log('=== No socket connection to disconnect ===');
    }
  }
}

// Exporting an instance of the socket service
const socketServices = new WSServices();

export default socketServices;
