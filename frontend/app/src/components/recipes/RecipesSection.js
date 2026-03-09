import RecipeTable from './RecipeTable';

function RecipesSection({ recipes, onOpenCreate, onEditRecipe }) {
  return (
    <div className="table-main-section">
      <RecipeTable
        recipes={recipes.filteredRecipes}
        categories={recipes.categories}
        searchTerm={recipes.searchTerm}
        onSearchTermChange={recipes.setSearchTerm}
        onEdit={onEditRecipe}
        onDelete={recipes.handleDeleteRecipe}
        onPrint={recipes.handlePrintRecipe}
        onOpenCreate={onOpenCreate}
      />
    </div>
  );
}

export default RecipesSection;
