import React, { useEffect, useState } from 'react';
import ChatOverSocket, { Message } from '../services/chat-over-socket';
import { Socket } from 'socket.io-client';
import { authenticate } from '../services/authenticate';
import { MessageFromPeer, RegisteredUser } from '../common/interfaces';
import { userDid } from './UserStatus';

import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const Chat = () => {
  const [messageToSent, setMessageToSent] = useState('');
  const [didToCommunicateWith, setDidToCommunicateWith] = useState('');
  const [sBtcThresholdValue, setSBtcThresholdValue] = useState('3');
  const [messages, setMessages] = useState<Message[]>([]);
  const [registrationMessage, setRegistrationMessage] = useState<string>(
    'I am interested in business networking!'
  );
  const [messagesFromPeer, setMessagesFromPeer] = useState<MessageFromPeer[]>(
    []
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<{
    [did: string]: RegisteredUser;
  }>({});

  useEffect(() => {
    console.log('registeredUsers', Object.keys(registeredUsers).length);
    const handleConnect = () => {
      console.log('Connected to the chat server');
    };

    const handleDisconnect = () => {
      console.log('Disconnected from the chat server');
    };

    const handleMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleMessageFromPeer = (args: MessageFromPeer) => {
      setMessagesFromPeer((prevMessages) => [...prevMessages, args]);
    };

    const handleNewRegisteredUser = (registeredUser: RegisteredUser) => {
      console.log('userDid', userDid);
      if (userDid !== registeredUser.decentralizedID!!) {
        registeredUsers[registeredUser.decentralizedID!!] = registeredUser;
        setRegisteredUsers({ ...registeredUsers });
      }
    };

    const newSocket = ChatOverSocket(
      handleConnect,
      handleDisconnect,
      handleMessage,
      handleMessageFromPeer,
      handleNewRegisteredUser
    );
    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleAnnounceFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (socket) {
      const userData = await authenticate();

      // TODO: signature must be sent and then verified by the receiver
      openSignatureRequestPopup({
        message: registrationMessage,
        network: new StacksTestnet(), // for mainnet, `new StacksMainnet()`
        appDetails: {
          name: 'Signing your status',
          icon: window.location.origin + '/icons8-bitcoin-64.png',
        },
        onFinish(data) {
          console.log('Signature of the message', data.signature);
          console.log('Use public key:', data.publicKey);
        },
      });

      socket.emit('register', userData);

      console.log('a register message has been emitted!');
      //   setInputValue('');
    }
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (messageToSent.trim() !== '' && socket) {
      const args = {
        data: { message: messageToSent },
        metadata: {
          signature: 'to be filled',
          senderDid: userDid,
          receiverDid: didToCommunicateWith,
        },
      };
      console.log('A message will be sent to another user!', args);
      socket.emit('sendMessageToUser', args);
      socket.send(messageToSent);
      //   setInputValue('');
    }
  };

  return (
    <div>
      <hr />
      <h3>Start networking</h3>
      <form onSubmit={handleAnnounceFormSubmit}>
        I am interested in people having sBTC more than
        <span style={{ marginLeft: 10 }}>
          <input
            type="text"
            value={sBtcThresholdValue}
            onChange={(e) => setSBtcThresholdValue(e.target.value)}
          />
        </span>
        <br />
        <span style={{ marginLeft: 10 }}>
          <input
            type="text"
            value={registrationMessage}
            style={{ minWidth: '400px' }}
            onChange={(e) => setRegistrationMessage(e.target.value)}
          />
        </span>
        <br />
        <button type="submit">Announce my status</button>
      </form>

      <hr />
      <h3>Received Personal Messages</h3>

      {messagesFromPeer.length !== 0 ? (
        <ul>
          {messagesFromPeer.map((args, index) => (
            <li key={index}>{args.data.message}</li>
          ))}
        </ul>
      ) : (
        '[no messages yet]'
      )}

      <hr />
      <h3>Available people</h3>
      {Object.keys(registeredUsers).length !== 0 ? (
        <ul>
          {Object.keys(registeredUsers).map((did) => (
            <li key={did}>{registeredUsers[did].decentralizedID}</li>
          ))}
        </ul>
      ) : (
        '[no connected peers]'
      )}

      <hr />
      <h3>Send a message</h3>
      <form onSubmit={handleFormSubmit}>
        To DID:
        <span style={{ marginLeft: 10 }}>
          <input
            type="text"
            value={didToCommunicateWith}
            style={{ minWidth: '400px' }}
            onChange={(e) => setDidToCommunicateWith(e.target.value)}
          />
        </span>
        <br />
        <br />
        Message:
        <span style={{ marginLeft: 10 }}>
          <textarea
            value={messageToSent}
            style={{ minWidth: '400px' }}
            onChange={(e) => setMessageToSent(e.target.value)}
          />
        </span>
        <br />
        <button type="submit">Send</button>
      </form>
      <hr />
      <h3>Advertisements</h3>
      <br />
      <div>(shown to profiles with free membership)</div>
      {messages.length !== 0 ? (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : (
        '[no adds received]'
      )}
      <hr />
      <h3>Note!</h3>
      <div>
        <p>
          This is a PoC in its incomplete-draft phase. And this page is used for
          illustration purposes.
        </p>
      </div>
    </div>
  );
};

export default Chat;
