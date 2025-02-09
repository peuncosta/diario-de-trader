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
        // Verificar se existe usuário admin
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (!usuarios.some(u => u.isAdmin)) {
          const adminUser = {
            id: 'admin-' + Date.now(),
            nome: 'Administrador',
            email: 'pedro@admin.com',
            senha: 'admin123',
            isAdmin: true,
            ativo: true,
            dataCriacao: new Date().toISOString()
          };
          usuarios.push(adminUser);
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Carregar usuário atual do cookie
        const cookieUser = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));

        if (cookieUser) {
          const userData = JSON.parse(cookieUser.split('=')[1]);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const getUserData = () => {
    if (!user?.id) return null;

    try {
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      return tradingData[user.id] || {
        operacoes: [],
        contas: [],
        ativos: [],
        desafios: [],
        checklist: []
      };
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  };

  const saveUserData = (data) => {
    if (!user?.id) return;

    try {
      const tradingData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      tradingData[user.id] = data;
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