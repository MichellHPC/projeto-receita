import UserProfileForm from './UserProfileForm';

function ProfileSection({ user, onUpdateUser, onDeleteUser }) {
  return (
    <section className="profile-screen panel">
      <div className="profile-screen-header">
        <h3>Perfil do Usuário</h3>
      </div>

      <UserProfileForm user={user} onSubmit={onUpdateUser} />

      <div className="profile-danger-zone">
        <h4>Zona de perigo</h4>
        <p>Excluir sua conta remove seu acesso ao sistema.</p>
        <button type="button" className="btn-secondary btn-danger-action" onClick={onDeleteUser}>
          Excluir usuário
        </button>
      </div>
    </section>
  );
}

export default ProfileSection;
