import { describe, it, expect } from 'vitest';
import { haversineKm, hasRealCoords, sortByDistanceFrom } from './distance.js';

// Pune-ish reference point used by seeded collectors.
const PUNE = { lat: 18.52, lng: 73.85 };
// The registration placeholder every new account gets until it sets a real location.
const NULL_ISLAND = { lat: 0, lng: 0 };

describe('hasRealCoords', () => {
  it('accepts a genuine coordinate', () => {
    expect(hasRealCoords(PUNE)).toBe(true);
  });

  it('rejects the (0,0) placeholder, missing objects, and null lat/lng', () => {
    expect(hasRealCoords(NULL_ISLAND)).toBe(false);
    expect(hasRealCoords(null)).toBe(false);
    expect(hasRealCoords({ lat: null, lng: null, address: 'nashik' })).toBe(false);
  });
});

describe('haversineKm', () => {
  it('measures distance between two real points', () => {
    expect(haversineKm(PUNE, { lat: 18.6, lng: 73.9 })).toBeGreaterThan(0);
  });

  it('treats the (0,0) placeholder as unknown distance, not a real ~7000 km point', () => {
    // This is the bug: a new user "at nashik" really sits at (0,0), and the
    // collector dashboard must treat that as "unknown" (shown to everyone),
    // never as a concrete far-away point that the 15 km radius filter hides.
    expect(haversineKm(PUNE, NULL_ISLAND)).toBe(Infinity);
    expect(haversineKm(NULL_ISLAND, PUNE)).toBe(Infinity);
  });
});

describe('sortByDistanceFrom', () => {
  it('ranks a (0,0) origin as all-unknown (Infinity) so nothing is treated as nearby', () => {
    const ranked = sortByDistanceFrom(NULL_ISLAND, [{ location: PUNE }], (c) => c.location);
    expect(ranked[0].distanceKm).toBe(Infinity);
  });
});
