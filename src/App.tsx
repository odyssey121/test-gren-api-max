import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ChatScreenContainer } from './features/ChatScreen/ChatScreenContainer';
import { CredentialsForm } from './features/CredentialsForm/CredentialsForm';
import type { Chat, Credentials } from './shared/api/types';
import { GREEN_API_URL } from './shared/config/environment';
import { pollingMessageToChatMessage } from './shared/helpers';
import { useConversations } from './shared/hooks/useConversations';
import {
  type IncomingMessage,
  useGreenApiNotification,
} from './shared/hooks/useNotifications';

const APP_TITLE = 'Chat';

export const App = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const {
    conversations,
    activeConversation,
    activateFirstChat,
    clearActiveChat,
    createOrSelectChat,
    selectChat,
    addMessage,
    updateMessage,
    addPolledMessage,
    clearConversation,
    deleteConversation,
  } = useConversations();

  const unreadChatsCount = conversations.filter(
    (conversation) => conversation.unreadCount > 0,
  ).length;

  useEffect(() => {
    document.title = unreadChatsCount > 0
      ? `(${unreadChatsCount}) ${APP_TITLE}`
      : APP_TITLE;
  }, [unreadChatsCount]);

  const handleIncomingMessage = useCallback(
    (incomingMessage: IncomingMessage) => {
      if (
        incomingMessage.sender.length === 0 ||
        incomingMessage.text.length === 0
      ) {
        return;
      }

      addPolledMessage(
        incomingMessage.sender,
        pollingMessageToChatMessage(incomingMessage),
      );
    },
    [addPolledMessage],
  );

  useGreenApiNotification({
    idInstance: credentials?.idInstance ?? '',
    apiTokenInstance: credentials?.apiTokenInstance ?? '',
    apiUrl: GREEN_API_URL,
    onMessageReceived: handleIncomingMessage,
  });

  const handleConnect = useCallback(
    (nextCredentials: Credentials) => {
      setCredentials(nextCredentials);
      activateFirstChat();
    },
    [activateFirstChat],
  );

  const handleDisconnect = useCallback(() => {
    setCredentials(null);
    clearActiveChat();
  }, [clearActiveChat]);

  const handleChatCreated = useCallback(
    (chat: Chat) => {
      createOrSelectChat(chat);
    },
    [createOrSelectChat],
  );

  const handleChatSelected = useCallback(
    (chatId: string) => {
      selectChat(chatId);
    },
    [selectChat],
  );

  return (
    credentials === null ? (
      <CredentialsForm onConnect={handleConnect} />
    ) : (
      <ChatScreenContainer
        credentials={credentials}
        conversations={conversations}
        activeChat={activeConversation?.chat ?? null}
        messages={activeConversation?.messages ?? []}
        onChatCreated={handleChatCreated}
        onChatSelected={handleChatSelected}
        onDisconnect={handleDisconnect}
        onMessageCreated={addMessage}
        onMessageUpdated={updateMessage}
        onConversationClear={clearConversation}
        onConversationDelete={deleteConversation}
      />
    )
  );
};
