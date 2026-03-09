import { useEffect, useRef, useState } from 'react';

function RecipeTable({ recipes, searchTerm, onSearchTermChange, onEdit, onDelete, onPrint }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const tableRef = useRef(null);

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

  const toggleMenu = (id) => {
    setOpenMenuId((currentId) => (currentId === id ? null : id));
  };

  const handleAction = (action) => {
    setOpenMenuId(null);
    action();
  };

  return (
    <div className="panel" ref={tableRef}>
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
                    <div className="table-actions dropdown-wrap">
                      <button
                        type="button"
                        className="btn-small dropdown-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(recipe.id);
                        }}
                      >
                        Ações
                      </button>

                      {openMenuId === recipe.id && (
                        <div className="dropdown-menu" role="menu">
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
