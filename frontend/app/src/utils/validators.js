export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateAuthData = ({ mode, nome, email, password, confirmPassword }) => {
  if (mode === 'register' && (!nome.trim() || nome.trim().length < 3)) {
    return 'O nome deve ter no mínimo 3 caracteres.';
  }

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
  }

  return '';
};

export const validateUserUpdateData = ({ nome, email, password }) => {
  if (!nome.trim() || nome.trim().length < 3) {
    return 'O nome deve ter no mínimo 3 caracteres.';
  }

  if (!validateEmail(email)) {
    return 'Informe um e-mail válido.';
  }

  if (password.trim() && password.trim().length < 6) {
    return 'A nova senha deve ter no mínimo 6 caracteres.';
  }

  return '';
};

export const validateRecipeData = ({ recipeNome, recipeTexto }) => {
  if (!recipeNome.trim() || recipeNome.trim().length < 3) {
    return 'O nome da receita deve ter no mínimo 3 caracteres.';
  }

  if (!recipeTexto.trim() || recipeTexto.trim().length < 10) {
    return 'A descrição da receita deve ter no mínimo 10 caracteres.';
  }

  return '';
};
