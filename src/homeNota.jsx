// HomeNota.jsx
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DeletarNota from "./DeletarNota";

const disciplinasFixas = {
  1: "Literatura Inglesa",
  2: "Álgebra II",
  3: "Geometria",
  4: "Pré-Cálculo",
  5: "Cálculo",
  6: "Biologia",
  7: "Química",
  8: "Física",
  9: "História dos EUA",
  10: "História Mundial",
  11: "Governo",
  12: "Economia",
  13: "Espanhol",
  14: "Francês",
  15: "Artes",
  16: "Música",
  17: "Educação Física",
  18: "Ciência da Computação",
};

function calcularMediasPorDescricaoENMateria(notas) {
  const grupos = {};

  notas.forEach(({ descricao, disciplina_id, nota }) => {
    const key = `${descricao || "sem_descricao"}|${disciplina_id}`;
    if (!grupos[key]) {
      grupos[key] = { soma: 0, count: 0 };
    }
    grupos[key].soma += nota;
    grupos[key].count++;
  });

  return Object.entries(grupos).map(([key, { soma, count }]) => {
    const [descricao, disciplina_id] = key.split("|");
    return {
      descricao,
      disciplina_id: Number(disciplina_id),
      media: soma / count,
    };
  });
}

export default function HomeNota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [notas, setNotas] = useState([]);
  const [aluno, setAluno] = useState(null);

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
        if (!Array.isArray(data)) throw new Error("Dados inválidos das notas");
        setNotas(data);
      } catch (error) {
        console.error(error);
        setNotas([]);
      }
    }

    fetchAluno();
    fetchNotas();
  }, [id]);

  const atualizarNotas = async () => {
    try {
      const res = await fetch(`http://localhost:3001/notas/aluno/${id}`);
      if (!res.ok) throw new Error("Notas não encontradas");
      const data = await res.json();
      setNotas(data);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!aluno) return <Typography>Carregando dados do aluno...</Typography>;

  const primeiraNotaId = notas.length > 0 ? notas[0].id : null;

  // Nota com nome da disciplina para passar ao DeletarNota
  const primeiraNota = notas.find((n) => n.id === primeiraNotaId);
  const primeiraNotaComNomeDisciplina = primeiraNota
    ? { ...primeiraNota, disciplina_nome: disciplinasFixas[primeiraNota.disciplina_id] }
    : null;

  const medias = calcularMediasPorDescricaoENMateria(notas);

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant={isSmallScreen ? "h6" : "h4"}
        sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}
      >
        Notas de {aluno.nome} {aluno.sobrenome}
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disciplina</TableCell>
              <TableCell>Trimestre</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Descrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notas.map(({ id, disciplina_id, trimestre, nota, descricao }) => (
              <TableRow key={id}>
                <TableCell>{disciplinasFixas[disciplina_id]}</TableCell>
                <TableCell>{trimestre}</TableCell>
                <TableCell>{nota}</TableCell>
                <TableCell>{descricao || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Médias por Descrição e Disciplina
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Média</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medias.map(({ descricao, disciplina_id, media }) => (
              <TableRow key={`${descricao}-${disciplina_id}`}>
                <TableCell>{descricao === "sem_descricao" ? "-" : descricao}</TableCell>
                <TableCell>{disciplinasFixas[disciplina_id]}</TableCell>
                <TableCell>{media.toFixed(2)}</TableCell>
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

        <Button
          variant="outlined"
          color="warning"
          onClick={() => {
            if (!primeiraNotaId) return alert("Nenhuma nota para editar.");
            navigate(`/editarNota/${primeiraNotaId}`);
          }}
          fullWidth={isSmallScreen}
          disabled={!primeiraNotaId}
        >
          Editar Nota
        </Button>

        {primeiraNotaComNomeDisciplina && (
          <DeletarNota
            nota={primeiraNotaComNomeDisciplina}
            onDeleteSuccess={atualizarNotas}
          />
        )}
      </Stack>
    </Box>
  );
}
