import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useState,
} from 'react';
import { sendMessage } from '../../../shared/api/greenApi';
import type { Chat, Credentials, Message } from '../../../shared/api/types';

interface UseMessageComposerOptions {
  credentials: Credentials;
  activeChat: Chat | null;
  onMessageCreated: (chatId: string, message: Message) => void;
  onMessageUpdated: (
    chatId: string,
    temporaryId: string,
    message: Message,
  ) => void;
}

interface UseMessageComposerResult {
  messageText: string;
  sendError: string | null;
  handleMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
  handleComposerKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const useMessageComposer = ({
  credentials,
  activeChat,
  onMessageCreated,
  onMessageUpdated,
}: UseMessageComposerOptions): UseMessageComposerResult => {
  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  const handleSend = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const text = messageText.trim();

    if (activeChat === null || text.length === 0) {
      return;
    }

    const temporaryId = `sending-${Date.now()}`;
    const pendingMessage: Message = {
      id: temporaryId,
      text,
      direction: 'outgoing',
      timestamp: Date.now(),
      status: 'sending',
    };

    onMessageCreated(activeChat.chatId, pendingMessage);
    setMessageText('');
    setSendError(null);

    try {
      const response = await sendMessage(credentials, activeChat.chatId, text);
      onMessageUpdated(activeChat.chatId, temporaryId, {
        ...pendingMessage,
        id: response.idMessage,
        status: 'sent',
      });
    } catch (error: unknown) {
      onMessageUpdated(activeChat.chatId, temporaryId, {
        ...pendingMessage,
        status: 'failed',
      });
      setSendError(
        error instanceof Error ? error.message : 'Не удалось отправить сообщение',
      );
    }
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return {
    messageText,
    sendError,
    handleMessageChange,
    handleSend,
    handleComposerKeyDown,
  };
};
