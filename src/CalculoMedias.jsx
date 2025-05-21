import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CalculoMedias() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [alunosRes, disciplinasRes] = await Promise.all([
          fetch('http://localhost:3001/alunos'),
          fetch('http://localhost:3001/disciplinas')
        ]);
        
        const alunosData = await alunosRes.json();
        const disciplinasData = await disciplinasRes.json();
        
        setAlunos(alunosData);
        setDisciplinas(disciplinasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    
    fetchData();
  }, []);

  const calcularMedia = async () => {
    if (!selectedAluno) return;
    
    setLoading(true);
    try {
      let url = `http://localhost:3001/notas/aluno/${selectedAluno}`;
      if (selectedDisciplina) {
        url += `?disciplina_id=${selectedDisciplina}`;
      }
      
      const res = await fetch(url);
      const notas = await res.json();
      
      if (notas.length === 0) {
        setMedias([]);
        return;
      }

      // Cálculo das médias
      const mediasCalculadas = notas.reduce((acc, { disciplina_id, disciplina, nota }) => {
        const disciplinaNome = disciplina || disciplinas.find(d => d.id === disciplina_id)?.nome || 'Desconhecida';
        const notaNum = parseFloat(nota) || 0;
        
        if (!acc[disciplina_id]) {
          acc[disciplina_id] = {
            disciplina_id,
            disciplina: disciplinaNome,
            soma: 0,
            count: 0
          };
        }
        
        acc[disciplina_id].soma += notaNum;
        acc[disciplina_id].count++;
        
        return acc;
      }, {});

      const resultado = Object.values(mediasCalculadas).map(item => ({
        disciplina: item.disciplina,
        media: (item.soma / item.count).toFixed(2),
        status: (item.soma / item.count) >= 6 ? 'Aprovado' : 'Reprovado'
      }));

      setMedias(resultado);
    } catch (error) {
      console.error('Erro ao calcular médias:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Cálculo de Médias
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: isSmallScreen ? 'column' : 'row', 
        gap: 2, 
        mb: 4 
      }}>
        <FormControl fullWidth>
          <InputLabel>Selecione o Aluno</InputLabel>
          <Select
            value={selectedAluno}
            onChange={(e) => setSelectedAluno(e.target.value)}
            label="Selecione o Aluno"
          >
            {alunos.map((aluno) => (
              <MenuItem key={aluno.id} value={aluno.id}>
                {aluno.nome} {aluno.sobrenome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Filtrar por Disciplina (Opcional)</InputLabel>
          <Select
            value={selectedDisciplina}
            onChange={(e) => setSelectedDisciplina(e.target.value)}
            label="Filtrar por Disciplina (Opcional)"
          >
            <MenuItem value="">Todas as Disciplinas</MenuItem>
            {disciplinas.map((disciplina) => (
              <MenuItem key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          onClick={calcularMedia}
          disabled={!selectedAluno || loading}
          sx={{ height: '56px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Calcular Médias'}
        </Button>
      </Box>

      {medias.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Disciplina</TableCell>
                <TableCell align="center">Média</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medias.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.disciplina}</TableCell>
                  <TableCell align="center">{item.media}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={item.status} 
                      color={item.status === 'Aprovado' ? 'success' : 'error'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {medias.length === 0 && !loading && selectedAluno && (
        <Typography sx={{ mt: 2 }}>Nenhuma nota encontrada para este aluno.</Typography>
      )}
    </Box>
  );
}

export default CalculoMedias;