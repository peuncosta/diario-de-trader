"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { globalStyles } from "@/styles/globals";

export default function DesafiosPage() {
  const [desafiosAtivos, setDesafiosAtivos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [desafioParaDesistir, setDesafioParaDesistir] = useState(null);

  const desafiosDisponiveis = [
    {
      id: "risco-zero",
      titulo: "Risco Zero",
      icone: "🔥",
      descricao: "Desenvolva disciplina no gerenciamento de risco",
      duracao: "5 dias úteis",
      tipo: "Individual",
      nivel: "Iniciante",
      beneficios: [
        "Melhor controle de risco",
        "Maior disciplina operacional",
        "Resultados mais consistentes"
      ]
    },
    {
      id: "erro-zero",
      titulo: "Erro Zero",
      icone: "🚀",
      descricao: "Corrija um erro específico e melhore sua performance",
      duracao: "5 dias úteis",
      tipo: "Individual",
      nivel: "Intermediário",
      beneficios: [
        "Identificação de padrões de erro",
        "Correção de comportamentos",
        "Evolução constante"
      ]
    }
  ];

  useEffect(() => {
    const desafiosSalvos = JSON.parse(localStorage.getItem('desafios') || '[]');
    setDesafiosAtivos(desafiosSalvos.filter(d => d.status === 'em_andamento'));
    setHistorico(desafiosSalvos.filter(d => d.status === 'concluido'));
  }, []);

  const handleDesistir = (desafio, e) => {
    e.preventDefault(); // Previne a navegação do Link
    e.stopPropagation(); // Previne a propagação do evento
    setDesafioParaDesistir(desafio);
    setShowConfirmModal(true);
  };

  const confirmarDesistencia = () => {
    const desafiosSalvos = JSON.parse(localStorage.getItem('desafios') || '[]');
    const desafiosAtualizados = desafiosSalvos.map(d => {
      if (d.id === desafioParaDesistir.id) {
        return {
          ...d,
          status: 'desistido',
          dataFim: new Date().toISOString(),
          motivoDesistencia: 'Desistência voluntária'
        };
      }
      return d;
    });

    localStorage.setItem('desafios', JSON.stringify(desafiosAtualizados));
    setDesafiosAtivos(prev => prev.filter(d => d.id !== desafioParaDesistir.id));
    setShowConfirmModal(false);
    setDesafioParaDesistir(null);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    title: {
      fontSize: "2.5rem",
      background: "linear-gradient(45deg, #00ff87, #60efff)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      marginBottom: "1rem",
    },
    subtitle: {
      color: "#999",
      fontSize: "1.2rem",
    },
    section: {
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      marginBottom: "1.5rem",
      color: "#fff",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
    },
    card: {
      ...globalStyles.card,
      padding: "1.5rem",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        borderColor: "#00ff87",
      },
    },
    icon: {
      fontSize: "2.5rem",
      marginBottom: "1rem",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      backgroundColor: "rgba(0, 255, 135, 0.1)",
      color: "#00ff87",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
    },
    beneficios: {
      listStyle: "none",
      padding: 0,
      margin: "1rem 0",
    },
    beneficioItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
      color: "#999",
      fontSize: "0.9rem",
    },
    button: {
      ...globalStyles.button,
      ...globalStyles.primaryButton,
      width: "100%",
      marginTop: "1rem",
    },
    progressCard: {
      ...globalStyles.card,
      padding: "1rem",
      backgroundColor: "rgba(0, 255, 135, 0.05)",
      marginBottom: "1rem",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      ...globalStyles.card,
      width: "90%",
      maxWidth: "400px",
      padding: "2rem",
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      textAlign: "center",
    },
    modalButtons: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "2rem",
    },
    desistirButton: {
      ...globalStyles.button,
      ...globalStyles.dangerButton,
      padding: "0.4rem",
      minWidth: "32px",
      height: "32px",
      position: "absolute",
      top: "1rem",
      right: "1rem",
      fontSize: "1.2rem",
    },
    progressCardWrapper: {
      position: "relative",
    }
  };

  return (
    <Layout title="Desafios">
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Desafios Trading</h1>
          <p style={styles.subtitle}>
            Supere seus limites e desenvolva disciplina através de desafios práticos
          </p>
        </header>

        {/* Desafios Ativos */}
        {desafiosAtivos.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Desafios em Andamento</h2>
            <div style={styles.grid}>
              {desafiosAtivos.map((desafio) => (
                <div key={desafio.id} style={styles.progressCardWrapper}>
                  <Link 
                    href={`/desafios/${desafio.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={styles.progressCard}>
                      <div style={styles.icon}>{desafio.icone}</div>
                      <h3 style={styles.cardTitle}>{desafio.titulo}</h3>
                      <p>Iniciado em: {new Date(desafio.dataInicio).toLocaleDateString()}</p>
                      <div style={styles.button}>
                        Continuar Desafio
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleDesistir(desafio, e)}
                    style={styles.desistirButton}
                    title="Desistir do Desafio"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Desafios Disponíveis */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Desafios Disponíveis</h2>
          <div style={styles.grid}>
            {desafiosDisponiveis.map((desafio) => (
              <Link 
                key={desafio.id} 
                href={`/desafios/${desafio.id}`}
                style={{ textDecoration: "none" }}
              >
                <div style={styles.card}>
                  <div style={styles.icon}>{desafio.icone}</div>
                  <h3 style={styles.cardTitle}>{desafio.titulo}</h3>
                  <div>
                    <span style={styles.badge}>{desafio.tipo}</span>
                    <span style={styles.badge}>{desafio.nivel}</span>
                    <span style={styles.badge}>{desafio.duracao}</span>
                  </div>
                  <p style={{ color: "#999", marginBottom: "1rem" }}>{desafio.descricao}</p>
                  
                  <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>Benefícios:</h4>
                  <ul style={styles.beneficios}>
                    {desafio.beneficios.map((beneficio, index) => (
                      <li key={index} style={styles.beneficioItem}>
                        <span style={{ color: "#00ff87" }}>✓</span>
                        {beneficio}
                      </li>
                    ))}
                  </ul>

                  <div style={styles.button}>
                    Participar do Desafio
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Histórico */}
        {historico.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Histórico de Desafios</h2>
            <div style={styles.grid}>
              {historico.map((desafio) => (
                <div key={desafio.id} style={styles.card}>
                  <div style={styles.icon}>🏆</div>
                  <h3 style={styles.cardTitle}>{desafio.titulo}</h3>
                  <p>Concluído em: {new Date(desafio.dataFim).toLocaleDateString()}</p>
                  <Link 
                    href={`/desafios/${desafio.id}`}
                    style={styles.button}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modal de Confirmação */}
        {showConfirmModal && (
          <div style={styles.modal} onClick={() => setShowConfirmModal(false)}>
            <div 
              style={styles.modalContent} 
              onClick={e => e.stopPropagation()}
            >
              <h3 style={styles.cardTitle}>Confirmar Desistência</h3>
              <p>
                Tem certeza que deseja desistir do desafio 
                "{desafioParaDesistir?.titulo}"?
              </p>
              <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "1rem" }}>
                Esta ação não pode ser desfeita e o desafio será marcado como abandonado.
              </p>
              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    ...globalStyles.button,
                    ...globalStyles.secondaryButton,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarDesistencia}
                  style={{
                    ...globalStyles.button,
                    ...globalStyles.dangerButton,
                  }}
                >
                  Confirmar Desistência
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 