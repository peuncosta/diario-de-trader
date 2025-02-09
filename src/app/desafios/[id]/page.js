"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { globalStyles } from "@/styles/globals";

export default function DetalhesDesafioPage({ params }) {
  const router = useRouter();
  const [desafio, setDesafio] = useState(null);
  const [registroDiario, setRegistroDiario] = useState({
    data: new Date().toISOString().split('T')[0],
    cumprido: false,
    observacoes: "",
    aprendizados: "",
    checklistCumprido: [],
    metricas: {
      operacoesDentroRisco: 0,
      stopsConfigurados: 0,
      limiteOperacoes: true
    },
    operacoes: []
  });

  const desafios = {
    "risco-zero": {
      id: "risco-zero",
      titulo: "Risco Zero",
      icone: "🔥",
      descricao: "Desenvolva disciplina no gerenciamento de risco",
      duracao: "5 dias úteis",
      tipo: "Individual",
      configuracao: {
        riscoOperacao: "",
        maxOperacoes: "",
        stopLoss: "",
        alvo: "",
        breakeven: "",
        capitalInicial: "",
      },
      regrasObrigatorias: [
        "Definir stop loss antes de entrar na operação",
        "Respeitar o limite máximo de operações diárias",
        "Não aumentar posição em operações perdedoras",
        "Manter o risco por operação constante",
        "Registrar todas as operações no diário"
      ],
      checklistDiario: [
        "Verificou o calendário econômico",
        "Definiu os níveis de entrada e saída",
        "Calculou o risco por operação",
        "Configurou os stops antes de operar",
        "Seguiu o plano de trading",
        "Respeitou o limite de operações"
      ],
      metricas: [
        {
          nome: "Operações dentro do risco",
          descricao: "% de trades que respeitaram o risco definido",
          meta: "100%"
        },
        {
          nome: "Stops configurados",
          descricao: "% de trades com stops definidos antes da entrada",
          meta: "100%"
        },
        {
          nome: "Limite de operações",
          descricao: "Respeito ao número máximo de trades por dia",
          meta: "100%"
        }
      ]
    },
    "erro-zero": {
      id: "erro-zero",
      titulo: "Erro Zero",
      icone: "🚀",
      descricao: "Corrija um erro específico e melhore sua performance",
      duracao: "5 dias úteis",
      tipo: "Individual",
      configuracao: {
        erroIdentificado: "",
        impactoNegativo: "",
        solucaoPlanejada: "",
        criterioSucesso: "",
        gatilhos: "",
        acaoCorretiva: "",
        metaSuperacao: "",
      },
      regrasObrigatorias: [
        "Identificar o erro específico antes de cada operação",
        "Documentar os gatilhos que levam ao erro",
        "Aplicar a ação corretiva planejada",
        "Registrar cada ocorrência do erro",
        "Avaliar diariamente o progresso"
      ],
      checklistDiario: [
        "Revisou o erro a ser corrigido",
        "Identificou os gatilhos do erro",
        "Aplicou a ação corretiva",
        "Manteve consciência durante as operações",
        "Registrou as ocorrências",
        "Avaliou o progresso"
      ],
      metricas: [
        {
          nome: "Frequência do Erro",
          descricao: "Quantas vezes o erro ocorreu hoje",
          tipo: "numero"
        },
        {
          nome: "Nível de Consciência",
          descricao: "Quão consciente esteve do erro (0-100%)",
          tipo: "porcentagem"
        },
        {
          nome: "Eficácia da Correção",
          descricao: "Sucesso na aplicação da correção (0-100%)",
          tipo: "porcentagem"
        }
      ]
    }
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
    },
    header: {
      marginBottom: "2rem",
      textAlign: "center",
    },
    icon: {
      fontSize: "3rem",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "1rem",
      background: "linear-gradient(45deg, #00ff87, #60efff)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    section: {
      ...globalStyles.card,
      marginBottom: "2rem",
      padding: "2rem",
    },
    form: {
      display: "grid",
      gap: "1.5rem",
    },
    formGroup: {
      display: "grid",
      gap: "0.5rem",
    },
    label: {
      fontSize: "1rem",
      color: "#999",
    },
    input: {
      ...globalStyles.input,
      width: "100%",
    },
    textarea: {
      ...globalStyles.input,
      width: "100%",
      minHeight: "100px",
      resize: "vertical",
    },
    button: {
      ...globalStyles.button,
      ...globalStyles.primaryButton,
      width: "100%",
    },
    registros: {
      display: "grid",
      gap: "1rem",
    },
    registro: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "1rem",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    regras: {
      backgroundColor: "rgba(0, 255, 135, 0.05)",
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "2rem",
    },
    regraTitulo: {
      color: "#00ff87",
      marginBottom: "1rem",
      fontSize: "1.2rem",
    },
    regraLista: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    regraItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.8rem",
      color: "#fff",
    },
    checklistItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
      padding: "0.8rem",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "8px",
    },
    metricaCard: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    metricaValor: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#00ff87",
      marginTop: "0.5rem",
    },
    operacaoForm: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "1.5rem",
      borderRadius: "12px",
      marginTop: "2rem",
    },
    formSection: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "2rem",
    },
    formSectionTitle: {
      fontSize: "1.1rem",
      color: "#00ff87",
      marginBottom: "1rem",
    },
    hint: {
      fontSize: "0.8rem",
      color: "#999",
      marginTop: "0.25rem",
    },
    formActions: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
    },
  };

  useEffect(() => {
    const desafioAtual = desafios[params.id];
    if (!desafioAtual) {
      router.push("/desafios");
      return;
    }
    setDesafio(desafioAtual);

    // Carregar progresso salvo
    const desafiosSalvos = JSON.parse(localStorage.getItem('desafios') || '[]');
    const desafioEmAndamento = desafiosSalvos.find(d => d.id === params.id && d.status === 'em_andamento');
    if (desafioEmAndamento) {
      setDesafio(prev => ({ ...prev, ...desafioEmAndamento }));
    }
  }, [params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const configuracao = {};
    
    for (let [key, value] of formData.entries()) {
      configuracao[key] = value;
    }

    const novoDesafio = {
      ...desafio,
      configuracao,
      dataInicio: new Date().toISOString(),
      status: 'em_andamento',
      registros: []
    };

    const desafiosSalvos = JSON.parse(localStorage.getItem('desafios') || '[]');
    localStorage.setItem('desafios', JSON.stringify([...desafiosSalvos, novoDesafio]));
    
    setDesafio(novoDesafio);
  };

  const handleRegistroDiario = (e) => {
    e.preventDefault();
    const novoRegistro = {
      ...registroDiario,
      id: Date.now()
    };

    const desafioAtualizado = {
      ...desafio,
      registros: [...(desafio.registros || []), novoRegistro]
    };

    const desafiosSalvos = JSON.parse(localStorage.getItem('desafios') || '[]');
    const desafiosAtualizados = desafiosSalvos.map(d => 
      d.id === desafio.id ? desafioAtualizado : d
    );

    localStorage.setItem('desafios', JSON.stringify(desafiosAtualizados));
    setDesafio(desafioAtualizado);
    setRegistroDiario({
      data: new Date().toISOString().split('T')[0],
      cumprido: false,
      observacoes: "",
      aprendizados: "",
      checklistCumprido: [],
      metricas: {
        operacoesDentroRisco: 0,
        stopsConfigurados: 0,
        limiteOperacoes: true
      },
      operacoes: []
    });
  };

  if (!desafio) return null;

  return (
    <Layout title={`Desafio: ${desafio.titulo}`}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.icon}>{desafio.icone}</div>
          <h1 style={styles.title}>{desafio.titulo}</h1>
          <p>{desafio.descricao}</p>
        </header>

        {!desafio.dataInicio ? (
          <section style={styles.section}>
            <h2 style={styles.cardTitle}>Configuração do Desafio</h2>
            
            <div style={styles.regras}>
              <p style={{ marginBottom: "1rem" }}>
                Antes de começar o desafio, defina seus parâmetros de risco e regras de operação.
                Estas configurações serão seu compromisso durante todo o desafio.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {desafio.id === "risco-zero" ? (
                <>
                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Capital e Risco</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Capital Inicial</label>
                      <input
                        type="number"
                        name="capitalInicial"
                        placeholder="Ex: 10000"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Seu capital disponível para o desafio</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Risco por Operação (%)</label>
                      <input
                        type="number"
                        name="riscoOperacao"
                        placeholder="Ex: 1"
                        min="0.1"
                        max="5"
                        step="0.1"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Porcentagem máxima do capital que você está disposto a arriscar por operação</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Limites Operacionais</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Máximo de Operações Diárias</label>
                      <input
                        type="number"
                        name="maxOperacoes"
                        placeholder="Ex: 3"
                        min="1"
                        max="10"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Limite diário para evitar overtrading</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Loss Diário Máximo</label>
                      <input
                        type="number"
                        name="lossDiario"
                        placeholder="Ex: 2"
                        min="1"
                        max="10"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Percentual máximo de perda diária para encerrar as operações</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Gerenciamento</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Stop Loss Padrão</label>
                      <input
                        type="text"
                        name="stopLoss"
                        placeholder="Ex: 2x ATR ou 30 pontos"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Sua referência para definir o stop loss</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Alvo Mínimo</label>
                      <input
                        type="text"
                        name="alvoMinimo"
                        placeholder="Ex: 1.5x risco ou 45 pontos"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Objetivo mínimo de ganho em relação ao risco</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Regra de Break-even</label>
                      <input
                        type="text"
                        name="breakeven"
                        placeholder="Ex: 1x risco ou 30 pontos"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Quando você irá mover seu stop para o preço de entrada</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Seu Compromisso</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Objetivo do Desafio</label>
                      <textarea
                        name="objetivo"
                        placeholder="Qual seu principal objetivo ao participar deste desafio?"
                        style={styles.textarea}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          name="comprometimento"
                          required
                          style={{ marginRight: "0.5rem" }}
                        />
                        Me comprometo a seguir rigorosamente estas regras durante todo o desafio
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Identificação do Erro</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Erro que vou corrigir</label>
                      <textarea
                        name="erroIdentificado"
                        placeholder="Ex: Sair antes do alvo por ansiedade"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>Descreva o erro específico que você quer eliminar</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Gatilhos do Erro</label>
                      <textarea
                        name="gatilhos"
                        placeholder="Ex: Operação muito lucrativa, mercado volátil"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>Quais situações costumam desencadear este erro?</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Impacto e Consequências</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Impacto Negativo</label>
                      <textarea
                        name="impactoNegativo"
                        placeholder="Ex: Redução do lucro médio em 30%"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>Como este erro afeta seus resultados? Seja específico</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Custo Estimado</label>
                      <input
                        type="text"
                        name="custoEstimado"
                        placeholder="Ex: $200 por ocorrência"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Quanto este erro tem custado em média?</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Plano de Ação</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Solução Planejada</label>
                      <textarea
                        name="solucaoPlanejada"
                        placeholder="Ex: Definir alvos fixos e usar ordem limite"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>Qual será sua estratégia para evitar este erro?</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Ação Corretiva</label>
                      <textarea
                        name="acaoCorretiva"
                        placeholder="Ex: Ao identificar ansiedade, respirar 3x e revisar o plano"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>O que você fará quando perceber o gatilho do erro?</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Metas e Critérios</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meta de Superação</label>
                      <input
                        type="text"
                        name="metaSuperacao"
                        placeholder="Ex: Reduzir ocorrências para zero em 5 dias"
                        style={styles.input}
                        required
                      />
                      <small style={styles.hint}>Qual é sua meta específica para este desafio?</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Critério de Sucesso</label>
                      <textarea
                        name="criterioSucesso"
                        placeholder="Ex: 5 dias seguidos sem cometer o erro"
                        style={styles.textarea}
                        required
                      />
                      <small style={styles.hint}>Como você saberá que superou este erro?</small>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>Seu Compromisso</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          name="comprometimento"
                          required
                          style={{ marginRight: "0.5rem" }}
                        />
                        Me comprometo a focar na correção deste erro e registrar honestamente todas as ocorrências
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div style={styles.formActions}>
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  style={{ ...styles.button, ...globalStyles.secondaryButton }}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.button}>
                  Iniciar Desafio
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            <section style={styles.regras}>
              <h3 style={styles.regraTitulo}>Regras do Desafio</h3>
              <ul style={styles.regraLista}>
                {desafio.regrasObrigatorias.map((regra, index) => (
                  <li key={index} style={styles.regraItem}>
                    <span style={{ color: "#00ff87" }}>✓</span>
                    {regra}
                  </li>
                ))}
              </ul>
            </section>

            <section style={styles.section}>
              <h3 style={styles.cardTitle}>Sua Configuração</h3>
              <div style={styles.metricaCard}>
                {desafio.id === "risco-zero" ? (
                  <>
                    <p><strong>Risco por Operação:</strong> {desafio.configuracao.riscoOperacao}</p>
                    <p><strong>Máximo de Operações:</strong> {desafio.configuracao.maxOperacoes}</p>
                    <p><strong>Stop Loss:</strong> {desafio.configuracao.stopLoss}</p>
                    <p><strong>Capital Inicial:</strong> {desafio.configuracao.capitalInicial}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Erro Identificado:</strong> {desafio.configuracao.erroIdentificado}</p>
                    <p><strong>Gatilhos:</strong> {desafio.configuracao.gatilhos}</p>
                    <p><strong>Impacto Negativo:</strong> {desafio.configuracao.impactoNegativo}</p>
                    <p><strong>Custo Estimado:</strong> {desafio.configuracao.custoEstimado}</p>
                  </>
                )}
              </div>
            </section>

            <section style={styles.section}>
              <h3 style={styles.cardTitle}>Checklist Diário</h3>
              <form onSubmit={handleRegistroDiario} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data</label>
                  <input
                    type="date"
                    value={registroDiario.data}
                    onChange={(e) => setRegistroDiario(prev => ({ ...prev, data: e.target.value }))}
                    style={styles.input}
                  />
                </div>

                {desafio.checklistDiario.map((item, index) => (
                  <div key={index} style={styles.checklistItem}>
                    <input
                      type="checkbox"
                      checked={registroDiario.checklistCumprido.includes(index)}
                      onChange={(e) => {
                        setRegistroDiario(prev => ({
                          ...prev,
                          checklistCumprido: e.target.checked
                            ? [...prev.checklistCumprido, index]
                            : prev.checklistCumprido.filter(i => i !== index)
                        }));
                      }}
                    />
                    <label>{item}</label>
                  </div>
                ))}

                <div style={styles.operacaoForm}>
                  <h4 style={{ marginBottom: "1rem" }}>Métricas do Dia</h4>
                  {desafio.metricas.map((metrica, index) => (
                    <div key={index} style={styles.formGroup}>
                      <label style={styles.label}>{metrica.nome}</label>
                      <input
                        type={metrica.tipo === "porcentagem" ? "number" : "text"}
                        min="0"
                        max="100"
                        value={registroDiario.metricas[metrica.nome.toLowerCase().replace(/ /g, '')]}
                        onChange={(e) => {
                          setRegistroDiario(prev => ({
                            ...prev,
                            metricas: {
                              ...prev.metricas,
                              [metrica.nome.toLowerCase().replace(/ /g, '')]: e.target.value
                            }
                          }));
                        }}
                        style={styles.input}
                      />
                      <small style={{ color: "#999" }}>{metrica.descricao}</small>
                    </div>
                  ))}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Observações do Dia</label>
                  <textarea
                    value={registroDiario.observacoes}
                    onChange={(e) => setRegistroDiario(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Como foi sua experiência hoje? Quais foram os desafios?"
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Aprendizados</label>
                  <textarea
                    value={registroDiario.aprendizados}
                    onChange={(e) => setRegistroDiario(prev => ({ ...prev, aprendizados: e.target.value }))}
                    placeholder="O que você aprendeu hoje sobre gerenciamento de risco?"
                    style={styles.textarea}
                  />
                </div>

                <button type="submit" style={styles.button}>
                  Salvar Registro
                </button>
              </form>
            </section>

            <section style={styles.section}>
              <h2>Histórico de Registros</h2>
              <div style={styles.registros}>
                {(desafio.registros || []).map((registro) => (
                  <div key={registro.id} style={styles.registro}>
                    <p><strong>Data:</strong> {new Date(registro.data).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {registro.cumprido ? "✅ Regras cumpridas" : "❌ Regras não cumpridas"}</p>
                    {registro.observacoes && (
                      <p><strong>Observações:</strong> {registro.observacoes}</p>
                    )}
                    {registro.aprendizados && (
                      <p><strong>Aprendizados:</strong> {registro.aprendizados}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
} 