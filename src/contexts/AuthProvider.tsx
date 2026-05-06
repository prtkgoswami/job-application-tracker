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
            setUser(currUser);
            if (currUser) {
                localStorage.setItem("jobTrackr_userId", currUser.uid);
            } else {
                localStorage.removeItem("jobTrackr_userId");
            }
        });
    }, [])

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
};

export default AuthProvider;