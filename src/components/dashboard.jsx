import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard({ usuarioLogado, setUsuarioLogado }) {
  const [turmas, setTurmas] = useState({});
  const [totalAlunos, setTotalAlunos] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAlunos();
  }, []);

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
    }
  }, [usuarioLogado, navigate]);

  function carregarAlunos() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const alunos = usuarios.filter(u => u.tipo === 'aluno');

    const agrupadoPorTurma = {};
    alunos.forEach(aluno => {
      const turma = aluno.turma || 'Sem Turma';
      if (!agrupadoPorTurma[turma]) {
        agrupadoPorTurma[turma] = [];
      }
      agrupadoPorTurma[turma].push(aluno.nome);
    });

    setTurmas(agrupadoPorTurma);
    setTotalAlunos(alunos.length);
  }

  function logout() {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
    navigate('/');
  }

  if (!usuarioLogado) {
    return null; 
  }

  const userName = usuarioLogado.nome || 'Professor';
  const userType = usuarioLogado.tipo || 'Professor';

  return (
    <div className="dashboard-container">
      <h1 className="logo">🥋 FightZone</h1>

      <div className="user-info">
        <h2>Bem-vindo, <span>{userName}</span></h2>
        <p>Tipo de Usuário: <span>{userType}</span></p>
        <button onClick={logout}>Sair</button>
      </div>

      {userType === 'professor' && (
        <div id="professorView">
          <h3>Visualizar Integrantes das Turmas</h3>
          <table id="turmasTable">
            <thead>
              <tr>
                <th>Turma</th>
                <th>Alunos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(turmas).map(([turma, alunos], index) => (
                <tr key={index}>
                  <td>{turma}</td>
                  <td>{alunos.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat">
          <h3>Total de Alunos</h3>
          <p>{totalAlunos}</p>
          <span>Total de Alunos</span>
        </div>
        <div className="stat">
          <h3>Total de Turmas</h3>
          <p>5</p>
          <span>Total de Turmas</span>
        </div>
        <div className="stat">
          <h3>Eventos</h3>
          <p>3</p>
          <span>Total de Eventos</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
