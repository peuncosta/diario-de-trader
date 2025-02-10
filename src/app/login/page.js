"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { globalStyles } from "@/styles/globals";
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      console.log('Tentando login com:', formData);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      console.log('Resposta do Supabase:', { data, error });

      if (error) throw error;

      // Salvar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('Dados do usuário:', userData);
      console.log('Erro ao buscar usuário:', userError);

      if (userError) throw userError;

      // Salvar na sessão
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000`;
      
      router.push('/');
    } catch (error) {
      console.error('Erro completo:', error);
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
    register: {
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
    registerLink: {
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.9rem",
      color: "#999",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Trading Journal</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
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
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
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
            ) : "Entrar"}
          </button>
        </form>

        <p style={styles.registerLink}>
          Não tem uma conta? <Link href="/register">Registre-se</Link>
        </p>
      </div>
    </div>
  );
} 