import React, { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export default function EditarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [aluno, setAluno] = useState({
    nome: "",
    sobrenome: "",
    dataNascimento: "",
    cpf: "",
    status: "ATIVO",
  });

  const [erroCpf, setErroCpf] = useState("");

  useEffect(() => {
    async function fetchAluno() {
      const res = await fetch(`http://localhost:3001/alunos/${id}`);
      const data = await res.json();

      const dataFormatada = new Date(data.dataNascimento)
        .toISOString()
        .split("T")[0];

      setAluno({ ...data, dataNascimento: dataFormatada });
    }
    fetchAluno();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAluno((prev) => ({ ...prev, [name]: value }));

    if (name === "cpf") {
      if (!validarCPF(value)) {
        setErroCpf("CPF inválido");
      } else {
        setErroCpf("");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validarCPF(aluno.cpf)) {
      setErroCpf("CPF inválido");
      return;
    }

    const dataFormatada = new Date(aluno.dataNascimento)
      .toISOString()
      .split("T")[0];

    const res = await fetch(`http://localhost:3001/alunos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...aluno,
        dataNascimento: dataFormatada,
      }),
    });

    if (res.ok) {
      alert("Dados atualizados com sucesso!");
      navigate("/");
    } else {
      alert("Erro ao atualizar os dados");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f9",
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
              color: "#2c3e50",
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Editar Aluno
          </Typography>

          <Stack spacing={3}>
            <TextField
              required
              label="Nome"
              name="nome"
              variant="filled"
              value={aluno.nome}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Sobrenome"
              name="sobrenome"
              variant="filled"
              value={aluno.sobrenome}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              value={aluno.dataNascimento}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="CPF"
              name="cpf"
              variant="filled"
              value={aluno.cpf}
              onChange={handleChange}
              error={!!erroCpf}
              helperText={erroCpf}
              fullWidth
            />
            <TextField
              select
              label="Status"
              name="status"
              variant="filled"
              value={aluno.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="ATIVO">ATIVO</MenuItem>
              <MenuItem value="INATIVO">INATIVO</MenuItem>
            </TextField>
          </Stack>
        </CardContent>

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: "bold",
            backgroundColor: "#556cd6",
            ":hover": { backgroundColor: "#4054b2" },
          }}
          disabled={!!erroCpf}
        >
          Salvar Alterações
        </Button>
      </Card>
    </Box>
  );
}
