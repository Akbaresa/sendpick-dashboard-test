"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { token } from "../lib/cookie";

interface AuthUser {
  username: string;
  email: string;
  token: string;
  expired_at: string;
}
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  checkToken: () => Promise<AuthUser>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    (async () => {
      try {
        await checkToken();
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const response = await res.json();
    if (!res.ok) {
      setLoading(false);
      console.log(response?.message || "login gagal");
    }

    const user: AuthUser = {
      username: response.data.nama,
      email: response.data.email,
      token: response.data.token,
      expired_at: response.data.expired_at,
    };

    if (user.token) {
      setCookie("token", user.token, {
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      setCookie("token_expired", user.expired_at, {
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      setUser(user);
    }

    setLoading(false);
    return user;
  };

  const checkToken = async () => {
    if (!token) {
      setUser(null);
      console.log("token tidak ditemukan");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setUser(null);
      router.push("/login");
      console.log("cek token gagal,token tidak ditemukan");

    }
    setUser(data.data);
    return data.data;
  };

  const logout = () => {
    deleteCookie("token");
    deleteCookie("token_expired");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, checkToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
