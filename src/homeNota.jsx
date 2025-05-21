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
  Button,
  Stack,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DeletarNota from "./DeletarNota";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function HomeNota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [notas, setNotas] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    async function fetchAluno() {
      try {
        const res = await fetch(`http://localhost:3001/alunos/${id}`);
        if (!res.ok) throw new Error("Aluno não encontrado");
        const data = await res.json();
        setAluno(data);
      } catch (error) {
        alert(error.message);
      }
    }

    async function fetchNotas() {
      try {
        const res = await fetch(`http://localhost:3001/notas/aluno/${id}`);
        if (!res.ok) throw new Error("Notas não encontradas");
        const data = await res.json();
        setNotas(data);
      } catch (error) {
        console.error(error);
        setNotas([]);
      }
    }

    async function fetchDisciplinas() {
      try {
        const res = await fetch("http://localhost:3001/disciplinas");
        if (!res.ok) throw new Error("Disciplinas não encontradas");
        const data = await res.json();
        setDisciplinas(data);
      } catch (error) {
        alert(error.message);
      }
    }

    fetchAluno();
    fetchNotas();
    fetchDisciplinas();
  }, [id]);

  const agruparNotas = () => {
    const agrupadas = {};

    notas.forEach((nota) => {
      const disciplina = disciplinas.find((d) => d.id === nota.disciplina_id);
      if (!disciplina) return;
      const nomeDisciplina = disciplina.nome;
      if (!agrupadas[nomeDisciplina]) {
        agrupadas[nomeDisciplina] = [];
      }
      agrupadas[nomeDisciplina].push(nota);
    });

    return Object.entries(agrupadas).map(([disciplina, notas]) => {
      const notasOrdenadas = ["PR1", "PR2", "PR3", "PR4"].map((desc) => {
        const nota = notas.find((n) => n.descricao === desc);
        return nota ? nota.nota : "-";
      });
      const notasValidas = notasOrdenadas.filter((n) => typeof n === "number");
      const media =
        notasValidas.length > 0
          ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(2)
          : "-";
      const primeiraNota = notas[0];
      return {
        disciplina,
        notas: notasOrdenadas,
        media,
        notaParaAcoes: primeiraNota,
      };
    });
  };

  if (!aluno) return <Typography>Carregando dados do aluno...</Typography>;

  const linhasNotas = agruparNotas();

  return (
    <Box sx={{ p: 2, maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, color: "#1976d2" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Notas de {aluno.nome} {aluno.sobrenome}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>PR1</TableCell>
              <TableCell>PR2</TableCell>
              <TableCell>PR3</TableCell>
              <TableCell>PR4</TableCell>
              <TableCell>Média</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {linhasNotas.map(({ disciplina, notas, media, notaParaAcoes }) => (
              <TableRow key={disciplina}>
                <TableCell>{disciplina}</TableCell>
                {notas.map((n, i) => (
                  <TableCell key={i}>{n}</TableCell>
                ))}
                <TableCell>{media}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate(`/editarNota/${aluno.id}`)}
                      size="small"
                    >
                      Editar
                    </Button>
                    <DeletarNota nota={notaParaAcoes} onDeleteSuccess={() => window.location.reload()} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        sx={{ mt: 3, justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/cadastroNota/${id}`)}
          fullWidth={isSmallScreen}
        >
          Adicionar Nota
        </Button>
      </Stack>
    </Box>
  );
}
