import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

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

function CadastroAluno() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!validarCPF(cpf)) {
      setErroCpf("CPF inválido");
      return;
    }

    const data = { nome, sobrenome, dataNascimento, cpf, status: "ATIVO" };

    try {
      const res = await fetch("http://localhost:3001/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Aluno cadastrado com sucesso!");
        setNome("");
        setSobrenome("");
        setDataNascimento("");
        setCpf("");
        setErroCpf("");
        navigate("/");
      } else {
        alert("Erro ao cadastrar aluno");
      }
    } catch {
      alert("Erro na conexão com o servidor");
    }
  };

  const handleCpfChange = (e) => {
    setCpf(e.target.value);
    if (!validarCPF(e.target.value)) {
      setErroCpf("CPF inválido");
    } else {
      setErroCpf("");
    }
  };

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
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Dando os Primeiros Passos na Educação
          </Typography>

          <Stack spacing={3}>
            <TextField
              required
              label="Nome"
              variant="filled"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
            />
            <TextField
              required
              label="Sobrenome"
              variant="filled"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              fullWidth
            />
            <TextField
              required
              label="Data Nascimento"
              variant="filled"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              fullWidth
            />
            <TextField
              required
              label="CPF"
              variant="filled"
              value={cpf}
              onChange={handleCpfChange}
              error={!!erroCpf}
              helperText={erroCpf}
              fullWidth
            />
            <TextField disabled variant="filled" defaultValue="ATIVO" fullWidth />
          </Stack>
        </CardContent>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
          disabled={!!erroCpf}
        >
          Cadastrar Aluno
        </Button>
      </Card>
    </Box>
  );
}

export default CadastroAluno;
