async function buscar() {
  const cpf = document.getElementById("cpfInput").value;
  if (!cpf) return alert("Digite um CPF");

  try {
    const res = await fetch(`/api/cpf?cpf=${cpf}`);
    const json = await res.json();
    const p = json.body || json;
    render(p);
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar dados na API");
  }
}

/* Calculadora de Idade */
function idade(data) {
  if (!data) return null;
  const [d, m, a] = data.split("/");
  const nasc = new Date(`${a}-${m}-${d}`);
  const hoje = new Date();
  let i = hoje.getFullYear() - nasc.getFullYear();
  const diff = hoje.getMonth() - nasc.getMonth();
  if (diff < 0 || (diff === 0 && hoje.getDate() < nasc.getDate())) i--;
  return i;
}

/* Algoritmo de Score */
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

/* Lógica de Classificação de Perfil */
function perfil(p, i) {
  const r = Number(p.income || 0);
  if (i >= 60) return "APOSENTADO / INSS";
  if (r > 3000) return "CLT / RENDA ALTA";
  if (r > 0 && r <= 1500) return "INFORMAL / BAIXA RENDA";
  return "SEM CLASSIFICAÇÃO";
}

/* Renderização Completa */
function render(p) {
  const i = idade(p.birth_date);
  const s = score(p);
  const pf = perfil(p, i);

  /* Topo */
  document.getElementById("score").innerText = `Score: ${s}`;
  document.getElementById("barFill").style.width = s + "%";
  document.getElementById("perfil").innerHTML = `<br><b>Perfil:</b> ${pf}`;
  document.getElementById("idade").innerHTML = `<b>Idade:</b> ${i || "N/D"}`;

  /* Dados */
  document.getElementById("dados").innerHTML = `
    <b>👤 Dados</b><br><br>
    Nome: ${p.name || "-"}<br>
    CPF: ${p.cpf_masked || p.cpf || "-"}<br>
    Nascimento: ${p.birth_date || "-"}<br>
    Sexo: ${p.gender || "-"}<br>
    Status: ${p.federal_status || "-"}`;

  /* Contatos */
  document.getElementById("contatos").innerHTML = `
    <b>📞 Telefones</b><br>${(p.phones || []).map(t => `• ${t}`).join("<br>")}<br><br>
    <b>📧 Emails</b><br>${(p.additional_emails || []).map(e => `• ${e}`).join("<br>")}<br><br>
    <b>📱 Operadoras</b><br>${(p.telefones_operadoras || []).map(t => `• ${t.telefone} (${t.operadora || "?"})`).join("<br>")}`;

  /* Financeiro */
  document.getElementById("financeiro").innerHTML = `
    <b>💰 Financeiro</b><br><br>
    Renda: R$ ${p.income || "0,00"}<br>
    PIS: ${p.pis || "-"}<br>
    Poder Aquisitivo: ${p.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
    Classe Social: ${p.social_class?.social_class || "-"}`;

  /* Endereços */
  document.getElementById("enderecos").innerHTML = `
    <b>📍 Endereços</b><br><br>
    ${(p.all_addresses || []).slice(0, 3).map(a => `• ${a.street}, ${a.number || 'S/N'} - ${a.city}/${a.state}`).join("<br>")}`;

  /* Qualidade */
  document.getElementById("qualidade").innerHTML = `
    <b>📊 Data Quality</b><br><br>
    Valid Email: ${p.data_quality?.has_valid_email ? "✅" : "❌"}<br>
    Múltiplos End: ${p.data_quality?.has_multiple_addresses ? "✅" : "❌"}<br>
    Dados Renda: ${p.data_quality?.has_income_data ? "✅" : "❌"}<br>
    Possui PIS: ${p.data_quality?.has_pis ? "✅" : "❌"}`;

  /* Atividade */
  document.getElementById("atividade").innerHTML = `
    <b>🧠 Activity</b><br><br>
    Primeiro Pedido: ${p.activity_profile?.first_order || "-"}<br>
    Último Pedido: ${p.activity_profile?.last_order || "-"}<br>
    Ativo: ${p.activity_profile?.is_active_buyer ? "Sim" : "Não"}`;

  /* Rede (Vizinhos) */
  document.getElementById("rede").innerHTML = `
    <b>👥 Vizinhos (Top 5)</b><br><br>
    ${(p.vizinhos || []).slice(0, 5).map(v => `• ${v.nome}`).join("<br>")}`;
}
