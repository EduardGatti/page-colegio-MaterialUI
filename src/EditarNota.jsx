import React, { useState, useEffect } from "react";
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
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function HomeNota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [notas, setNotas] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [notaEditando, setNotaEditando] = useState(null);
  const [notaEditada, setNotaEditada] = useState({
    disciplina_id: "",
    trimestre: "",
    nota: "",
    descricao: "",
  });
  const [erros, setErros] = useState({
    nota: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const alunoRes = await fetch(`http://localhost:3001/alunos/${id}`);
        if (!alunoRes.ok) throw new Error("Aluno não encontrado");
        const alunoData = await alunoRes.json();
        setAluno(alunoData);

        const notasRes = await fetch(`http://localhost:3001/notas/aluno/${id}`);
        if (!notasRes.ok) throw new Error("Notas não encontradas");
        const notasData = await notasRes.json();
        setNotas(Array.isArray(notasData) ? notasData : []);

        const disciplinasRes = await fetch("http://localhost:3001/disciplinas");
        if (!disciplinasRes.ok) throw new Error("Disciplinas não encontradas");
        const disciplinasData = await disciplinasRes.json();
        setDisciplinas(disciplinasData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert(error.message);
      }
    }

    fetchData();
  }, [id]);

  const validarNota = (nota) => {
    const num = parseFloat(nota);
    return !isNaN(num) && num >= 1 && num <= 10;
  };

  const handleEditarNota = (nota) => {
    setNotaEditando(nota);
    setNotaEditada({
      disciplina_id: nota.disciplina_id,
      trimestre: nota.trimestre,
      nota: nota.nota,
      descricao: nota.descricao || "",
    });
    setErros({ nota: false });
  };

  const handleFecharEdicao = () => {
    setNotaEditando(null);
  };

  const handleSalvarEdicao = async () => {
    if (!validarNota(notaEditada.nota)) {
      setErros({ nota: true });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/notas/${notaEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notaEditada),
      });

      if (!response.ok) throw new Error("Erro ao atualizar nota");

      setNotas(notas.map(nota => 
        nota.id === notaEditando.id ? { ...nota, ...notaEditada } : nota
      ));

      handleFecharEdicao();
      alert("Nota atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotaEditada(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "nota") {
      setErros(prev => ({
        ...prev,
        nota: !validarNota(value)
      }));
    }
  };

  if (!aluno) return <Typography>Carregando dados do aluno...</Typography>;

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Notas de {aluno.nome} {aluno.sobrenome}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>Trimestre</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notas.map((nota) => {
              const disciplina = disciplinas.find((d) => d.id === nota.disciplina_id);
              return (
                <TableRow key={nota.id}>
                  <TableCell>{disciplina ? disciplina.nome : "Desconhecida"}</TableCell>
                  <TableCell>{nota.trimestre}</TableCell>
                  <TableCell>{nota.nota}</TableCell>
                  <TableCell>{nota.descricao || "-"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => handleEditarNota(nota)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(notaEditando)} onClose={handleFecharEdicao}>
        <DialogTitle>Editar Nota</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Disciplina</InputLabel>
            <Select
              name="disciplina_id"
              value={notaEditada.disciplina_id}
              onChange={handleChange}
              label="Disciplina"
            >
              {disciplinas.map((disciplina) => (
                <MenuItem key={disciplina.id} value={disciplina.id}>
                  {disciplina.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Trimestre</InputLabel>
            <Select
              name="trimestre"
              value={notaEditada.trimestre}
              onChange={handleChange}
              label="Trimestre"
            >
              <MenuItem value={1}>1º Trimestre</MenuItem>
              <MenuItem value={2}>2º Trimestre</MenuItem>
              <MenuItem value={3}>3º Trimestre</MenuItem>
              <MenuItem value={4}>4º Trimestre</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            name="nota"
            label="Nota"
            type="number"
            value={notaEditada.nota}
            onChange={handleChange}
            error={erros.nota}
            helperText={erros.nota ? "A nota deve ser entre 1 e 10" : ""}
            inputProps={{ 
              min: "1", 
              max: "10", 
              step: "0.1",
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="descricao"
            label="Descrição"
            value={notaEditada.descricao}
            onChange={handleChange}
            multiline
            rows={3}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharEdicao}>Cancelar</Button>
          <Button 
            onClick={handleSalvarEdicao} 
            color="primary" 
            variant="contained"
            disabled={erros.nota}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}