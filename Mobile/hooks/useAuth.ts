// import { useState } from "react";
// import { signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
// import type { User } from "firebase/auth";
// import { useAuthStore } from "../app/store/useAuthStore";
// import { auth } from "@/firebase/config";

// export const useAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { logout: clearAuthStore } = useAuthStore();

//   const signInWithGithub = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const provider = new GithubAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user: User = result.user;

//       console.log("GitHub 로그인 성공:", user);
//       return user;
//     } catch (err: any) {
//       console.error("GitHub 로그인 에러:", err);
//       setError(err.message);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       await signOut(auth);
//       clearAuthStore();
//       console.log("로그아웃 성공");
//     } catch (err: any) {
//       console.error("로그아웃 에러:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     signInWithGithub,
//     logout,
//     loading,
//     error,
//   };
// };
// hooks/useAuth.ts

// hooks/useAuth.ts
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGithub = async () => {
    setLoading(true);
    setError(null);

    const email = "boywonderof@jbnu.ac.kr";
    const password = "test123456";

    try {
      let userCredential;

      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: "Test User",
          photoURL: "https://i.ibb.co/HLY2nYqh/avatar.png",
        });

        console.log("✅ 새 계정 생성 성공");
      } catch (createErr: any) {
        // 이미 계정이 있으면 로그인
        if (createErr.code === "auth/email-already-in-use") {
          userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("✅ 기존 계정 로그인 성공");
        } else {
          throw createErr;
        }
      }

      console.log("로그인된 사용자:", userCredential.user.email);
      return userCredential.user;
    } catch (err: any) {
      console.error("❌ 로그인 오류:", err);
      setError(err.message || "로그인에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGithub, loading, error };
};
