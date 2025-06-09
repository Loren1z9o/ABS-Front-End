import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function DashboardProfessor({ usuarioLogado, setUsuarioLogado }) {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [form, setForm] = useState({ nomeTurma: '', horarioInicio: '', horarioFim: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    carregarAlunos();
    listarTurmas();
  }, [usuarioLogado, navigate]);

  const carregarAlunos = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const alunosFiltrados = usuarios.filter(u => u.tipo === 'aluno');
    setAlunos(alunosFiltrados);
  };

  const logout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
    navigate('/');
  };

  const excluirConta = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta?')) {
      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios = usuarios.filter(u => u.email !== usuarioLogado.email);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.removeItem('usuarioLogado');
      setUsuarioLogado(null);
      alert('Conta excluída com sucesso.');
      navigate('/');
    }
  };

  const salvarTurma = (nomeTurma, modalidade, horarioInicio, horarioFim) => {
    const novasTurmas = [...turmas, { nomeTurma, modalidade, horarioInicio, horarioFim }];
    setTurmas(novasTurmas);
    localStorage.setItem('turmas', JSON.stringify(novasTurmas));
  };

  const listarTurmas = () => {
    const turmasSalvas = JSON.parse(localStorage.getItem('turmas')) || [];
    setTurmas(turmasSalvas);
  };

  const excluirTurma = (index) => {
    if (window.confirm(`Deseja realmente excluir a turma "${turmas[index].nomeTurma}"?`)) {
      const novasTurmas = [...turmas];
      novasTurmas.splice(index, 1);
      setTurmas(novasTurmas);
      localStorage.setItem('turmas', JSON.stringify(novasTurmas));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    salvarTurma(
      form.nomeTurma,
      usuarioLogado?.modalidade || 'Não definida',
      form.horarioInicio,
      form.horarioFim
    );
    setForm({ nomeTurma: '', horarioInicio: '', horarioFim: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  if (!usuarioLogado) return null;

  return (
    <div>
      <header>
        <h1>Dashboard do Professor</h1>
        <button onClick={logout}>Sair</button>
      </header>
      <main>
        <section className="info">
          <h2>Bem-vindo, <span>{usuarioLogado?.nome || 'Professor'}</span></h2>
          <p>Aqui você pode visualizar os alunos cadastrados.</p>
          <p>Modalidade: <span>{usuarioLogado?.modalidade || 'Não informada'}</span></p>
          <button onClick={excluirConta}>Excluir minha conta</button>
        </section>

        <section>
          <h3>Alunos Cadastrados</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length === 0 ? (
                <tr><td colSpan="2">Nenhum aluno cadastrado.</td></tr>
              ) : (
                alunos.map((aluno, index) => (
                  <tr key={index}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h3>Cadastrar Nova Turma</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nomeTurma">Nome da Turma</label>
            <input type="text" id="nomeTurma" value={form.nomeTurma} onChange={handleChange} required />

            <label htmlFor="horarioInicio">Horário de Início</label>
            <input type="time" id="horarioInicio" value={form.horarioInicio} onChange={handleChange} required />

            <label htmlFor="horarioFim">Horário de Fim</label>
            <input type="time" id="horarioFim" value={form.horarioFim} onChange={handleChange} required />

            <button type="submit">Cadastrar Turma</button>
          </form>
        </section>

        <h3>Turmas Cadastradas</h3>
        <ul>
          {turmas.map((t, index) => (
            <li key={index}>
              {`${t.nomeTurma} - ${t.modalidade} - ${t.horarioInicio} às ${t.horarioFim}`}
              <button
                onClick={() => excluirTurma(index)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#C0392B',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default DashboardProfessor;
