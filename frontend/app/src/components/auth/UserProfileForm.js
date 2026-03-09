import { useEffect, useState } from 'react';

function UserProfileForm({ user, onSubmit, compact = false }) {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setNome(user?.name || '');
    setLogin(user?.login || '');
    setPassword('');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await onSubmit({ nome, login, password });
    if (ok) {
      setPassword('');
    }
  };

  return (
    <div className={compact ? 'user-profile-compact' : 'panel profile-panel'}>
      {!compact && <h3>Minha Conta</h3>}
      <form className={compact ? 'user-compact-form' : 'recipe-form'} onSubmit={handleSubmit}>
        <label htmlFor="profile-name">Nome</label>
        <input
          id="profile-name"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          required
        />

        <label htmlFor="profile-login">Login</label>
        <input
          id="profile-login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="usuario.login"
          required
        />

        <label htmlFor="profile-password">Nova senha (opcional)</label>
        <input
          id="profile-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Deixe em branco para manter"
        />

        <button type="submit" className="btn-login">
          Atualizar dados
        </button>
      </form>
    </div>
  );
}

export default UserProfileForm;
