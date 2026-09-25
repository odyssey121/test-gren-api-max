import { useEffect, useRef } from 'react';

export interface IncomingMessage {
  sender: string;
  text: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
}

interface UseGreenApiNotificationProps {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl?: string;
  onMessageReceived: (message: IncomingMessage) => void;
  delay?: number;
}

interface GreenApiNotification {
  receiptId?: number;
  body?: {
    typeWebhook?: string;
    senderData?: {
      chatId?: string;
      sender?: string;
    };
    messageData?: {
      typeMessage?: string;
      textMessageData?: {
        textMessage?: string;
      };
    };
    timestamp?: number;
  };
}

export const useGreenApiNotification = ({
  idInstance,
  apiTokenInstance,
  apiUrl,
  onMessageReceived,
  delay = 2000,
}: UseGreenApiNotificationProps): void => {
  const savedCallback = useRef(onMessageReceived);

  useEffect(() => {
    savedCallback.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (idInstance.length === 0 || apiTokenInstance.length === 0) {
      return undefined;
    }

    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const poll = async (): Promise<void> => {
      const receiveUrl = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
      const deleteUrl = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}`;

      try {
        const response = await fetch(receiveUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 1. Защита от пустого ответа (204 No Content)
        if (response.status === 204) {
          if (isMounted) {
            timerId = setTimeout(poll, delay);
          }
          return;
        }

        // 2. Читаем ответ как текст, чтобы безопасно проверить его содержимое
        const responseText = await response.text();

        // 3. Если сервер вернул пустую строку или "null" - новых сообщений нет
        if (!responseText || responseText.trim() === 'null') {
          if (isMounted) {
            timerId = setTimeout(poll, delay);
          }
          return;
        }

        // 4. Парсим только после того, как убедились, что строка не пустая
        const notification = JSON.parse(responseText) as GreenApiNotification;

        const receiptId = notification.receiptId;
        const body = notification.body;

        const isIncoming = body?.typeWebhook === 'incomingMessageReceived';
        const isOutgoing = body?.typeWebhook === 'outgoingMessageReceived';
        const isTextMessage = body?.messageData?.typeMessage === 'textMessage';

        if ((isIncoming || isOutgoing) && isTextMessage) {
          const sender =
            body.senderData?.chatId ?? body.senderData?.sender ?? '';
          const text = body.messageData?.textMessageData?.textMessage ?? '';
          const timestamp = body.timestamp ?? Date.now();

          savedCallback.current({
            sender,
            text,
            timestamp,
            direction: isOutgoing ? 'outgoing' : 'incoming',
          });
        }

        if (receiptId !== undefined) {
          await fetch(`${deleteUrl}/${receiptId}`, { method: 'DELETE' });
        }

        if (isMounted) {
          // Если сообщение было обработано, запрашиваем следующее быстрее (через 100мс)
          timerId = setTimeout(poll, 100);
        }
      } catch (error: unknown) {
        console.error('Ошибка при опросе Green API:', error);

        if (isMounted) {
          // При сетевой ошибке увеличиваем задержку
          timerId = setTimeout(poll, delay * 2);
        }
      }
    };

    void poll();

    return () => {
      isMounted = false;

      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    };
  }, [idInstance, apiTokenInstance, apiUrl, delay]);
};
