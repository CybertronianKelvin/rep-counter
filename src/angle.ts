import { Point } from './types';

/**
 * Calculate angle between three points (in degrees)
 * @param pointA - First point {x, y}
 * @param pointB - Middle point (vertex) {x, y}
 * @param pointC - Third point {x, y}
 */
export function calculateAngle(pointA: Point, pointB: Point, pointC: Point): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * Get vertical distance between two points (normalized)
 */
export function getVerticalDistance(point1: Point, point2: Point): number {
  return Math.abs(point1.y - point2.y);
}

/**
 * Check if body is roughly straight (for push-ups, planks)
 */
export function isBodyStraight(
  shoulder: Point,
  hip: Point,
  knee: Point,
  threshold = 20
): boolean {
  const angle = calculateAngle(shoulder, hip, knee);
  return angle > 180 - threshold;
}