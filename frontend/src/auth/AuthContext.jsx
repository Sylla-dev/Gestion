import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? { token } : null;
    });

    const login = async (email, password) => {
    try {
        const res = await axios.post("http://localhost:3000/api/auth/login", 
            { email, password }, // données dans le corps
            { headers: { "Content-Type": "application/json" } } // headers à part
        );

        const data = res.data;
        localStorage.setItem("token", data.token);
        setUser({ token: data.token, ...data.user }); // Tu peux stocker d'autres infos
        return { success: true };
    } catch (error) {
        console.error('Login failed:', error.response?.data?.error || error.message);
        return { success: false, message: error.response?.data?.error || error.message };
    }
};
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);