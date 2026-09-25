import { ChangeEvent, FormEvent, useState } from 'react';
import { checkAccount } from '../../../shared/api/greenApi';
import type { Chat, Credentials } from '../../../shared/api/types';
import { isValidPhone, normalizePhone } from '../../../shared/helpers';

interface UseCreateChatOptions {
  credentials: Credentials;
  onChatCreated: (chat: Chat) => void;
}

interface UseCreateChatResult {
  phoneNumber: string;
  newChatError: string | null;
  isCreatingChat: boolean;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCreateChat: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useCreateChat = ({
  credentials,
  onChatCreated,
}: UseCreateChatOptions): UseCreateChatResult => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newChatError, setNewChatError] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleCreateChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = normalizePhone(phoneNumber);

    if (!isValidPhone(normalizedPhone)) {
      setNewChatError('Введите номер РФ или РБ в международном формате');
      return;
    }

    setIsCreatingChat(true);
    setNewChatError(null);

    try {
      const account = await checkAccount(credentials, normalizedPhone);

      if (!account.exist || account.chatId.length === 0) {
        setNewChatError('Для этого номера не найден аккаунт MAX');
        return;
      }

      onChatCreated({ chatId: account.chatId, phoneNumber: normalizedPhone });
      setPhoneNumber('');
    } catch (error: unknown) {
      setNewChatError(
        error instanceof Error ? error.message : 'Не удалось создать чат',
      );
    } finally {
      setIsCreatingChat(false);
    }
  };

  return {
    phoneNumber,
    newChatError,
    isCreatingChat,
    handlePhoneNumberChange,
    handleCreateChat,
  };
};
