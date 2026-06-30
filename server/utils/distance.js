const toRad = (d) => (d * Math.PI) / 180;

/**
 * True only for a usable location. New accounts are created with the placeholder
 * { lat: 0, lng: 0 } (see auth.js registration defaults) until they set a real
 * location, so (0,0) — "Null Island" — must be treated as "unknown", not as a
 * concrete point ~8000 km from India. Anything with a missing lat/lng is unknown too.
 */
export function hasRealCoords(p) {
  return (
    !!p &&
    p.lat != null &&
    p.lng != null &&
    Number.isFinite(p.lat) &&
    Number.isFinite(p.lng) &&
    !(p.lat === 0 && p.lng === 0)
  );
}

export function haversineKm(a, b) {
  if (!hasRealCoords(a) || !hasRealCoords(b)) return Infinity;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function sortByDistanceFrom(origin, items, coordOf) {
  return [...items]
    .map((it) => ({ item: it, distanceKm: haversineKm(origin, coordOf(it)) }))
    .sort((x, y) => x.distanceKm - y.distanceKm);
}
