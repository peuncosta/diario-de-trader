"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ContaPage({ params }) {
  const { conta } = params || {};
  const router = useRouter();
  const localStorageKey = "tradersRegistrados";

  const [operacoes, setOperacoes] = useState([]);

  useEffect(() => {
    const storedOps = localStorage.getItem(localStorageKey);
    if (storedOps) {
      const allOps = JSON.parse(storedOps);
      const filteredOps = allOps.filter((op) => op.conta === conta);
      setOperacoes(filteredOps);
    }
  }, [conta]);

  const handleDelete = (indexToDelete) => {
    if (confirm("Tem certeza que deseja apagar esta operação?")) {
      const storedOps = localStorage.getItem(localStorageKey);
      if (storedOps) {
        const allOps = JSON.parse(storedOps);
        // Filtra as operações desta conta
        const filteredOps = allOps.filter((op) => op.conta === conta);
        // Identifica a operação a ser removida (com base no índice na lista filtrada)
        const opToDelete = filteredOps[indexToDelete];
        // Remove a operação do array global
        const updatedOps = allOps.filter((op) => op !== opToDelete);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedOps));
        // Atualiza o estado filtrando novamente
        setOperacoes(updatedOps.filter((op) => op.conta === conta));
      }
    }
  };

  const chartLabels = operacoes.map((op) => op.data);
  const chartDataPoints = operacoes.map((op) =>
    ((op.precoSaida - op.precoEntrada) / op.precoEntrada) * 100
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Retorno (%)",
        data: chartDataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Desempenho das Operações (%)" },
    },
  };

  if (!conta) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "white",
          color: "black"
        }}
      >
        <h1>Conta não definida.</h1>
        <p>
          <Link href="/operacoes">Voltar para seleção de contas</Link>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        color: "black"
      }}
    >
      <h1>Operações - {conta.toUpperCase()}</h1>
      {operacoes.length === 0 ? (
        <p>Nenhuma operação cadastrada para esta conta.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1rem"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Ativo
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Operação
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Preço de Entrada
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Preço de Saída
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Retorno (%)
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Observações
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    color: "black"
                  }}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {operacoes.map((op, index) => {
                const retorno = (((op.precoSaida - op.precoEntrada) / op.precoEntrada) * 100).toFixed(2);
                return (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.data}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.ativo}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.operacao}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.precoEntrada}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.precoSaida}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{retorno}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{op.observacoes}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                      <button onClick={() => handleDelete(index)} style={{ color: "black" }}>
                        Apagar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginBottom: "1rem" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      )}
      <p>
        <Link href="/operacoes">Voltar para seleção de contas</Link>
      </p>
    </div>
  );
}
