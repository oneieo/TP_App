import { useEffect, Suspense, useState, useRef } from "react";
import { NaverMap, Container, Marker, useNavermaps } from "react-naver-maps";

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  content?: string;
  category?: string;
}

interface NaverMapComponentProps {
  width?: string | number;
  height?: string | number;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: MarkerData[];
  className?: string;
  onMapReady?: () => void;
  onMarkerClick?: (markerId: string) => void;
  showLabels?: boolean;
}

// 마커 아이콘
const getMarkerIconPath = (markerId: string): string => {
  if (markerId.includes("current-location")) {
    return "/icons/my-location.png";
  }
  if (markerId.includes("event")) {
    return "/icons/clover-gold-24px.png";
  }
  if (markerId.includes("snack")) {
    if (markerId.includes("1014")) {
      return "/icons/호두과자마커.png";
    }
    return "/icons/붕어빵1-36px.png";
  }
  return "/icons/icon-clover2.png";
};

const createMarkerWithLabel = (markerId: string, title?: string) => {
  const iconPath = getMarkerIconPath(markerId);
  const showLabel =
    title &&
    !markerId.includes("current-location") &&
    !markerId.includes("event") &&
    !markerId.includes("snack");

  return {
    content: `
      <div style="position: relative; text-align: center;">
        ${
          showLabel
            ? `
          <div style="
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            pointer-events: none;
          ">
            ${title}
          </div>
        `
            : ""
        }
        <img src="${iconPath}" style="width: 24px; height: 24px;" />
      </div>
    `,
    anchor: { x: 12, y: 12 },
  };
};

function MapContent({
  center,
  zoom = 16,
  markers = [],
  onMapReady,
  onMarkerClick,
  showLabels = true,
}: NaverMapComponentProps) {
  const navermaps = useNavermaps();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  useEffect(() => {
    if (onMapReady) {
      onMapReady();
    }
  }, [onMapReady]);

  const handleMarkerClick = (markerId: string) => {
    console.log("Marker clicked in NaverMapComponent:", markerId);
    setSelectedMarker(selectedMarker === markerId ? null : markerId);

    if (onMarkerClick) {
      onMarkerClick(markerId);
    }
  };

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(center.lat, center.lng)}
      defaultZoom={zoom}
      center={new navermaps.LatLng(center.lat, center.lng)}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={new navermaps.LatLng(marker.lat, marker.lng)}
          title={marker.title}
          onClick={() => handleMarkerClick(marker.id)}
          icon={
            showLabels
              ? createMarkerWithLabel(marker.id, marker.title)
              : getMarkerIconPath(marker.id)
          }
        />
      ))}
    </NaverMap>
  );
}

// 메인 컴포넌트
export default function NaverMapComponent({
  width = "100%",
  height = "400px",
  center,
  zoom = 16,
  markers = [],
  className = "",
  onMapReady,
  onMarkerClick,
  showLabels = true,
}: NaverMapComponentProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Container className="w-full h-full">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">지도를 불러오는 중...</p>
              </div>
            </div>
          }
        >
          <MapContent
            center={center}
            zoom={zoom}
            markers={markers}
            onMapReady={onMapReady}
            onMarkerClick={onMarkerClick}
            showLabels={showLabels}
          />
        </Suspense>
      </Container>
    </div>
  );
}
