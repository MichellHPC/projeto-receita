import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  clearSessionUser,
  getSessionUser,
  getUsers,
  saveSessionUser,
  saveUsers,
} from '../utils/storage';
import { validateAuthData } from '../utils/validators';

function useAuth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
      setMode('app');
    }
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    clearMessages();
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const users = getUsers();
    const validationMessage = validateAuthData({
      mode,
      email,
      password,
      confirmPassword,
      users,
    });

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (mode === 'register') {
      saveUsers([...users, { email, password }]);
      setSuccess('Usuário cadastrado com sucesso. Faça login para continuar.');
      setMode('login');
      setConfirmPassword('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      const apiUser = response?.data?.user;

      if (!apiUser?.email) {
        setError('Resposta de login inválida do servidor.');
        return;
      }

      const sessionUser = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
      };

      saveSessionUser(sessionUser);
      setUser(sessionUser);
      setMode('app');
      setSuccess(response?.data?.message || 'Login realizado com sucesso.');
    } catch (requestError) {
      if (!requestError?.response) {
        setError('Erro ao conectar com o servidor.');
        return;
      }

      if (requestError.response.status === 401) {
        setError('Email ou senha incorretos.');
        return;
      }

      setError(requestError.response?.data?.message || 'Falha ao realizar login.');
    }
  };

  const handleLogout = () => {
    clearSessionUser();
    setUser(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMode('login');
    clearMessages();
  };

  return {
    mode,
    email,
    password,
    confirmPassword,
    user,
    error,
    success,
    setEmail,
    setPassword,
    setConfirmPassword,
    clearMessages,
    toggleMode,
    handleAuthSubmit,
    handleLogout,
    setError,
    setSuccess,
  };
}

export default useAuth;
