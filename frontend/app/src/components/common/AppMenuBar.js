import { useEffect, useRef, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

function AppMenuBar({
  title,
  userLogin,
  isDarkMode,
  onToggleTheme,
  onGoToRecipes,
  onOpenProfile,
  onLogout,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const openProfile = () => {
    setIsUserMenuOpen(false);
    onOpenProfile();
  };

  const logout = () => {
    setIsUserMenuOpen(false);
    onLogout();
  };

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <h2 className="menu-title">{title}</h2>

        <button className="btn-secondary" type="button" onClick={onGoToRecipes}>
          Receitas
        </button>
      </div>
      <div className="menu-bar-right">
        <ThemeSwitch isDarkMode={isDarkMode} onToggle={onToggleTheme} />

        <div className="top-user-menu" ref={userMenuRef}>
          <button
            className="btn-user-trigger"
            type="button"
            aria-label="Abrir menu do usuário"
            onClick={() => setIsUserMenuOpen((current) => !current)}
          >
            <span className="user-name-inline">{userLogin}</span>
            <span className="btn-user-icon" aria-hidden="true">
              👤
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="user-menu-dropdown">
              <button type="button" className="dropdown-item" onClick={openProfile}>
                Perfil
              </button>
              <button type="button" className="dropdown-item" onClick={logout}>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppMenuBar;
