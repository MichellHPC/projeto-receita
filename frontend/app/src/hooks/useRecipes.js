import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { printRecipe } from '../utils/printRecipe';
import { validateRecipeData } from '../utils/validators';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const normalizeRecipe = (recipe) => ({
  id: recipe?.id || recipe?.receita_id || '',
  idCategoria: recipe?.id_categorias ?? null,
  nome: recipe?.nome || '',
  tempoPreparoMinutos: recipe?.tempo_preparo_minutos ?? '',
  porcoes: recipe?.porcoes ?? '',
  modoPreparo: recipe?.modo_preparo || recipe?.descricao || recipe?.texto || '',
  ingredientes: recipe?.ingredientes || '',
});

const CATEGORY_OPTIONS = [
  { id: 1, nome: 'Bolos e tortas doces' },
  { id: 2, nome: 'Carnes' },
  { id: 3, nome: 'Aves' },
  { id: 4, nome: 'Peixes e frutos do mar' },
  { id: 5, nome: 'Saladas, molhos e acompanhamentos' },
  { id: 6, nome: 'Sopas' },
  { id: 7, nome: 'Massas' },
  { id: 8, nome: 'Bebidas' },
  { id: 9, nome: 'Doces e sobremesas' },
  { id: 10, nome: 'Lanches' },
  { id: 11, nome: 'Prato Único' },
  { id: 12, nome: 'Light' },
  { id: 13, nome: 'Alimentação Saudável' },
];

const getRequestErrorMessage = (requestError, fallbackMessage) => {
  if (!requestError?.response) {
    return 'Erro ao conectar com o servidor.';
  }

  return requestError.response?.data?.message || fallbackMessage;
};

function useRecipes({ user, setError, setSuccess, clearMessages }) {
  const [recipes, setRecipes] = useState([]);
  const [recipeCategoriaId, setRecipeCategoriaId] = useState('');
  const [recipeNome, setRecipeNome] = useState('');
  const [recipeTempoPreparo, setRecipeTempoPreparo] = useState('');
  const [recipePorcoes, setRecipePorcoes] = useState('');
  const [recipeIngredientes, setRecipeIngredientes] = useState('');
  const [recipeModoPreparo, setRecipeModoPreparo] = useState('');
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
        String(recipe.id).toLowerCase().includes(term) ||
        recipe.nome.toLowerCase().includes(term) ||
        recipe.modoPreparo.toLowerCase().includes(term) ||
        recipe.ingredientes.toLowerCase().includes(term)
    );
  }, [recipes, searchTerm]);

  const resetRecipeForm = () => {
    setRecipeCategoriaId('');
    setRecipeNome('');
    setRecipeTempoPreparo('');
    setRecipePorcoes('');
    setRecipeIngredientes('');
    setRecipeModoPreparo('');
    setEditingId(null);
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const validationMessage = validateRecipeData({
      recipeNome,
      recipeModoPreparo,
      recipeTempoPreparo,
      recipePorcoes,
    });

    if (validationMessage) {
      setError(validationMessage);
      return false;
    }

    if (!user?.id) {
      setError('Usuário não identificado. Faça login novamente.');
      return false;
    }

    const payload = {
      id_usuarios: user.id,
      id_categorias: recipeCategoriaId ? Number(recipeCategoriaId) : null,
      nome: recipeNome.trim(),
      tempo_preparo_minutos: recipeTempoPreparo ? Number(recipeTempoPreparo) : null,
      porcoes: recipePorcoes ? Number(recipePorcoes) : null,
      modo_preparo: recipeModoPreparo.trim(),
      ingredientes: recipeIngredientes.trim() || null,
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/receitas/${editingId}`, payload);
        setRecipes((currentRecipes) =>
          currentRecipes.map((recipe) =>
            recipe.id === editingId
              ? {
                  ...recipe,
                  idCategoria: payload.id_categorias,
                  nome: payload.nome,
                  tempoPreparoMinutos: payload.tempo_preparo_minutos || '',
                  porcoes: payload.porcoes || '',
                  modoPreparo: payload.modo_preparo,
                  ingredientes: payload.ingredientes || '',
                }
              : recipe
          )
        );
        setSuccess('Receita atualizada com sucesso.');
        resetRecipeForm();
        return true;
      }

      const response = await axios.post(`${API_BASE_URL}/receitas`, {
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
      return true;
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'Falha ao salvar receita.'));
      return false;
    }
  };

  const handleEditRecipe = (recipe) => {
    clearMessages();
    setEditingId(recipe.id);
    setRecipeCategoriaId(recipe.idCategoria ? String(recipe.idCategoria) : '');
    setRecipeNome(recipe.nome);
    setRecipeTempoPreparo(recipe.tempoPreparoMinutos ? String(recipe.tempoPreparoMinutos) : '');
    setRecipePorcoes(recipe.porcoes ? String(recipe.porcoes) : '');
    setRecipeIngredientes(recipe.ingredientes || '');
    setRecipeModoPreparo(recipe.modoPreparo || '');
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
    categories: CATEGORY_OPTIONS,
    recipeCategoriaId,
    recipeNome,
    recipeTempoPreparo,
    recipePorcoes,
    recipeIngredientes,
    recipeModoPreparo,
    editingId,
    searchTerm,
    filteredRecipes,
    setRecipeCategoriaId,
    setRecipeNome,
    setRecipeTempoPreparo,
    setRecipePorcoes,
    setRecipeIngredientes,
    setRecipeModoPreparo,
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
