import { useEffect, useState } from 'react';
import AuthScreen from './auth/AuthScreen';
import ProfileSection from './auth/ProfileSection';
import Notification from './common/Notification';
import AppMenuBar from './common/AppMenuBar';
import RecipeDrawer from './recipes/RecipeDrawer';
import RecipesSection from './recipes/RecipesSection';
import useAuth from '../hooks/useAuth';
import useRecipes from '../hooks/useRecipes';

const THEME_STORAGE_KEY = 'pr_theme';

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecipeDrawerOpen, setIsRecipeDrawerOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('recipes');
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
    setIsRecipeDrawerOpen(false);
    setActiveScreen('recipes');
    recipes.clearAll();
    auth.handleLogout();
  };

  const handleProfileScreenOpen = () => {
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
        <AppMenuBar
          title="Titulo do site"
          userName={auth.user.name || auth.user.login}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onGoToRecipes={handleRecipeScreenOpen}
          onOpenProfile={handleProfileScreenOpen}
          onLogout={handleLogout}
        />

        <Notification error={auth.error} success={auth.success} onClose={auth.clearMessages} />

        {activeScreen === 'profile' ? (
          <ProfileSection user={auth.user} onUpdateUser={auth.handleUserUpdate} />
        ) : (
          <RecipesSection recipes={recipes} onOpenCreate={openRecipeDrawer} onEditRecipe={handleEditRecipe} />
        )}

        <RecipeDrawer
          isOpen={isRecipeDrawerOpen}
          onClose={closeRecipeDrawer}
          formProps={recipeFormProps}
          editingId={recipes.editingId}
        />
      </div>
    );
  }

  return <AuthScreen auth={auth} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
}

export default Login;