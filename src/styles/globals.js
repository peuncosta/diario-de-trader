export const globalStyles = {
  // Containers
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },

  // Cards
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "1rem",
  },

  // Grids
  grid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },

  // Forms
  formField: {
    marginBottom: "1.5rem",
  },

  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#999",
    fontSize: "0.9rem",
  },

  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  select: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.8rem center",
    backgroundSize: "1.2rem",
    paddingRight: "2.5rem",
  },

  // Buttons
  button: {
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },

  primaryButton: {
    backgroundColor: "#00ff87",
    color: "#111",
  },

  secondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  dangerButton: {
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    color: "#ff4444",
    border: "1px solid #ff4444",
  },

  // Text
  title: {
    fontSize: "1.2rem",
    margin: "0 0 1rem 0",
    color: "#999",
  },

  // Valores
  positiveValue: {
    color: "#00ff87",
    fontWeight: "bold",
  },

  negativeValue: {
    color: "#ff4444",
    fontWeight: "bold",
  },
};

export const globalCss = `
  @media (max-width: 640px) {
    select, input {
      max-width: 100% !important;
    }
    
    .card {
      padding: 1rem !important;
    }
    
    h3 {
      font-size: 1rem !important;
    }
    
    p {
      font-size: 1.2rem !important;
    }
  }
  
  select option {
    padding: 12px;
    background-color: #1a1a1a;
    color: white;
  }
  
  select option:hover {
    background-color: #333;
  }
`; 