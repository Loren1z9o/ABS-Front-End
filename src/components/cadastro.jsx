import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('aluno');
  const [modalidade, setModalidade] = useState('');
  const [mostrarModalidade, setMostrarModalidade] = useState(false);

  useEffect(() => {
    setMostrarModalidade(tipo === 'professor');
  }, [tipo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (tipo === 'professor' && (!modalidade || modalidade === '')) {
      alert('Selecione uma modalidade para professor.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const emailExiste = usuarios.some((user) => user.email === email);
    if (emailExiste) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    const novoUsuario = { nome, email, senha, tipo };
    if (tipo === 'professor') {
      novoUsuario.modalidade = modalidade;
    }

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
  };

  return (
    <div className="cadastro-container">
      <h1 className="logo">🥋 FightZone</h1>
      <h2>Cadastro de Usuário</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome Completo</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label htmlFor="tipo">Tipo de Usuário</label>
        <select
          id="tipo"
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
        </select>

        {mostrarModalidade && (
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
      </form>
    </div>
  );
}

export default Cadastro;
