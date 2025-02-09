"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { globalStyles } from "@/styles/globals";
import { useUser } from "@/contexts/UserContext";

export default function Layout({ children, title }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();

  // Detectar scroll para efeitos visuais
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: "/", icon: "🏠", label: "Home", show: pathname !== "/" },
    { href: "/dashboard", icon: "📊", label: "Dashboard", show: true },
    { href: "/operacoes", icon: "📋", label: "Operações", show: true },
    { href: "/desafios", icon: "🎯", label: "Desafios", show: true },
    { href: "/checklist", icon: "✅", label: "Checklist", show: true },
    { href: "/contas", icon: "💰", label: "Contas", show: true },
    { href: "/ativos", icon: "📈", label: "Ativos", show: true },
    { 
      href: "/admin", 
      icon: "👑", 
      label: "Admin", 
      show: user?.isAdmin === true
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      router.push("/login");
    }
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('#nav-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    // Verificar dados a cada minuto
    const interval = setInterval(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      
      if (!usuarios.length || !Object.keys(tradingData).length) {
        // Recarregar página se os dados foram perdidos
        window.location.reload();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header(scrolled)}>
        <div style={styles.headerContent}>
          {/* Logo e Título */}
          <div style={styles.logoContainer}>
            <div style={styles.logo}>TJ</div>
            <h1 style={styles.title}>{title}</h1>
          </div>

          {/* Menu Mobile */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <div style={styles.menuIcon(menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Navegação e Perfil */}
          <div id="nav-container" style={styles.navContainer(menuOpen)}>
            <nav style={styles.nav}>
              {navigationItems.map((item) => {
                if (item.show === false) return null;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={styles.navItem(isActive)}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={styles.itemIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <span style={styles.activeIndicator} />}
                  </Link>
                );
              })}
            </nav>

            {/* Perfil e Logout */}
            <div style={styles.profileSection}>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {user?.nome?.charAt(0).toUpperCase()}
                  <span style={styles.userStatus} />
                </div>
                <div style={styles.userDetails}>
                  <span style={styles.userName}>{user?.nome}</span>
                  <span style={styles.userRole}>
                    {user?.isAdmin ? "Administrador" : "Usuário"}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                <span style={styles.logoutIcon}>🚪</span>
                <span style={styles.logoutText}>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {children}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.copyright}>Trading Journal © 2024</p>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Termos</a>
            <a href="#" style={styles.footerLink}>Privacidade</a>
            <a href="#" style={styles.footerLink}>Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },
  header: (scrolled) => ({
    position: "sticky",
    top: 0,
    backgroundColor: scrolled ? "rgba(26, 26, 26, 0.98)" : "rgba(26, 26, 26, 0.8)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: scrolled ? "0.4rem 0" : "0.6rem 0",
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: scrolled ? "0 2px 20px rgba(0, 0, 0, 0.3)" : "none",
  }),
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    padding: "0 1rem",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logo: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(45deg, #00ff87, #60efff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#1a1a1a",
    boxShadow: "0 2px 10px rgba(0, 255, 135, 0.3)",
  },
  title: {
    margin: 0,
    fontSize: "1.2rem",
    background: "linear-gradient(45deg, #00ff87, #60efff)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  },
  menuButton: {
    display: "none",
    background: "none",
    border: "none",
    padding: "0.5rem",
    cursor: "pointer",
    "@media (max-width: 1024px)": {
      display: "block",
      position: "relative",
      zIndex: 1001,
    },
  },
  menuIcon: (open) => ({
    width: "24px",
    height: "24px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    "& span": {
      display: "block",
      width: "100%",
      height: "2px",
      backgroundColor: open ? "#00ff87" : "white",
      transition: "all 0.3s ease",
      transformOrigin: "1px",
    },
    "& span:first-child": {
      transform: open ? "rotate(45deg)" : "rotate(0)",
    },
    "& span:nth-child(2)": {
      opacity: open ? "0" : "1",
      transform: open ? "translateX(20px)" : "translateX(0)",
    },
    "& span:last-child": {
      transform: open ? "rotate(-45deg)" : "rotate(0)",
    },
  }),
  navContainer: (open) => ({
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    "@media (max-width: 1024px)": {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(26, 26, 26, 0.98)",
      backdropFilter: "blur(10px)",
      width: "280px",
      padding: "5rem 1.5rem 1.5rem",
      flexDirection: "column",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s ease",
      overflowY: "auto",
      boxShadow: open ? "-5px 0 30px rgba(0, 0, 0, 0.5)" : "none",
    },
  }),
  nav: {
    display: "flex",
    gap: "0.5rem",
    "@media (max-width: 1024px)": {
      flexDirection: "column",
      width: "100%",
    },
  },
  navItem: (isActive) => ({
    ...globalStyles.button,
    ...(isActive ? globalStyles.primaryButton : globalStyles.secondaryButton),
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem 0.8rem",
    fontSize: "0.85rem",
    position: "relative",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 255, 135, 0.2)",
    },
    "@media (max-width: 1024px)": {
      width: "100%",
      justifyContent: "flex-start",
      padding: "0.5rem 1rem",
    },
  }),
  activeIndicator: {
    position: "absolute",
    bottom: "-2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#00ff87",
    "@media (max-width: 1024px)": {
      left: "0",
      top: "50%",
      transform: "translateY(-50%)",
      width: "4px",
      height: "60%",
      borderRadius: "0 2px 2px 0",
    },
  },
  itemIcon: {
    fontSize: "1.1rem",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    "@media (max-width: 1024px)": {
      flexDirection: "column",
      width: "100%",
      marginTop: "auto",
      paddingTop: "1rem",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 255, 135, 0.1)",
    color: "#00ff87",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
    position: "relative",
    border: "2px solid rgba(0, 255, 135, 0.2)",
  },
  userStatus: {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#00ff87",
    border: "2px solid #1a1a1a",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "0.85rem",
    color: "#fff",
    fontWeight: "500",
  },
  userRole: {
    fontSize: "0.75rem",
    color: "#999",
  },
  logoutButton: {
    ...globalStyles.button,
    ...globalStyles.secondaryButton,
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.4rem 0.8rem",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 68, 68, 0.1)",
      color: "#ff4444",
    },
    "@media (max-width: 1024px)": {
      width: "100%",
      justifyContent: "center",
      padding: "0.5rem 1rem",
    },
  },
  logoutIcon: {
    fontSize: "1.1rem",
  },
  logoutText: {
    "@media (max-width: 1024px)": {
      display: "inline",
    },
  },
  main: {
    flex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
    width: "100%",
  },
  footer: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "2rem",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copyright: {
    color: "#666",
    margin: 0,
  },
  footerLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  footerLink: {
    color: "#666",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#00ff87",
    },
  },
}; 