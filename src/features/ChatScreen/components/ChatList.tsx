import { Avatar, CellAction, Typography } from '@maxhub/max-ui';
import type { Conversation } from '../../../shared/api/types';
import { formatPhone } from '../../../shared/helpers';

interface ChatListProps {
  conversations: Conversation[];
  activeChatId?: string;
  onChatSelected: (chatId: string) => void;
}

export const ChatList = ({
  conversations,
  activeChatId,
  onChatSelected,
}: ChatListProps) => (
  <div className="chat-list" aria-label="Список чатов">
    {conversations.length === 0 ? (
      <Typography.Text
        variant="description"
        color="tertiary"
        className="chat-list__empty"
      >
        Здесь появится созданный чат
      </Typography.Text>
    ) : (
      conversations.map((conversation) => {
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
            </span>
          </CellAction>
        );
      })
    )}
  </div>
);
