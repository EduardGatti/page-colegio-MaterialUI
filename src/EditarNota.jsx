import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  useMediaQuery,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarNota() {
  const { id } = useParams(); // id do aluno
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [notas, setNotas] = useState([]);

  const [disciplinaId, setDisciplinaId] = useState("");
  const [trimestre, setTrimestre] = useState("");
  const [nota, setNota] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroNota, setErroNota] = useState("");

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
        if (!res.ok) throw new Error("Disciplinas não encontradas");
        const data = await res.json();
        setDisciplinas(data);
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
        alert(error.message);
      }
    }

    fetchAluno();
    fetchDisciplinas();
    fetchNotas();
  }, [id]);

  useEffect(() => {
    if (!disciplinaId) {
      setNota("");
      setDescricao("");
      setTrimestre("");
      return;
    }

    const notaSelecionada = notas.find(
      (n) => n.disciplina_id === Number(disciplinaId)
    );

    if (notaSelecionada) {
      setNota(notaSelecionada.nota.toString());
      setDescricao(notaSelecionada.descricao || "");
      setTrimestre(notaSelecionada.trimestre.toString());
    } else {
      setNota("");
      setDescricao("");
      setTrimestre("");
    }
  }, [disciplinaId, notas]);

  const validarNota = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 10) {
      setErroNota("Nota deve ser um número entre 0 e 10");
      return false;
    }
    setErroNota("");
    return true;
  };

const descricoesOptions = React.useMemo(() => {
  const descricoes = notas
    .map((n) => n.descricao)
    .filter((desc) => desc && desc.trim() !== "");

  console.log("Descrições únicas encontradas:", [...new Set(descricoes)]);
  return [...new Set(descricoes)];
}, [notas]);



  const handleSubmit = async () => {
    if (!validarNota(nota)) return;
    if (!trimestre.trim()) {
      alert("Trimestre é obrigatório");
      return;
    }
    if (!disciplinaId) {
      alert("Disciplina é obrigatória");
      return;
    }

    const data = {
      aluno_id: Number(id),
      disciplina_id: Number(disciplinaId),
      trimestre: Number(trimestre),
      nota: Number(nota),
      descricao: descricao.trim(),
    };

    try {
      const res = await fetch(`http://localhost:3001/notas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Nota atualizada com sucesso!");
        navigate(`/homeNota/${id}`);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao atualizar nota");
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
            Editar Nota de {aluno.nome} {aluno.sobrenome}
          </Typography>

          <Stack spacing={3}>
            <TextField
              select
              required
              label="Disciplina"
              variant="filled"
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Selecione uma disciplina</MenuItem>
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
              type="number"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (Number(val) >= 0 && Number(val) <= 10)) {
                  setNota(val);
                  setErroNota("");
                } else {
                  setErroNota("Nota deve ser entre 0 e 10");
                }
              }}
              error={!!erroNota}
              helperText={erroNota}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              fullWidth
            />

            <Autocomplete
              freeSolo
              options={descricoesOptions}
              value={descricao}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setDescricao(newValue);
                } else if (newValue && newValue.inputValue) {
                  setDescricao(newValue.inputValue);
                } else {
                  setDescricao(newValue || "");
                }
              }}
              onInputChange={(event, newInputValue) => {
                setDescricao(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Descrição (opcional)"
                  variant="filled"
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />
          </Stack>
        </CardContent>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
          disabled={
            !!erroNota || nota === "" || trimestre.trim() === "" || disciplinaId === ""
          }
        >
          Atualizar Nota
        </Button>
      </Card>
    </Box>
  );
}
