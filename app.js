async function buscar() {
  const cpf = document.getElementById("cpfInput").value.replace(/\D/g, '');

  if (!cpf) {
    alert("Por favor, digite um CPF válido.");
    return;
  }

  try {
    const res = await fetch(`/api/cpf?cpf=${cpf}`);
    const json = await res.json();

    const p = json.body || json;

    if (!p) {
      alert("CPF não encontrado.");
      return;
    }

    render(p);

  } catch (err) {
    console.error(err);
    alert("Erro na conexão com a API.");
  }
}

/* =========================
   IDADE
========================= */
function idade(data) {
  if (!data) return null;

  let d, m, a;

  if (data.includes("/")) {
    [d, m, a] = data.split("/");
  } else {
    [a, m, d] = data.split("-");
  }

  const nasc = new Date(`${a}-${m}-${d}`);
  const hoje = new Date();

  let i = hoje.getFullYear() - nasc.getFullYear();
  const diff = hoje.getMonth() - nasc.getMonth();

  if (diff < 0 || (diff === 0 && hoje.getDate() < nasc.getDate())) {
    i--;
  }

  return i;
}

/* =========================
   SCORE 0-100
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
   PERFIL
========================= */
function perfil(p, i) {
  const r = Number(p.income || 0);

  if (i >= 60) return "APOSENTADO / INSS";
  if (p.federal_status === "REGULAR" && r > 3000) return "CLT / RENDA ATIVA";
  if (r > 0 && r <= 1500) return "INFORMAL / BAIXA RENDA";
  if (!p.income) return "DESEMPREGADO / SEM RENDA";

  return "SEM CLASSIFICAÇÃO";
}

/* =========================
   RENDER (BLINDADO)
========================= */
function render(p) {
  const i = idade(p.birth_date);
  const s = score(p);
  const pf = perfil(p, i);

  // SCORE TOP
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.innerText = `${s}`;

  const fill = document.getElementById("fill");
  if (fill) fill.style.width = s + "%";

  const perfilEl = document.getElementById("perfil");
  if (perfilEl) perfilEl.innerHTML = `<b>${pf}</b>`;

  const idadeEl = document.getElementById("idade");
  if (idadeEl) idadeEl.innerHTML = `<b>${i || "N/D"} anos</b>`;

  // DADOS
  const dados = document.getElementById("dados");
  if (dados) {
    dados.innerHTML = `
      <b>👤 Dados</b><br><br>
      Nome: ${p.name || "-"}<br>
      CPF: ${p.cpf || "-"}<br>
      Nascimento: ${p.birth_date || "-"}<br>
      Sexo: ${p.gender || "-"}<br>
      Status: ${p.federal_status || "-"}
    `;
  }

  // CONTATOS
  const contatos = document.getElementById("contatos");
  if (contatos) {
    contatos.innerHTML = `
      <b>📞 Telefones</b><br>
      ${(p.phones || []).map(t => `• ${t}`).join("<br>")}

      <br><br><b>📡 Operadoras</b><br>
      ${(p.telefones_operadoras || []).map(t => `• ${t.telefone} (${t.operadora || "?"})`).join("<br>")}

      <br><br><b>📞 Assecc</b><br>
      ${(p.telefones_assecc || []).map(t => `• ${t.telefone || t}`).join("<br>")}

      <br><br><b>📧 Emails</b><br>
      ${(p.additional_emails || []).map(e => `• ${e}`).join("<br>")}
    `;
  }

  // FINANCEIRO
  const financeiro = document.getElementById("financeiro");
  if (financeiro) {
    financeiro.innerHTML = `
      <b>💰 Financeiro</b><br><br>
      Renda: R$ ${p.income || "0"}<br>
      PIS: ${p.pis || "-"}<br>
      Poder: ${p.poder_aquisitivo?.PODER_AQUISITIVO || "-"}<br>
      Classe Social: ${p.social_class?.social_class || "-"}
    `;
  }

  // ENDEREÇOS
  const end = document.getElementById("enderecos");
  if (end) {
    end.innerHTML = `
      <b>📍 Endereços</b><br><br>
      ${(p.all_addresses || []).map(a =>
        `• ${a.street || ""} ${a.number || ""} - ${a.city || ""}/${a.state || ""}`
      ).join("<br>")}
    `;
  }

  // QUALIDADE
  const qual = document.getElementById("qualidade");
  if (qual) {
    qual.innerHTML = `
      <b>📊 Data Quality</b><br><br>
      Email válido: ${p.data_quality?.has_valid_email ? "Sim" : "Não"}<br>
      Renda: ${p.data_quality?.has_income_data ? "Sim" : "Não"}<br>
      PIS: ${p.data_quality?.has_pis ? "Sim" : "Não"}<br>
      Vizinhos: ${p.data_quality?.has_vizinhos ? "Sim" : "Não"}
    `;
  }

  // ATIVIDADE
  const atv = document.getElementById("atividade");
  if (atv) {
    atv.innerHTML = `
      <b>🧠 Activity</b><br><br>
      Primeiro Pedido: ${p.activity_profile?.first_order || "-"}<br>
      Último Pedido: ${p.activity_profile?.last_order || "-"}<br>
      Ativo: ${p.activity_profile?.is_active_buyer ? "Sim" : "Não"}
    `;
  }

  // REDE
  const rede = document.getElementById("rede");
  if (rede) {
    rede.innerHTML = `
      <b>👥 Vizinhos</b><br><br>
      ${(p.vizinhos || []).slice(0, 8).map(v =>
        `• ${v.nome} (${v.logradouro || ""})`
      ).join("<br>")}
    `;
  }
}
