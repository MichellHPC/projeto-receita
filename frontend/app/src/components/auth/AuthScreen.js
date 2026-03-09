import AuthForm from './AuthForm';
import Notification from '../common/Notification';
import ThemeSwitch from '../common/ThemeSwitch';

function AuthScreen({ auth, isDarkMode, onToggleTheme }) {
  return (
    <div className="login-form-wrap">
      <div className="auth-top-actions">
        <ThemeSwitch isDarkMode={isDarkMode} onToggle={onToggleTheme} />
      </div>

      <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />

      <AuthForm
        mode={auth.mode}
        nome={auth.nome}
        login={auth.login}
        password={auth.password}
        confirmPassword={auth.confirmPassword}
        onNomeChange={auth.setNome}
        onLoginChange={auth.setLogin}
        onPasswordChange={auth.setPassword}
        onConfirmPasswordChange={auth.setConfirmPassword}
        onSubmit={auth.handleAuthSubmit}
        onToggleMode={auth.toggleMode}
      />
    </div>
  );
}

export default AuthScreen;
