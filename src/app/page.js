"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { globalStyles } from "@/styles/globals";

export default function HomePage() {
  const [theme, setTheme] = useState("dark");

  const buttonGroups = [
    {
      title: "Análise e Planejamento",
      buttons: [
        {
          href: "/checklist",
          icon: "✅",
          label: "Checklist Pré-Mercado",
          description: "Prepare-se para o dia de trading",
          priority: "high",
        },
        {
          href: "/dashboard",
          icon: "📊",
          label: "Dashboard",
          description: "Visualize suas estatísticas",
          priority: "high",
        },
        {
          href: "/desafios",
          icon: "🎯",
          label: "Desafios",
          description: "Participe de desafios para melhorar sua performance",
          priority: "high",
        },
      ]
    },
    {
      title: "Gestão de Operações",
      buttons: [
        {
          href: "/novo",
          icon: "➕",
          label: "Nova Operação",
          description: "Registre seus trades",
          priority: "high",
        },
        {
          href: "/operacoes",
          icon: "📋",
          label: "Histórico de Operações",
          description: "Visualize e analise seus trades",
          priority: "medium",
        },
      ]
    },
    {
      title: "Configurações",
      buttons: [
        {
          href: "/contas",
          icon: "💰",
          label: "Gerenciar Contas",
          description: "Configure suas contas de trading",
          priority: "medium",
        },
        {
          href: "/ativos",
          icon: "📈",
          label: "Gerenciar Ativos",
          description: "Configure os ativos operados",
          priority: "medium",
        },
      ]
    },
  ];

  const buttonStyles = {
    container: {
      display: "grid",
      gap: "2rem",
      padding: "2rem",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    group: {
      display: "grid",
      gap: "1.5rem",
    },
    groupTitle: {
      fontSize: "1.2rem",
      color: "#999",
      marginBottom: "0.5rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      paddingBottom: "0.5rem",
    },
    buttonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1rem",
    },
    button: (priority) => ({
      ...globalStyles.card,
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backgroundColor: priority === "high" ? "rgba(0, 255, 135, 0.05)" : "rgba(255, 255, 255, 0.05)",
      cursor: "pointer",
      textDecoration: "none",
      color: "white",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        borderColor: priority === "high" ? "#00ff87" : "#60efff",
      },
      "&:active": {
        transform: "translateY(1px)",
      },
    }),
    icon: {
      fontSize: "2rem",
      marginBottom: "1rem",
    },
    label: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    description: {
      fontSize: "0.9rem",
      color: "#999",
    },
  };

  return (
    <Layout title={
      <div style={{ 
        textAlign: "center",
        background: "linear-gradient(45deg, #00ff87, #60efff)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "2rem",
      }}>
        Trading Journal Pro
      </div>
    }>
      <div style={buttonStyles.container}>
        {buttonGroups.map((group, index) => (
          <div key={index} style={buttonStyles.group}>
            <h2 style={buttonStyles.groupTitle}>{group.title}</h2>
            <div style={buttonStyles.buttonGrid}>
              {group.buttons.map((button, buttonIndex) => (
                <Link
                  key={buttonIndex}
                  href={button.href}
                  style={buttonStyles.button(button.priority)}
                >
                  <span style={buttonStyles.icon}>{button.icon}</span>
                  <span style={buttonStyles.label}>{button.label}</span>
                  <span style={buttonStyles.description}>{button.description}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Tema */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          ...globalStyles.button,
          ...globalStyles.secondaryButton,
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </Layout>
  );
}
