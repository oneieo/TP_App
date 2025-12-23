import { useState } from "react";
import { signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout: clearAuthStore } = useAuthStore();

  const signInWithGithub = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;

      console.log("GitHub 로그인 성공:", user);
      return user;
    } catch (err: any) {
      console.error("GitHub 로그인 에러:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      clearAuthStore();
      console.log("로그아웃 성공");
    } catch (err: any) {
      console.error("로그아웃 에러:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGithub,
    logout,
    loading,
    error,
  };
};
