"use client";

import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      style={{
        position: "absolute",
        top: "2rem",
        right: "2rem",
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
      🏠 Home
    </button>
  );
} 