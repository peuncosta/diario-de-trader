"use client";

export default function DashboardCard({ title, value, trend, children }) {
  const getTrendColor = () => {
    if (trend === 'up') return '#00ff87';
    if (trend === 'down') return '#ff4444';
    return '#ffffff';
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <h3 style={{ color: "#999", fontSize: "0.9rem" }}>{title}</h3>
      <div style={{ 
        fontSize: "1.5rem", 
        fontWeight: "bold",
        color: getTrendColor()
      }}>
        {value}
      </div>
      {children}
    </div>
  );
} 