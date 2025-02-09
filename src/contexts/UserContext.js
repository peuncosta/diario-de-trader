"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar dados do usuário
  useEffect(() => {
    const loadUser = () => {
      try {
        // Garantir que o admin sempre exista
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (!usuarios.some(u => u.isAdmin)) {
          const adminUser = {
            id: 'admin-' + Date.now(),
            nome: 'Administrador',
            email: 'pedro@admin.com',
            senha: 'admin123',
            isAdmin: true,
            ativo: true,
            plano: 'admin',
            dataExpiracao: null, // Admin nunca expira
            dataCriacao: new Date().toISOString()
          };
          usuarios.push(adminUser);
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Carregar usuário atual
        const cookieUser = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));

        if (cookieUser) {
          const userData = JSON.parse(cookieUser.split('=')[1]);
          const userAtual = usuarios.find(u => u.id === userData.id);
          
          if (userAtual) {
            // Verificar se o plano está ativo
            if (userAtual.dataExpiracao) {
              const dataExpiracao = new Date(userAtual.dataExpiracao);
              if (dataExpiracao < new Date()) {
                throw new Error('Plano expirado');
              }
            }
            
            setUser(userAtual);
          } else {
            throw new Error('Usuário não encontrado');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    // Verificar a cada 5 minutos
    const interval = setInterval(loadUser, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const getUserData = () => {
    if (!user?.id) return null;

    try {
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      if (!tradingData[user.id]) {
        tradingData[user.id] = {
          operacoes: [],
          contas: [],
          ativos: [],
          desafios: [],
          checklist: []
        };
        localStorage.setItem('tradingData', JSON.stringify(tradingData));
      }
      return tradingData[user.id];
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  };

  const saveUserData = (data) => {
    if (!user?.id) return;

    try {
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      tradingData[user.id] = {
        ...tradingData[user.id],
        ...data,
        ultimaAtualizacao: new Date().toISOString()
      };
      localStorage.setItem('tradingData', JSON.stringify(tradingData));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      getUserData, 
      saveUserData,
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 