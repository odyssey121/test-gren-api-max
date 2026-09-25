import { Typography } from '@maxhub/max-ui';
import './MaxLogo.css';

interface MaxLogoProps {
  compact?: boolean;
}

export const MaxLogo = ({ compact = false }: MaxLogoProps) => (
  <div className={`max-logo${compact ? ' max-logo--compact' : ''}`}>
    <span className="max-logo__mark" aria-hidden="true">
      M
    </span>
    {!compact && (
      <Typography.Title variant="large-strong" className="max-logo__word">
        MAX
      </Typography.Title>
    )}
  </div>
);
