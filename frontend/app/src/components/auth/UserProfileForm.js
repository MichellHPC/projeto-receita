import { useEffect, useState } from 'react';

function UserProfileForm({ user, onSubmit }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setNome(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await onSubmit({ nome, email, password });
    if (ok) {
      setPassword('');
    }
  };

  return (
    <div className="panel profile-panel">
      <h3>Minha Conta</h3>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <label htmlFor="profile-name">Nome</label>
        <input
          id="profile-name"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          required
        />

        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@dominio.com"
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
