function RecipeForm({
  editingId,
  recipeId,
  recipeNome,
  recipeTexto,
  onRecipeIdChange,
  onRecipeNomeChange,
  onRecipeTextoChange,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <div className="panel">
      <h3>{editingId ? 'Editar Receita' : 'Cadastro de Receita'}</h3>
      <form className="recipe-form" onSubmit={onSubmit}>
        <label htmlFor="recipe-id">ID</label>
        <input
          id="recipe-id"
          type="text"
          value={recipeId}
          onChange={(e) => onRecipeIdChange(e.target.value)}
          placeholder="Ex: RC001"
          required
        />

        <label htmlFor="recipe-nome">Nome</label>
        <input
          id="recipe-nome"
          type="text"
          value={recipeNome}
          onChange={(e) => onRecipeNomeChange(e.target.value)}
          placeholder="Nome da receita"
          required
        />

        <label htmlFor="recipe-texto">Descrição</label>
        <textarea
          id="recipe-texto"
          value={recipeTexto}
          onChange={(e) => onRecipeTextoChange(e.target.value)}
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
    </div>
  );
}

export default RecipeForm;
