export function calculateMyDistance(
  myLat: number,
  myLng: number,
  storeLat: number,
  storeLng: number
): number {
  const earthRadius = 6371000;
  const toRad = (degree: number) => (degree * Math.PI) / 180;

  const dLat = toRad(storeLat - myLat);
  const dLng = toRad(storeLng - myLng);

  const lat1Rad = toRad(myLat);
  const lat2Rad = toRad(storeLat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.floor(earthRadius * c);
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.floor(R * c);
};

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  } else {
    const km = (meters / 1000).toFixed(1);
    return `${km}km`;
  }
}
