export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateAuthData = ({ mode, email, password, confirmPassword, users }) => {
  if (!validateEmail(email)) {
    return 'Informe um e-mail válido.';
  }

  if (password.length < 6) {
    return 'A senha deve ter no mínimo 6 caracteres.';
  }

  if (mode === 'register') {
    if (confirmPassword !== password) {
      return 'A confirmação de senha não confere.';
    }

    const alreadyExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (alreadyExists) {
      return 'Já existe um usuário cadastrado com esse e-mail.';
    }
  }

  return '';
};

export const validateRecipeData = ({ recipeId, recipeNome, recipeTexto, recipes, editingId }) => {
  if (!recipeId.trim()) {
    return 'O campo ID da receita é obrigatório.';
  }

  if (!recipeNome.trim() || recipeNome.trim().length < 3) {
    return 'O nome da receita deve ter no mínimo 3 caracteres.';
  }

  if (!recipeTexto.trim() || recipeTexto.trim().length < 10) {
    return 'A descrição da receita deve ter no mínimo 10 caracteres.';
  }

  const idAlreadyUsed = recipes.some(
    (recipe) => recipe.id.toLowerCase() === recipeId.trim().toLowerCase() && recipe.id !== editingId
  );

  if (idAlreadyUsed) {
    return 'Já existe uma receita com esse ID.';
  }

  return '';
};
