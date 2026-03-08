function RecipeTable({ recipes, searchTerm, onSearchTermChange, onEdit, onDelete, onPrint }) {
  return (
    <div className="panel">
      <h3>Receitas Cadastradas</h3>
      <input
        type="text"
        className="search-input"
        placeholder="Pesquisar por ID, nome ou texto"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />

      {recipes.length === 0 ? (
        <p className="empty-text">Nenhuma receita encontrada.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.id}</td>
                  <td>{recipe.nome}</td>
                  <td className="text-col">{recipe.texto}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="btn-small" onClick={() => onEdit(recipe)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-small btn-danger"
                        onClick={() => onDelete(recipe.id)}
                      >
                        Excluir
                      </button>
                      <button
                        type="button"
                        className="btn-small btn-print"
                        onClick={() => onPrint(recipe)}
                      >
                        Imprimir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecipeTable;
