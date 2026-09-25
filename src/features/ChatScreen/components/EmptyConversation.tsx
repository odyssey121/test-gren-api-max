import { Typography } from '@maxhub/max-ui';

export const EmptyConversation = () => (
  <div className="conversation__placeholder">
    <div className="conversation__placeholder-icon" aria-hidden="true">✦</div>
    <Typography.Title variant="medium-strong">
      Выберите получателя
    </Typography.Title>
    <Typography.Text variant="body" color="secondary">
      Введите номер телефона слева, чтобы начать переписку в MAX
    </Typography.Text>
  </div>
);
