import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function DashboardAluno({ usuarioLogado, setUsuarioLogado }) {
  const [nomeUsuario, setNomeUsuario] = useState('Aluno');
  const [artesSelecionadas, setArtesSelecionadas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [mensagemLimite, setMensagemLimite] = useState('');
  const navigate = useNavigate();

  const artesMarciais = ['Jiu-Jitsu', 'Muay Thai', 'Karatê', 'Boxe'];
  const horariosArtes = {
    'Jiu-Jitsu': { professor: 'Professor(a) de Jiu-Jitsu' },
    'Muay Thai': { professor: 'Professor(a) de Muay Thai' },
    'Karatê': { professor: 'Professor(a) de Karatê' },
    'Boxe': { professor: 'Professor(a) de Boxe' },
  };

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    setNomeUsuario(usuarioLogado.nome || 'Aluno');
    const artesSalvas = JSON.parse(localStorage.getItem('artesEscolhidas')) || [];
    setArtesSelecionadas(artesSalvas);
    carregarTurmasDisponiveis();
  }, [usuarioLogado, navigate]);

  const carregarTurmasDisponiveis = () => {
    const turmasSalvas = JSON.parse(localStorage.getItem('turmas')) || [];
    setTurmas(turmasSalvas);
  };

  const handleCheckboxChange = (arte) => {
    let novasArtes = [...artesSelecionadas];
    if (novasArtes.includes(arte)) {
      novasArtes = novasArtes.filter(a => a !== arte);
    } else {
      if (novasArtes.length >= 4) {
        setMensagemLimite('Você pode escolher no máximo 4 artes marciais.');
        return;
      }
      novasArtes.push(arte);
    }
    setMensagemLimite('');
    setArtesSelecionadas(novasArtes);
  };

  const salvarArtes = () => {
    if (artesSelecionadas.length === 0) {
      alert('Selecione ao menos uma arte marcial.');
      return;
    }
    localStorage.setItem('artesEscolhidas', JSON.stringify(artesSelecionadas));
    alert('Artes marciais salvas!');
  };

  const contatarProfessor = () => {
    if (artesSelecionadas.length === 0) {
      alert('Por favor, selecione ao menos uma arte marcial para contatar o professor.');
      return;
    }

    let arteEscolhida = '';
    if (artesSelecionadas.length === 1) {
      arteEscolhida = artesSelecionadas[0];
    } else {
      arteEscolhida = prompt('Você escolheu mais de uma arte. Qual professor deseja contatar?\n' + artesSelecionadas.join(', '));
      if (!artesSelecionadas.includes(arteEscolhida)) {
        alert('Arte marcial inválida.');
        return;
      }
    }

    const professor = horariosArtes[arteEscolhida]?.professor || 'Professor(a)';
    const mensagem = prompt(`Digite a mensagem para o(a) ${professor}:`);

    if (mensagem && mensagem.trim() !== '') {
      alert(`Mensagem enviada para ${professor}:\n"${mensagem}"`);
    } else {
      alert('Mensagem vazia. Operação cancelada.');
    }
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

  if (!usuarioLogado) return null; // enquanto redireciona

  return (
    <div>
      <header>
        <h1>Dashboard do Aluno</h1>
        <button onClick={logout}>Sair</button>
      </header>
      <main>
        <section className="info">
          <h2>Bem-vindo, <span>{nomeUsuario}</span></h2>
          <p>Aqui você pode visualizar suas informações e gerenciar sua conta.</p>
        </section>

        <section className="artes-marcais">
          <h3>Escolha a arte marcial que deseja treinar:</h3>
          <form>
            {artesMarciais.map((arte, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  name="arte"
                  value={arte}
                  checked={artesSelecionadas.includes(arte)}
                  onChange={() => handleCheckboxChange(arte)}
                /> {arte}
              </label>
            ))}
            <button type="button" onClick={salvarArtes}>Salvar Artes Escolhidas</button>
            <div style={{ color: 'red', marginTop: '5px' }}>{mensagemLimite}</div>
          </form>
        </section>

        <section className="turmas-disponiveis">
          <h3>Turmas Disponíveis</h3>
          <ul>
            {turmas.length === 0 ? (
              <li>Nenhuma turma cadastrada.</li>
            ) : (
              turmas.map((turma, index) => (
                <li key={index}>
                  <strong>Turma de {turma.modalidade}</strong><br />
                  Nome: {turma.nomeTurma}<br />
                  Horário: {turma.horarioInicio} às {turma.horarioFim}
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <button onClick={contatarProfessor}>Entrar em contato com o professor</button>
        </section>

        <section>
          <button onClick={excluirConta} className="excluir">Excluir minha conta</button>
        </section>
      </main>
    </div>
  );
}

export default DashboardAluno;
