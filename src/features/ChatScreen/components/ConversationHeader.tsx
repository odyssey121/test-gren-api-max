import { Avatar, Button, Typography } from '@maxhub/max-ui';
import type { Chat } from '../../../shared/api/types';
import { formatPhone } from '../../../shared/helpers';

interface ConversationHeaderProps {
  chat: Chat;
  hasMessages: boolean;
  onClear: () => void;
  onDelete: () => void;
}

export const ConversationHeader = ({
  chat,
  hasMessages,
  onClear,
  onDelete,
}: ConversationHeaderProps) => (
  <header className="conversation__header">
    <Avatar.Container size={42}>
      <Avatar.Text gradient="blue">M</Avatar.Text>
    </Avatar.Container>
    <div className="conversation__heading">
      <Typography.Text variant="body-strong">
        {formatPhone(chat.phoneNumber)}
      </Typography.Text>
      <Typography.Text variant="description" color="secondary">
        MAX
      </Typography.Text>
    </div>
    <div className="conversation__actions">
      <Button
        type="button"
        size="xsmall"
        variant="secondary"
        onClick={onClear}
        disabled={!hasMessages}
      >
        Стереть переписку
      </Button>
      <Button
        type="button"
        size="xsmall"
        variant="secondary"
        className="conversation__delete-button"
        onClick={onDelete}
      >
        Удалить чат
      </Button>
    </div>
    <span
      className="connection-dot"
      title="Получение сообщений включено"
      aria-label="Получение сообщений включено"
    />
  </header>
);
