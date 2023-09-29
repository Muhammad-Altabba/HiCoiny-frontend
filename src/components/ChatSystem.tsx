// tslint:disable-next-line: no-submodule-imports
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.css';
// styles.use();
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';

require('@chatscope/chat-ui-kit-styles/dist/default/styles.css');

export default function UserStatus() {
  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={
                {
                  message: 'Hello my friend',
                  sentTime: 'just now',
                  sender: 'Joe',
                } as any
              }
            />
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
