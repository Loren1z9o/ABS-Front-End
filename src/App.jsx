import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Index from './components/index';
import Cadastro from './components/cadastro';
import Dashboard from './components/dashboard';
import DashboardAluno from './components/dashboard_aluno';
import DashboardProfessor from './components/dashboard_professor';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuarioLogado(usuario);
  }, []);

  function logout() {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index setUsuarioLogado={setUsuarioLogado} />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route 
          path="/dashboard"
          element={
            usuarioLogado
              ? <Dashboard logout={logout} usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />
              : <Navigate to="/" replace />
          }
        />

        <Route 
          path="/dashboard_aluno"
          element={
            usuarioLogado?.tipo === 'aluno'
              ? <DashboardAluno logout={logout} usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />
              : <Navigate to="/" replace />
          }
        />

        <Route 
          path="/dashboard_professor"
          element={
            usuarioLogado?.tipo === 'professor'
              ? <DashboardProfessor logout={logout} usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />
              : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
