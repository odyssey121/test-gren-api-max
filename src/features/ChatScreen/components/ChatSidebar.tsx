import { useState, type ChangeEventHandler, type FormEventHandler } from 'react';
import { Typography } from '@maxhub/max-ui';
import type { Conversation, Credentials } from '../../../shared/api/types';
import { ChatList } from './ChatList';
import { NewChatForm } from './NewChatForm';

interface ChatSidebarProps {
  credentials: Credentials;
  conversations: Conversation[];
  onlyUnread: boolean;
  activeChatId?: string;
  phoneNumber: string;
  newChatError: string | null;
  isCreatingChat: boolean;
  onPhoneNumberChange: ChangeEventHandler<HTMLInputElement>;
  onCreateChat: FormEventHandler<HTMLFormElement>;
  onChatSelected: (chatId: string) => void;
  onDisconnect: () => void;
}

export const ChatSidebar = ({
  credentials,
  conversations,
  onlyUnread,
  activeChatId,
  phoneNumber,
  newChatError,
  isCreatingChat,
  onPhoneNumberChange,
  onCreateChat,
  onChatSelected,
  onDisconnect,
}: ChatSidebarProps) => {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <aside className="sidebar" aria-label="Чаты">
      <div className="sidebar__topbar">
        <Typography.Title variant="large-strong">Chats</Typography.Title>
        <button
          className="sidebar__add"
          type="button"
          aria-label="Начать чат"
          aria-expanded={isNewChatOpen}
          onClick={() => setIsNewChatOpen((value) => !value)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="sidebar__search-wrap">
        <input
          className="sidebar__search"
          type="search"
          aria-label="Поиск"
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isNewChatOpen && (
        <NewChatForm
          phoneNumber={phoneNumber}
          error={newChatError}
          isLoading={isCreatingChat}
          onPhoneNumberChange={onPhoneNumberChange}
          onSubmit={onCreateChat}
        />
      )}

    <ChatList
      conversations={conversations}
      onlyUnread={onlyUnread}
      activeChatId={activeChatId}
      search={search}
      onChatSelected={onChatSelected}
    />

      <Typography.Text variant="note" color="tertiary" className="sidebar__instance">
        Инстанс {credentials.idInstance} · <button type="button" onClick={onDisconnect}>Выйти</button>
      </Typography.Text>
    </aside>
  );
};
