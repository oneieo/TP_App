declare namespace NodeJS {
  interface ProcessEnv {
    // Naver Maps Configuration
    EXPO_PUBLIC_NAVER_MAP_CLIENT_ID: string;
    EXPO_PUBLIC_NAVER_MAPS_API_KEY: string;

    // Firebase Configuration
    EXPO_PUBLIC_FIREBASE_API_KEY: string;
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    EXPO_PUBLIC_FIREBASE_DATABASE_URL: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    EXPO_PUBLIC_FIREBASE_APP_ID: string;
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
  }
}
