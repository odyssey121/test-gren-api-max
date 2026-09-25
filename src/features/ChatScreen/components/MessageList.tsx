import type { RefObject } from 'react';
import { Typography } from '@maxhub/max-ui';
import type { Message } from '../../../shared/api/types';
import { formatTime, getMessageStatusLabel } from '../../../shared/helpers';

interface MessageListProps {
  messages: Message[];
  endRef: RefObject<HTMLDivElement | null>;
}

const MessageItem = ({ message }: { message: Message }) => (
  <article
    className={`message message--${message.direction}${
      message.status === 'failed' ? ' message--failed' : ''
    }`}
  >
    <Typography.Text variant="body" color="inherit">
      {message.text}
    </Typography.Text>
    <span className="message__meta">
      <Typography.Text variant="note" color="inherit">
        {formatTime(message.timestamp)}
      </Typography.Text>
      {message.direction === 'outgoing' && (
        <span
          className="message__status"
          aria-label={getMessageStatusLabel(message)}
          title={getMessageStatusLabel(message)}
        >
          {message.status === 'sending'
            ? '◷'
            : message.status === 'failed'
              ? '!'
              : '✓✓'}
        </span>
      )}
    </span>
  </article>
);

export const MessageList = ({ messages, endRef }: MessageListProps) => (
  <div className="messages" aria-live="polite">
    <div className="messages__date">
      <Typography.Text variant="note" color="secondary">
        Сегодня
      </Typography.Text>
    </div>

    {messages.length === 0 && (
      <div className="messages__empty">
        <Typography.Text variant="description" color="secondary">
          Напишите первое сообщение
        </Typography.Text>
      </div>
    )}

    {messages.map((message) => (
      <MessageItem key={message.id} message={message} />
    ))}
    <div ref={endRef} />
  </div>
);
