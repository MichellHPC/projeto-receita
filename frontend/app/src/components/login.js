import { useEffect, useState } from 'react';
import AuthForm from './auth/AuthForm';
import UserProfileForm from './auth/UserProfileForm';
import Notification from './common/Notification';
import RecipeForm from './recipes/RecipeForm';
import RecipeTable from './recipes/RecipeTable';
import useAuth from '../hooks/useAuth';
import useRecipes from '../hooks/useRecipes';

const THEME_STORAGE_KEY = 'pr_theme';

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const auth = useAuth();
  const recipes = useRecipes({
    user: auth.user,
    setError: auth.setError,
    setSuccess: auth.setSuccess,
    clearMessages: auth.clearMessages,
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

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
            <p className="user-label">Usuário: {auth.user.login}</p>
          </div>
          <div className="top-actions">
            <button className="btn-theme" type="button" onClick={toggleTheme}>
              {isDarkMode ? 'Modo claro' : 'Modo noturno'}
            </button>
            <button className="btn-secondary" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />

        <UserProfileForm user={auth.user} onSubmit={auth.handleUserUpdate} />

        <div className="content-grid">
          <RecipeForm
            categories={recipes.categories}
            editingId={recipes.editingId}
            recipeCategoriaId={recipes.recipeCategoriaId}
            recipeNome={recipes.recipeNome}
            recipeTempoPreparo={recipes.recipeTempoPreparo}
            recipePorcoes={recipes.recipePorcoes}
            recipeIngredientes={recipes.recipeIngredientes}
            recipeModoPreparo={recipes.recipeModoPreparo}
            onRecipeCategoriaIdChange={recipes.setRecipeCategoriaId}
            onRecipeNomeChange={recipes.setRecipeNome}
            onRecipeTempoPreparoChange={recipes.setRecipeTempoPreparo}
            onRecipePorcoesChange={recipes.setRecipePorcoes}
            onRecipeIngredientesChange={recipes.setRecipeIngredientes}
            onRecipeModoPreparoChange={recipes.setRecipeModoPreparo}
            onSubmit={recipes.handleRecipeSubmit}
            onCancelEdit={recipes.resetRecipeForm}
          />

          <RecipeTable
            recipes={recipes.filteredRecipes}
            categories={recipes.categories}
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
      <div className="auth-top-actions">
        <button className="btn-theme" type="button" onClick={toggleTheme}>
          {isDarkMode ? 'Modo claro' : 'Modo noturno'}
        </button>
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

export default Login;