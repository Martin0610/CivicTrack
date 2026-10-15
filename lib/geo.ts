/**
 * Calculate distance in meters between two geographic coordinates using the Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Duplicate proximity radius threshold in meters (default: 75m)
 */
export const DUPLICATE_RADIUS_METERS = 75;

export interface PotentialDuplicate {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: string;
  distanceMeters: number;
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string | null;
  upvoteCount: number;
  createdAt: Date;
}
