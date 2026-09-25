import { Avatar, CellAction, Typography } from '@maxhub/max-ui';
import type { Conversation } from '../../../shared/api/types';
import { formatPhone } from '../../../shared/helpers';

interface ChatListProps {
  conversations: Conversation[];
  onlyUnread?: boolean;
  activeChatId?: string;
  search?: string;
  onChatSelected: (chatId: string) => void;
}

export const ChatList = ({
  conversations,
  onlyUnread = false,
  activeChatId,
  search = '',
  onChatSelected,
}: ChatListProps) => {
  const visibleConversations = conversations
    .filter((conversation) => !onlyUnread || conversation.unreadCount > 0)
    .filter((conversation) =>
      formatPhone(conversation.chat.phoneNumber).toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort((first, second) => {
      const unreadDifference = Number(second.unreadCount > 0) - Number(first.unreadCount > 0);

      if (unreadDifference !== 0) {
        return unreadDifference;
      }

      return (second.messages.at(-1)?.timestamp ?? 0) - (first.messages.at(-1)?.timestamp ?? 0);
    });

  return (
  <div className="chat-list" aria-label="Список чатов">
    {visibleConversations.length === 0 ? (
      <Typography.Text
        variant="description"
        color="tertiary"
        className="chat-list__empty"
      >
        {search ? 'Ничего не найдено' : onlyUnread ? 'Новых сообщений нет' : 'Здесь появится созданный чат'}
      </Typography.Text>
    ) : (
      visibleConversations.map((conversation) => {
        const isActive = conversation.chat.chatId === activeChatId;
        const lastMessage = conversation.messages.at(-1);

        return (
          <CellAction
            key={conversation.chat.chatId}
            className={`chat-list__item${
              isActive ? ' chat-list__item--active' : ''
            }`}
            mode="custom"
            before={(
              <Avatar.Container size={46}>
                <Avatar.Text gradient="blue">M</Avatar.Text>
              </Avatar.Container>
            )}
            aria-pressed={isActive}
            onClick={() => onChatSelected(conversation.chat.chatId)}
          >
            <span className="chat-list__details">
              <Typography.Text variant="body-strong">
                {formatPhone(conversation.chat.phoneNumber)}
              </Typography.Text>
              <Typography.Text variant="description" color="secondary">
                {lastMessage?.text ?? 'Чат создан'}
              </Typography.Text>
              <Typography.Text variant="note" color="tertiary" className="chat-list__time">
                {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
              </Typography.Text>
            </span>
            {conversation.unreadCount > 0 && (
              <span className="chat-list__unread" aria-label={`Новых сообщений: ${conversation.unreadCount}`}>
                {conversation.unreadCount}
              </span>
            )}
          </CellAction>
        );
      })
    )}
  </div>
  );
};
