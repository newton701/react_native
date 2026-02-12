import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = '@todo_app_user';
const CREDENTIALS_KEY = '@todo_app_credentials';

interface StoredCredentials {
  email: string;
  password: string;
}

/**
 * Provides a very basic, local-only authentication mechanism using AsyncStorage.
 * This is meant for assignment/demo purposes only (not production-ready security).
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem(USER_KEY);
        if (json) {
          const parsed: User = JSON.parse(json);
          setUser(parsed);
        }
      } catch (error) {
        console.warn('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        Alert.alert('Validation', 'Email and password are required.');
        return;
      }

      // In a real app, you would call a backend or Firebase here.
      const credentials: StoredCredentials = { email, password };
      await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));

      const newUser: User = { email };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.warn('Register error', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const json = await AsyncStorage.getItem(CREDENTIALS_KEY);
      if (!json) {
        Alert.alert('Login failed', 'No account found. Please register first.');
        return;
      }

      const stored: StoredCredentials = JSON.parse(json);
      if (stored.email === email && stored.password === password) {
        const loggedInUser: User = { email };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      } else {
        Alert.alert('Login failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.warn('Login error', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);
    } catch (error) {
      console.warn('Logout error', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

