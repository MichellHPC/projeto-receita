import UserProfileForm from './UserProfileForm';

function ProfileSection({ user, onUpdateUser }) {
  return (
    <section className="profile-screen panel">
      <div className="profile-screen-header">
        <h3>Perfil do Usuário</h3>
      </div>

      <UserProfileForm user={user} onSubmit={onUpdateUser} />
    </section>
  );
}

export default ProfileSection;
