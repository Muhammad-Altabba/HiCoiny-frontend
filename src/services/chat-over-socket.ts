import socketIOClient, { Socket } from 'socket.io-client';
import { MessageFromPeer, RegisteredUser } from '../common/interfaces';

export type Message = string;

const ChatOverSocket = (
  onConnect: () => void,
  onDisconnect: () => void,
  onMessage: (message: Message) => void,
  onMessageFromPeer: (args: MessageFromPeer) => void,
  onNewRegisteredUser: (registeredUser: RegisteredUser) => void
) => {
  const socket: Socket = socketIOClient(
    'http://localhost:3000/',
    { path: '/api/v1/socket' } // Replace the URL with your server's URL
  );

  socket.on('connect', () => {
    console.log('connect!!!');
    onConnect();
  });

  socket.on('disconnect', () => {
    console.log('disconnect!!!');
    onDisconnect();
  });

  socket.on('message', (message: Message) => {
    console.log('message!!!', message);
    onMessage(message);
  });

  socket.on('messageFromPeer', (args: MessageFromPeer) => {
    console.log('Message from a Peer!!!', args);
    onMessageFromPeer(args);
  });

  socket.on('newRegisteredUser', (registeredUser: RegisteredUser) => {
    console.log('New Registered User!!!', registeredUser);
    onNewRegisteredUser(registeredUser);
  });

  return socket;
};

export default ChatOverSocket;
