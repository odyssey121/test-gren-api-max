import type { ChangeEventHandler, FormEventHandler } from 'react';
import { Button, Input, Typography } from '@maxhub/max-ui';

interface NewChatFormProps {
  phoneNumber: string;
  error: string | null;
  isLoading: boolean;
  onPhoneNumberChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const NewChatForm = ({
  phoneNumber,
  error,
  isLoading,
  onPhoneNumberChange,
  onSubmit,
}: NewChatFormProps) => (
  <div className="new-chat">
    <Typography.Title variant="medium-strong">Новый чат</Typography.Title>
    <form className="new-chat__form" onSubmit={onSubmit}>
      <Input
        aria-label="Номер телефона получателя"
        inputMode="tel"
        size="medium"
        placeholder="+7 999 123-45-67"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="medium"
        stretched
        loading={isLoading}
        disabled={isLoading}
      >
        Создать чат
      </Button>
    </form>
    {error !== null && (
      <Typography.Text variant="note" className="form-error" role="alert">
        {error}
      </Typography.Text>
    )}
  </div>
);
