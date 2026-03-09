import { useEffect, useRef, useState } from 'react';
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
  const [isRecipeDrawerOpen, setIsRecipeDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('recipes');
  const userMenuRef = useRef(null);
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef?.current && !userMenuRef.current.contains(event.target)) {
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
  }, [userMenuRef]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  const handleLogout = () => {
    setIsRecipeDrawerOpen(false);
    setIsUserMenuOpen(false);
    setActiveScreen('recipes');
    recipes.clearAll();
    auth.handleLogout();
  };

  const handleProfileScreenOpen = () => {
    setIsUserMenuOpen(false);
    setIsRecipeDrawerOpen(false);
    setActiveScreen('profile');
  };

  const handleRecipeScreenOpen = () => {
    setActiveScreen('recipes');
  };

  const openRecipeDrawer = () => {
    setIsRecipeDrawerOpen(true);
  };

  const closeRecipeDrawer = () => {
    setIsRecipeDrawerOpen(false);
  };

  const handleRecipeSubmit = async (e) => {
    const ok = await recipes.handleRecipeSubmit(e);
    if (ok) {
      closeRecipeDrawer();
    }
  };

  const handleEditRecipe = (recipe) => {
    openRecipeDrawer();
    recipes.handleEditRecipe(recipe);
  };

  const recipeFormProps = {
    categories: recipes.categories,
    editingId: recipes.editingId,
    recipeCategoriaId: recipes.recipeCategoriaId,
    recipeNome: recipes.recipeNome,
    recipeTempoPreparo: recipes.recipeTempoPreparo,
    recipePorcoes: recipes.recipePorcoes,
    recipeIngredientes: recipes.recipeIngredientes,
    recipeModoPreparo: recipes.recipeModoPreparo,
    onRecipeCategoriaIdChange: recipes.setRecipeCategoriaId,
    onRecipeNomeChange: recipes.setRecipeNome,
    onRecipeTempoPreparoChange: recipes.setRecipeTempoPreparo,
    onRecipePorcoesChange: recipes.setRecipePorcoes,
    onRecipeIngredientesChange: recipes.setRecipeIngredientes,
    onRecipeModoPreparoChange: recipes.setRecipeModoPreparo,
    onSubmit: handleRecipeSubmit,
    onCancelEdit: recipes.resetRecipeForm,
  };

  if (auth.mode === 'app' && auth.user) {
    return (
      <div className="app-shell">
        <div className="menu-bar">
          <div className="menu-bar-left">
            <h2 className="menu-title">Titulo do site </h2>

            <button className="btn-secondary" type="button" onClick={handleRecipeScreenOpen}>
              Receitas
            </button>

          </div>
          <div className="menu-bar-right">
            <button className="btn-theme" type="button" onClick={toggleTheme}>
              {isDarkMode ? 'Modo claro' : 'Modo noturno'}
            </button>

            <div className="top-user-menu" ref={userMenuRef}>
              <button
                className="btn-user-trigger"
                type="button"
                aria-label="Abrir menu do usuário"
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <span className="user-name-inline">{auth.user.login}</span>
                <span className="btn-user-icon" aria-hidden="true">
                  👤
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown">
                  <button type="button" className="dropdown-item" onClick={handleProfileScreenOpen}>
                    Perfil
                  </button>
                  <button type="button" className="dropdown-item" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />

        {activeScreen === 'profile' ? (
          <section className="profile-screen panel">
            <div className="profile-screen-header">
              <h3>Perfil do Usuário</h3>
            </div>

            <UserProfileForm user={auth.user} onSubmit={auth.handleUserUpdate} />
          </section>
        ) : (
          <div className="table-main-section">
            <RecipeTable
              recipes={recipes.filteredRecipes}
              categories={recipes.categories}
              searchTerm={recipes.searchTerm}
              onSearchTermChange={recipes.setSearchTerm}
              onEdit={handleEditRecipe}
              onDelete={recipes.handleDeleteRecipe}
              onPrint={recipes.handlePrintRecipe}
              onOpenCreate={openRecipeDrawer}
            />
          </div>
        )}

        {isRecipeDrawerOpen && (
          <>
            <button
              type="button"
              className="recipe-drawer-backdrop"
              onClick={closeRecipeDrawer}
              aria-label="Fechar cadastro de receita"
            />
            <aside className="recipe-drawer" aria-label="Cadastro de Receita">
              <div className="recipe-drawer-header">
                <h3>{recipes.editingId ? 'Editar Receita' : 'Cadastro de Receita'}</h3>
                <button type="button" className="btn-secondary" onClick={closeRecipeDrawer}>
                  Fechar
                </button>
              </div>

              <RecipeForm
                {...recipeFormProps}
                variant="drawer"
              />
            </aside>
          </>
        )}
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