function media(notas) {
  const grupos = {};

  notas.forEach(({ descricao, disciplina_id, nota }) => {
    const key = `${descricao || "sem_descricao"}|${disciplina_id}`;
    const valorNota = Number(nota);
    if (isNaN(valorNota)) return; // pula notas inválidas

    if (!grupos[key]) {
      grupos[key] = { soma: 0, count: 0 };
    }
    grupos[key].soma += valorNota;
    grupos[key].count++;
  });

  const medias = Object.entries(grupos).map(([key, { soma, count }]) => {
    const [descricao, disciplina_id] = key.split("|");
    return {
      descricao,
      disciplina_id: Number(disciplina_id),
      mediaFinal: soma / count,
    };
  });

  return medias;
}
