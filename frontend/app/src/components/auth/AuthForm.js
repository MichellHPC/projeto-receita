function AuthForm({
  mode,
  nome,
  login,
  password,
  confirmPassword,
  onNomeChange,
  onLoginChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onToggleMode,
}) {
  return (
    <>
      <h2>{mode === 'login' ? 'Login' : 'Cadastro de Usuário'}</h2>

      <form className="login-form" onSubmit={onSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        )}

        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => onLoginChange(e.target.value)}
          placeholder="Digite seu login"
          required
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Digite sua senha"
          required
        />

        {mode === 'register' && (
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
        )}

        <button type="submit" className="btn-login">
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="auth-switch">
        {mode === 'login' ? 'Ainda não possui conta?' : 'Já possui conta?'}{' '}
        <button type="button" className="link-button" onClick={onToggleMode}>
          {mode === 'login' ? 'Cadastrar usuário' : 'Ir para login'}
        </button>
      </div>
    </>
  );
}

export default AuthForm;
