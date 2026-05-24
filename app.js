async function buscar() {
  const cpf = document.getElementById("cpf").value;

  const res = await fetch(`/api/cpf?cpf=${cpf}`);
  const data = await res.json();

  const body = data.body || data;

  // SCORE
  const score = data.score_total || 0;
  document.getElementById("scoreFill").style.width = score + "%";

  // DADOS
  document.getElementById("dados").innerHTML = `
    Nome: ${body.name || "-"} <br>
    CPF: ${body.cpf || "-"} <br>
    Nascimento: ${body.birth_date || "-"}
  `;

  // CONTATOS
  document.getElementById("contatos").innerHTML = `
    Telefones: ${(body.phones || []).join("<br>")} <br>
    Emails: ${(body.additional_emails || []).join("<br>")}
  `;

  // ENDEREÇO
  const addr = body.address || {};
  document.getElementById("endereco").innerHTML = `
    ${addr.street || ""} ${addr.number || ""} <br>
    ${addr.neighborhood || ""} <br>
    ${addr.city || ""} - ${addr.state || ""}
  `;
}
