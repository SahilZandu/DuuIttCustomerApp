import { io } from 'socket.io-client';
import { rootStore } from '../stores/rootStore';
import Url from '../api/Url';

// let Source_Url = 'https://duuitt.hashsoft.io/'; // Replace with your server URL
let Source_Url = Url?.Base_Url // Replace with your server URL

class WSServices {
  // Initialize the WebSocket connection
  initailizeSocket = async () => {
    const { token } = rootStore.commonStore;
    try {
      this.socket = io(Source_Url, {
        auth: {
          token: token,
        },
        // transports: ['websocket'],
        path: '/socket.io',
        reconnection: true, // Enable reconnection
        reconnectionAttempts: Infinity, // Unlimited reconnection attempts
        reconnectionDelay: 1000, // Delay before attempting to reconnect
        reconnectionDelayMax: 5000, // Maximum delay for reconnection attempts
        timeout: 200000, // Connection timeout
        forceNew: true, // Create new connection each time
        autoConnect: true,
      });

      console.log('Initializing socket...', this.socket);

      // Connection established
      this.socket.on('connect', () => {
        console.log('=== Socket connected ===');
      });


      // Handle disconnection
      // this.socket.on('disconnect', () => {
      //   console.log('=== Socket disconnected ===');
      //   // if (reason === 'io server disconnect') {
      //   //   this.socket.connect(); // reconnect manually if the server disconnected us
      //   // } else {
      //   this.socket.connect(); // reconnect manually if the server disconnected us
      //   // }
      // });
      this.socket.on('disconnect', (reason) => {
        console.log("disconnect", reason);
        // if (reason === 'io server disconnect' || reason === 'transport close') {
        //   this.socket.auth = { token: token };
        //   this.socket.connect();
        // }
      });

      // Handle connection errors
      this.socket.on('connect_error', error => {
        console.log('=== Socket connection error ===', error);
        setTimeout(() => {
          if (this.socket && !this.socket.connected) {
            console.log('🔁 Retrying socket connection...');
            this.socket.auth = { token: token };
            this.socket.connect();
          }
        }, 3000);
      });

      // Other error handling
      this.socket.on('error', error => {
        console.log('=== Socket error ===', error);
      });
    } catch (error) {
      console.log('=== Socket initialization failed ===', error);
    }
  };

  // 🔥🔥 ADD THIS
  isSocketConnected() {
    console.log("isSocketConnected", this.socket?.connected, this.socket?.connected ?? false);
    return this.socket?.connected || false;
  }
  // Emit events to the server
  emit(event, data = {}) {
    if ((this.socket && this.socket.connected)) {
      this.socket.emit(event, data);
      console.log(`Emitted event: ${event} with data:`, data);
    } else {
      console.log(`Socket is not connected, cannot emit event: ${event}`)
    }
  }

  // Listen for events from the server
  on(event, cb) {
    if ((this.socket && this.socket.connected)) {
      this.socket.on(event, cb); // Correcting to use 'on' for listening
      console.log(`Listening for event: ${event}`);
    } else {
      console.log(`Socket is not connected, cannot listen to event: ${event}`);
    }
  }

  off(event, cb) {
    if ((this.socket && this.socket.connected)) {
      this.socket.off(event, cb); // Correcting to use 'on' for listening
      console.log(`Listening for event: ${event}`);
    } else {
      console.log(`Socket is not connected, cannot listen to event: ${event}`);
    }
  }

  // Remove a specific event listener
  removeListener(listenerName) {
    if ((this.socket && this.socket.connected)) {
      this.socket.removeListener(listenerName);
      console.log(`Removed listener: ${listenerName}`);
    } else {
      console.log(
        `Socket is not connected, cannot remove listener: ${listenerName}`,

      );
    }
  }

  // Remove all event listeners
  removeAllListeners() {
    if ((this.socket && this.socket.connected)) {
      this.socket.removeAllListeners();
      console.log('✅ All socket listeners removed');
    } else {
      console.log('⚠️ Socket not connected — no listeners to remove');
    }
  }

  disconnectSocket() {
    if ((this.socket && this.socket.connected)) {
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
