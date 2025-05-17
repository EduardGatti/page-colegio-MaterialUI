import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";

export default function DeletarNota({ nota, onDeleteSuccess }) {
  const [open, setOpen] = useState(false);

  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);

  const confirmarDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3001/notas/${nota.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Nota deletada com sucesso!");
        onDeleteSuccess();
        fecharModal();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao deletar nota");
      }
    } catch {
      alert("Erro na conexão com o servidor");
    }
  };

  return (
    <>
      <Button color="error" onClick={abrirModal}>
        Deletar
      </Button>

      <Dialog open={open} onClose={fecharModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar a nota:{" "}
            <strong>{nota?.descricao || "sem descrição"}</strong> da disciplina{" "}
            <strong>{nota?.disciplina_nome || "desconhecida"}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button color="error" onClick={confirmarDelete}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
