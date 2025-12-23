import { ref, set, get, update } from "firebase/database";
import { db } from "../firebase/config";
import type { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  affiliation: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 정보 저장
export const saveUserProfile = async (
  firebaseUser: User,
  affiliation: string
): Promise<void> => {
  try {
    const userRef = ref(db, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    const existingData = snapshot.val();

    const userData: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      affiliation: affiliation,
      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(userRef, userData);
    console.log("사용자 정보 저장 성공:", userData);
  } catch (error) {
    console.error("사용자 정보 저장 실패:", error);
    throw error;
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
};

// 사용자 소속 업데이트
export const updateUserAffiliation = async (
  uid: string,
  affiliation: string
): Promise<void> => {
  try {
    const userRef = ref(db, `users/${uid}`);
    await update(userRef, {
      affiliation,
      updatedAt: new Date().toISOString(),
    });
    console.log("소속 정보 업데이트 성공");
  } catch (error) {
    console.error("소속 정보 업데이트 실패:", error);
    throw error;
  }
};

// 사용자 삭제 (탈퇴)
export const deleteUserProfile = async (uid: string): Promise<void> => {
  try {
    const userRef = ref(db, `users/${uid}`);
    await set(userRef, null);
    console.log("사용자 정보 삭제 성공");
  } catch (error) {
    console.error("사용자 정보 삭제 실패:", error);
    throw error;
  }
};
