import { useEffect, useRef } from 'react';
import type {
  Chat,
  Conversation,
  Credentials,
  Message,
} from '../../shared/api/types';
import { ChatSidebar } from './components/ChatSidebar';
import { ConversationHeader } from './components/ConversationHeader';
import { EmptyConversation } from './components/EmptyConversation';
import { MessageComposer } from './components/MessageComposer';
import { MessageList } from './components/MessageList';
import { useCreateChat } from './hooks/useCreateChat';
import { useMessageComposer } from './hooks/useMessageComposer';
import './ChatScreen.css';

interface ChatScreenContainerProps {
  credentials: Credentials;
  conversations: Conversation[];
  activeChat: Chat | null;
  messages: Message[];
  onChatCreated: (chat: Chat) => void;
  onChatSelected: (chatId: string) => void;
  onDisconnect: () => void;
  onMessageCreated: (chatId: string, message: Message) => void;
  onMessageUpdated: (
    chatId: string,
    temporaryId: string,
    message: Message,
  ) => void;
  onConversationClear: (chatId: string) => void;
  onConversationDelete: (chatId: string) => void;
}

export const ChatScreenContainer = ({
  credentials,
  conversations,
  activeChat,
  messages,
  onChatCreated,
  onChatSelected,
  onDisconnect,
  onMessageCreated,
  onMessageUpdated,
  onConversationClear,
  onConversationDelete,
}: ChatScreenContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    phoneNumber,
    newChatError,
    isCreatingChat,
    handlePhoneNumberChange,
    handleCreateChat,
  } = useCreateChat({ credentials, onChatCreated });
  const {
    messageText,
    sendError,
    handleMessageChange,
    handleSend,
    handleComposerKeyDown,
  } = useMessageComposer({
    credentials,
    activeChat,
    onMessageCreated,
    onMessageUpdated,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="app-shell chat-layout">
      <ChatSidebar
        credentials={credentials}
        conversations={conversations}
        activeChatId={activeChat?.chatId}
        phoneNumber={phoneNumber}
        newChatError={newChatError}
        isCreatingChat={isCreatingChat}
        onPhoneNumberChange={handlePhoneNumberChange}
        onCreateChat={handleCreateChat}
        onChatSelected={onChatSelected}
        onDisconnect={onDisconnect}
      />

      <section className="conversation" aria-label="Переписка">
        {activeChat === null ? (
          <EmptyConversation />
        ) : (
          <>
            <ConversationHeader
              chat={activeChat}
              hasMessages={messages.length > 0}
              onClear={() => onConversationClear(activeChat.chatId)}
              onDelete={() => onConversationDelete(activeChat.chatId)}
            />
            <MessageList messages={messages} endRef={messagesEndRef} />
            <MessageComposer
              messageText={messageText}
              error={sendError}
              onMessageChange={handleMessageChange}
              onKeyDown={handleComposerKeyDown}
              onSubmit={handleSend}
            />
          </>
        )}
      </section>
    </main>
  );
};
