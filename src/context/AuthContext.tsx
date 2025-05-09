import React, { createContext, useState, useContext, useEffect } from 'react';

// Intentionally vulnerable user data structure
interface User {
  id: number;
  username: string;
  password: string; // Storing plain text passwords - vulnerability!
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, email: string) => boolean;
  logout: () => void;
  users: User[];
  getUserById: (id: number) => User | undefined;
}

// Initial users with weak passwords
const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'Shadowadmin', // Weak admin password - vulnerability!
    email: 'admin@example.com',
    isAdmin: true
  },
  {
    id: 2,
    username: 'user1',
    password: 'SQL_1nj3ct10n_m4st3r',
    email: 'user1@example.com',
    isAdmin: false
  },
  {
    id: 3,
    username: 'user2',
    password: 'qwerty',
    email: 'user2@example.com',
    isAdmin: false
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Modified SQL injection vulnerability to only allow access to user1
  const login = (username: string, password: string): boolean => {
    // Simulating SQL injection vulnerability
    // In a real app with SQL, this would be: 
    // "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
    
    // For demonstration, we'll simulate the vulnerability with this logic:
    if (username.includes("' or '1'='1")) {
      // SQL Injection success - log in as user1 instead of admin
      const user1 = users.find(u => u.username === 'user1');
      if (user1) {
        setCurrentUser(user1);
        return true;
      }
      return false;
    }

    // Regular login attempt
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, email: string): boolean => {
    if (users.some(u => u.username === username)) {
      return false;
    }

    const newUser: User = {
      id: users.length + 1,
      username,
      password, // Plain text password - vulnerability!
      email,
      isAdmin: false
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getUserById = (id: number) => {
    return users.find(u => u.id === id);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, users, getUserById }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};