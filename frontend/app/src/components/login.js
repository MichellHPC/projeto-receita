import { useState } from 'react';

function Login() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, senha });
    // Aqui você pode adicionar a lógica de autenticação
  }


  return (
    <div className="login-form-wrap">
        <h2>Login</h2>
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
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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