// components/SettingsComponent.js
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setLanguage, toggleNotifications } from '../redux/slices/settingsSlice';

const SettingsComponent = () => {
  const dispatch = useDispatch();
  const { theme, language, notificationsEnabled } = useSelector((state) => state.settings);

  const handleThemeChange = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
  };

  const handleToggleNotifications = () => {
    dispatch(toggleNotifications());
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <p>Theme: {theme}</p>
        <button onClick={handleThemeChange}>Toggle Theme</button>
      </div>
      <div>
        <p>Language: {language}</p>
        <button onClick={() => handleLanguageChange('fr')}>Change Language to French</button>
      </div>
      <div>
        <p>Notifications: {notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
        <button onClick={handleToggleNotifications}>Toggle Notifications</button>
      </div>
    </div>
  );
};

export default SettingsComponent;