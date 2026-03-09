export const validateLogin = (value) => {
  return value.trim().length >= 3;
};

export const validateAuthData = ({ mode, nome, login, password, confirmPassword }) => {
  if (mode === 'register' && (!nome.trim() || nome.trim().length < 3)) {
    return 'O nome deve ter no mínimo 3 caracteres.';
  }

  if (!validateLogin(login)) {
    return 'O login deve ter no mínimo 3 caracteres.';
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

export const validateUserUpdateData = ({ nome, login, password }) => {
  if (!nome.trim() || nome.trim().length < 3) {
    return 'O nome deve ter no mínimo 3 caracteres.';
  }

  if (!validateLogin(login)) {
    return 'O login deve ter no mínimo 3 caracteres.';
  }

  if (password.trim() && password.trim().length < 6) {
    return 'A nova senha deve ter no mínimo 6 caracteres.';
  }

  return '';
};

export const validateRecipeData = ({ recipeNome, recipeModoPreparo, recipeTempoPreparo, recipePorcoes }) => {
  if (!recipeNome.trim() || recipeNome.trim().length < 3) {
    return 'O nome da receita deve ter no mínimo 3 caracteres.';
  }

  if (!recipeModoPreparo.trim() || recipeModoPreparo.trim().length < 10) {
    return 'O modo de preparo deve ter no mínimo 10 caracteres.';
  }

  if (recipeTempoPreparo && Number(recipeTempoPreparo) <= 0) {
    return 'O tempo de preparo deve ser maior que zero.';
  }

  if (recipePorcoes && Number(recipePorcoes) <= 0) {
    return 'As porções devem ser maiores que zero.';
  }

  return '';
};
