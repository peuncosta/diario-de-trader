"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import BackButton from "@/components/BackButton";

export default function ContaSucessoPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout title="Conta Cadastrada com Sucesso!">
      <BackButton />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#00ff87",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          ✓
        </div>
        <p style={{ fontSize: "1.2rem", color: "#999" }}>
          Sua conta foi cadastrada com sucesso! Você será redirecionado para o dashboard em alguns segundos...
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Ir para o Dashboard agora
        </button>
      </div>
    </Layout>
  );
} 