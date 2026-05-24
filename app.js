
async function buscar() {
  const cpf = document.getElementById("cpfInput").value;

  try {
    const res = await fetch(`/api/cpf?cpf=${cpf}`);
    const json = await res.json();

    const p = json.body || json;

    render(p);

  } catch (err) {
    console.log(err);
    alert("Erro na API");
  }
}

/* ================= IDADE ================= */
function idade(data){
  if(!data) return null;

  const [d,m,a] = data.split("/");
  const nasc = new Date(`${a}-${m}-${d}`);
  const hoje = new Date();

  let i = hoje.getFullYear() - nasc.getFullYear();
  const diff = hoje.getMonth() - nasc.getMonth();

  if(diff < 0 || (diff === 0 && hoje.getDate() < nasc.getDate())) i--;

  return i;
}

/* ================= SCORE ================= */
function score(p){
  let s = 0;

  if(p.name) s += 10;
  if(p.cpf) s += 10;
  if(p.birth_date) s += 10;

  if((p.phones||[]).length > 3) s += 15;
  if((p.additional_emails||[]).length > 2) s += 10;
  if((p.all_addresses||[]).length > 1) s += 10;

  if(p.income) s += 15;
  if(p.pis) s += 10;
  if(p.serasa_completo) s += 10;

  return Math.min(s,100);
}

/* ================= PERFIL ================= */
function perfil(p,i){
  const r = Number(p.income||0);

  if(i >= 60) return "APOSENTADO / INSS (SIMULADO)";
  if(r > 3000) return "CLT / RENDA ATIVA";
  if(r > 0 && r <= 1500) return "INFORMAL / BAIXA RENDA";

  return "SEM CLASSIFICAÇÃO";
}

/* ================= RENDER ================= */
function render(p){

  const i = idade(p.birth_date);
  const s = score(p);
  const pf = perfil(p,i);

  /* TOP */
  document.getElementById("score").innerText = `Score: ${s}`;
  document.getElementById("fill").style.width = s + "%";
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
  ${(p.phones||[]).map(t=>`• ${t}`).join("<br>")}<br><br>

  <b>📧 Emails</b><br>
  ${(p.additional_emails||[]).map(e=>`• ${e}`).join("<br>")}<br><br>

  <b>📱 Operadoras</b><br>
  ${(p.telefones_operadoras||[]).map(t=>`• ${t.telefone} (${t.operadora||"?"})`).join("<br>")}<br><br>

  <b>📞 Assecc</b><br>
  ${(p.telefones_assecc||[]).map(t=>`• ${t.telefone}`).join("<br>")}
  `;

  /* FINANCEIRO */
  document.getElementById("financeiro").innerHTML = `
  <b>💰 Financeiro</b><br><br>
  Renda: ${p.income || "-"}<br>
  PIS: ${p.pis || "-"}<br>
  Classe: ${p.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
  Social: ${p.social_class?.social_class || "-"}
  `;

  /* ENDEREÇOS */
  document.getElementById("enderecos").innerHTML = `
  <b>📍 Endereços</b><br><br>

  ${(p.all_addresses||[]).map(a=>`
  • ${a.street || ""} ${a.number || ""} - ${a.city || ""}/${a.state || ""}
  `).join("<br>")}

  <br><b>Delivery:</b><br>
  ${(p.delivery_addresses||[]).map(a=>`
  • ${a.street || ""} ${a.number || ""} - ${a.city || ""}
  `).join("<br>")}
  `;

  /* QUALIDADE */
  document.getElementById("qualidade").innerHTML = `
  <b>📊 Data Quality</b><br><br>
  Email válido: ${p.data_quality?.has_valid_email}<br>
  Endereços: ${p.data_quality?.has_multiple_addresses}<br>
  Renda: ${p.data_quality?.has_income_data}<br>
  PIS: ${p.data_quality?.has_pis}<br>
  Vizinhos: ${p.data_quality?.has_vizinhos}
  `;

  /* ATIVIDADE */
  document.getElementById("atividade").innerHTML = `
  <b>🧠 Activity</b><br><br>
  Primeiro pedido: ${p.activity_profile?.first_order || "-"}<br>
  Último pedido: ${p.activity_profile?.last_order || "-"}<br>
  Ativo: ${p.activity_profile?.is_active_buyer}
  `;

  /* REDE */
  document.getElementById("rede").innerHTML = `
  <b>👥 Vizinhos</b><br><br>
  ${(p.vizinhos||[]).slice(0,10).map(v=>`
  • ${v.nome}
  `).join("<br>")}
  `;
}
