"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const cookieUser = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));
        
        if (!cookieUser) {
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(cookieUser.split('=')[1]);
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const userExists = usuarios.find(u => u.id === userData.id);
        
        if (!userExists) {
          document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          router.push('/login');
          return;
        }

        // Atualizar dados do usuário
        const updatedUserData = {
          ...userData,
          isAdmin: userExists.isAdmin,
          ativo: userExists.ativo
        };

        setUser(updatedUserData);
        document.cookie = `user=${JSON.stringify(updatedUserData)}; path=/; max-age=86400`;

      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const getUserData = () => {
    if (!user?.id) return {
      operacoes: [],
      contas: [],
      ativos: [],
      desafios: [],
      checklist: []
    };

    try {
      const allData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      const userData = allData[user.id] || {
        operacoes: [],
        contas: [],
        ativos: [],
        desafios: [],
        checklist: []
      };

      // Garantir que todas as propriedades existam
      return {
        operacoes: userData.operacoes || [],
        contas: userData.contas || [],
        ativos: userData.ativos || [],
        desafios: userData.desafios || [],
        checklist: userData.checklist || []
      };
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      return {
        operacoes: [],
        contas: [],
        ativos: [],
        desafios: [],
        checklist: []
      };
    }
  };

  const saveUserData = (data) => {
    if (!user?.id) return;
    
    try {
      const allData = JSON.parse(localStorage.getItem('tradingData') || '{}');
      allData[user.id] = data;
      localStorage.setItem('tradingData', JSON.stringify(allData));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
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