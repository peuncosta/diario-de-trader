"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { formatUSD } from "@/utils/format";
import { globalStyles, globalCss } from "@/styles/globals";
import { useUser } from "@/contexts/UserContext";

export default function NovaOperacaoPage() {
  const router = useRouter();
  const { getUserData, saveUserData } = useUser();
  const [contas, setContas] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [ativoSelecionado, setAtivoSelecionado] = useState(null);
  const [operacao, setOperacao] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    conta: "",
    ativo: "",
    tipo: "compra",
    quantidade: 1,
    precoEntrada: "",
    precoSaida: "",
    resultado: 0,
    observacoes: "",
    screenshot: "",
    comissao: 0,
    lucroInformado: "",
    modoComissao: "direto",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const userData = getUserData();
    setContas(userData.contas || []);
    const ativosSalvos = JSON.parse(localStorage.getItem('ativos') || '[]');
    setAtivos(ativosSalvos);
  }, []);

  // Calcula o resultado bruto (sem comissão)
  const calcularResultadoBruto = () => {
    if (!ativoSelecionado || !operacao.precoEntrada || !operacao.precoSaida) return 0;

    const entrada = parseFloat(operacao.precoEntrada);
    const saida = parseFloat(operacao.precoSaida);
    const diferenca = operacao.tipo === "compra" ? saida - entrada : entrada - saida;
    const ticks = diferenca / ativoSelecionado.tickSize;
    return ticks * ativoSelecionado.valorPorTick * operacao.quantidade;
  };

  // Calcula o resultado líquido (com comissão)
  const calcularResultado = () => {
    const resultadoBruto = calcularResultadoBruto();
    return resultadoBruto - (parseFloat(operacao.comissao) || 0);
  };

  // Atualiza o ativo selecionado quando o símbolo muda
  useEffect(() => {
    const ativo = ativos.find(a => a.simbolo === operacao.ativo);
    setAtivoSelecionado(ativo);
  }, [operacao.ativo, ativos]);

  // Atualiza o resultado quando os preços ou comissão mudam
  useEffect(() => {
    const resultadoBruto = calcularResultadoBruto();
    
    if (operacao.modoComissao === "porLucro" && operacao.lucroInformado) {
      // Se estiver no modo "por lucro", a comissão é a diferença entre o bruto e o lucro informado
      const novaComissao = resultadoBruto - parseFloat(operacao.lucroInformado);
      setOperacao(prev => ({ 
        ...prev,
        comissao: novaComissao,
        resultado: parseFloat(operacao.lucroInformado) // O resultado será o lucro informado
      }));
    } else {
      // Se estiver no modo direto, calcula normalmente
      const novoResultado = resultadoBruto - (parseFloat(operacao.comissao) || 0);
      setOperacao(prev => ({ 
        ...prev,
        resultado: novoResultado
      }));
    }
  }, [operacao.precoEntrada, operacao.precoSaida, operacao.tipo, operacao.quantidade, ativoSelecionado, operacao.lucroInformado, operacao.modoComissao, operacao.comissao]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!operacao.conta || !operacao.ativo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const resultadoBruto = calcularResultadoBruto();
    const comissao = parseFloat(operacao.comissao) || 0;
    const resultadoLiquido = resultadoBruto - comissao;

    const userData = getUserData();
    const novaOperacao = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      conta: operacao.conta,
      ativo: operacao.ativo,
      tipo: operacao.tipo,
      quantidade: operacao.quantidade,
      precoEntrada: operacao.precoEntrada,
      precoSaida: operacao.precoSaida,
      resultadoBruto: resultadoBruto,
      comissao: comissao,
      resultado: resultadoLiquido,
      observacoes: operacao.observacoes,
      screenshot: operacao.screenshot,
      modoComissao: operacao.modoComissao,
      lucroInformado: operacao.lucroInformado,
    };
    
    const operacoesAtualizadas = [...(userData.operacoes || []), novaOperacao];
    
    saveUserData({
      ...userData,
      operacoes: operacoesAtualizadas
    });

    router.push("/operacoes");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setOperacao(prev => ({
          ...prev,
          screenshot: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setOperacao(prev => ({
      ...prev,
      screenshot: ""
    }));
  };

  return (
    <Layout title="Nova Operação">
      <div style={globalStyles.pageContainer}>
        <form onSubmit={handleSubmit}>
          {/* Dados Principais */}
          <div style={globalStyles.card}>
            <div style={{ 
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}>
              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Data/Hora</label>
                <input
                  type="datetime-local"
                  value={operacao.timestamp}
                  onChange={(e) => setOperacao({ ...operacao, timestamp: e.target.value })}
                  required
                  style={globalStyles.input}
                />
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Conta</label>
                <select
                  value={operacao.conta}
                  onChange={(e) => setOperacao({ ...operacao, conta: e.target.value })}
                  required
                  style={globalStyles.select}
                >
                  <option value="">Selecione uma conta</option>
                  {contas.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome} ({conta.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Ativo</label>
                <select
                  value={operacao.ativo}
                  onChange={(e) => setOperacao({ ...operacao, ativo: e.target.value })}
                  required
                  style={globalStyles.select}
                >
                  <option value="">Selecione um ativo</option>
                  {ativos.map(ativo => (
                    <option key={ativo.simbolo} value={ativo.simbolo}>
                      {ativo.simbolo} - {ativo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Informações do Ativo Selecionado */}
            {ativoSelecionado && (
              <div style={{ ...globalStyles.card, marginTop: "1.5rem" }}>
                <h3 style={globalStyles.title}>Informações do Ativo</h3>
                <div style={{ 
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                }}>
                  <div>
                    <p style={globalStyles.label}>Mercado</p>
                    <p style={{ margin: 0 }}>{ativoSelecionado.mercado}</p>
                  </div>
                  <div>
                    <p style={globalStyles.label}>Tick Size</p>
                    <p style={{ margin: 0 }}>{ativoSelecionado.tickSize}</p>
                  </div>
                  <div>
                    <p style={globalStyles.label}>Valor por Tick</p>
                    <p style={{ margin: 0 }}>{formatUSD(ativoSelecionado.valorPorTick)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detalhes da Operação */}
            <div style={{ 
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              marginTop: "1.5rem",
            }}>
              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Tipo</label>
                <select
                  value={operacao.tipo}
                  onChange={(e) => setOperacao({ ...operacao, tipo: e.target.value })}
                  style={globalStyles.select}
                >
                  <option value="compra">Compra</option>
                  <option value="venda">Venda</option>
                </select>
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={operacao.quantidade}
                  onChange={(e) => setOperacao({ ...operacao, quantidade: parseInt(e.target.value) })}
                  required
                  style={globalStyles.input}
                />
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Preço Entrada</label>
                <input
                  type="number"
                  step="any"
                  value={operacao.precoEntrada}
                  onChange={(e) => setOperacao({ ...operacao, precoEntrada: e.target.value })}
                  required
                  style={globalStyles.input}
                />
              </div>

              <div style={globalStyles.formField}>
                <label style={globalStyles.label}>Preço Saída</label>
                <input
                  type="number"
                  step="any"
                  value={operacao.precoSaida}
                  onChange={(e) => setOperacao({ ...operacao, precoSaida: e.target.value })}
                  required
                  style={globalStyles.input}
                />
              </div>
            </div>

            {/* Seção de Resultado e Comissão */}
            <div style={globalStyles.card}>
              <h3 style={globalStyles.title}>Resultado e Comissão</h3>
              
              <div style={{ 
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}>
                <div style={globalStyles.formField}>
                  <label style={globalStyles.label}>Modo de Cálculo da Comissão</label>
                  <select
                    value={operacao.modoComissao}
                    onChange={(e) => {
                      setOperacao({
                        ...operacao,
                        modoComissao: e.target.value,
                        comissao: 0,
                        lucroInformado: ""
                      });
                    }}
                    style={globalStyles.select}
                  >
                    <option value="direto">Informar Comissão Diretamente</option>
                    <option value="porLucro">Calcular pela Diferença do Lucro</option>
                  </select>
                </div>

                {operacao.modoComissao === "direto" ? (
                  <div style={globalStyles.formField}>
                    <label style={globalStyles.label}>Comissão</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={operacao.comissao}
                      onChange={(e) => setOperacao({
                        ...operacao,
                        comissao: parseFloat(e.target.value) || 0
                      })}
                      style={globalStyles.input}
                    />
                  </div>
                ) : (
                  <div style={globalStyles.formField}>
                    <label style={globalStyles.label}>Lucro Real (após comissão)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={operacao.lucroInformado}
                      onChange={(e) => {
                        const valor = e.target.value;
                        const resultadoBruto = calcularResultadoBruto();
                        const novaComissao = resultadoBruto - parseFloat(valor || 0);
                        
                        setOperacao(prev => ({
                          ...prev,
                          lucroInformado: valor,
                          comissao: novaComissao,
                          resultado: parseFloat(valor || 0)
                        }));
                      }}
                      style={globalStyles.input}
                    />
                  </div>
                )}
              </div>

              {/* Resumo dos Valores */}
              {(operacao.precoEntrada && operacao.precoSaida) && (
                <div style={{ 
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: operacao.resultado >= 0 ? "rgba(0, 255, 135, 0.1)" : "rgba(255, 68, 68, 0.1)",
                  borderRadius: "8px",
                }}>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={globalStyles.label}>Resultado Bruto</span>
                      <span style={{ 
                        color: calcularResultadoBruto() >= 0 ? "#00ff87" : "#ff4444",
                        fontWeight: "bold"
                      }}>
                        {formatUSD(calcularResultadoBruto())}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={globalStyles.label}>Comissão</span>
                      <span style={{ color: "#ff4444" }}>
                        -{formatUSD(parseFloat(operacao.comissao) || 0)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      paddingTop: "1rem",
                      marginTop: "0.5rem"
                    }}>
                      <span style={globalStyles.label}>Resultado Líquido</span>
                      <span style={operacao.resultado >= 0 ? globalStyles.positiveValue : globalStyles.negativeValue}>
                        {formatUSD(operacao.resultado)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Screenshot */}
          <div style={globalStyles.card}>
            <label style={globalStyles.label}>Screenshot da Operação</label>
            <div style={{ textAlign: "center" }}>
              {previewImage ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={previewImage}
                    alt="Screenshot da operação"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      ...globalStyles.button,
                      ...globalStyles.dangerButton,
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    style={{
                      padding: "2rem",
                      border: "2px dashed rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "block",
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>📸</div>
                    <p style={{ margin: 0, color: "#999" }}>
                      Clique ou arraste uma imagem aqui
                    </p>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                      PNG, JPG ou GIF (max. 5MB)
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div style={globalStyles.card}>
            <label style={globalStyles.label}>Observações</label>
            <textarea
              value={operacao.observacoes}
              onChange={(e) => setOperacao({ ...operacao, observacoes: e.target.value })}
              style={{
                ...globalStyles.input,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{ ...globalStyles.button, ...globalStyles.secondaryButton }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ ...globalStyles.button, ...globalStyles.primaryButton }}
            >
              Salvar Operação
            </button>
          </div>
        </form>

        <style jsx global>{globalCss}</style>
      </div>
    </Layout>
  );
}
