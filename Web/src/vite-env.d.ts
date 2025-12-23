/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_NAVER_MAP_CLIENT_ID: string;
  // 다른 환경 변수들도 여기에 추가
  // readonly VITE_API_BASE_URL: string;
  // readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
