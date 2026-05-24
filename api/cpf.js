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