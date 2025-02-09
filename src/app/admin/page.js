"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { globalStyles } from "@/styles/globals";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user?.isAdmin) {
        router.push('/');
        return;
      }

      // Carregar lista de usuários
      const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios') || '[]');
      setUsuarios(usuariosSalvos.filter(u => !u.isAdmin));
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  const handleToggleStatus = (userId) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === userId);
    
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].ativo = !usuarios[usuarioIndex].ativo;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setUsuarios(usuarios.filter(u => !u.isAdmin));
    }
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }

    // Remover usuário
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuariosAtualizados = usuarios.filter(u => u.id !== userId);
    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));

    // Remover dados do usuário
    const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
    delete tradingData[userId];
    localStorage.setItem('tradingData', JSON.stringify(tradingData));

    setUsuarios(usuariosAtualizados.filter(u => !u.isAdmin));
  };

  const registrarNovoUsuario = (dadosUsuario) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    const novoUsuario = {
      id: 'user-' + Date.now(),
      ...dadosUsuario,
      ativo: true,
      plano: 'basic', // ou premium
      dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      dataCriacao: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return novoUsuario;
  };

  if (isLoading || pageLoading) {
    return (
      <Layout title="Painel Administrativo">
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Painel Administrativo">
      <div style={globalStyles.pageContainer}>
        {/* Header com estatísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>Total de Usuários</h3>
            <p>{usuarios.length}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Usuários Ativos</h3>
            <p>{usuarios.filter(u => u.ativo).length}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Usuários Inativos</h3>
            <p>{usuarios.filter(u => !u.ativo).length}</p>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div style={styles.tableCard}>
          <h2 style={styles.tableTitle}>Usuários Registrados</h2>
          
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Registro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div style={styles.userInfo}>
                        <span style={styles.userAvatar}>
                          {usuario.nome.charAt(0).toUpperCase()}
                        </span>
                        <span>{usuario.nome}</span>
                      </div>
                    </td>
                    <td>{usuario.email}</td>
                    <td>{new Date(usuario.dataCriacao).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: usuario.ativo ? "rgba(0, 255, 135, 0.1)" : "rgba(255, 68, 68, 0.1)",
                        color: usuario.ativo ? "#00ff87" : "#ff4444",
                      }}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <div style={styles.actions}>
                        <button
                          onClick={() => handleToggleStatus(usuario.id)}
                          style={{
                            ...styles.actionButton,
                            backgroundColor: usuario.ativo ? "rgba(255, 68, 68, 0.1)" : "rgba(0, 255, 135, 0.1)",
                            color: usuario.ativo ? "#ff4444" : "#00ff87",
                          }}
                        >
                          {usuario.ativo ? "Bloquear" : "Ativar"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usuario.id)}
                          style={{
                            ...styles.actionButton,
                            backgroundColor: "rgba(255, 68, 68, 0.1)",
                            color: "#ff4444",
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>👥</span>
              <p>Nenhum usuário registrado.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    gap: "1rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255, 255, 255, 0.1)",
    borderTop: "3px solid #00ff87",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "1.5rem",
    borderRadius: "12px",
    textAlign: "center",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
    },
    "& h3": {
      margin: "0 0 0.5rem 0",
      color: "#999",
      fontSize: "1rem",
    },
    "& p": {
      margin: 0,
      fontSize: "2rem",
      fontWeight: "bold",
      background: "linear-gradient(45deg, #00ff87, #60efff)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
  },
  tableCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  tableTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: "1.5rem",
    fontWeight: "normal",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    "& th, & td": {
      padding: "1rem",
      textAlign: "left",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    "& th": {
      color: "#999",
      fontWeight: "normal",
      fontSize: "0.9rem",
    },
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 255, 135, 0.1)",
    color: "#00ff87",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  actionButton: {
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "opacity 0.2s",
    "&:hover": {
      opacity: 0.8,
    },
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#999",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
  },
  "@media (max-width: 768px)": {
    table: {
      "& th, & td": {
        padding: "0.75rem 0.5rem",
        fontSize: "0.9rem",
      },
    },
    actions: {
      flexDirection: "column",
    },
    actionButton: {
      padding: "0.4rem 0.75rem",
      width: "100%",
    },
  },
}; 