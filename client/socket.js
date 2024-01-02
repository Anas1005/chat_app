import io from 'socket.io-client';

const isProduction = process.env.NODE_ENV === 'production';
const socketServerURL = isProduction ? 'https://chat-app-backend-f9jz.onrender.com' : 'http://localhost:4000';

let socket=null;

const connectSocket = (user_id) => {
  console.log('Connecting socket');
  let newSocket;
    
  return new Promise((resolve, reject) => {
    newSocket = io(socketServerURL, {
      query: `user_id=${user_id}`,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      socket = newSocket; // Assign the new socket to the module-level variable
      resolve(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reject(error);
    });
  });
};


export const disconnectSocket = (user_id) => {
    console.log('Disconnecting socket...');
    socket?.emit("end", {user_id});
    socket = null;
    // if (socket) {
    //   socket.disconnect();
    //   socket = null; // Set the module-level variable to null upon disconnection
    //   console.log('Socket disconnected');
    // }
  };


  
export {socket, connectSocket};