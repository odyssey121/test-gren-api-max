import { FormEvent, useState } from 'react';
import { Button, Input, Typography } from '@maxhub/max-ui';
import { checkConnection } from '../../shared/api/greenApi';
import type { Credentials } from '../../shared/api/types';
import { MaxLogo } from '../../shared/ui/MaxLogo/MaxLogo';
import './CredentialsForm.css';

interface CredentialsFormProps {
  onConnect: (credentials: Credentials) => void;
}

export const CredentialsForm = ({ onConnect }: CredentialsFormProps) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const credentials: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    if (credentials.idInstance.length === 0 || credentials.apiTokenInstance.length === 0) {
      setError('Заполните оба поля');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await checkConnection(credentials);
      onConnect(credentials);
    } catch (connectionError: unknown) {
      setError(
        connectionError instanceof Error
          ? connectionError.message
          : 'Не удалось подключиться к GREEN-API',
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <main className="credentials-page">
      <div className="credentials-card">
        <MaxLogo />

        <div className="credentials-card__intro">
          <Typography.Title variant="large-strong">
            Войдите в чат
          </Typography.Title>
          <Typography.Text variant="body" color="secondary">
            Используйте данные MAX-инстанса из личного кабинета GREEN-API
          </Typography.Text>
        </div>

        <form className="credentials-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="id-instance">
            <Typography.Text variant="detail-strong">
              idInstance
            </Typography.Text>
          </label>
          <Input
            id="id-instance"
            size="large"
            inputMode="numeric"
            autoComplete="username"
            placeholder="Например, 3100000001"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            disabled={isConnecting}
          />

          <label className="field-label" htmlFor="api-token">
            <Typography.Text variant="detail-strong">
              apiTokenInstance
            </Typography.Text>
          </label>
          <Input
            id="api-token"
            type="password"
            size="large"
            autoComplete="current-password"
            placeholder="Токен инстанса"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            disabled={isConnecting}
          />

          {error !== null && (
            <Typography.Text
              variant="detail"
              className="form-error"
              role="alert"
            >
              {error}
            </Typography.Text>
          )}

          <Button
            type="submit"
            size="large"
            stretched
            loading={isConnecting}
            disabled={isConnecting}
          >
            Подключиться
          </Button>
        </form>

        <Typography.Text variant="note" color="tertiary">
          Данные не сохраняются и исчезнут после закрытия вкладки
        </Typography.Text>
      </div>
    </main>
  );
};
