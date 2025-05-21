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

  const opcoesDescricao = [
    "ATV 1", "ATV 2", "ATV 3", "ATV 4",
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

  const handleSubmit = async () => {
    if (!validarNota(nota)) return;
    if (!trimestre.trim()) {
      alert("Trimestre é obrigatório");
      return;
    }
    if (!disciplina) {
      alert("Disciplina é obrigatória");
      return;
    }

    const data = {
      aluno_id: Number(id),
      disciplina_id: Number(disciplina),
      trimestre: trimestre.trim(),
      nota: Number(nota),
      descricao: descricao.trim(),
    };

    try {
      const res = await fetch("http://localhost:3001/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Nota cadastrada com sucesso!");
        setDisciplina("");
        setTrimestre("");
        setNota("");
        setDescricao("");
        navigate(`/homeNota/${id}`);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao cadastrar nota");
      }
    } catch (error) {
      alert("Erro na conexão com o servidor");
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
              label="Descrição (opcional)"
              variant="filled"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
            >
              <MenuItem value="">-- Nenhuma --</MenuItem>
              {opcoesDescricao.map((desc) => (
                <MenuItem key={desc} value={desc}>
                  {desc}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
          disabled={
            !!erroNota ||
            nota === "" ||
            trimestre.trim() === "" ||
            disciplina === ""
          }
        >
          Cadastrar Nota
        </Button>
      </Card>
    </Box>
  );
}
