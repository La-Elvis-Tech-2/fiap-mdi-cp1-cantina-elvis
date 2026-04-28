import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const USERS_KEY = '@fiap_users';
const SESSION_KEY = '@fiap_session';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = ainda carregando, null = sem sessão
    
    useEffect(() => {
        AsyncStorage.getItem(SESSION_KEY)
            .then(json => setUser(json ? JSON.parse(json) : null))
            .catch(() => setUser(null));
    }, []);

    const register = async ({ name, email, password }) => {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        const users = usersJson ? JSON.parse(usersJson) : [];
        if (users.find(u => u.email === email)) throw new Error('E-mail já cadastrado.');
        const newUser = { id: Date.now().toString(), name, email, password };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
        const session = { id: newUser.id, name: newUser.name, email: newUser.email };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const login = async ({ email, password }) => {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        const users = usersJson ? JSON.parse(usersJson) : [];
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('E-mail ou senha incorretos.');
        const session = { id: found.id, name: found.name, email: found.email };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
    };

    const logout = async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading: user === undefined, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};