"use client";
import { useEffect, useState } from "react";

export const useNaverMapScript = (clientId: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.naver && window.naver.maps) {
      setIsLoaded(true);
      return;
    }

    // 이미 스크립트 태그가 있는 경우
    const existingScript = document.querySelector(
      'script[src*="openapi.map.naver.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      existingScript.addEventListener("error", () =>
        setError("네이버 지도 API 로드 실패")
      );
      return;
    }

    // 새로운 스크립트 태그 생성
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("네이버 지도 API 로드 실패");
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거는 하지 않음 (다른 컴포넌트에서도 사용할 수 있음)
    };
  }, [clientId]);

  return { isLoaded, error };
};
