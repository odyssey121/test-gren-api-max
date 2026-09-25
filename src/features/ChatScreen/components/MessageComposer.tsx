import type {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
} from 'react';
import { IconButton, Textarea, Typography } from '@maxhub/max-ui';

interface MessageComposerProps {
  messageText: string;
  error: string | null;
  onMessageChange: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const MessageComposer = ({
  messageText,
  error,
  onMessageChange,
  onKeyDown,
  onSubmit,
}: MessageComposerProps) => (
  <>
    {error !== null && (
      <div className="conversation__error" role="status">
        <Typography.Text variant="note" className="form-error">
          {error}
        </Typography.Text>
      </div>
    )}

    <form className="composer" onSubmit={onSubmit}>
      <Textarea
        aria-label="Сообщение"
        placeholder="Сообщение"
        rows={1}
        maxLength={4000}
        value={messageText}
        onChange={onMessageChange}
        onKeyDown={onKeyDown}
      />
      <IconButton
        type="submit"
        size="medium"
        variant="primary"
        aria-label="Отправить сообщение"
        disabled={messageText.trim().length === 0}
      >
        <span className="send-arrow" aria-hidden="true">↑</span>
      </IconButton>
    </form>
  </>
);
