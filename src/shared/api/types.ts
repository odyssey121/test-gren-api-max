export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Chat {
  chatId: string;
  phoneNumber: string;
}

export type MessageDirection = 'incoming' | 'outgoing';
export type MessageStatus = 'sending' | 'sent' | 'failed' | 'received';

export interface Message {
  id: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
  status: MessageStatus;
}

export interface Conversation {
  chat: Chat;
  messages: Message[];
  unreadCount: number;
}

export interface NotificationTextData {
  textMessage?: string;
}

export interface NotificationMessageData {
  typeMessage?: string;
  textMessageData?: NotificationTextData;
}

export interface NotificationSenderData {
  chatId?: string;
  senderPhoneNumber?: number;
  senderName?: string;
}

export interface NotificationBody {
  typeWebhook?: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: NotificationSenderData;
  messageData?: NotificationMessageData;
}

export interface NotificationEnvelope {
  receiptId: number;
  body: NotificationBody;
}
