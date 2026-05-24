async function buscar() {
  const cpf = document.getElementById("cpf").value;

  const res = await fetch(`/api/cpf?cpf=${cpf}`);
  const data = await res.json();

  const pessoa = data.body || data;

  // SCORE (simples animado)
  const score = calcularScore(pessoa);
  animarScore(score);

  // 👤 Dados
  document.getElementById("dados").innerHTML = `
    Nome: ${pessoa.name || "-"} <br>
    CPF: ${pessoa.cpf || "-"} <br>
    Nascimento: ${pessoa.birth_date || "-"} <br>
    Sexo: ${pessoa.gender || "-"} <br>
    Status: ${pessoa.federal_status || "-"}
  `;

  // 📞 Contatos
  document.getElementById("contatos").innerHTML = `
    <b>Telefones:</b><br>
    ${(pessoa.phones || []).map(t => "• " + t).join("<br>")}<br><br>

    <b>Emails:</b><br>
    ${(pessoa.additional_emails || []).map(e => "• " + e).join("<br>")}
  `;

  // 📍 Endereço
  const a = pessoa.address || {};
  document.getElementById("endereco").innerHTML = `
    ${a.street || ""} ${a.number || ""}<br>
    ${a.neighborhood || ""}<br>
    ${a.city || ""} - ${a.state || ""}
  `;

  // 💰 Financeiro
  document.getElementById("financeiro").innerHTML = `
    Renda: ${pessoa.income || "-"}<br>
    Poder: ${pessoa.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
    PIS: ${pessoa.pis || "-"}
  `;

  // 👨‍👩‍👧
  document.getElementById("parentes").innerHTML = `
    ${(pessoa.parentes || []).map(p => `• ${p.nome} (${p.vinculo})`).join("<br>")}
  `;
}

// 🔥 SCORE ANIMADO
function animarScore(valor) {
  let el = document.getElementById("score");
  let i = 0;

  let intervalo = setInterval(() => {
    if (i >= valor) clearInterval(intervalo);
    el.innerHTML = `Score: ${i}`;
    i++;
  }, 10);
}

// 📊 SCORE SIMPLES
function calcularScore(p) {
  let s = 0;

  if (p.name) s += 20;
  if (p.cpf) s += 10;
  if (p.birth_date) s += 10;
  if (p.phones?.length) s += 20;
  if (p.additional_emails?.length) s += 10;
  if (p.income) s += 20;
  if (p.parentes?.length) s += 10;

  return Math.min(s, 100);
}
