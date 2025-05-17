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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function DeletarAluno() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alunoNome, setAlunoNome] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const buscarAluno = async () => {
    if (!id) {
      alert("Informe o ID do aluno");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/alunos/${id}`);
      if (!res.ok) throw new Error("Aluno não encontrado");
      const data = await res.json();
      setAlunoNome(`${data.nome} ${data.sobrenome}`);
      setDialogOpen(true);
    } catch (error) {
      alert(error.message);
      setAlunoNome("");
    } finally {
      setLoading(false);
    }
  };

  const deletarAluno = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/alunos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar aluno");
      alert(`Aluno ${alunoNome} deletado com sucesso!`);
      setId("");
      setAlunoNome("");
      setDialogOpen(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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
          width: isSmallScreen ? "100%" : 400,
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
              color: "#d32f2f",
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Deletar Aluno
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="ID do Aluno"
              variant="filled"
              value={id}
              onChange={(e) => setId(e.target.value)}
              fullWidth
              type="number"
            />
            <Button
              variant="contained"
              color="error"
              onClick={buscarAluno}
              disabled={loading || !id}
              fullWidth
            >
              Buscar Aluno
            </Button>
          </Stack>
        </CardContent>

        {/* Dialog para confirmar deleção */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Deleção</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja deletar o aluno: <b>{alunoNome}</b> (ID: {id})?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={deletarAluno}
              color="error"
              variant="contained"
              disabled={loading}
            >
              Deletar
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
}
