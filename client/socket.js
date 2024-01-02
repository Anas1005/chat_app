import io from 'socket.io-client';
import { BASE_URL } from './config';


let socket=null;

const connectSocket = (user_id) => {
  console.log('Connecting socket');
  let newSocket;
    
  return new Promise((resolve, reject) => {
    newSocket = io(BASE_URL, {
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