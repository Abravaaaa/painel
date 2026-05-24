async function buscar() {
  const cpf = document.getElementById("cpfInput").value;

  const res = await fetch(`/api/cpf?cpf=${cpf}`);
  const json = await res.json();

  const pessoa = json.body || json;

  render(pessoa);
}

/* =========================
   CALCULA IDADE
========================= */
function idade(nascimento) {
  if (!nascimento) return null;

  const [dia, mes, ano] = nascimento.split("/");
  const nasc = new Date(`${ano}-${mes}-${dia}`);
  const hoje = new Date();

  let i = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) i--;

  return i;
}

/* =========================
   SCORE SIMPLES
========================= */
function score(p) {
  let s = 0;

  if (p.name) s += 10;
  if (p.cpf) s += 10;
  if (p.birth_date) s += 10;

  if ((p.phones || []).length > 3) s += 15;
  if ((p.additional_emails || []).length > 2) s += 10;
  if ((p.all_addresses || []).length > 1) s += 10;

  if (p.income) s += 15;
  if (p.pis) s += 10;
  if (p.serasa_completo) s += 10;

  return Math.min(s, 100);
}

/* =========================
   PERFIL SIMULADO
========================= */
function perfil(p, idadeVal) {
  const renda = Number(p.income || 0);

  if (idadeVal >= 60) return "APOSENTADO / INSS (SIMULADO)";
  if (renda > 3000) return "POSSÍVEL CLT / RENDA ATIVA";
  if (renda > 0 && renda < 1500) return "BAIXA RENDA / INFORMAL";
  return "SEM CLASSIFICAÇÃO";
}

/* =========================
   RENDER PRINCIPAL
========================= */
function render(p) {

  const i = idade(p.birth_date);
  const s = score(p);
  const pf = perfil(p, i);

  document.getElementById("score").innerText = `Score: ${s}`;
  document.getElementById("bar").style.width = s + "%";

  document.getElementById("perfil").innerHTML = `<br><b>Perfil:</b> ${pf}`;
  document.getElementById("idade").innerHTML = `<b>Idade:</b> ${i || "N/D"}`;

  /* DADOS */
  document.getElementById("dados").innerHTML = `
    <b>👤 Dados</b><br><br>
    Nome: ${p.name || "-"}<br>
    CPF: ${p.cpf || "-"}<br>
    Nascimento: ${p.birth_date || "-"}<br>
    Sexo: ${p.gender || "-"}<br>
    Status: ${p.federal_status || "-"}
  `;

  /* CONTATOS */
  document.getElementById("contatos").innerHTML = `
    <b>📞 Telefones</b><br>
    ${(p.phones || []).map(t => `• ${t}`).join("<br>")}<br><br>

    <b>📧 Emails</b><br>
    ${(p.additional_emails || []).map(e => `• ${e}`).join("<br>")}<br><br>

    <b>📍 Vizinhos</b><br>
    ${(p.vizinhos || []).slice(0, 5).map(v => `• ${v.nome}`).join("<br>")}
  `;

  /* FINANCEIRO */
  document.getElementById("financeiro").innerHTML = `
    <b>💰 Financeiro</b><br><br>
    Renda: ${p.income || "-"}<br>
    PIS: ${p.pis || "-"}<br>
    Classe: ${p.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
    Social: ${p.social_class?.social_class || "-"}
  `;
}
