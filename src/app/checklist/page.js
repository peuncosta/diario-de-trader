"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { globalStyles, globalCss } from "@/styles/globals";

export default function ChecklistPage() {
  const checklistPadrao = [
    // Preparação Mental
    { 
      id: 1, 
      categoria: "Preparação Mental",
      texto: "Meditação/Respiração",
      descricao: "5-10 minutos de respiração consciente ou meditação para acalmar a mente",
      checked: false 
    },
    { 
      id: 2, 
      texto: "Revisão do Estado Emocional",
      categoria: "Preparação Mental",
      descricao: "Avaliar se está em condições emocionais para operar (sem raiva, ansiedade ou euforia)",
      checked: false 
    },
    { 
      id: 3, 
      texto: "Definição de Expectativas",
      categoria: "Preparação Mental",
      descricao: "Lembrar que cada dia é único e não criar expectativas irreais de ganhos",
      checked: false 
    },

    // Análise de Mercado
    { 
      id: 4, 
      texto: "Revisão de Notícias Importantes",
      categoria: "Análise de Mercado",
      descricao: "Verificar calendário econômico e notícias que podem impactar o mercado",
      checked: false 
    },
    { 
      id: 5, 
      texto: "Análise do Contexto Macro",
      categoria: "Análise de Mercado",
      descricao: "Entender o momento do mercado (tendência, volatilidade, liquidez)",
      checked: false 
    },
    { 
      id: 6, 
      texto: "Identificação de Níveis Chave",
      categoria: "Análise de Mercado",
      descricao: "Marcar suportes, resistências e áreas de interesse no gráfico",
      checked: false 
    },

    // Gestão de Risco
    { 
      id: 7, 
      texto: "Definição do Risco Máximo",
      categoria: "Gestão de Risco",
      descricao: "Estabelecer o valor máximo que está disposto a perder no dia",
      checked: false 
    },
    { 
      id: 8, 
      texto: "Verificação do Tamanho da Posição",
      categoria: "Gestão de Risco",
      descricao: "Calcular o tamanho adequado da posição conforme seu risco por operação",
      checked: false 
    },
    { 
      id: 9, 
      texto: "Revisão das Regras de Stop",
      categoria: "Gestão de Risco",
      descricao: "Relembrar seus critérios de saída e comprometer-se a respeitá-los",
      checked: false 
    },

    // Setup Operacional
    { 
      id: 10, 
      texto: "Preparação do Ambiente",
      categoria: "Setup Operacional",
      descricao: "Organizar área de trabalho, monitores e ferramentas necessárias",
      checked: false 
    },
    { 
      id: 11, 
      texto: "Verificação das Conexões",
      categoria: "Setup Operacional",
      descricao: "Testar internet, plataforma e backup caso necessário",
      checked: false 
    },
    { 
      id: 12, 
      texto: "Revisão do Plano de Trading",
      categoria: "Setup Operacional",
      descricao: "Relembrar suas regras de entrada, alvos e gestão",
      checked: false 
    }
  ];

  const [checklist, setChecklist] = useState(checklistPadrao);
  const [historico, setHistorico] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visualizandoData, setVisualizandoData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const historicoSalvo = JSON.parse(localStorage.getItem('checklistHistorico') || '{}');
    setHistorico(historicoSalvo);
    carregarChecklistDoDia(visualizandoData);
  }, []);

  const carregarChecklistDoDia = (data) => {
    const checklistDoDia = historico[data] || checklistPadrao;
    setChecklist(checklistDoDia);
  };

  const handleCheck = (id) => {
    const newChecklist = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(newChecklist);
    
    const novoHistorico = { ...historico, [visualizandoData]: newChecklist };
    localStorage.setItem('checklistHistorico', JSON.stringify(novoHistorico));
    setHistorico(novoHistorico);
  };

  const handleDiaClick = (data) => {
    const dataString = data.toISOString().split('T')[0];
    setVisualizandoData(dataString);
    carregarChecklistDoDia(dataString);
  };

  const getDiasDoMes = (data) => {
    const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
    const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    const dias = [];

    // Adiciona dias vazios no início para alinhar com o dia da semana correto
    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push(null);
    }

    // Adiciona os dias do mês
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(data.getFullYear(), data.getMonth(), i));
    }

    return dias;
  };

  const diasDoMes = getDiasDoMes(selectedDate);
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getStatusDia = (data) => {
    if (!data) return null;
    const dataString = data.toISOString().split('T')[0];
    const checklistDia = historico[dataString];
    if (!checklistDia) return 'pendente';
    const total = checklistDia.length;
    const completados = checklistDia.filter(item => item.checked).length;
    if (completados === 0) return 'pendente';
    if (completados === total) return 'completo';
    return 'parcial';
  };

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Função para agrupar checklist por categoria
  const checklistAgrupado = checklist.reduce((grupos, item) => {
    const grupo = grupos[item.categoria] || [];
    grupo.push(item);
    grupos[item.categoria] = grupo;
    return grupos;
  }, {});

  return (
    <Layout title="Checklist do Trader">
      <div style={globalStyles.pageContainer}>
        <div style={{ 
          display: "grid", 
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}>
          {/* Calendário */}
          <div style={globalStyles.card}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                style={{ ...globalStyles.button, ...globalStyles.secondaryButton }}
              >
                ←
              </button>
              <h3 style={{ ...globalStyles.title, margin: 0 }}>
                {meses[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                style={{ ...globalStyles.button, ...globalStyles.secondaryButton }}
              >
                →
              </button>
            </div>

            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.5rem",
              textAlign: "center",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
            }}>
              {diasDaSemana.map(dia => (
                <div key={dia} style={{ 
                  padding: "0.5rem",
                  color: "#999",
                  fontWeight: "bold",
                }}>
                  {dia}
                </div>
              ))}
              
              {diasDoMes.map((dia, index) => {
                if (!dia) return <div key={`empty-${index}`} />;
                
                const status = getStatusDia(dia);
                const dataString = dia.toISOString().split('T')[0];
                const isSelected = dataString === visualizandoData;
                const isHoje = new Date().toDateString() === dia.toDateString();
                
                return (
                  <div
                    key={dia.getTime()}
                    onClick={() => handleDiaClick(dia)}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor: status === 'completo' ? "rgba(0, 255, 135, 0.1)" :
                                     status === 'parcial' ? "rgba(255, 193, 7, 0.1)" :
                                     "rgba(255, 255, 255, 0.1)",
                      border: isSelected ? "2px solid #00ff87" :
                              isHoje ? "2px solid rgba(0, 255, 135, 0.5)" : 
                              "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      }
                    }}
                  >
                    {dia.getDate()}
                  </div>
                );
              })}
            </div>

            <div style={{ 
              marginTop: "1rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
              }}>
                <div style={{ 
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(0, 255, 135, 0.1)",
                  borderRadius: "3px",
                }}/>
                <span>Completo</span>
              </div>
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
              }}>
                <div style={{ 
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(255, 193, 7, 0.1)",
                  borderRadius: "3px",
                }}/>
                <span>Parcial</span>
              </div>
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
              }}>
                <div style={{ 
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                }}/>
                <span>Pendente</span>
              </div>
            </div>
          </div>

          {/* Checklist do Dia - Versão Melhorada */}
          <div style={globalStyles.card}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <h3 style={{ ...globalStyles.title, margin: 0 }}>
                Checklist do dia {formatarData(visualizandoData)}
              </h3>
              {visualizandoData !== new Date().toISOString().split('T')[0] && (
                <span style={{ color: "#999", fontSize: "0.9rem" }}>
                  Visualizando outro dia
                </span>
              )}
            </div>

            {Object.entries(checklistAgrupado).map(([categoria, items]) => (
              <div key={categoria} style={{ marginBottom: "2rem" }}>
                <h4 style={{ 
                  color: "#00ff87",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  borderBottom: "1px solid rgba(0, 255, 135, 0.2)",
                  paddingBottom: "0.5rem"
                }}>
                  {categoria}
                </h4>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() => handleCheck(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "1rem",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}}
                          style={{ 
                            width: "20px", 
                            height: "20px",
                            cursor: "pointer",
                          }}
                        />
                        <div>
                          <span style={{
                            textDecoration: item.checked ? "line-through" : "none",
                            color: item.checked ? "#999" : "white",
                          }}>
                            {item.texto}
                          </span>
                          <p style={{ 
                            margin: "0.5rem 0 0 0",
                            fontSize: "0.9rem",
                            color: "#999",
                            fontStyle: "italic"
                          }}>
                            {item.descricao}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{globalCss}</style>
      </div>
    </Layout>
  );
} 