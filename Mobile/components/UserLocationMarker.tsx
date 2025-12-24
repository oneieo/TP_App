import React, { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";

type Coord = { latitude: number; longitude: number };

interface Props {
  /** 회전(heading) 적용 여부 (기본 true) */
  enableRotation?: boolean;
}

/**
 * - expo-location 으로 실시간 위치 구독
 * - NaverMapMarkerOverlay로 주황색 커스텀 마커 표시
 * - heading(베어링)으로 마커 회전 (가능한 환경에서)
 */
export default function UserLocationMarker({ enableRotation = true }: Props) {
  const [coord, setCoord] = useState<Coord | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      // 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      // 실시간 구독
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest, // 가능한 한 가장 정확하게(배터리 더 소모)
          timeInterval: 1000, // 최소 1초마다 콜백 허용
          distanceInterval: 1, // 1m 이상 이동해야 콜백(시간/거리 조건 중 충족 시 콜백)
          mayShowUserSettingsDialog: true, // OS에서 "위치 서비스 켜기" 다이얼로그 등장
        },
        (loc) => {
          const {
            coords: { latitude, longitude, heading: hdg },
          } = loc;

          setCoord({ latitude, longitude });
          if (enableRotation && typeof hdg === "number" && !isNaN(hdg)) {
            setHeading(hdg);
          }
        }
      );
    })();

    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [enableRotation]);

  if (!coord) return null;

  return (
    <NaverMapMarkerOverlay
      latitude={coord.latitude}
      longitude={coord.longitude}
      image={require("../assets/images/icons/my-location.png")}
      width={38}
      height={38}
      anchor={{ x: 0.5, y: 0.5 }}
      angle={enableRotation ? heading : 0}
    />
  );
}
