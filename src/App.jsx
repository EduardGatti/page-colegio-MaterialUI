import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.jsx';
import CadastroAluno from './CadastroAluno.jsx';
import EditarAluno from './editarAluno.jsx';
import DeletarAluno from './deletarAluno.jsx';
import HomeNota from './homeNota.jsx';
import CadastroNota from './CadastroNota.jsx';
import EditarNota from './EditarNota.jsx';
import DeletarNota from './DeletarNota.jsx';
import CalculoMedias from './CalculoMedias.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastroAlunos" element={<CadastroAluno />} />
        <Route path="/editarAluno/:id" element={<EditarAluno />} />
        <Route path="/deletarAluno" element={<DeletarAluno />} />
        <Route path="/homeNota/:id" element={<HomeNota />} />
        <Route path="/cadastroNota/:id" element={<CadastroNota />} />
        <Route path="/editarNota/:id" element={<EditarNota />} />
        <Route path="/deletarNota/:id" element={<DeletarNota />} />
        <Route path="/calculo-medias/:id" element={<CalculoMedias />} />
      </Routes>
    </Router>
  );
}

export default App;
