import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Index({ setUsuarioLogado }) {  // recebe a prop setUsuarioLogado
  const navigate = useNavigate();

  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [mensagemLogin, setMensagemLogin] = useState('');

  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  const [modalidade, setModalidade] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');

  const [exibirCadastro, setExibirCadastro] = useState(false);

  function salvarUsuario(nome, email, senha, tipo, modalidade = null) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const novoUsuario = { nome, email, senha, tipo };
    if (tipo === 'professor') novoUsuario.modalidade = modalidade;
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  function autenticarUsuario(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.find(user => user.email === email && user.senha === senha);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();

    const usuario = autenticarUsuario(emailLogin, senhaLogin);

    if (usuario) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

      setUsuarioLogado(usuario);  // **ATUALIZA O ESTADO GLOBAL AQUI**

      if (usuario.tipo === 'aluno') {
        navigate('/dashboard_aluno');
      } else if (usuario.tipo === 'professor') {
        navigate('/dashboard_professor');
      } else {
        navigate('/dashboard');
      }
    } else {
      setMensagemLogin('Credenciais inválidas. Tente novamente.');
    }
  }

  function handleCadastroSubmit(e) {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const emailExiste = usuarios.some(u => u.email === emailCadastro);

    if (emailExiste) {
      setMensagemCadastro('Este e-mail já está cadastrado.');
      return;
    }

    if (senhaCadastro.length < 6) {
      setMensagemCadastro('Senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (tipoUsuario === 'professor' && (!modalidade || modalidade === '')) {
      setMensagemCadastro('Selecione uma modalidade.');
      return;
    }

    salvarUsuario(nomeCadastro, emailCadastro, senhaCadastro, tipoUsuario, modalidade);

    setMensagemCadastro('Cadastro realizado com sucesso! Faça login para continuar.');

    setTimeout(() => {
      setExibirCadastro(false);
      setMensagemCadastro('');
      setNomeCadastro('');
      setEmailCadastro('');
      setSenhaCadastro('');
      setTipoUsuario('aluno');
      setModalidade('');
    }, 2000);
  }

  return (
    <div>
      {!exibirCadastro && (
        <div className="login-container">
          <h1 className="logo">🥋 FightZone</h1>
          <p className="slogan" style={{ textAlign: 'center', color: '#8B0000', fontWeight: 'bold', fontSize: 22, margin: '20px 0' }}>
            Bem-vindo de volta, guerreiro!⚔️
          </p>

          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              required
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
            />

            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
              value={senhaLogin}
              onChange={(e) => setSenhaLogin(e.target.value)}
            />

            <button type="submit">Entrar</button>
            <p style={{ color: 'red' }}>{mensagemLogin}</p>
          </form>

          <p className="cadastro-link">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => setExibirCadastro(true)}
              style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>
      )}

      {exibirCadastro && (
        <div className="cadastro-container">
          <h2>Cadastro de Novo Usuário</h2>
          <form onSubmit={handleCadastroSubmit}>
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={nomeCadastro}
              onChange={(e) => setNomeCadastro(e.target.value)}
            />

            <label htmlFor="emailCadastro">E-mail</label>
            <input
              type="email"
              id="emailCadastro"
              name="emailCadastro"
              required
              value={emailCadastro}
              onChange={(e) => setEmailCadastro(e.target.value)}
            />

            <label htmlFor="senhaCadastro">Senha</label>
            <input
              type="password"
              id="senhaCadastro"
              name="senhaCadastro"
              required
              value={senhaCadastro}
              onChange={(e) => setSenhaCadastro(e.target.value)}
            />

            <label htmlFor="tipo">Tipo de Usuário</label>
            <select
              id="tipo"
              name="tipo"
              required
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>

            {tipoUsuario === 'professor' && (
              <div id="modalidadeContainer">
                <label htmlFor="modalidade">Modalidade</label>
                <select
                  id="modalidade"
                  name="modalidade"
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                >
                  <option value="">Selecione uma modalidade</option>
                  <option value="Karatê">Karatê</option>
                  <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                  <option value="Muay Thai">Muay Thai</option>
                  <option value="Taekwondo">Taekwondo</option>
                  <option value="Boxe">Boxe</option>
                  <option value="Capoeira">Capoeira</option>
                </select>
              </div>
            )}

            <button type="submit">Cadastrar</button>
            <p style={{ color: mensagemCadastro.includes('sucesso') ? 'green' : 'red' }}>{mensagemCadastro}</p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Index;
