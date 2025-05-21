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

function calcularMedia(notas) {
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
        if (!Array.isArray(data)) throw new Error("Dados inválidos das notas");
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

  const primeiraNota = notas.find((n) => n.id === primeiraNotaId);
  const primeiraNotaComNomeDisciplina = primeiraNota
    ? {
        ...primeiraNota,
        disciplina_nome: disciplinas.find(
          (d) => d.id === primeiraNota.disciplina_id
        )?.nome, 
      }
    : null;

  const medias = calcularMedia(notas);

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
            {notas.map(({ id, disciplina_id, trimestre, nota, descricao }) => {
              // Buscar o nome da disciplina usando o ID
              const disciplina = disciplinas.find((d) => d.id === disciplina_id);
              return (
                <TableRow key={id}>
                  <TableCell>{disciplina ? disciplina.nome : "Desconhecida"}</TableCell>
                  <TableCell>{trimestre}</TableCell>
                  <TableCell>{nota}</TableCell>
                  <TableCell>{descricao || "-"}</TableCell>
                </TableRow>
              );
            })}
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
            navigate(`/editarNota/${aluno.id}`);
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
