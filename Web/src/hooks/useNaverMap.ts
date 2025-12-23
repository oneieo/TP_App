import { useEffect, useRef, useState, useCallback } from "react";

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
}

interface MarkerData {
  lat: number;
  lng: number;
  title?: string;
  content?: string;
}

// 네이버 지도 스크립트 로딩 훅
export function useNaverMapScript(clientId: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.naver && window.naver.maps) {
      setIsLoaded(true);
      return;
    }

    // 이미 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector("script[data-naver-maps]");
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.setAttribute("data-naver-maps", "true");
    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true);
      } else {
        setError("네이버 지도 API 로딩에 실패했습니다.");
      }
    };

    script.onerror = () => {
      setError("네이버 지도 스크립트 로딩에 실패했습니다.");
    };

    document.head.appendChild(script);

    return () => {
      // 정리 작업
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clientId]);

  return { isLoaded, error };
}

// 네이버 지도 훅
export function useNaverMap(
  containerId: string,
  options: NaverMapOptions,
  markers: MarkerData[] = []
) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않았습니다.");
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`지도 컨테이너를 찾을 수 없습니다: ${containerId}`);
      return;
    }

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(
          options.center.lat,
          options.center.lng
        ),
        zoom: options.zoom,
        minZoom: options.minZoom || 6,
        maxZoom: options.maxZoom || 18,
        zoomControl: options.zoomControl !== false,
        mapTypeControl: options.mapTypeControl !== false,
        scaleControl: options.scaleControl !== false,
        logoControl: options.logoControl !== false,
        mapDataControl: options.mapDataControl !== false,
      };

      mapRef.current = new window.naver.maps.Map(container, mapOptions);
      setIsMapReady(true);
    } catch (error) {
      console.error("지도 초기화 중 오류 발생:", error);
    }
  }, [containerId, options]);

  // 마커 업데이트
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !window.naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 새 마커 추가
    markers.forEach((markerData) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(markerData.lat, markerData.lng),
        map: mapRef.current,
        title: markerData.title || "",
      });

      // 정보창 추가 (content가 있는 경우)
      if (markerData.content) {
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:10px;min-width:150px;">${markerData.content}</div>`,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(mapRef.current, marker);
          }
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers]);

  // 지도 중심 이동
  const moveToLocation = useCallback(
    (lat: number, lng: number, zoom?: number) => {
      if (!mapRef.current) return;

      const newCenter = new window.naver.maps.LatLng(lat, lng);
      mapRef.current.setCenter(newCenter);

      if (zoom !== undefined) {
        mapRef.current.setZoom(zoom);
      }
    },
    []
  );

  // 현재 위치로 이동
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation이 지원되지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        moveToLocation(latitude, longitude, 15);
      },
      (error) => {
        console.error("현재 위치를 가져올 수 없습니다:", error);
      }
    );
  }, [moveToLocation]);

  // 지도 초기화 Effect
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap();
    }
  }, [initializeMap]);

  // 마커 업데이트 Effect
  useEffect(() => {
    if (isMapReady) {
      updateMarkers();
    }
  }, [isMapReady, updateMarkers]);

  return {
    map: mapRef.current,
    isMapReady,
    moveToLocation,
    moveToCurrentLocation,
  };
}
