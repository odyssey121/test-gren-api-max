import type { Conversation, Message } from '../api/types';

const STORAGE_KEY = 'max-green-api-conversations-v1';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isMessage = (value: unknown): value is Message => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    (value.direction === 'incoming' || value.direction === 'outgoing') &&
    typeof value.timestamp === 'number' &&
    (value.status === 'sending' ||
      value.status === 'sent' ||
      value.status === 'failed' ||
      value.status === 'received')
  );
};

const isConversation = (value: unknown): value is Conversation => {
  if (!isRecord(value) || !isRecord(value.chat) || !Array.isArray(value.messages)) {
    return false;
  }

  return (
    typeof value.chat.chatId === 'string' &&
    typeof value.chat.phoneNumber === 'string' &&
    value.messages.every(isMessage)
  );
};

export const loadConversations = (): Conversation[] => {
  try {
    const serialized = globalThis.localStorage.getItem(STORAGE_KEY);

    if (serialized === null) {
      return [];
    }

    const parsed = JSON.parse(serialized) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isConversation).map((conversation) => ({
      ...conversation,
      unreadCount:
        typeof conversation.unreadCount === 'number' && conversation.unreadCount > 0
          ? conversation.unreadCount
          : 0,
      messages: conversation.messages.map((message) =>
        message.status === 'sending'
          ? { ...message, status: 'failed' }
          : message,
      ),
    }));
  } catch {
    return [];
  }
};

export const saveConversations = (conversations: Conversation[]): void => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // The application remains usable when browser storage is unavailable.
  }
};
