import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function DashboardProfessor({ usuarioLogado, setUsuarioLogado }) {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [form, setForm] = useState({ nomeTurma: '', horarioInicio: '', horarioFim: '' });
  const [mensagens, setMensagens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    carregarAlunos();
    listarTurmas();
    carregarMensagens();
  }, [usuarioLogado, navigate]);

  const carregarAlunos = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const alunosFiltrados = usuarios.filter(u => u.tipo === 'aluno');
    setAlunos(alunosFiltrados);
  };

  const carregarMensagens = () => {
    const msgs = JSON.parse(localStorage.getItem('mensagens')) || [];
    const msgsDoProfessor = msgs.filter(msg => msg.paraModalidade === usuarioLogado.modalidade);
    setMensagens(msgsDoProfessor);
  };

  const listarTurmas = () => {
    const turmasSalvas = JSON.parse(localStorage.getItem('turmas')) || [];
    setTurmas(turmasSalvas.filter(t => t.modalidade === usuarioLogado.modalidade));
  };

  const salvarTurma = (nomeTurma, modalidade, horarioInicio, horarioFim) => {
    const novaTurma = { nomeTurma, modalidade, horarioInicio, horarioFim, alunos: [] };
    const novasTurmas = [...turmas, novaTurma];
    setTurmas(novasTurmas);

    const turmasGlobais = JSON.parse(localStorage.getItem('turmas')) || [];
    turmasGlobais.push(novaTurma);
    localStorage.setItem('turmas', JSON.stringify(turmasGlobais));
  };

  const excluirTurma = (index) => {
    if (window.confirm(`Deseja realmente excluir a turma "${turmas[index].nomeTurma}"?`)) {
      const novasTurmas = [...turmas];
      const turmaExcluida = novasTurmas.splice(index, 1)[0];

      setTurmas(novasTurmas);

      // Atualizar turmas no localStorage
      let turmasGlobais = JSON.parse(localStorage.getItem('turmas')) || [];
      turmasGlobais = turmasGlobais.filter(
        t => !(t.nomeTurma === turmaExcluida.nomeTurma && t.modalidade === turmaExcluida.modalidade)
      );
      localStorage.setItem('turmas', JSON.stringify(turmasGlobais));
    }
  };

  const excluirAlunoDaTurma = (indexTurma, alunoEmail) => {
    const novasTurmas = [...turmas];
    novasTurmas[indexTurma].alunos = novasTurmas[indexTurma].alunos.filter(email => email !== alunoEmail);
    setTurmas(novasTurmas);

    // Atualizar no localStorage
    const turmasGlobais = JSON.parse(localStorage.getItem('turmas')) || [];
    turmasGlobais.forEach((t, i) => {
      if (
        t.nomeTurma === novasTurmas[indexTurma].nomeTurma &&
        t.modalidade === usuarioLogado.modalidade
      ) {
        turmasGlobais[i] = novasTurmas[indexTurma];
      }
    });
    localStorage.setItem('turmas', JSON.stringify(turmasGlobais));
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
          <p>Modalidade: <span>{usuarioLogado?.modalidade || 'Não informada'}</span></p>
          <button onClick={excluirConta}>Excluir minha conta</button>
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

        <section>
          <h3>Turmas Cadastradas</h3>
          <ul>
            {turmas.map((t, index) => (
              <li key={index}>
                <strong>{t.nomeTurma}</strong> - {t.horarioInicio} às {t.horarioFim}
                <br />
                <em>Alunos:</em>
                {t.alunos && t.alunos.length > 0 ? (
                  <ul>
                    {t.alunos.map((email, idx) => {
                      const aluno = alunos.find(a => a.email === email);
                      return (
                        <li key={idx}>
                          {aluno?.nome || email}
                          <button onClick={() => excluirAlunoDaTurma(index, email)} style={{ marginLeft: '10px' }}>
                            Remover
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>Nenhum aluno nesta turma.</p>
                )}
                <button onClick={() => excluirTurma(index)} style={{ backgroundColor: '#C0392B', color: 'white', marginTop: '5px' }}>
                  Excluir Turma
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Mensagens Recebidas</h3>
          <ul>
            {mensagens.length === 0 ? (
              <li>Nenhuma mensagem recebida.</li>
            ) : (
              mensagens.map((msg, i) => (
                <li key={i}>
                  <strong>{msg.de}:</strong> {msg.texto}
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default DashboardProfessor;
