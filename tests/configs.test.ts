import { detectExerciseType, EXERCISE_CONFIGS } from '../src/configs';

describe('detectExerciseType', () => {
  it('returns exact match for push-ups', () => {
    expect(detectExerciseType('push-ups')).toBe('push-ups');
  });

  it('fuzzy matches push up without hyphen', () => {
    expect(detectExerciseType('push up')).toBe('push-ups');
  });

  it('returns exact push-up with hyphen', () => {
    expect(detectExerciseType('push-up')).toBe('push-up');
  });

  it('detects incline push-up', () => {
    expect(detectExerciseType('incline push-up')).toBe('incline push-up');
  });

  it('detects incline push up without hyphen', () => {
    expect(detectExerciseType('incline push up')).toBe('incline push-up');
  });

  it('detects decline push-up', () => {
    expect(detectExerciseType('decline push-up')).toBe('decline push-up');
  });

  it('returns exact match for squats', () => {
    expect(detectExerciseType('squats')).toBe('squats');
  });

  it('returns exact squat', () => {
    expect(detectExerciseType('squat')).toBe('squat');
  });

  it('returns exact jump squat', () => {
    expect(detectExerciseType('jump squat')).toBe('jump squat');
  });

  it('detects jump squats', () => {
    expect(detectExerciseType('jump squats')).toBe('jump squats');
  });

  it('returns exact pull-up', () => {
    expect(detectExerciseType('pull-up')).toBe('pull-up');
  });

  it('detects pull ups', () => {
    expect(detectExerciseType('pull ups')).toBe('pull-ups');
  });

  it('detects chin-up', () => {
    expect(detectExerciseType('chin-up')).toBe('chin-up');
  });

  it('detects dips', () => {
    expect(detectExerciseType('dips')).toBe('dips');
  });

  it('returns exact dip', () => {
    expect(detectExerciseType('dip')).toBe('dip');
  });

  it('returns exact burpee', () => {
    expect(detectExerciseType('burpee')).toBe('burpee');
  });

  it('detects burpees', () => {
    expect(detectExerciseType('burpees')).toBe('burpees');
  });

  it('returns exact sit-up', () => {
    expect(detectExerciseType('sit-up')).toBe('sit-up');
  });

  it('detects sit ups', () => {
    expect(detectExerciseType('sit ups')).toBe('sit-ups');
  });

  it('returns exact lunge', () => {
    expect(detectExerciseType('lunge')).toBe('lunge');
  });

  it('detects lunges', () => {
    expect(detectExerciseType('lunges')).toBe('lunges');
  });

  it('detects mountain climbers', () => {
    expect(detectExerciseType('mountain climbers')).toBe('mountain climbers');
  });

  it('detects jumping jacks', () => {
    expect(detectExerciseType('jumping jacks')).toBe('jumping jacks');
  });

  it('returns exact jumping jack', () => {
    expect(detectExerciseType('jumping jack')).toBe('jumping jack');
  });

  it('returns null for unknown exercise', () => {
    expect(detectExerciseType('unknown-exercise')).toBeNull();
  });

  it('returns null for random string', () => {
    expect(detectExerciseType('asdfghjkl')).toBeNull();
  });
});

describe('EXERCISE_CONFIGS', () => {
  it('contains push-ups config', () => {
    expect(EXERCISE_CONFIGS['push-ups']).toBeDefined();
  });

  it('push-ups config has correct thresholds', () => {
    const config = EXERCISE_CONFIGS['push-ups'];
    expect(config.downThreshold).toBe(90);
    expect(config.upThreshold).toBe(160);
    expect(config.type).toBe('angle_based');
  });

  it('push-ups config requires straight body', () => {
    const config = EXERCISE_CONFIGS['push-ups'];
    expect(config.requiresStraightBody).toBe(true);
  });

  it('squat config has fallbackKeypoints', () => {
    const config = EXERCISE_CONFIGS['squats'];
    expect(config.fallbackKeypoints).toBeDefined();
    expect(config.fallbackKeypoints).toContain('right_hip');
  });

  it('burpees config has complex movement type', () => {
    const config = EXERCISE_CONFIGS['burpees'];
    expect(config.type).toBe('complex_movement');
  });

  it('pull-ups config has vertical movement type', () => {
    const config = EXERCISE_CONFIGS['pull-ups'];
    expect(config.type).toBe('vertical_movement');
  });

  it('sit-ups config has reverse logic', () => {
    const config = EXERCISE_CONFIGS['sit-ups'];
    expect(config.reverseLogic).toBe(true);
  });
});