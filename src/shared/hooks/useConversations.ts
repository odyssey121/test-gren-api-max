import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Chat, Conversation, Message } from '../api/types';
import {
  loadConversations,
  saveConversations,
} from '../storage/conversationsStorage';

interface UseConversationsResult {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activateFirstChat: () => void;
  clearActiveChat: () => void;
  createOrSelectChat: (chat: Chat) => void;
  selectChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (
    chatId: string,
    temporaryId: string,
    message: Message,
  ) => void;
  addPolledMessage: (chatId: string, message: Message) => void;
  clearConversation: (chatId: string) => void;
  deleteConversation: (chatId: string) => void;
}

export const useConversations = (): UseConversationsResult => {
  const [conversations, setConversations] = useState<Conversation[]>(
    loadConversations,
  );
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.chat.chatId === activeChatId,
      ) ?? null,
    [activeChatId, conversations],
  );

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if (
      activeChatId !== null &&
      !conversations.some(
        (conversation) => conversation.chat.chatId === activeChatId,
      )
    ) {
      setActiveChatId(conversations[0]?.chat.chatId ?? null);
    }
  }, [activeChatId, conversations]);

  const activateFirstChat = useCallback(() => {
    setActiveChatId((currentChatId) =>
      currentChatId ?? conversations[0]?.chat.chatId ?? null,
    );
  }, [conversations]);

  const clearActiveChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  const createOrSelectChat = useCallback((chat: Chat) => {
    setConversations((currentConversations) => {
      const existingConversation = currentConversations.find(
        (conversation) => conversation.chat.chatId === chat.chatId,
      );

      if (existingConversation !== undefined) {
        return [
          { ...existingConversation, chat },
          ...currentConversations.filter(
            (conversation) => conversation.chat.chatId !== chat.chatId,
          ),
        ];
      }

      return [{ chat, messages: [] }, ...currentConversations];
    });
    setActiveChatId(chat.chatId);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const addMessage = useCallback((chatId: string, message: Message) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.chat.chatId === chatId
          ? { ...conversation, messages: [...conversation.messages, message] }
          : conversation,
      ),
    );
  }, []);

  const updateMessage = useCallback(
    (chatId: string, temporaryId: string, message: Message) => {
      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.chat.chatId === chatId
            ? {
                ...conversation,
                messages: conversation.messages.map((currentMessage) =>
                  currentMessage.id === temporaryId ? message : currentMessage,
                ),
              }
            : conversation,
        ),
      );
    },
    [],
  );

  const addPolledMessage = useCallback((chatId: string, message: Message) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.chat.chatId !== chatId) {
          return conversation;
        }

        const alreadyExists = conversation.messages.some(
          (currentMessage) => currentMessage.id === message.id,
        );

        return alreadyExists
          ? conversation
          : {
              ...conversation,
              messages: [...conversation.messages, message],
            };
      }),
    );
  }, []);

  const clearConversation = useCallback((chatId: string) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.chat.chatId === chatId
          ? { ...conversation, messages: [] }
          : conversation,
      ),
    );
  }, []);

  const deleteConversation = useCallback((chatId: string) => {
    setConversations((currentConversations) =>
      currentConversations.filter(
        (conversation) => conversation.chat.chatId !== chatId,
      ),
    );
  }, []);

  return {
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
  };
};
