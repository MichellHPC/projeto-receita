import { useEffect, useMemo, useState } from 'react';
import { getRecipesByEmail, saveRecipesByEmail } from '../utils/storage';
import { printRecipe } from '../utils/printRecipe';
import { validateRecipeData } from '../utils/validators';

function useRecipes({ user, setError, setSuccess, clearMessages }) {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState('');
  const [recipeNome, setRecipeNome] = useState('');
  const [recipeTexto, setRecipeTexto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setRecipes([]);
      return;
    }

    setRecipes(getRecipesByEmail(user.email));
  }, [user]);

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return recipes;
    }

    return recipes.filter(
      (recipe) =>
        recipe.id.toLowerCase().includes(term) ||
        recipe.nome.toLowerCase().includes(term) ||
        recipe.texto.toLowerCase().includes(term)
    );
  }, [recipes, searchTerm]);

  const persistRecipes = (nextRecipes) => {
    if (!user?.email) {
      return;
    }

    saveRecipesByEmail(user.email, nextRecipes);
    setRecipes(nextRecipes);
  };

  const resetRecipeForm = () => {
    setRecipeId('');
    setRecipeNome('');
    setRecipeTexto('');
    setEditingId(null);
  };

  const handleRecipeSubmit = (e) => {
    e.preventDefault();
    clearMessages();

    const validationMessage = validateRecipeData({
      recipeId,
      recipeNome,
      recipeTexto,
      recipes,
      editingId,
    });

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const payload = {
      id: recipeId.trim(),
      nome: recipeNome.trim(),
      texto: recipeTexto.trim(),
    };

    if (editingId) {
      const updatedRecipes = recipes.map((recipe) => (recipe.id === editingId ? payload : recipe));
      persistRecipes(updatedRecipes);
      setSuccess('Receita atualizada com sucesso.');
      resetRecipeForm();
      return;
    }

    persistRecipes([...recipes, payload]);
    setSuccess('Receita cadastrada com sucesso.');
    resetRecipeForm();
  };

  const handleEditRecipe = (recipe) => {
    clearMessages();
    setEditingId(recipe.id);
    setRecipeId(recipe.id);
    setRecipeNome(recipe.nome);
    setRecipeTexto(recipe.texto);
  };

  const handleDeleteRecipe = (id) => {
    clearMessages();

    if (!window.confirm('Tem certeza que deseja excluir esta receita?')) {
      return;
    }

    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    persistRecipes(updatedRecipes);

    if (editingId === id) {
      resetRecipeForm();
    }

    setSuccess('Receita excluída com sucesso.');
  };

  const handlePrintRecipe = (recipe) => {
    const ok = printRecipe(recipe);
    if (!ok) {
      setError('Não foi possível abrir a janela de impressão.');
    }
  };

  const clearAll = () => {
    setRecipes([]);
    setSearchTerm('');
    resetRecipeForm();
  };

  return {
    recipeId,
    recipeNome,
    recipeTexto,
    editingId,
    searchTerm,
    filteredRecipes,
    setRecipeId,
    setRecipeNome,
    setRecipeTexto,
    setSearchTerm,
    handleRecipeSubmit,
    handleEditRecipe,
    handleDeleteRecipe,
    handlePrintRecipe,
    resetRecipeForm,
    clearAll,
  };
}

export default useRecipes;
