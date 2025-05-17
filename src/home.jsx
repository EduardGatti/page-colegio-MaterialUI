import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const [alunos, setAlunos] = useState([]);


    const fetchAlunos = async () => {
        try {
            const res = await fetch("http://localhost:3001/alunos");
            const data = await res.json();
            setAlunos(data);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        }
    };

    useEffect(() => {
        fetchAlunos();
    }, []);


    const handleDeletar = async (id, nomeCompleto) => {
        const confirmado = window.confirm(
            `Tem certeza que deseja deletar o aluno ${nomeCompleto}?`
        );
        if (!confirmado) return;

        try {
            const res = await fetch(`http://localhost:3001/alunos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar aluno");
            alert("Aluno deletado com sucesso!");
            fetchAlunos();
        } catch (error) {
            alert(error.message);
        }
    };

    const statusCount = alunos.reduce((acc, aluno) => {
        acc[aluno.status] = (acc[aluno.status] || 0) + 1;
        return acc;
    }, {});

    const totalAlunos = alunos.length;

    const chartData = {
        labels: Object.keys(statusCount),
        datasets: [
            {
                label: "Quantidade de Alunos",
                data: Object.values(statusCount),
                backgroundColor: Object.keys(statusCount).map((status) =>
                    status === "ATIVO" ? "#4caf50" : "#f44336"
                ),
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Distribuição dos Alunos por Status",
                font: { size: 18 },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const valor = context.raw;
                        const percentual = ((valor / totalAlunos) * 100).toFixed(1);
                        return `${valor} alunos (${percentual}%)`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f4f6f9",
                color: "#333",
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
            }}
        >
            <Typography
                variant={isSmallScreen ? "h5" : "h4"}
                sx={{
                    fontWeight: "bold",
                    color: "#2c3e50",
                    fontFamily: "'Playfair Display', serif",
                }}
            >
                Dashboard de Alunos
            </Typography>

            <Paper
                elevation={4}
                sx={{
                    width: isSmallScreen ? "100%" : 700,
                    height: isSmallScreen ? 300 : 400,
                    p: 3,
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                }}
            >
                <Bar data={chartData} options={chartOptions} />
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    width: isSmallScreen ? "100%" : 700,
                    p: 3,
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Lista de Alunos
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Sobrenome</TableCell>
                                <TableCell>Data de Nascimento</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alunos.map((aluno) => (
                                <TableRow key={aluno.id}>
                                    <TableCell>{aluno.nome}</TableCell>
                                    <TableCell>{aluno.sobrenome}</TableCell>
                                    <TableCell>{aluno.dataNascimento}</TableCell>
                                    <TableCell>{aluno.cpf}</TableCell>
                                    <TableCell>{aluno.status}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                onClick={() => navigate(`/editarAluno/${aluno.id}`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDeletar(aluno.id, `${aluno.nome} ${aluno.sobrenome}`)
                                                }
                                            >
                                                Deletar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                onClick={() => navigate(`/homeNota/${aluno.id}`)}
                                            >
                                                Painel
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Button
                variant="contained"
                onClick={() => navigate("/cadastroAlunos")}
                sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#556cd6",
                    ":hover": { backgroundColor: "#4054b2" },
                }}
            >
                Cadastrar Novo Aluno
            </Button>
        </Box>
    );
}
