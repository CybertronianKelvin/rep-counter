import { calculateAngle, getVerticalDistance, isBodyStraight } from '../src/angle';

describe('calculateAngle', () => {
  it('returns 90 degrees for a right angle', () => {
    const pointA = { x: 0, y: 1 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 1, y: 0 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(90);
  });

  it('returns 180 degrees for a straight line', () => {
    const pointA = { x: 0, y: 1 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 0, y: -1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(180);
  });

  it('returns 0 degrees for overlapping points', () => {
    const pointA = { x: 0, y: 0 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 0, y: 0 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(0);
  });

  it('handles angles greater than 180 (reflex)', () => {
    const pointA = { x: 1, y: 0 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 0, y: 1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(90);
  });

  it('handles 45 degree angle', () => {
    const pointA = { x: 0, y: 1 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 1, y: 1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(45);
  });

  it('handles 135 degree angle (returns smaller equivalent)', () => {
    const pointA = { x: 1, y: 1 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: -1, y: 1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(90);
  });

  it('returns 90 for inverted right angle', () => {
    const pointA = { x: 1, y: 0 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 0, y: 1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(90);
  });

  it('handles negative coordinates', () => {
    const pointA = { x: -1, y: 0 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 0, y: -1 };

    const angle = calculateAngle(pointA, pointB, pointC);

    expect(angle).toBe(90);
  });
});

describe('getVerticalDistance', () => {
  it('returns absolute vertical difference', () => {
    const point1 = { x: 5, y: 10 };
    const point2 = { x: 5, y: 5 };

    const distance = getVerticalDistance(point1, point2);

    expect(distance).toBe(5);
  });

  it('handles reversed order', () => {
    const point1 = { x: 5, y: 5 };
    const point2 = { x: 5, y: 10 };

    const distance = getVerticalDistance(point1, point2);

    expect(distance).toBe(5);
  });

  it('returns 0 for same y', () => {
    const point1 = { x: 5, y: 5 };
    const point2 = { x: 10, y: 5 };

    const distance = getVerticalDistance(point1, point2);

    expect(distance).toBe(0);
  });
});

describe('isBodyStraight', () => {
  it('returns true for straight body (default threshold)', () => {
    const shoulder = { x: 0.5, y: 0.2 };
    const hip = { x: 0.5, y: 0.5 };
    const knee = { x: 0.5, y: 0.8 };

    const isStraight = isBodyStraight(shoulder, hip, knee);

    expect(isStraight).toBe(true);
  });

  it('returns false for bent body', () => {
    const shoulder = { x: 0.5, y: 0.2 };
    const hip = { x: 0.5, y: 0.5 };
    const knee = { x: 0.3, y: 0.6 };

    const isStraight = isBodyStraight(shoulder, hip, knee);

    expect(isStraight).toBe(false);
  });

  it('respects custom threshold', () => {
    const shoulder = { x: 0.5, y: 0.2 };
    const hip = { x: 0.5, y: 0.5 };
    const knee = { x: 0.5, y: 0.8 };

    const isStraight = isBodyStraight(shoulder, hip, knee, 10);

    expect(isStraight).toBe(true);
  });

  it('returns false for severely bent body even with high threshold', () => {
    const shoulder = { x: 0.5, y: 0.2 };
    const hip = { x: 0.5, y: 0.5 };
    const knee = { x: 0.2, y: 0.4 };

    const isStraight = isBodyStraight(shoulder, hip, knee, 30);

    expect(isStraight).toBe(false);
  });
});