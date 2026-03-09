function RecipeForm({
  variant = 'panel',
  categories,
  editingId,
  recipeCategoriaId,
  recipeNome,
  recipeTempoPreparo,
  recipePorcoes,
  recipeIngredientes,
  recipeModoPreparo,
  onRecipeCategoriaIdChange,
  onRecipeNomeChange,
  onRecipeTempoPreparoChange,
  onRecipePorcoesChange,
  onRecipeIngredientesChange,
  onRecipeModoPreparoChange,
  onSubmit,
  onCancelEdit,
}) {
  const formContent = (
    <form className="recipe-form" onSubmit={onSubmit}>
      <label htmlFor="recipe-categoria">Categoria</label>
      <select
        id="recipe-categoria"
        value={recipeCategoriaId}
        onChange={(e) => onRecipeCategoriaIdChange(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.nome}
          </option>
        ))}
      </select>

      <label htmlFor="recipe-nome">Nome</label>
      <input
        id="recipe-nome"
        type="text"
        value={recipeNome}
        onChange={(e) => onRecipeNomeChange(e.target.value)}
        placeholder="Nome da receita"
        required
      />

      <label htmlFor="recipe-tempo">Tempo de preparo (min)</label>
      <input
        id="recipe-tempo"
        type="number"
        min="1"
        value={recipeTempoPreparo}
        onChange={(e) => onRecipeTempoPreparoChange(e.target.value)}
        placeholder="Ex: 45"
      />

      <label htmlFor="recipe-porcoes">Porções</label>
      <input
        id="recipe-porcoes"
        type="number"
        min="1"
        value={recipePorcoes}
        onChange={(e) => onRecipePorcoesChange(e.target.value)}
        placeholder="Ex: 6"
      />

      <label htmlFor="recipe-ingredientes">Ingredientes</label>
      <textarea
        id="recipe-ingredientes"
        value={recipeIngredientes}
        onChange={(e) => onRecipeIngredientesChange(e.target.value)}
        placeholder="Liste os ingredientes da receita"
        rows={4}
      />

      <label htmlFor="recipe-modo-preparo">Modo de preparo</label>
      <textarea
        id="recipe-modo-preparo"
        value={recipeModoPreparo}
        onChange={(e) => onRecipeModoPreparoChange(e.target.value)}
        placeholder="Digite o modo de preparo da receita"
        rows={6}
        required
      />

      <div className="recipe-actions">
        <button type="submit" className="btn-login">
          {editingId ? 'Atualizar Receita' : 'Cadastrar Receita'}
        </button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  );

  if (variant === 'drawer') {
    return formContent;
  }

  return (
    <div className="panel">
      <h3>{editingId ? 'Editar Receita' : 'Cadastro de Receita'}</h3>
      {formContent}
    </div>
  );
}

export default RecipeForm;
