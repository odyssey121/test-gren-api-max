import type { Credentials, NotificationEnvelope } from './types';
import { GREEN_API_URL } from '../config/environment';

interface SendMessageResponse {
  idMessage: string;
}

interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (!isRecord(payload)) {
    return fallback;
  }

  const description = payload.description;
  const reason = payload.reason;
  const message = payload.message;

  if (typeof description === 'string') {
    return description;
  }

  if (typeof reason === 'string') {
    return reason;
  }

  return typeof message === 'string' ? message : fallback;
};

const methodUrl = (
  credentials: Credentials,
  method: string,
  suffix = '',
): string =>
  `${GREEN_API_URL}/waInstance${encodeURIComponent(credentials.idInstance)}/${method}/${encodeURIComponent(credentials.apiTokenInstance)}${suffix}`;

const readPayload = async (response: Response): Promise<unknown> => {
  const responseText = await response.text();

  if (responseText.length === 0) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
};

const request = async (
  url: string,
  init: RequestInit,
  fallbackError: string,
): Promise<unknown> => {
  const response = await fetch(url, init);
  const payload = await readPayload(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `${fallbackError} (${response.status})`));
  }

  return payload;
};

export const checkConnection = async (
  credentials: Credentials,
): Promise<void> => {
  const payload = await request(
    methodUrl(credentials, 'getStateInstance'),
    { method: 'GET' },
    'Не удалось подключиться к инстансу',
  );

  if (!isRecord(payload) || typeof payload.stateInstance !== 'string') {
    throw new Error('GREEN-API не вернул состояние инстанса');
  }

  if (
    payload.stateInstance !== 'authorized' &&
    payload.stateInstance !== 'suspended'
  ) {
    throw new Error(`Инстанс не готов к работе: ${payload.stateInstance}`);
  }
};

export const checkAccount = async (
  credentials: Credentials,
  phoneNumber: string,
): Promise<CheckAccountResponse> => {
  const payload = await request(
    methodUrl(credentials, 'checkAccount'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
    },
    'Не удалось проверить номер',
  );

  if (
    !isRecord(payload) ||
    typeof payload.exist !== 'boolean' ||
    typeof payload.chatId !== 'string'
  ) {
    throw new Error(getErrorMessage(payload, 'GREEN-API вернул неожиданный ответ'));
  }

  return { exist: payload.exist, chatId: payload.chatId };
};

export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const payload = await request(
    methodUrl(credentials, 'sendMessage'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    },
    'Не удалось отправить сообщение',
  );

  if (!isRecord(payload) || typeof payload.idMessage !== 'string') {
    throw new Error(getErrorMessage(payload, 'GREEN-API не вернул id сообщения'));
  }

  return { idMessage: payload.idMessage };
};

const parseNotification = (payload: unknown): NotificationEnvelope | null => {
  if (payload === null) {
    return null;
  }

  if (
    !isRecord(payload) ||
    typeof payload.receiptId !== 'number' ||
    !isRecord(payload.body)
  ) {
    throw new Error('GREEN-API вернул уведомление неизвестного формата');
  }

  const body = payload.body;
  const senderData = isRecord(body.senderData) ? body.senderData : undefined;
  const messageData = isRecord(body.messageData) ? body.messageData : undefined;
  const rawTextMessageData = messageData?.textMessageData;
  const textMessageData = isRecord(rawTextMessageData)
    ? rawTextMessageData
    : undefined;

  return {
    receiptId: payload.receiptId,
    body: {
      typeWebhook:
        typeof body.typeWebhook === 'string' ? body.typeWebhook : undefined,
      timestamp: typeof body.timestamp === 'number' ? body.timestamp : undefined,
      idMessage: typeof body.idMessage === 'string' ? body.idMessage : undefined,
      senderData:
        senderData === undefined
          ? undefined
          : {
              chatId:
                typeof senderData.chatId === 'string'
                  ? senderData.chatId
                  : undefined,
              senderPhoneNumber:
                typeof senderData.senderPhoneNumber === 'number'
                  ? senderData.senderPhoneNumber
                  : undefined,
              senderName:
                typeof senderData.senderName === 'string'
                  ? senderData.senderName
                  : undefined,
            },
      messageData:
        messageData === undefined
          ? undefined
          : {
              typeMessage:
                typeof messageData.typeMessage === 'string'
                  ? messageData.typeMessage
                  : undefined,
              textMessageData:
                textMessageData === undefined
                  ? undefined
                  : {
                      textMessage:
                        typeof textMessageData.textMessage === 'string'
                          ? textMessageData.textMessage
                          : undefined,
                    },
            },
    },
  };
};

export const receiveNotification = async (
  credentials: Credentials,
  signal: AbortSignal,
): Promise<NotificationEnvelope | null> => {
  const payload = await request(
    methodUrl(credentials, 'receiveNotification', '?receiveTimeout=5'),
    { method: 'GET', signal },
    'Не удалось получить сообщения',
  );

  return parseNotification(payload);
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
): Promise<void> => {
  await request(
    methodUrl(credentials, 'deleteNotification', `/${receiptId}`),
    { method: 'DELETE' },
    'Не удалось подтвердить уведомление',
  );
};
