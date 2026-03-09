import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { printRecipe } from '../utils/printRecipe';
import { validateRecipeData } from '../utils/validators';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const normalizeRecipe = (recipe) => ({
  id: recipe?.id || recipe?.receita_id || '',
  nome: recipe?.nome || '',
  texto: recipe?.descricao || recipe?.texto || '',
});

const getRequestErrorMessage = (requestError, fallbackMessage) => {
  if (!requestError?.response) {
    return 'Erro ao conectar com o servidor.';
  }

  return requestError.response?.data?.message || fallbackMessage;
};

function useRecipes({ user, setError, setSuccess, clearMessages }) {
  const [recipes, setRecipes] = useState([]);
  const [recipeNome, setRecipeNome] = useState('');
  const [recipeTexto, setRecipeTexto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecipesByUser = useCallback(async () => {
    if (!user?.id) {
      setRecipes([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/receitas/usuario/${user.id}`);
      const apiRecipes = Array.isArray(response?.data)
        ? response.data
        : response?.data?.receitas || response?.data?.data || [];

      setRecipes(apiRecipes.map(normalizeRecipe).filter((recipe) => Boolean(recipe.id)));
    } catch (requestError) {
      setRecipes([]);
      setError(getRequestErrorMessage(requestError, 'Falha ao carregar receitas do usuário.'));
    }
  }, [user?.id, setError]);

  useEffect(() => {
    fetchRecipesByUser();
  }, [fetchRecipesByUser]);

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

  const resetRecipeForm = () => {
    setRecipeNome('');
    setRecipeTexto('');
    setEditingId(null);
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const validationMessage = validateRecipeData({
      recipeNome,
      recipeTexto,
    });

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (!user?.id) {
      setError('Usuário não identificado. Faça login novamente.');
      return;
    }

    const payload = {
      nome: recipeNome.trim(),
      descricao: recipeTexto.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/receitas/${editingId}`, payload);
        setRecipes((currentRecipes) =>
          currentRecipes.map((recipe) =>
            recipe.id === editingId
              ? {
                  ...recipe,
                  nome: payload.nome,
                  texto: payload.descricao,
                }
              : recipe
          )
        );
        setSuccess('Receita atualizada com sucesso.');
        resetRecipeForm();
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/receitas`, {
        criador_id: user.id,
        ...payload,
      });

      const createdRecipe = normalizeRecipe(
        response?.data?.receita || response?.data?.data || response?.data
      );

      if (createdRecipe.id) {
        setRecipes((currentRecipes) => [...currentRecipes, createdRecipe]);
      } else {
        await fetchRecipesByUser();
      }

      setSuccess('Receita cadastrada com sucesso.');
      resetRecipeForm();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'Falha ao salvar receita.'));
    }
  };

  const handleEditRecipe = (recipe) => {
    clearMessages();
    setEditingId(recipe.id);
    setRecipeNome(recipe.nome);
    setRecipeTexto(recipe.texto);
  };

  const handleDeleteRecipe = async (id) => {
    clearMessages();

    if (!window.confirm('Tem certeza que deseja excluir esta receita?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/receitas/${id}`);
      setRecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== id));

      if (editingId === id) {
        resetRecipeForm();
      }

      setSuccess('Receita excluída com sucesso.');
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'Falha ao excluir receita.'));
    }
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
    recipeNome,
    recipeTexto,
    editingId,
    searchTerm,
    filteredRecipes,
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
