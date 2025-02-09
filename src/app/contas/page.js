"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { globalStyles, globalCss } from "@/styles/globals";
import { useUser } from "@/contexts/UserContext";

export default function ContasPage() {
  const router = useRouter();
  const { getUserData, saveUserData } = useUser();
  const [contas, setContas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [novaConta, setNovaConta] = useState({
    id: "",
    nome: "",
    corretora: "",
    tipo: "Teste",
    saldoInicial: "",
    observacoes: "",
  });

  useEffect(() => {
    const userData = getUserData();
    setContas(userData.contas || []);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar se já existe uma conta com o mesmo ID
    if (contas.some(conta => conta.id === novaConta.id)) {
      alert("Já existe uma conta com este ID!");
      return;
    }

    const userData = getUserData();
    const contasAtualizadas = [...(userData.contas || []), {
      ...novaConta,
      saldoInicial: parseFloat(novaConta.saldoInicial) || 0,
      dataCriacao: new Date().toISOString()
    }];

    saveUserData({
      ...userData,
      contas: contasAtualizadas
    });

    setContas(contasAtualizadas);
    setShowForm(false);
    setNovaConta({
      id: "",
      nome: "",
      corretora: "",
      tipo: "Teste",
      saldoInicial: "",
      observacoes: "",
    });
    
    router.push("/contas/sucesso");
  };

  const handleDelete = (contaId) => {
    const userData = getUserData();
    const conta = userData.contas.find(c => c.id === contaId);
    
    // Verifica se existem operações para esta conta
    const operacoes = JSON.parse(localStorage.getItem('operacoes') || '[]');
    const temOperacoes = operacoes.some(op => op.conta === contaId);

    if (temOperacoes) {
      if (window.confirm(
        `A conta "${conta?.nome}" possui operações registradas. ` +
        `Excluir a conta também removerá todas as operações associadas. ` +
        `Deseja continuar?`
      )) {
        // Remove as operações da conta
        const novasOperacoes = operacoes.filter(op => op.conta !== contaId);
        localStorage.setItem('operacoes', JSON.stringify(novasOperacoes));
        
        // Remove a conta
        const contasAtualizadas = userData.contas.filter(c => c.id !== contaId);
        saveUserData({
          ...userData,
          contas: contasAtualizadas
        });
        setContas(contasAtualizadas);
      }
    } else {
      if (window.confirm(`Tem certeza que deseja excluir a conta "${conta?.nome}"?`)) {
        const contasAtualizadas = userData.contas.filter(c => c.id !== contaId);
        saveUserData({
          ...userData,
          contas: contasAtualizadas
        });
        setContas(contasAtualizadas);
      }
    }
  };

  return (
    <Layout title="Gerenciar Contas">
      <div style={globalStyles.pageContainer}>
        {!showForm ? (
          <div style={{ ...globalStyles.card, marginBottom: "2rem" }}>
            <div style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <h3 style={globalStyles.title}>Suas Contas</h3>
              <button
                onClick={() => setShowForm(true)}
                style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
              >
                + Nova Conta
              </button>
            </div>
          </div>
        ) : (
          <div style={globalStyles.card}>
            <h3 style={globalStyles.title}>Nova Conta</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              }}>
                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>ID da Conta</label>
                  <input
                    type="text"
                    placeholder="ex: conta01"
                    value={novaConta.id}
                    onChange={(e) => setNovaConta({ ...novaConta, id: e.target.value })}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Nome da Conta</label>
                  <input
                    type="text"
                    placeholder="ex: Conta Principal"
                    value={novaConta.nome}
                    onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Corretora</label>
                  <input
                    type="text"
                    placeholder="Nome da corretora"
                    value={novaConta.corretora}
                    onChange={(e) => setNovaConta({ ...novaConta, corretora: e.target.value })}
                    required
                    style={globalStyles.input}
                  />
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Tipo de Conta</label>
                  <select
                    value={novaConta.tipo}
                    onChange={(e) => setNovaConta({ ...novaConta, tipo: e.target.value })}
                    style={globalStyles.select}
                  >
                    <option value="Teste">Conta Demo</option>
                    <option value="Real">Conta Real</option>
                  </select>
                </div>

                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Saldo Inicial</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={novaConta.saldoInicial}
                    onChange={(e) => setNovaConta({ ...novaConta, saldoInicial: e.target.value })}
                    style={globalStyles.input}
                  />
                </div>
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Observações</label>
                <textarea
                  placeholder="Observações sobre a conta..."
                  value={novaConta.observacoes}
                  onChange={(e) => setNovaConta({ ...novaConta, observacoes: e.target.value })}
                  style={{
                    ...globalStyles.input,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
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
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={globalStyles.grid}>
          {contas.map((conta) => (
            <div key={conta.id} style={globalStyles.card}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}>
                <div>
                  <h3 style={{ ...globalStyles.title, margin: 0 }}>{conta.nome}</h3>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#999", fontSize: "0.9rem" }}>
                    ID: {conta.id}
                  </p>
                </div>
                <span style={{
                  padding: "0.4rem 1rem",
                  backgroundColor: conta.tipo === "Teste" ? "rgba(255, 148, 77, 0.2)" : "rgba(0, 255, 135, 0.2)",
                  color: conta.tipo === "Teste" ? "#ff944d" : "#00ff87",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}>
                  {conta.tipo}
                </span>
              </div>

              <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <p style={globalStyles.label}>Corretora</p>
                  <p style={{ margin: 0 }}>{conta.corretora}</p>
                </div>
                <div>
                  <p style={globalStyles.label}>Saldo Inicial</p>
                  <p style={{ margin: 0 }}>R$ {conta.saldoInicial.toFixed(2)}</p>
                </div>
                {conta.observacoes && (
                  <div>
                    <p style={globalStyles.label}>Observações</p>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>{conta.observacoes}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDelete(conta.id)}
                style={{ ...globalStyles.button, ...globalStyles.dangerButton, width: "100%" }}
              >
                Excluir Conta
              </button>
            </div>
          ))}
        </div>

        {contas.length === 0 && !showForm && (
          <div style={{ ...globalStyles.card, textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
              Você ainda não possui nenhuma conta cadastrada.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
            >
              Cadastrar Primeira Conta
            </button>
          </div>
        )}

        <style jsx global>{globalCss}</style>
      </div>
    </Layout>
  );
}
