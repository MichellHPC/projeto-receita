import RecipeForm from './RecipeForm';

function RecipeDrawer({ isOpen, onClose, formProps, editingId }) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="recipe-drawer-backdrop"
        onClick={onClose}
        aria-label="Fechar cadastro de receita"
      />

      <aside className="recipe-drawer" aria-label="Cadastro de Receita">
        <div className="recipe-drawer-header">
          <h3>{editingId ? 'Editar Receita' : 'Cadastro de Receita'}</h3>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>

        <RecipeForm {...formProps} variant="drawer" />
      </aside>
    </>
  );
}

export default RecipeDrawer;
