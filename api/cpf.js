export default async function handler(req, res) {
  const cpf = req.query.cpf;

  if (!cpf) {
    return res.status(400).json({
      statusCode: 400,
      message: "CPF não informado"
    });
  }

   try {
    const response = await fetch(
      `https://snoopintelligence.cloud/api/v2/generic/cpf?cpf=${cpf}&token=snp_pe_12364015_520e3ffa`
    );

    const data = await response.json();

    // calcula score antes de devolver
    const score = calcularScore(data?.body || data);

    return res.status(200).json({
      ...data,
      score_total: score
    });

  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Erro no proxy",
      error: err.message
    });
  }
}

// 📊 SCORE DE COMPLETUDE (não identifica profissão/pessoa)
function calcularScore(dados) {
  let score = 0;

  if (dados?.name) score += 15;
  if (dados?.cpf) score += 10;
  if (dados?.birth_date) score += 10;

  if (dados?.phones?.length) score += 15;
  if (dados?.address) score += 10;

  if (dados?.additional_emails?.length) score += 10;
  if (dados?.all_addresses?.length > 1) score += 10;

  if (dados?.income) score += 20;

  return Math.min(score, 100);
}
