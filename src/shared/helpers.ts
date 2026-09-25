import type { Message } from './api/types';
import type { IncomingMessage } from './hooks/useNotifications';

export const normalizePhone = (value: string): string =>
  value.replace(/\D/g, '');

export const isValidPhone = (phoneNumber: string): boolean =>
  (phoneNumber.length === 11 && phoneNumber.startsWith('7')) ||
  (phoneNumber.length === 12 && phoneNumber.startsWith('375'));

export const formatPhone = (phoneNumber: string): string => `+${phoneNumber}`;

export const formatTime = (timestamp: number): string =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

export const getMessageStatusLabel = (message: Message): string => {
  if (message.status === 'sending') {
    return 'Отправляется';
  }

  if (message.status === 'failed') {
    return 'Ошибка';
  }

  return message.direction === 'outgoing' ? 'Отправлено' : 'Получено';
};

export const pollingMessageToChatMessage = (
  message: IncomingMessage,
): Message => ({
  id: `${message.direction}-${message.sender}-${message.timestamp}-${message.text}`,
  text: message.text,
  direction: message.direction,
  timestamp:
    message.timestamp < 1_000_000_000_000
      ? message.timestamp * 1000
      : message.timestamp,
  status: message.direction === 'outgoing' ? 'sent' : 'received',
});
