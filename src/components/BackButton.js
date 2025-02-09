"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      style={{
        position: "absolute",
        top: "2rem",
        left: "2rem",
        padding: "0.8rem 1.5rem",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "all 0.2s ease",
        hover: {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }
      }}
    >
      ← Voltar
    </button>
  );
} 