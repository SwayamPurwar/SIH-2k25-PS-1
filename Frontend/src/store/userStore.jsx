import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  // FIXED: Bulletproof JSON parsing that protects against "undefined" strings
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      // If there's no data, or if it accidentally saved the string "undefined", return null
      if (!storedUser || storedUser === 'undefined') {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      // If parsing fails, clean up the corrupted data and return null
      console.error('Failed to parse user from storage, clearing corrupt data...');
      localStorage.removeItem('user');
      return null;
    }
  });

  function login(userData, token) {
    if (!userData) return; // Prevent saving undefined data
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }

  function addPoints(pts) {
    setUser(u => {
      if (!u) return null;
      const updatedUser = { ...u, points: (u.points || 0) + pts };
      localStorage.setItem('user', JSON.stringify(updatedUser)); 
      return updatedUser;
    });
  }

  return (
    <UserContext.Provider value={{ user, login, logout, addPoints }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}