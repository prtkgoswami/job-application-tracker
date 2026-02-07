"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";

const AuthContext = createContext<User | null>(null);
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (currUser) => {
            setUser(currUser)
        });
    }, [])

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
};

export default AuthProvider;