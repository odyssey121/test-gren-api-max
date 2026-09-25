import type { ChangeEventHandler, FormEventHandler } from 'react';
import { Button, Typography } from '@maxhub/max-ui';
import type { Conversation, Credentials } from '../../../shared/api/types';
import { MaxLogo } from '../../../shared/ui/MaxLogo/MaxLogo';
import { ChatList } from './ChatList';
import { NewChatForm } from './NewChatForm';

interface ChatSidebarProps {
  credentials: Credentials;
  conversations: Conversation[];
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
  activeChatId,
  phoneNumber,
  newChatError,
  isCreatingChat,
  onPhoneNumberChange,
  onCreateChat,
  onChatSelected,
  onDisconnect,
}: ChatSidebarProps) => (
  <aside className="sidebar">
    <div className="sidebar__topbar">
      <MaxLogo compact />
      <Button
        size="small"
        variant="ghost"
        aria-label="Отключиться от GREEN-API"
        title="Отключиться"
        onClick={onDisconnect}
      >
        Выйти
      </Button>
    </div>

    <NewChatForm
      phoneNumber={phoneNumber}
      error={newChatError}
      isLoading={isCreatingChat}
      onPhoneNumberChange={onPhoneNumberChange}
      onSubmit={onCreateChat}
    />

    <ChatList
      conversations={conversations}
      activeChatId={activeChatId}
      onChatSelected={onChatSelected}
    />

    <Typography.Text
      variant="note"
      color="tertiary"
      className="sidebar__instance"
    >
      Инстанс {credentials.idInstance}
    </Typography.Text>
  </aside>
);
