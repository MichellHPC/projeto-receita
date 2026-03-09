import AuthForm from './auth/AuthForm';
import UserProfileForm from './auth/UserProfileForm';
import Notification from './common/Notification';
import RecipeForm from './recipes/RecipeForm';
import RecipeTable from './recipes/RecipeTable';
import useAuth from '../hooks/useAuth';
import useRecipes from '../hooks/useRecipes';

function Login() {
  const auth = useAuth();
  const recipes = useRecipes({
    user: auth.user,
    setError: auth.setError,
    setSuccess: auth.setSuccess,
    clearMessages: auth.clearMessages,
  });

  const handleLogout = () => {
    recipes.clearAll();
    auth.handleLogout();
  };

  if (auth.mode === 'app' && auth.user) {
    return (
      <div className="app-shell">
        <div className="top-bar">
          <div>
            <h2>Painel de Receitas</h2>
            <p className="user-label">Usuário: {auth.user.email}</p>
          </div>
          <button className="btn-secondary" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>

        <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />

        <UserProfileForm user={auth.user} onSubmit={auth.handleUserUpdate} />

        <div className="content-grid">
          <RecipeForm
            editingId={recipes.editingId}
            recipeNome={recipes.recipeNome}
            recipeTexto={recipes.recipeTexto}
            onRecipeNomeChange={recipes.setRecipeNome}
            onRecipeTextoChange={recipes.setRecipeTexto}
            onSubmit={recipes.handleRecipeSubmit}
            onCancelEdit={recipes.resetRecipeForm}
          />

          <RecipeTable
            recipes={recipes.filteredRecipes}
            searchTerm={recipes.searchTerm}
            onSearchTermChange={recipes.setSearchTerm}
            onEdit={recipes.handleEditRecipe}
            onDelete={recipes.handleDeleteRecipe}
            onPrint={recipes.handlePrintRecipe}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="login-form-wrap">
      <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />
      <AuthForm
        mode={auth.mode}
        nome={auth.nome}
        email={auth.email}
        password={auth.password}
        confirmPassword={auth.confirmPassword}
        onNomeChange={auth.setNome}
        onEmailChange={auth.setEmail}
        onPasswordChange={auth.setPassword}
        onConfirmPasswordChange={auth.setConfirmPassword}
        onSubmit={auth.handleAuthSubmit}
        onToggleMode={auth.toggleMode}
      />
    </div>
  );
}

export default Login;