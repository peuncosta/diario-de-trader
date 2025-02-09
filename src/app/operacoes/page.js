// src/app/operacoes/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { formatUSD } from "@/utils/format";
import { globalStyles, globalCss } from "@/styles/globals";
import { useUser } from "@/contexts/UserContext";

export default function OperacoesPage() {
  const { getUserData, saveUserData } = useUser();
  const [contas, setContas] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState("todas");
  const [estatisticas, setEstatisticas] = useState({
    total: { wins: 0, losses: 0, resultado: 0 },
    porConta: {}
  });
  const [modalImage, setModalImage] = useState(null);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = () => {
      const userData = getUserData();
      if (userData) {
        setContas(userData.contas || []);
        setOperacoes(userData.operacoes || []);
        calcularEstatisticas(userData.operacoes || []);
      }
    };

    carregarDados();
    // Recarregar dados periodicamente
    const interval = setInterval(carregarDados, 5000);
    return () => clearInterval(interval);
  }, []);

  const calcularEstatisticas = (operacoesParaCalcular) => {
    const operacoesFiltradas = contaSelecionada === "todas" 
      ? operacoesParaCalcular 
      : operacoesParaCalcular.filter(op => op.conta === contaSelecionada);

    let stats = {
      total: {
        resultado: 0,
        resultadoBruto: 0,
        comissaoTotal: 0,
        wins: 0,
        losses: 0
      },
      porConta: {}
    };

    operacoesFiltradas.forEach(op => {
      // Garantir que os valores sejam números e não undefined
      const resultado = Number(op.resultado) || 0;
      const resultadoBruto = Number(op.resultadoBruto) || 0;
      const comissao = Number(op.comissao) || 0;

      // Estatísticas totais
      stats.total.resultado += resultado;
      stats.total.resultadoBruto += resultadoBruto;
      stats.total.comissaoTotal += comissao;
      
      if (resultado > 0) stats.total.wins++;
      if (resultado < 0) stats.total.losses++;

      // Estatísticas por conta
      if (!stats.porConta[op.conta]) {
        stats.porConta[op.conta] = {
          resultado: 0,
          resultadoBruto: 0,
          comissaoTotal: 0,
          wins: 0,
          losses: 0
        };
      }

      stats.porConta[op.conta].resultado += resultado;
      stats.porConta[op.conta].resultadoBruto += resultadoBruto;
      stats.porConta[op.conta].comissaoTotal += comissao;
      
      if (resultado > 0) stats.porConta[op.conta].wins++;
      if (resultado < 0) stats.porConta[op.conta].losses++;
    });

    setEstatisticas(stats);
  };

  // Atualizar estatísticas quando mudar a conta selecionada
  useEffect(() => {
    calcularEstatisticas(operacoes);
  }, [contaSelecionada, operacoes]);

  const operacoesFiltradas = operacoes
    .filter(op => contaSelecionada === "todas" || op.conta === contaSelecionada)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ordenar por data mais recente

  const getContaNome = (contaId) => {
    const conta = contas.find(c => c.id === contaId);
    return conta ? conta.nome : contaId;
  };

  // Função para salvar alterações
  const salvarAlteracoes = (novasOperacoes) => {
    const userData = getUserData();
    saveUserData({
      ...userData,
      operacoes: novasOperacoes
    });
    setOperacoes(novasOperacoes);
    calcularEstatisticas(novasOperacoes);
  };

  const handleDeleteOperacao = (operacaoId) => {
    if (window.confirm("Tem certeza que deseja excluir esta operação? Esta ação não pode ser desfeita.")) {
      const novasOperacoes = operacoes.filter(op => op.id !== operacaoId);
      salvarAlteracoes(novasOperacoes);
    }
  };

  const handleLimparConta = (contaId) => {
    const conta = contas.find(c => c.id === contaId);
    if (window.confirm(`Tem certeza que deseja excluir TODAS as operações da conta "${conta?.nome}"? Esta ação não pode ser desfeita.`)) {
      const novasOperacoes = operacoes.filter(op => op.conta !== contaId);
      salvarAlteracoes(novasOperacoes);
    }
  };

  const ImageModal = ({ src, onClose }) => {
    if (!src) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "2rem",
        }}
        onClick={onClose}
      >
        <div style={{ position: "relative", maxWidth: "100%", maxHeight: "100%" }}>
          <img
            src={src}
            alt="Screenshot da operação"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              backgroundColor: "rgba(255, 68, 68, 0.9)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const salvarOperacao = (novaOperacao) => {
    const userData = getUserData();
    const operacoesAtualizadas = [...userData.operacoes, novaOperacao];
    
    // Atualizar dados do usuário
    saveUserData({
      ...userData,
      operacoes: operacoesAtualizadas
    });
    
    setOperacoes(operacoesAtualizadas);
  };

  return (
    <Layout title="Operações">
      <div style={globalStyles.pageContainer}>
        {/* Cabeçalho com Filtro e Ações */}
        <div style={{ ...globalStyles.card, marginBottom: "2rem" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "1.5rem",
            "@media (min-width: 768px)": {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }
          }}>
            {/* Filtro de Conta */}
            <div style={{ flex: 1, maxWidth: "400px" }}>
              <label style={globalStyles.label}>Filtrar por Conta</label>
              <select
                value={contaSelecionada}
                onChange={(e) => setContaSelecionada(e.target.value)}
                style={globalStyles.select}
              >
                <option value="todas">Todas as Contas</option>
                {contas.map(conta => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome} ({conta.tipo})
                  </option>
                ))}
              </select>
            </div>

            {/* Botões de Ação */}
            <div style={{ 
              display: "flex", 
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              flex: 1,
            }}>
              {contaSelecionada !== "todas" && operacoesFiltradas.length > 0 && (
                <button
                  onClick={() => handleLimparConta(contaSelecionada)}
                  style={{ ...globalStyles.button, ...globalStyles.dangerButton }}
                >
                  🗑️ Limpar Conta
                </button>
              )}
              <Link
                href="/novo"
                style={{ ...globalStyles.button, ...globalStyles.primaryButton, textDecoration: "none" }}
              >
                + Nova Operação
              </Link>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div style={{ 
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            marginTop: "2rem",
          }}>
            <div style={globalStyles.card}>
              <div style={{ 
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={globalStyles.label}>Resultado Bruto</span>
                  <span style={{ 
                    color: estatisticas.total.resultadoBruto >= 0 ? "#00ff87" : "#ff4444",
                    fontWeight: "bold"
                  }}>
                    {formatUSD(estatisticas.total.resultadoBruto)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={globalStyles.label}>Total Comissões</span>
                  <span style={{ color: "#ff4444" }}>
                    -{formatUSD(estatisticas.total.comissaoTotal)}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                }}>
                  <span style={globalStyles.label}>Resultado Líquido</span>
                  <span style={estatisticas.total.resultado >= 0 ? globalStyles.positiveValue : globalStyles.negativeValue}>
                    {formatUSD(estatisticas.total.resultado)}
                  </span>
                </div>
              </div>
            </div>

            <div style={globalStyles.card}>
              <h3 style={globalStyles.title}>Win Rate</h3>
              <p style={{ fontSize: "1.5rem", margin: 0, fontWeight: "bold" }}>
                {((estatisticas.total.wins / (estatisticas.total.wins + estatisticas.total.losses)) * 100).toFixed(1)}%
              </p>
              <p style={{ margin: "0.5rem 0 0 0", color: "#999", fontSize: "0.9rem" }}>
                {estatisticas.total.wins} wins / {estatisticas.total.losses} losses
              </p>
            </div>

            <div style={globalStyles.card}>
              <h3 style={globalStyles.title}>Total de Trades</h3>
              <p style={{ fontSize: "1.5rem", margin: 0, fontWeight: "bold" }}>
                {estatisticas.total.wins + estatisticas.total.losses}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Operações */}
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
          {/* Cabeçalho da Lista */}
          <div style={{
            ...globalStyles.card,
            display: "grid",
            gridTemplateColumns: "1fr 100px 150px 150px 150px 50px",
            gap: "1rem",
            padding: "0.75rem 1rem",
            alignItems: "center",
            fontWeight: "bold",
            color: "#999",
            fontSize: "0.9rem",
            "@media (max-width: 768px)": {
              display: "none", // Esconde o cabeçalho em telas pequenas
            }
          }}>
            <span>Ativo/Data</span>
            <span>Tipo</span>
            <span style={{ textAlign: "right" }}>Resultado Bruto</span>
            <span style={{ textAlign: "right" }}>Comissão</span>
            <span style={{ textAlign: "right" }}>Resultado Líquido</span>
            <span></span>
          </div>

          {operacoesFiltradas.map((op) => (
            <div key={op.id} style={{
              ...globalStyles.card,
              display: "grid",
              gridTemplateColumns: "1fr 100px 150px 150px 150px 50px",
              gap: "1rem",
              padding: "0.75rem 1rem",
              alignItems: "center",
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
                gap: "0.5rem",
              }
            }}>
              {/* Ativo e Data */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "bold" }}>{op.ativo}</span>
                  <span style={{ color: "#999", fontSize: "0.8rem" }}>
                    ({getContaNome(op.conta)})
                  </span>
                </div>
                <span style={{ color: "#999", fontSize: "0.8rem" }}>
                  {new Date(op.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Tipo */}
              <span style={{
                padding: "0.2rem 0.5rem",
                backgroundColor: op.tipo === "compra" ? "rgba(0, 255, 135, 0.1)" : "rgba(255, 68, 68, 0.1)",
                color: op.tipo === "compra" ? "#00ff87" : "#ff4444",
                borderRadius: "4px",
                fontSize: "0.8rem",
                textAlign: "center",
                "@media (max-width: 768px)": {
                  width: "fit-content",
                }
              }}>
                {op.tipo.toUpperCase()}
              </span>

              {/* Resultado Bruto */}
              <div style={{ 
                textAlign: "right",
                "@media (max-width: 768px)": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }
              }}>
                <span style={{ 
                  color: "#999", 
                  fontSize: "0.9rem",
                  display: "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                  }
                }}>Resultado Bruto:</span>
                <span style={{ 
                  color: Number(op.resultadoBruto) >= 0 ? "#00ff87" : "#ff4444",
                  fontWeight: "bold"
                }}>
                  {formatUSD(Number(op.resultadoBruto || 0))}
                </span>
              </div>

              {/* Comissão */}
              <div style={{ 
                textAlign: "right",
                "@media (max-width: 768px)": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }
              }}>
                <span style={{ 
                  color: "#999", 
                  fontSize: "0.9rem",
                  display: "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                  }
                }}>Comissão:</span>
                <span style={{ color: "#ff4444" }}>
                  -{formatUSD(Number(op.comissao || 0))}
                </span>
              </div>

              {/* Resultado Líquido */}
              <div style={{ 
                textAlign: "right",
                "@media (max-width: 768px)": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "0.5rem",
                }
              }}>
                <span style={{ 
                  color: "#999", 
                  fontSize: "0.9rem",
                  display: "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                  }
                }}>Resultado Líquido:</span>
                <span style={Number(op.resultado || 0) >= 0 ? globalStyles.positiveValue : globalStyles.negativeValue}>
                  {formatUSD(Number(op.resultado || 0))}
                </span>
              </div>

              {/* Ações */}
              <div style={{ 
                display: "flex", 
                gap: "0.5rem",
                justifyContent: "flex-end",
                "@media (max-width: 768px)": {
                  justifyContent: "flex-start",
                }
              }}>
                {op.screenshot && (
                  <button
                    onClick={() => setModalImage(op.screenshot)}
                    style={{ 
                      ...globalStyles.button, 
                      ...globalStyles.secondaryButton,
                      padding: "0.4rem",
                      minWidth: "32px",
                      height: "32px",
                    }}
                  >
                    🖼️
                  </button>
                )}
                <button
                  onClick={() => handleDeleteOperacao(op.id)}
                  style={{ 
                    ...globalStyles.button, 
                    ...globalStyles.dangerButton,
                    padding: "0.4rem",
                    minWidth: "32px",
                    height: "32px",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Imagem */}
        <ImageModal
          src={modalImage}
          onClose={() => setModalImage(null)}
        />

        {/* Estado Vazio */}
        {operacoesFiltradas.length === 0 && (
          <div style={{ ...globalStyles.card, textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
              Nenhuma operação encontrada{contaSelecionada !== "todas" ? " para esta conta" : ""}.
            </p>
            <Link
              href="/novo"
              style={{ ...globalStyles.button, ...globalStyles.primaryButton, textDecoration: "none" }}
            >
              Registrar Primeira Operação
            </Link>
          </div>
        )}

        <style jsx global>{globalCss}</style>
      </div>
    </Layout>
  );
}
