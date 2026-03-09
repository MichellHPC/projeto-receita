import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  clearSessionUser,
  getSessionUser,
  saveSessionUser,
} from '../utils/storage';
import { validateAuthData, validateUserUpdateData } from '../utils/validators';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getRequestErrorMessage = (requestError, fallbackMessage) => {
  if (!requestError?.response) {
    return 'Erro ao conectar com o servidor.';
  }

  return requestError.response?.data?.message || fallbackMessage;
};

function useAuth() {
  const [mode, setMode] = useState('login');
  const [nome, setNome] = useState('');
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
    setNome('');
    setConfirmPassword('');
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const validationMessage = validateAuthData({
      mode,
      nome,
      email,
      password,
      confirmPassword,
    });

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (mode === 'register') {
      try {
        await axios.post(`${API_BASE_URL}/usuarios`, {
          nome: nome.trim(),
          email: email.trim(),
          password,
        });

        setSuccess('Usuário cadastrado com sucesso. Faça login para continuar.');
        setMode('login');
        setNome('');
        setPassword('');
        setConfirmPassword('');
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, 'Falha ao cadastrar usuário.'));
      }

      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
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
        name: apiUser.name || apiUser.nome || '',
        email: apiUser.email,
      };

      saveSessionUser(sessionUser);
      setUser(sessionUser);
      setMode('app');
      setPassword('');
      setConfirmPassword('');
      setSuccess(response?.data?.message || 'Login realizado com sucesso.');
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        setError('Email ou senha incorretos.');
        return;
      }

      setError(getRequestErrorMessage(requestError, 'Falha ao realizar login.'));
    }
  };

  const handleUserUpdate = async ({ nome: nextNome, email: nextEmail, password: nextPassword }) => {
    clearMessages();

    if (!user?.id) {
      setError('Usuário não identificado. Faça login novamente.');
      return false;
    }

    const validationMessage = validateUserUpdateData({
      nome: nextNome,
      email: nextEmail,
      password: nextPassword,
    });

    if (validationMessage) {
      setError(validationMessage);
      return false;
    }

    try {
      const payload = {
        nome: nextNome.trim(),
        email: nextEmail.trim(),
      };

      if (nextPassword.trim()) {
        payload.password = nextPassword;
      }

      const response = await axios.put(`${API_BASE_URL}/usuarios/${user.id}`, payload);
      const apiUser = response?.data?.usuario || response?.data?.user || response?.data || {};

      const updatedUser = {
        id: user.id,
        name: apiUser.name || apiUser.nome || payload.nome,
        email: apiUser.email || payload.email,
      };

      saveSessionUser(updatedUser);
      setUser(updatedUser);
      setSuccess('Dados do usuário atualizados com sucesso.');
      return true;
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'Falha ao atualizar usuário.'));
      return false;
    }
  };

  const handleLogout = () => {
    clearSessionUser();
    setUser(null);
    setNome('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMode('login');
    clearMessages();
  };

  return {
    mode,
    nome,
    email,
    password,
    confirmPassword,
    user,
    error,
    success,
    setNome,
    setEmail,
    setPassword,
    setConfirmPassword,
    clearMessages,
    toggleMode,
    handleAuthSubmit,
    handleUserUpdate,
    handleLogout,
    setError,
    setSuccess,
  };
}

export default useAuth;
