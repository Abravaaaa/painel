export default async function handler(req, res) {
  const cpf = req.query.cpf;

  // CORS (evita bloqueio no front)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  // resposta para preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    // fallback caso venha estrutura diferente
    const body = data?.body || data;

    // SCORE simples (0–100)
    let score = 0;

    if (body?.name) score += 15;
    if (body?.cpf) score += 10;
    if (body?.birth_date) score += 10;
    if (body?.phones?.length) score += 15;
    if (body?.address) score += 10;
    if (body?.additional_emails?.length) score += 10;
    if (body?.all_addresses?.length > 1) score += 10;
    if (body?.income) score += 20;

    score = Math.min(score, 100);

    return res.status(200).json({
      statusCode: 200,
      body,
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
