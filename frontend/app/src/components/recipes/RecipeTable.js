import { useEffect, useRef, useState } from 'react';

function RecipeTable({ recipes, categories, searchTerm, onSearchTermChange, onEdit, onDelete, onPrint }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const tableRef = useRef(null);
  const PAGE_SIZE = 8;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!tableRef.current?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleMenu = (id, event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const nextLeft = Math.max(8, buttonRect.right - 150);
    const nextTop = buttonRect.bottom + 6;

    setMenuPosition({ top: nextTop, left: nextLeft });
    setOpenMenuId((currentId) => (currentId === id ? null : id));
  };

  const handleAction = (action) => {
    setOpenMenuId(null);
    action();
  };

  const openDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenMenuId(null);
  };

  const closeDetails = () => {
    setSelectedRecipe(null);
  };

  const getCategoryName = (idCategoria) => {
    const category = categories.find((item) => item.id === Number(idCategoria));
    return category?.nome || '-';
  };

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null);
  }, [recipes.length, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedRecipes = recipes.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <div className="panel" ref={tableRef}>
      <h3>Receitas Cadastradas</h3>
      <input
        type="text"
        className="search-input"
        placeholder="Pesquisar por ID, nome, preparo ou ingredientes"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />

      {recipes.length === 0 ? (
        <p className="empty-text">Nenhuma receita encontrada.</p>
      ) : (
        <div className="table-wrap compact-table-wrap">
          <table className="compact-table">
            <thead>
              <tr>
                <th className="name-col">Nome</th>
                <th>Categoria</th>
                <th className="action-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="name-col">{recipe.nome}</td>
                  <td>
                    <span className="category-badge">{getCategoryName(recipe.idCategoria)}</span>
                  </td>
                  <td className="action-col">
                    <div className="table-actions action-buttons">
                      <button
                        type="button"
                        className="btn-small btn-secondary details-btn"
                        onClick={() => openDetails(recipe)}
                      >
                        Detalhes
                      </button>

                      <div className="dropdown-wrap">
                        <button
                          type="button"
                          className="btn-small dropdown-toggle icon-gear-btn"
                          aria-label="Abrir menu de ações"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(recipe.id, e);
                          }}
                        >
                          <span aria-hidden="true">⚙</span>
                        </button>

                        {openMenuId === recipe.id && (
                          <div
                            className="dropdown-menu dropdown-menu-fixed"
                            role="menu"
                            style={{ top: menuPosition.top, left: menuPosition.left }}
                          >
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => handleAction(() => onEdit(recipe))}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="dropdown-item dropdown-item-danger"
                              onClick={() => handleAction(() => onDelete(recipe.id))}
                            >
                              Excluir
                            </button>
                            <button
                              type="button"
                              className="dropdown-item dropdown-item-print"
                              onClick={() => handleAction(() => onPrint(recipe))}
                            >
                              Imprimir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {recipes.length > 0 && (
        <div className="table-pagination">
          <button
            type="button"
            className="btn-secondary"
            onClick={goToPreviousPage}
            disabled={safeCurrentPage === 1}
          >
            Anterior
          </button>
          <span className="pagination-label">
            Página {safeCurrentPage} de {totalPages}
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={goToNextPage}
            disabled={safeCurrentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}

      {selectedRecipe && (
        <div className="recipe-modal-backdrop" role="dialog" aria-modal="true">
          <div className="recipe-modal">
            <div className="recipe-modal-header">
              <h3>Detalhes da Receita</h3>
              <button type="button" className="error-close" onClick={closeDetails}>
                x
              </button>
            </div>

            <div className="recipe-modal-body">
              <p>
                <strong>ID:</strong> {selectedRecipe.id}
              </p>
              <p>
                <strong>Nome:</strong> {selectedRecipe.nome}
              </p>
              <p>
                <strong>Categoria:</strong> {getCategoryName(selectedRecipe.idCategoria)}
              </p>
              <p>
                <strong>Tempo de preparo:</strong> {selectedRecipe.tempoPreparoMinutos || '-'} min
              </p>
              <p>
                <strong>Porções:</strong> {selectedRecipe.porcoes || '-'}
              </p>
              <p>
                <strong>Ingredientes:</strong>
              </p>
              <div className="recipe-modal-content">{selectedRecipe.ingredientes || '-'}</div>
              <p>
                <strong>Modo de preparo:</strong>
              </p>
              <div className="recipe-modal-content">{selectedRecipe.modoPreparo}</div>
            </div>

            <div className="recipe-modal-footer">
              <button type="button" className="btn-secondary" onClick={closeDetails}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeTable;
