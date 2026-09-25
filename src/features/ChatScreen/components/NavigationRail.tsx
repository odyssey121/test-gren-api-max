import { ChatsIcon } from './icons/ChatsIcon';
import { NewMessagesIcon } from './icons/NewMessagesIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface NavigationRailProps {
  onlyUnread: boolean;
  unreadCount: number;
  onFilterChange: (onlyUnread: boolean) => void;
  onDisconnect: () => void;
}

export const NavigationRail = ({
  onlyUnread,
  unreadCount,
  onFilterChange,
  onDisconnect,
}: NavigationRailProps) => (
  <nav className="nav-rail" aria-label="Разделы">
    <button
      className={`nav-rail__item${onlyUnread ? '' : ' nav-rail__item--active'}`}
      type="button"
      onClick={() => onFilterChange(false)}
    >
      <span className="nav-rail__icon"><ChatsIcon /></span>
      <span>All</span>
    </button>
    <button
      className={`nav-rail__item${onlyUnread ? ' nav-rail__item--active' : ''}`}
      type="button"
      onClick={() => onFilterChange(true)}
    >
      <span className="nav-rail__icon">
        <NewMessagesIcon />
        {unreadCount > 0 && <b>{unreadCount}</b>}
      </span>
      <span>Новые</span>
    </button>
    <button
      className="nav-rail__item nav-rail__settings"
      type="button"
      onClick={onDisconnect}
      title="Отключиться"
    >
      <span className="nav-rail__icon"><SettingsIcon /></span>
      <span>Settings</span>
    </button>
  </nav>
);
