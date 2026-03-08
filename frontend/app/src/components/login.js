import { useState } from 'react';
import axios from 'axios';

function Login() {

  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //console.log('Login:', { email, password });
    
    try {
        const response = await axios.post('http://localhost:3000/login',
            JSON.stringify({ email, password }),
            { 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

        console.log('Resposta do servidor:', response.data);

    } catch (error) {
        if (!error?.response) {
            setError('Erro ao conectar com o servidor');
        } else if(error.response.status === 401) {
            setError('Email ou senha incorretos');
        }
    }
  }


  return (
    <div className="login-form-wrap">
        <h2>Login</h2>
        {error && (
          <div className="error-notification">
            <span className="error-icon">⚠</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close" 
              onClick={() => setError('')}
              type="button"
            >
              ×
            </button>
          </div>
        )}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
      </div>
  );
}

export default Login;