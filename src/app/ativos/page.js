"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { formatUSD } from "@/utils/format";
import { globalStyles, globalCss } from "@/styles/globals";

export default function AtivosPage() {
  const [ativos, setAtivos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [novoAtivo, setNovoAtivo] = useState({
    simbolo: "",
    nome: "",
    tipo: "acao", // acao, cripto, forex, indice
    tickSize: 0.01,
    contractSize: 1,
    mercado: "B3", // B3, NYSE, NASDAQ, Binance, etc
    valorPorTick: 1, // Novo campo
  });
  const [showForm, setShowForm] = useState(false);

  const tiposAtivo = [
    { valor: "acao", nome: "Ação" },
    { valor: "indice", nome: "Índice" },
    { valor: "cripto", nome: "Criptomoeda" },
    { valor: "forex", nome: "Forex" },
    { valor: "metais", nome: "Metais" }, // Novo tipo
  ];

  const mercados = [
    { valor: "CME", nome: "CME" },
    { valor: "CBOX", nome: "CBOX" },
    { valor: "B3", nome: "B3" },
    { valor: "NYSE", nome: "NYSE" },
    { valor: "NASDAQ", nome: "NASDAQ" },
    { valor: "Binance", nome: "Binance" },
    { valor: "Forex", nome: "Forex" }
  ];

  const ativosIniciais = [
    {
      simbolo: "NQ",
      nome: "Mini Nasdaq",
      tipo: "indice",
      mercado: "CME",
      tickSize: 0.25,
      valorPorTick: 5.00,
      contractSize: 1
    },
    {
      simbolo: "MNQ",
      nome: "Micro Nasdaq",
      tipo: "indice",
      mercado: "CME",
      tickSize: 0.25,
      valorPorTick: 0.50,
      contractSize: 1
    },
    {
      simbolo: "YM",
      nome: "Mini Dow Jones",
      tipo: "indice",
      mercado: "CME",
      tickSize: 1.00,
      valorPorTick: 5.00,
      contractSize: 1
    },
    {
      simbolo: "MYM",
      nome: "Micro Dow Jones",
      tipo: "indice",
      mercado: "CME",
      tickSize: 1.00,
      valorPorTick: 0.50,
      contractSize: 1
    },
    {
      simbolo: "ES",
      nome: "Mini SP500",
      tipo: "indice",
      mercado: "CME",
      tickSize: 0.25,
      valorPorTick: 12.50,
      contractSize: 1
    },
    {
      simbolo: "MES",
      nome: "Micro SP500",
      tipo: "indice",
      mercado: "CME",
      tickSize: 0.25,
      valorPorTick: 1.25,
      contractSize: 1
    },
    {
      simbolo: "GC",
      nome: "Mini Ouro",
      tipo: "metais",
      mercado: "CBOX",
      tickSize: 0.10,
      valorPorTick: 10.00,
      contractSize: 1
    },
    {
      simbolo: "MGC",
      nome: "Micro Ouro",
      tipo: "metais",
      mercado: "CBOX",
      tickSize: 0.10,
      valorPorTick: 1.00,
      contractSize: 1
    },
    {
      simbolo: "CL",
      nome: "Mini Petróleo",
      tipo: "metais",
      mercado: "CBOX",
      tickSize: 0.01,
      valorPorTick: 10.00,
      contractSize: 1
    },
    {
      simbolo: "MCL",
      nome: "Micro Petróleo",
      tipo: "metais",
      mercado: "CBOX",
      tickSize: 0.01,
      valorPorTick: 1.00,
      contractSize: 1
    }
  ];

  useEffect(() => {
    const ativosSalvos = JSON.parse(localStorage.getItem('ativos') || '[]');
    
    // Verifica se todos os ativos iniciais estão presentes
    const ativosAtualizados = [...ativosSalvos];
    let precisaAtualizar = false;

    ativosIniciais.forEach(ativoInicial => {
      if (!ativosSalvos.some(ativo => ativo.simbolo === ativoInicial.simbolo)) {
        ativosAtualizados.push(ativoInicial);
        precisaAtualizar = true;
      }
    });

    // Se foram adicionados novos ativos, atualiza o localStorage e o estado
    if (precisaAtualizar) {
      localStorage.setItem('ativos', JSON.stringify(ativosAtualizados));
      setAtivos(ativosAtualizados);
    } else {
      setAtivos(ativosSalvos);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (ativos.some(a => a.simbolo === novoAtivo.simbolo)) {
      alert("Este ativo já está cadastrado!");
      return;
    }

    const novosAtivos = [...ativos, novoAtivo];
    localStorage.setItem('ativos', JSON.stringify(novosAtivos));
    setAtivos(novosAtivos);
    setShowForm(false);
    setNovoAtivo({
      simbolo: "",
      nome: "",
      tipo: "acao",
      tickSize: 0.01,
      contractSize: 1,
      mercado: "B3",
      valorPorTick: 1,
    });
  };

  const handleDelete = async (simbolo) => {
    const result = await confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este ativo?',
      okText: 'Sim, excluir',
      cancelText: 'Cancelar'
    });

    if (result) {
      const novosAtivos = ativos.filter(a => a.simbolo !== simbolo);
      localStorage.setItem('ativos', JSON.stringify(novosAtivos));
      setAtivos(novosAtivos);
    }
  };

  const ativosFiltrados = filtroTipo === "todos" 
    ? ativos 
    : ativos.filter(a => a.tipo === filtroTipo);

  return (
    <Layout title="Gerenciar Ativos">
      <div style={globalStyles.pageContainer}>
        {/* Cabeçalho com Filtros e Botão Novo */}
        <div style={{ ...globalStyles.card, marginBottom: "2rem" }}>
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            "@media (min-width: 640px)": {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }
          }}>
            <div style={globalStyles.formField}>
              <label style={globalStyles.label}>Filtrar por Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{ ...globalStyles.select, maxWidth: "300px" }}
              >
                <option value="todos">Todos os Tipos</option>
                {tiposAtivo.map(tipo => (
                  <option key={tipo.valor} value={tipo.valor}>{tipo.nome}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
            >
              + Novo Ativo
            </button>
          </div>
        </div>

        {/* Formulário de Novo Ativo */}
        {showForm && (
          <div style={globalStyles.card}>
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}>
                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Símbolo</label>
                  <input
                    type="text"
                    placeholder="ex: PETR4"
                    value={novoAtivo.simbolo}
                    onChange={(e) => setNovoAtivo({...novoAtivo, simbolo: e.target.value.toUpperCase()})}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Nome</label>
                  <input
                    type="text"
                    placeholder="Nome do ativo"
                    value={novoAtivo.nome}
                    onChange={(e) => setNovoAtivo({...novoAtivo, nome: e.target.value})}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Tipo</label>
                  <select
                    value={novoAtivo.tipo}
                    onChange={(e) => setNovoAtivo({...novoAtivo, tipo: e.target.value})}
                    style={globalStyles.select}
                  >
                    {tiposAtivo.map(tipo => (
                      <option key={tipo.valor} value={tipo.valor}>{tipo.nome}</option>
                    ))}
                  </select>
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Mercado</label>
                  <select
                    value={novoAtivo.mercado}
                    onChange={(e) => setNovoAtivo({...novoAtivo, mercado: e.target.value})}
                    style={globalStyles.select}
                  >
                    {mercados.map(mercado => (
                      <option key={mercado.valor} value={mercado.valor}>{mercado.nome}</option>
                    ))}
                  </select>
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Tick Size</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={novoAtivo.tickSize}
                    onChange={(e) => setNovoAtivo({...novoAtivo, tickSize: parseFloat(e.target.value)})}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Valor por Tick</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoAtivo.valorPorTick}
                    onChange={(e) => setNovoAtivo({...novoAtivo, valorPorTick: parseFloat(e.target.value)})}
                    required
                    style={globalStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ ...globalStyles.button, ...globalStyles.secondaryButton }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
                >
                  Salvar Ativo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Ativos */}
        <div style={globalStyles.grid}>
          {ativosFiltrados.map((ativo) => (
            <div key={ativo.simbolo} style={globalStyles.card}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}>
                <div>
                  <h3 style={{ ...globalStyles.title, margin: 0 }}>{ativo.simbolo}</h3>
                  <p style={{ margin: 0, color: "#999", fontSize: "0.9rem" }}>{ativo.nome}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}>
                    {ativo.tipo.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#999" }}>
                    {ativo.mercado}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}>
                <div>
                  <p style={globalStyles.label}>Tick Size</p>
                  <p style={{ margin: 0 }}>{ativo.tickSize}</p>
                </div>
                <div>
                  <p style={globalStyles.label}>Valor por Tick</p>
                  <p style={{ margin: 0 }}>{formatUSD(ativo.valorPorTick)}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(ativo.simbolo)}
                style={{ ...globalStyles.button, ...globalStyles.dangerButton, width: "100%" }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {ativosFiltrados.length === 0 && (
          <div style={{ ...globalStyles.card, textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
              Nenhum ativo encontrado{filtroTipo !== "todos" ? ` do tipo ${filtroTipo}` : ""}.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
            >
              Cadastrar Primeiro Ativo
            </button>
          </div>
        )}

        <style jsx global>{globalCss}</style>
      </div>
    </Layout>
  );
} 