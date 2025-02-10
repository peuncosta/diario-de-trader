"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { globalStyles } from "@/styles/globals";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Iniciando registro:', formData);
      
      // 1. Criar usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome
          }
        }
      });

      console.log('Resposta auth:', authData);

      if (authError) throw authError;

      // 2. Inserir na tabela usuarios
      const { error: userError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            nome: formData.nome,
            email: formData.email,
            is_admin: false,
            ativo: true,
            plano: 'basic'
          }
        ]);

      if (userError) throw userError;

      alert('Registro realizado com sucesso! Faça login para continuar.');
      router.push('/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      setError(error.message);
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
    loginLink: {
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.9rem",
      color: "#999",
      "& a": {
        color: "#00ff87",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Criar Conta</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                Registrando...
                <div style={styles.spinner} />
              </>
            ) : "Criar Conta"}
          </button>

          <p style={styles.loginLink}>
            Já tem uma conta? <Link href="/login">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
} 