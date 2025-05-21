import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  MenuItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useParams, useNavigate } from "react-router-dom";

export default function CadastroNota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplina, setDisciplina] = useState("");
  const [trimestre, setTrimestre] = useState("");
  const [nota, setNota] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroNota, setErroNota] = useState("");
  const [notas, setNotas] = useState([]);

  const opcoesDescricao = [
    "PR 1", "PR 2", "PR 3", "PR 4",
    "RP 1", "RP 2", "RP 3", "RP 4"
  ];

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

    async function fetchDisciplinas() {
      try {
        const res = await fetch("http://localhost:3001/disciplinas");
        if (!res.ok) throw new Error("Erro ao buscar disciplinas");
        const data = await res.json();
        setDisciplinas(data);
      } catch (error) {
        alert(error.message);
      }
    }

    fetchAluno();
    fetchDisciplinas();
  }, [id]);

  const validarNota = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 10) {
      setErroNota("Nota deve ser um número entre 0 e 10");
      return false;
    }
    setErroNota("");
    return true;
  };

  const adicionarNota = () => {
    if (!validarNota(nota)) return;
    if (!trimestre.trim() || !disciplina || !descricao.trim()) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const novaNota = {
      aluno_id: Number(id),
      disciplina_id: Number(disciplina),
      trimestre: trimestre.trim(),
      nota: Number(nota),
      descricao: descricao.trim(),
    };

    setNotas([...notas, novaNota]);
    setDisciplina("");
    setTrimestre("");
    setNota("");
    setDescricao("");
  };

  const submitNotas = async () => {
    if (notas.length !== 4) {
      alert("Você deve adicionar exatamente 4 notas.");
      return;
    }

    try {
      for (const notaObj of notas) {
        const res = await fetch("http://localhost:3001/notas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notaObj),
        });
        if (!res.ok) throw new Error("Erro ao cadastrar nota");
      }
      alert("4 notas cadastradas com sucesso!");
      navigate(`/homeNota/${id}`);
    } catch (error) {
      alert("Erro ao enviar notas.");
    }
  };

  if (!aluno) return <Typography>Carregando dados do aluno...</Typography>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: isSmallScreen ? "100%" : 500,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "#1976d2",
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Cadastrar Nota para {aluno.nome} {aluno.sobrenome}
          </Typography>

          <Stack spacing={3}>
            <TextField
              select
              required
              label="Disciplina"
              variant="filled"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              fullWidth
            >
              {disciplinas.map(({ id, nome }) => (
                <MenuItem key={id} value={id}>
                  {nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              label="Trimestre"
              variant="filled"
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
              fullWidth
            />

            <TextField
              required
              label="Nota (0 a 10)"
              variant="filled"
              value={nota}
              onChange={(e) => {
                setNota(e.target.value);
                validarNota(e.target.value);
              }}
              error={!!erroNota}
              helperText={erroNota}
              fullWidth
              type="number"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
            />

            <TextField
              select
              required
              label="Descrição"
              variant="filled"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
            >
              {opcoesDescricao.map((desc) => (
                <MenuItem key={desc} value={desc}>
                  {desc}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              onClick={adicionarNota}
              disabled={
                !!erroNota ||
                nota === "" ||
                trimestre.trim() === "" ||
                disciplina === "" ||
                descricao.trim() === ""
              }
            >
              Adicionar Nota
            </Button>

            {notas.length > 0 && (
              <Box>
                <Typography variant="subtitle1">Notas adicionadas:</Typography>
                {notas.map((n, i) => (
                  <Typography key={i}>
                    {n.descricao} - {n.nota} - {n.trimestre}
                  </Typography>
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={submitNotas}
              fullWidth
              disabled={notas.length !== 4}
            >
              Enviar 4 Notas
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
