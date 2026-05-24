async function buscar() {
  const cpf = document.getElementById("cpf").value;

  const res = await fetch(`/api/cpf?cpf=${cpf}`);
  const data = await res.json();

  const pessoa = data.body || data;

  const score = calcularScore(pessoa);
  animarScore(score);

  // 👤 DADOS
  document.getElementById("dados").innerHTML = `
    <b>Nome:</b> ${pessoa.name || "-"}<br>
    <b>CPF:</b> ${pessoa.cpf || "-"}<br>
    <b>Nascimento:</b> ${pessoa.birth_date || "-"}<br>
    <b>Sexo:</b> ${pessoa.gender || "-"}<br>
    <b>Status:</b> ${pessoa.federal_status || "-"}<br>
  `;

  // 📞 CONTATOS COMPLETO
  document.getElementById("contatos").innerHTML = `
    <b>Phones:</b><br>
    ${(pessoa.phones || []).map(t => `• ${t}`).join("<br>")}<br><br>

    <b>Emails:</b><br>
    ${(pessoa.additional_emails || []).map(e => `• ${e}`).join("<br>")}<br><br>

    <b>Operadoras:</b><br>
    ${(pessoa.telefones_operadoras || [])
      .map(t => `• ${t.telefone} (${t.operadora || "N/A"})`)
      .join("<br>")}<br><br>

    <b>Assecc:</b><br>
    ${(pessoa.telefones_assecc || [])
      .map(t => `• ${t.telefone} - ${t.nome}`)
      .join("<br>")}
  `;

  // 📍 ENDEREÇOS COMPLETO
  document.getElementById("endereco").innerHTML = `
    <b>Principal:</b><br>
    ${pessoa.address?.street || ""} ${pessoa.address?.number || ""}<br>
    ${pessoa.address?.neighborhood || ""}<br>
    ${pessoa.address?.city || ""} - ${pessoa.address?.state || ""}<br><br>

    <b>Outros:</b><br>
    ${(pessoa.all_addresses || [])
      .map(a => `• ${a.street || ""} ${a.number || ""} - ${a.city || ""}`)
      .join("<br>")}<br><br>

    <b>Delivery:</b><br>
    ${(pessoa.delivery_addresses || [])
      .map(a => `• ${a.street} ${a.number} - ${a.city}`)
      .join("<br>")}
  `;

  // 💰 FINANCEIRO COMPLETO
  document.getElementById("financeiro").innerHTML = `
    <b>Renda:</b> ${pessoa.income || "-"}<br>
    <b>Poder:</b> ${pessoa.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
    <b>PIS:</b> ${pessoa.pis || "-"}<br>
    <b>Social Class:</b> ${pessoa.social_class?.social_class || "-"}<br>
  `;

  // 👨‍👩‍👧 RELACIONADOS + VIZINHOS
  document.getElementById("parentes").innerHTML = `
    <b>Parentes:</b><br>
    ${(pessoa.parentes || [])
      .map(p => `• ${p.nome} (${p.vinculo})`)
      .join("<br>")}<br><br>

    <b>Vizinhos:</b><br>
    ${(pessoa.vizinhos || [])
      .slice(0, 10)
      .map(v => `• ${v.nome} - ${v.logradouro}`)
      .join("<br>")}
  `;

  // 📊 DATA QUALITY + MÉTRICAS
  const dq = pessoa.data_quality || {};
  const dc = pessoa.data_coverage || {};
  const cp = pessoa.contact_summary || {};
  const ap = pessoa.activity_profile || {};

  document.getElementById("qualidade").innerHTML = `
    <b>Data Quality:</b><br>
    Emails válidos: ${dq.has_valid_email ? "SIM" : "NÃO"}<br>
    Endereços múltiplos: ${dq.has_multiple_addresses ? "SIM" : "NÃO"}<br>
    Renda: ${dq.has_income_data ? "SIM" : "NÃO"}<br>
    Vizinhos: ${dq.has_vizinhos ? "SIM" : "NÃO"}<br><br>

    <b>Contact Summary:</b><br>
    Telefones: ${cp.total_phones || 0}<br>
    Emails: ${cp.total_emails || 0}<br>
    Orders: ${cp.total_ecommerce_orders || 0}<br><br>

    <b>Activity:</b><br>
    Primeiro pedido: ${ap.first_order || "-"}<br>
    Último pedido: ${ap.last_order || "-"}<br>
    Ativo comprador: ${ap.is_active_buyer ? "SIM" : "NÃO"}<br><br>

    <b>Coverage:</b><br>
    Fontes: ${(dc.sources || []).join(", ")}
  `;
}

// 🔥 SCORE
function animarScore(valor) {
  let el = document.getElementById("score");
  let i = 0;

  let interval = setInterval(() => {
    if (i >= valor) clearInterval(interval);
    el.innerHTML = `Score: ${i}`;
    i++;
  }, 10);
}

function calcularScore(p) {
  let s = 0;

  if (p.name) s += 15;
  if (p.cpf) s += 10;
  if (p.birth_date) s += 10;
  if (p.phones?.length) s += 15;
  if (p.additional_emails?.length) s += 10;
  if (p.income) s += 20;
  if (p.parentes?.length) s += 10;
  if (p.vizinhos?.length) s += 10;

  return Math.min(s, 100);
}
