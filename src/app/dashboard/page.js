"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { formatUSD } from "@/utils/format";
import { globalStyles, globalCss } from "@/styles/globals";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useUser } from "@/contexts/UserContext";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { getUserData } = useUser();
  const [contas, setContas] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState("todas");
  const [stats, setStats] = useState({
    resultado: 0,
    resultadoBruto: 0,
    comissaoTotal: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    mediaGain: 0,
    mediaLoss: 0,
    fatorLucro: 0,
    maiorGain: 0,
    maiorLoss: 0,
    drawdown: 0,
  });
  const [dadosGrafico, setDadosGrafico] = useState({
    labels: [],
    datasets: []
  });

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = () => {
      const userData = getUserData();
      if (userData) {
        setContas(userData.contas || []);
        setOperacoes(userData.operacoes || []);
      }
    };

    carregarDados();
    // Recarregar dados periodicamente
    const interval = setInterval(carregarDados, 5000);
    return () => clearInterval(interval);
  }, []);

  // Atualizar estatísticas quando mudar os dados
  useEffect(() => {
    if (operacoes.length > 0) {
      calcularEstatisticas();
      atualizarGrafico();
    }
  }, [operacoes, contaSelecionada]);

  const atualizarGrafico = () => {
    if (operacoes.length === 0) return;

    const operacoesFiltradas = contaSelecionada === "todas" 
      ? operacoes 
      : operacoes.filter(op => op.conta === contaSelecionada);

    const dadosPorConta = {};
    const todasDatas = new Set();

    // Inicializar dados por conta
    operacoesFiltradas.forEach(op => {
      const data = new Date(op.timestamp).toLocaleDateString();
      todasDatas.add(data);
      
      if (!dadosPorConta[op.conta]) {
        dadosPorConta[op.conta] = {
          resultados: {},
          acumulado: {},
          nome: contas.find(c => c.id === op.conta)?.nome || op.conta
        };
      }
    });

    // Calcular resultados diários e acumulados
    const datasOrdenadas = Array.from(todasDatas).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    operacoesFiltradas.forEach(op => {
      const data = new Date(op.timestamp).toLocaleDateString();
      const resultado = Number(op.resultado) || 0;
      
      if (!dadosPorConta[op.conta].resultados[data]) {
        dadosPorConta[op.conta].resultados[data] = 0;
      }
      dadosPorConta[op.conta].resultados[data] += resultado;
    });

    // Calcular valores acumulados
    Object.keys(dadosPorConta).forEach(contaId => {
      let acumulado = 0;
      datasOrdenadas.forEach(data => {
        acumulado += dadosPorConta[contaId].resultados[data] || 0;
        dadosPorConta[contaId].acumulado[data] = acumulado;
      });
    });

    // Preparar datasets para o gráfico
    const datasets = Object.entries(dadosPorConta).map(([contaId, dados], index) => ({
      label: dados.nome,
      data: datasOrdenadas.map(data => dados.acumulado[data] || null),
      borderColor: getContaColor(index),
      backgroundColor: getContaColor(index),
      tension: 0.4,
    }));

    setDadosGrafico({
      labels: datasOrdenadas,
      datasets
    });
  };

  // Função auxiliar para gerar cores para as linhas
  const getContaColor = (index) => {
    const cores = ['#00ff87', '#60efff', '#ff944d', '#ff4444', '#9c27b0'];
    return cores[index % cores.length];
  };

  // Opções do gráfico
  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatUSD(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#999',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#999',
          callback: (value) => formatUSD(value)
        }
      }
    }
  };

  const calcularEstatisticas = () => {
    const operacoesFiltradas = contaSelecionada === "todas" 
      ? operacoes 
      : operacoes.filter(op => op.conta === contaSelecionada);

    let stats = {
      resultado: 0,
      resultadoBruto: 0,
      comissaoTotal: 0,
      trades: operacoesFiltradas.length,
      wins: 0,
      losses: 0,
      winRate: 0,
      mediaGain: 0,
      mediaLoss: 0,
      fatorLucro: 0,
      maiorGain: 0,
      maiorLoss: 0,
      drawdown: 0,
    };

    let totalGains = 0;
    let totalLosses = 0;
    let saldoAcumulado = 0;
    let maiorSaldo = 0;
    let drawdown = 0;

    operacoesFiltradas.forEach(op => {
      const resultado = op.resultado || 0;
      const resultadoBruto = op.resultadoBruto || 0;
      const comissao = op.comissao || 0;

      stats.resultado += resultado;
      stats.resultadoBruto += resultadoBruto;
      stats.comissaoTotal += comissao;

      if (resultado > 0) {
        stats.wins++;
        totalGains += resultado;
        stats.maiorGain = Math.max(stats.maiorGain, resultado);
      } else if (resultado < 0) {
        stats.losses++;
        totalLosses += Math.abs(resultado);
        stats.maiorLoss = Math.min(stats.maiorLoss, resultado);
      }

      saldoAcumulado += resultado;
      maiorSaldo = Math.max(maiorSaldo, saldoAcumulado);
      drawdown = Math.min(drawdown, saldoAcumulado - maiorSaldo);
    });

    stats.winRate = stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0;
    stats.mediaGain = stats.wins > 0 ? totalGains / stats.wins : 0;
    stats.mediaLoss = stats.losses > 0 ? totalLosses / stats.losses : 0;
    stats.fatorLucro = stats.mediaLoss !== 0 ? Math.abs(stats.mediaGain / stats.mediaLoss) : 0;
    stats.drawdown = Math.abs(drawdown);

    setStats(stats);
  };

  return (
    <Layout title="Dashboard">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Seletor de Conta com melhor estilo */}
        <div style={{ 
          marginBottom: "2rem",
          position: "relative",
          zIndex: 10, // Garante que o dropdown fique sobre outros elementos
        }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#999",
              fontSize: "0.9rem",
            }}
          >
            Selecione uma conta
          </label>
          <select
            value={contaSelecionada}
            onChange={(e) => setContaSelecionada(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "100%",
              maxWidth: "300px",
              cursor: "pointer",
              appearance: "none", // Remove estilo padrão do select
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.8rem center",
              backgroundSize: "1.2rem",
              paddingRight: "2.5rem",
            }}
          >
            <option value="todas" style={{ backgroundColor: "#1a1a1a", color: "white" }}>
              Todas as Contas
            </option>
            {contas.map(conta => (
              <option 
                key={conta.id} 
                value={conta.id}
                style={{ backgroundColor: "#1a1a1a", color: "white" }}
              >
                {conta.nome} ({conta.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Grid de Estatísticas Principal */}
        <div style={{ 
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Reduzido para melhor responsividade
          marginBottom: "2rem",
        }}>
          <div style={globalStyles.card}>
            <h3 style={globalStyles.title}>Resultado Geral</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Resultado Bruto</span>
                <span style={{ color: stats.resultadoBruto >= 0 ? "#00ff87" : "#ff4444" }}>
                  {formatUSD(stats.resultadoBruto)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Comissões</span>
                <span style={{ color: "#ff4444" }}>
                  -{formatUSD(stats.comissaoTotal)}
                </span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: "1rem"
              }}>
                <span>Resultado Líquido</span>
                <span style={{ color: stats.resultado >= 0 ? "#00ff87" : "#ff4444" }}>
                  {formatUSD(stats.resultado)}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#999" }}>Win Rate</h3>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {stats.winRate.toFixed(1)}%
            </p>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#999" }}>Fator de Lucro</h3>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {stats.fatorLucro.toFixed(2)}
            </p>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#999" }}>Drawdown</h3>
            <p style={{ 
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#ff4444"
            }}>
              {formatUSD(stats.drawdown)}
            </p>
          </div>
        </div>

        {/* Gráfico de Performance */}
        <div style={{ ...globalStyles.card, marginBottom: "2rem" }}>
          <h3 style={globalStyles.title}>Performance ao Longo do Tempo</h3>
          <div style={{ height: "400px" }}>
            <Line data={dadosGrafico} options={opcoesGrafico} />
          </div>
        </div>

        {/* Grid de Detalhes */}
        <div style={{ 
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // Ajustado para melhor responsividade
        }}>
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#999" }}>Operações</h3>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total de Trades</span>
                <span>{stats.trades}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Wins</span>
                <span style={{ color: "#00ff87" }}>{stats.wins}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Losses</span>
                <span style={{ color: "#ff4444" }}>{stats.losses}</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#999" }}>Médias</h3>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Média de Gain</span>
                <span style={{ color: "#00ff87" }}>{formatUSD(stats.mediaGain)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Média de Loss</span>
                <span style={{ color: "#ff4444" }}>{formatUSD(Math.abs(stats.mediaLoss))}</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "12px",
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#999" }}>Extremos</h3>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Maior Gain</span>
                <span style={{ color: "#00ff87" }}>{formatUSD(stats.maiorGain)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Maior Loss</span>
                <span style={{ color: "#ff4444" }}>{formatUSD(Math.abs(stats.maiorLoss))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estilo global para os cards */}
        <style jsx global>{`
          @media (max-width: 640px) {
            select {
              max-width: 100% !important;
            }
            
            .card {
              padding: 1rem !important;
            }
            
            h3 {
              font-size: 1rem !important;
            }
            
            p {
              font-size: 1.2rem !important;
            }
          }
          
          /* Estilo para as opções do select */
          select option {
            padding: 12px;
            background-color: #1a1a1a;
            color: white;
          }
          
          /* Hover nas opções */
          select option:hover {
            background-color: #333;
          }
        `}</style>
      </div>
    </Layout>
  );
} 