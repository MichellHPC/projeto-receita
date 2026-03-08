const USERS_KEY = 'pr_users';
const SESSION_KEY = 'pr_session';

export const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getSessionUser = () => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveSessionUser = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getRecipesKey = (email) => `pr_recipes_${email}`;

export const getRecipesByEmail = (email) => {
  const key = getRecipesKey(email);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveRecipesByEmail = (email, recipes) => {
  const key = getRecipesKey(email);
  localStorage.setItem(key, JSON.stringify(recipes));
};
