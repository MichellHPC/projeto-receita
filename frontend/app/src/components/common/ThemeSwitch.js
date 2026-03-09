function ThemeSwitch({ isDarkMode, onToggle }) {
  return (
    <button
      className={`theme-switch ${isDarkMode ? 'is-dark' : 'is-light'}`}
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label="Alternar tema claro/escuro"
      onClick={onToggle}
    >
      <span className="theme-switch-icon sun" aria-hidden="true">
        ☀
      </span>
      <span className="theme-switch-icon moon" aria-hidden="true">
        🌙
      </span>
      <span className="theme-switch-thumb" aria-hidden="true" />
    </button>
  );
}

export default ThemeSwitch;
