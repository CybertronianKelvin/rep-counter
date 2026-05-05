import { countReps, reset, getCount } from '../src/stateMachine';
import { Pose } from '../src/types';

beforeEach(() => {
  reset('push-ups');
  reset('squats');
  reset('pull-ups');
  reset('burpees');
  reset('mountain climbers');
  reset('jumping jacks');
});

describe('countReps', () => {
  it('returns correct shape with repCount, state, feedback', () => {
    const pose: Pose = {
      keypoints: [
        { name: 'left_shoulder', x: 0.5, y: 0.3, score: 0.9 },
        { name: 'left_elbow', x: 0.5, y: 0.5, score: 0.9 },
        { name: 'left_wrist', x: 0.5, y: 0.7, score: 0.9 },
        { name: 'left_hip', x: 0.5, y: 0.5, score: 0.9 },
        { name: 'left_knee', x: 0.5, y: 0.8, score: 0.9 },
      ],
    };

    const result = countReps(pose, 'push-ups');

    expect(result).toHaveProperty('repCount');
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('feedback');
  });

  it('returns no pose detected for null pose', () => {
    const result = countReps(null as any, 'push-ups');

    expect(result.repCount).toBe(0);
    expect(result.feedback).toBe('No pose detected');
  });

  it('returns no pose detected for empty keypoints', () => {
    const pose: Pose = { keypoints: [] };

    const result = countReps(pose, 'push-ups');

    expect(result.feedback).toBe('No pose detected');
  });

  it('returns no pose detected for missing keypoints', () => {
    const pose: Pose = {
      keypoints: [{ name: 'left_shoulder', x: 0.5, y: 0.3, score: 0.9 }],
    };

    const result = countReps(pose, 'push-ups');

    expect(result.feedback).toContain('Position');
  });

  it('handles invalid exercise', () => {
    const pose: Pose = {
      keypoints: [
        { name: 'left_shoulder', x: 0.5, y: 0.3, score: 0.9 },
        { name: 'left_elbow', x: 0.5, y: 0.5, score: 0.9 },
        { name: 'left_wrist', x: 0.5, y: 0.7, score: 0.9 },
      ],
    };

    const result = countReps(pose, 'unknown-exercise-xyz');

    expect(result.feedback).toBe('Exercise not supported');
  });

  it('returns feedback string', () => {
    const pose: Pose = {
      keypoints: [
        { name: 'left_shoulder', x: 0.5, y: 0.3, score: 0.9 },
        { name: 'left_elbow', x: 0.5, y: 0.5, score: 0.9 },
        { name: 'left_wrist', x: 0.5, y: 0.7, score: 0.9 },
      ],
    };

    const result = countReps(pose, 'push-ups');

    expect(typeof result.feedback).toBe('string');
  });
});

describe('reset', () => {
  it('clears rep count to 0', () => {
    // First do some reps
    const poseDown: Pose = {
      keypoints: [
        { name: 'left_hip', x: 0.5, y: 0.5, score: 0.9 },
        { name: 'left_knee', x: 0.5, y: 0.6, score: 0.9 },
        { name: 'left_ankle', x: 0.5, y: 0.8, score: 0.9 },
      ],
    };

    const poseUp: Pose = {
      keypoints: [
        { name: 'left_hip', x: 0.5, y: 0.4, score: 0.9 },
        { name: 'left_knee', x: 0.5, y: 0.3, score: 0.9 },
        { name: 'left_ankle', x: 0.5, y: 0.8, score: 0.9 },
      ],
    };

    countReps(poseDown, 'squats');
    countReps(poseUp, 'squats');

    reset('squats');

    expect(getCount('squats')).toBe(0);
  });
});

describe('getCount', () => {
  it('returns current rep count', () => {
    reset('squats');

    // Just check reset works
    expect(getCount('squats')).toBe(0);
  });
});