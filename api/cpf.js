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

    // libera CORS pro seu site
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Erro no proxy",
      error: err.message
    });
  }
}
function calcularScore(dados) {
  let score = 0;

  if (dados.name) score += 10;
  if (dados.cpf) score += 10;
  if (dados.birth_date) score += 10;

  if (dados.phones && dados.phones.length > 1) score += 10;
  if (dados.all_addresses && dados.all_addresses.length > 1) score += 10;

  if (dados.additional_emails && dados.additional_emails.length > 0) score += 10;

  if (dados.income) {
    const renda = Number(dados.income);
    if (renda < 1500) score += 5;
    else if (renda < 5000) score += 10;
    else score += 15;
  }

  if (dados.serasa_completo) score += 15;

  if (dados.parentes && dados.parentes.length > 0) score += 10;

  return Math.min(score, 100);
}
