async function buscar() {
  const cpf = document.getElementById("cpf").value;

  const res = await fetch(`/api/cpf?cpf=${cpf}`);
  const data = await res.json();

  const body = data.body || data;

  // SCORE
  document.getElementById("scoreFill").style.width = (data.score_total || 0) + "%";

  // 👤 DADOS PRINCIPAIS
  document.getElementById("dados").innerHTML = `
    <b>Nome:</b> ${body.name || "-"} <br>
    <b>CPF:</b> ${body.cpf || "-"} <br>
    <b>Nascimento:</b> ${body.birth_date || "-"} <br>
    <b>Sexo:</b> ${body.gender || "-"} <br>
    <b>Status:</b> ${body.federal_status || "-"}
  `;

  // 📞 TELEFONES (com tratamento melhor)
  document.getElementById("contatos").innerHTML = `
    <b>Telefones:</b><br>
    ${(body.phones || []).map(t => `• ${t}`).join("<br>")}
    <br><br>
    <b>Emails:</b><br>
    ${(body.additional_emails || []).map(e => `• ${e}`).join("<br>")}
  `;

  // 📍 ENDEREÇOS (principais + históricos)
  document.getElementById("endereco").innerHTML = `
    <b>Principal:</b><br>
    ${body.address?.street || ""} ${body.address?.number || ""} <br>
    ${body.address?.neighborhood || ""} <br>
    ${body.address?.city || ""} - ${body.address?.state || ""}
    <br><br>

    <b>Outros endereços:</b><br>
    ${(body.all_addresses || [])
      .slice(0, 5)
      .map(a => `• ${a.street} ${a.number || ""} - ${a.city}`)
      .join("<br>")}
  `;

  // 💰 FINANCEIRO (NOVO BLOCO IMPORTANTE)
  if (!document.getElementById("financeiro")) {
    document.querySelector(".cards").innerHTML += `
      <div class="card">
        <h3>💰 Financeiro</h3>
        <div id="financeiro"></div>
      </div>
    `;
  }

  document.getElementById("financeiro").innerHTML = `
    <b>Renda:</b> ${body.income || "-"} <br>
    <b>Poder aquisitivo:</b> ${body.poder_aquisitivo?.PODER_AQUISITIVO || "-"} <br>
    <b>PIS:</b> ${body.pis || "-"}
  `;

  // 👨‍👩‍👧 RELACIONADOS (NOVO)
  if (!document.getElementById("relacionados")) {
    document.querySelector(".cards").innerHTML += `
      <div class="card">
        <h3>👨‍👩‍👧 Relacionados</h3>
        <div id="relacionados"></div>
      </div>
    `;
  }

  document.getElementById("relacionados").innerHTML = `
    ${(body.parentes || [])
      .map(p => `• ${p.nome} (${p.vinculo})`)
      .join("<br>")}
  `;
}
