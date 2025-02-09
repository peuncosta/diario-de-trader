"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { globalStyles } from "@/styles/globals";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forcaSenha, setForcaSenha] = useState(0);

  const calcularForcaSenha = (senha) => {
    let pontos = 0;
    if (senha.length >= 6) pontos++;
    if (senha.length >= 10) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (/[^A-Za-z0-9]/.test(senha)) pontos++;
    return pontos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    // Validações adicionais
    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!/[A-Z]/.test(formData.senha)) {
      setError("A senha deve conter pelo menos uma letra maiúscula");
      return;
    }

    if (!/[0-9]/.test(formData.senha)) {
      setError("A senha deve conter pelo menos um número");
      return;
    }

    if (!formData.nome.trim()) {
      setError("O nome é obrigatório");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email inválido");
      return;
    }
    
    setLoading(true);

    try {
      // Verificar se o email já está registrado
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioExistente = usuarios.find(u => u.email === formData.email);

      if (usuarioExistente) {
        setError("Este email já está registrado");
        setLoading(false);
        return;
      }

      // Gerar ID único usando timestamp + random
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Criar novo usuário
      const novoUsuario = {
        id: uniqueId,
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        dataCriacao: new Date().toISOString()
      };

      // Salvar usuário
      localStorage.setItem('usuarios', JSON.stringify([...usuarios, novoUsuario]));

      // Criar estrutura inicial dos dados do usuário
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      tradingData[uniqueId] = {
        operacoes: [],
        contas: [],
        ativos: [],
        desafios: [],
        checklist: []
      };
      localStorage.setItem('tradingData', JSON.stringify(tradingData));

      // Criar sessão
      const userData = {
        id: uniqueId,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      };
      
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400`; // Cookie expira em 24h
      router.push("/");
      
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#1a1a1a",
      color: "white",
    },
    card: {
      ...globalStyles.card,
      width: "100%",
      maxWidth: "400px",
      padding: "2rem",
    },
    logo: {
      fontSize: "2rem",
      textAlign: "center",
      marginBottom: "2rem",
      background: "linear-gradient(45deg, #00ff87, #60efff)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
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
      fontSize: "0.9rem",
      color: "#999",
    },
    input: {
      ...globalStyles.input,
      width: "100%",
    },
    button: {
      ...globalStyles.button,
      ...globalStyles.primaryButton,
      width: "100%",
      position: "relative",
    },
    error: {
      color: "#ff4444",
      fontSize: "0.9rem",
      textAlign: "center",
      marginTop: "1rem",
    },
    login: {
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.9rem",
      color: "#999",
    },
    link: {
      color: "#00ff87",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      position: "absolute",
      right: "1rem",
    },
    forcaSenha: {
      position: "relative",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Trading Journal</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => {
                setFormData({ ...formData, senha: e.target.value });
                setForcaSenha(calcularForcaSenha(e.target.value));
              }}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.forcaSenha}>
            <div style={{
              height: "4px",
              backgroundColor: "#333",
              borderRadius: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${(forcaSenha / 5) * 100}%`,
                height: "100%",
                backgroundColor: [
                  "#ff4444",
                  "#ffbb33",
                  "#00C851",
                  "#33b5e5",
                  "#2BBBAD"
                ][forcaSenha - 1] || "#333",
                transition: "all 0.3s ease"
              }} />
            </div>
            <small style={{ color: "#999", fontSize: "0.8rem" }}>
              {[
                "Muito fraca",
                "Fraca",
                "Média",
                "Forte",
                "Muito forte"
              ][forcaSenha - 1] || "Digite sua senha"}
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar Senha</label>
            <input
              type="password"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.spinner} />
            ) : "Criar Conta"}
          </button>
        </form>

        <div style={styles.login}>
          Já tem uma conta?{" "}
          <Link href="/login" style={styles.link}>
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
} 